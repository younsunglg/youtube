import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
} from 'n8n-workflow';

import * as cheerio from 'cheerio';
import fetch from 'node-fetch';

export class BlogToShorts implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Blog to Shorts',
    name: 'blogToShorts',
    icon: 'fa:blog',
    group: ['transform'],
    version: 1,
    description: 'Convert blog posts to YouTube Shorts format',
    defaults: {
      name: 'Blog to Shorts',
    },
    inputs: ['main'],
    outputs: ['main'],
    properties: [
      // Input Type
      {
        displayName: 'Input Type',
        name: 'inputType',
        type: 'options',
        options: [
          {
            name: 'URL',
            value: 'url',
            description: 'Fetch content from a blog URL',
          },
          {
            name: 'Text',
            value: 'text',
            description: 'Use direct text input',
          },
        ],
        default: 'url',
        description: 'Choose how to provide the blog content',
      },

      // Blog URL
      {
        displayName: 'Blog URL',
        name: 'blogUrl',
        type: 'string',
        default: '',
        displayOptions: {
          show: {
            inputType: ['url'],
          },
        },
        placeholder: 'https://example.com/blog-post',
        description: 'URL of the blog post to convert',
        required: true,
      },

      // Blog Text
      {
        displayName: 'Blog Text',
        name: 'blogText',
        type: 'string',
        typeOptions: {
          rows: 10,
        },
        default: '',
        displayOptions: {
          show: {
            inputType: ['text'],
          },
        },
        placeholder: 'Enter your blog content here...',
        description: 'The blog text to convert to shorts',
        required: true,
      },

      // CSS Selector for Content
      {
        displayName: 'Content Selector',
        name: 'contentSelector',
        type: 'string',
        default: 'article, .post-content, .entry-content, main',
        displayOptions: {
          show: {
            inputType: ['url'],
          },
        },
        description: 'CSS selector to extract main content (comma-separated, will try in order)',
      },

      // Maximum Characters
      {
        displayName: 'Max Characters',
        name: 'maxChars',
        type: 'number',
        default: 300,
        description: 'Maximum characters for the shorts script (60s ≈ 300 chars)',
      },

      // Split into Segments
      {
        displayName: 'Split into Segments',
        name: 'splitSegments',
        type: 'boolean',
        default: true,
        description: 'Whether to split content into multiple short segments (for subtitles)',
      },

      // Segment Length
      {
        displayName: 'Segment Length',
        name: 'segmentLength',
        type: 'number',
        default: 50,
        displayOptions: {
          show: {
            splitSegments: [true],
          },
        },
        description: 'Approximate characters per segment (for subtitle timing)',
      },

      // Language
      {
        displayName: 'Language',
        name: 'language',
        type: 'options',
        options: [
          {
            name: '한국어',
            value: 'ko',
          },
          {
            name: 'English',
            value: 'en',
          },
          {
            name: '日本語',
            value: 'ja',
          },
        ],
        default: 'ko',
        description: 'Language of the blog content',
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    for (let i = 0; i < items.length; i++) {
      try {
        const inputType = this.getNodeParameter('inputType', i) as string;
        const maxChars = this.getNodeParameter('maxChars', i) as number;
        const splitSegments = this.getNodeParameter('splitSegments', i) as boolean;
        const segmentLength = this.getNodeParameter('segmentLength', i) as number;
        const language = this.getNodeParameter('language', i) as string;

        let content = '';

        // Get content based on input type
        if (inputType === 'url') {
          const blogUrl = this.getNodeParameter('blogUrl', i) as string;
          const contentSelector = this.getNodeParameter('contentSelector', i) as string;

          // Fetch the blog content
          const response = await fetch(blogUrl);
          if (!response.ok) {
            throw new NodeOperationError(
              this.getNode(),
              `Failed to fetch blog: ${response.statusText}`
            );
          }

          const html = await response.text();
          const $ = cheerio.load(html);

          // Try each selector until we find content
          const selectors = contentSelector.split(',').map(s => s.trim());
          for (const selector of selectors) {
            const element = $(selector).first();
            if (element.length > 0) {
              content = element.text().trim();
              if (content.length > 100) { // Minimum content threshold
                break;
              }
            }
          }

          if (!content || content.length < 100) {
            throw new NodeOperationError(
              this.getNode(),
              'Could not extract sufficient content from the blog URL. Try adjusting the Content Selector.'
            );
          }
        } else {
          content = this.getNodeParameter('blogText', i) as string;
        }

        // Clean and process content
        content = cleanText(content);

        // Truncate to max characters
        if (content.length > maxChars) {
          content = truncateText(content, maxChars);
        }

        // Prepare output
        const outputData: any = {
          originalLength: content.length,
          content: content,
          language: language,
          metadata: {
            maxChars: maxChars,
            truncated: content.length >= maxChars,
          }
        };

        // Split into segments if requested
        if (splitSegments) {
          const segments = splitIntoSegments(content, segmentLength);
          outputData.segments = segments;
          outputData.segmentCount = segments.length;
        }

        returnData.push({
          json: outputData,
        });

      } catch (error) {
        if (this.continueOnFail()) {
          returnData.push({
            json: {
              error: (error as Error).message,
            },
          });
          continue;
        }
        throw error;
      }
    }

    return [returnData];
  }
}

/**
 * Clean text: remove extra whitespace, newlines, etc.
 */
function cleanText(text: string): string {
    return text
      .replace(/\s+/g, ' ')  // Replace multiple whitespace with single space
      .replace(/\n+/g, ' ')  // Replace newlines with space
      .trim();
  }

/**
 * Truncate text to max characters, trying to break at sentence boundaries
 */
function truncateText(text: string, maxChars: number): string {
    if (text.length <= maxChars) {
      return text;
    }

    // Try to break at sentence boundary
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    let result = '';

    for (const sentence of sentences) {
      if ((result + sentence).length > maxChars) {
        break;
      }
      result += sentence;
    }

    // If we got nothing, just truncate at max chars
    if (result.length < maxChars * 0.5) {
      result = text.substring(0, maxChars);
      // Try to break at last space
      const lastSpace = result.lastIndexOf(' ');
      if (lastSpace > maxChars * 0.7) {
        result = result.substring(0, lastSpace);
      }
      result += '...';
    }

    return result.trim();
  }

/**
 * Split text into segments for subtitle timing
 */
function splitIntoSegments(text: string, segmentLength: number): Array<{text: string, order: number}> {
    const words = text.split(' ');
    const segments: Array<{text: string, order: number}> = [];
    let currentSegment = '';
    let order = 0;

    for (const word of words) {
      if ((currentSegment + ' ' + word).length > segmentLength && currentSegment.length > 0) {
        segments.push({
          text: currentSegment.trim(),
          order: order++
        });
        currentSegment = word;
      } else {
        currentSegment += (currentSegment ? ' ' : '') + word;
      }
    }

    // Add the last segment
    if (currentSegment) {
      segments.push({
        text: currentSegment.trim(),
        order: order
      });
    }

    return segments;
}
