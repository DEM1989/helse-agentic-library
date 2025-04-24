import { configureAgent, ForwardAgent } from '../agent';
import { WritingSuggestion } from '../types';

// Mock OpenAI
jest.mock('openai', () => {
  const mockCreate = jest.fn();
  return jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: mockCreate
      }
    }
  }));
});

describe('ForwardAgent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getWritingSuggestions', () => {
    it('should throw an error if API key is not configured', async () => {
      // Configure without API key
      configureAgent({});

      await expect(ForwardAgent.getWritingSuggestions('test text'))
        .rejects
        .toThrow('Agent is not configured with an API key');
    });

    it('should return writing suggestions from the LLM', async () => {
      // Mock suggestions response
      const mockSuggestions: WritingSuggestion[] = [
        {
          type: 'grammar',
          originalText: 'The company have been',
          suggestedText: 'The company has been',
          explanation: 'Use singular verb form with singular subject',
          confidence: 0.95
        }
      ];

      // Mock OpenAI response
      const mockOpenAI = require('openai');
      const mockInstance = mockOpenAI();
      mockInstance.chat.completions.create.mockResolvedValue({
        choices: [
          {
            message: {
              content: JSON.stringify(mockSuggestions)
            }
          }
        ]
      });

      configureAgent({
        apiKey: 'test-api-key'
      });

      // Call the method
      const result = await ForwardAgent.getWritingSuggestions('test text');

      // Verify results
      expect(result).toEqual(mockSuggestions);
      expect(mockInstance.chat.completions.create).toHaveBeenCalledWith(expect.objectContaining({
        messages: expect.arrayContaining([
          expect.objectContaining({ role: 'system' }),
          expect.objectContaining({ role: 'user', content: 'test text' })
        ]),
        temperature: expect.any(Number),
        response_format: { type: 'json_object' }
      }));
    });

    it('should handle parsing errors gracefully', async () => {
      // Mock invalid JSON response
      const mockOpenAI = require('openai');
      const mockInstance = mockOpenAI();
      mockInstance.chat.completions.create.mockResolvedValue({
        choices: [
          {
            message: {
              content: 'This is not valid JSON'
            }
          }
        ]
      });

      configureAgent({
        apiKey: 'test-api-key',
        callbacks: {
          onAgentError: jest.fn()
        }
      });

      // Call the method
      const result = await ForwardAgent.getWritingSuggestions('test text');

      // Should return empty array on parse error
      expect(result).toEqual([]);
      expect(mockInstance.chat.completions.create).toHaveBeenCalled();
    });
  });
});
