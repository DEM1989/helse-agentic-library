import { triggerCallback, findTool } from '../utils';
import { Tool } from '../types';

describe('Utils', () => {
  describe('triggerCallback', () => {
    it('should call the callback with the provided data', async () => {
      const mockCallback = jest.fn();
      const testData = { test: 'data' };

      await triggerCallback(mockCallback, testData);

      expect(mockCallback).toHaveBeenCalledWith(testData);
    });

    it('should not throw if callback is undefined', async () => {
      const testData = { test: 'data' };

      // This should not throw
      await expect(triggerCallback(undefined, testData)).resolves.not.toThrow();
    });

    it('should handle errors in the callback', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      const errorMessage = 'Test error';
      const mockCallback = jest.fn().mockImplementation(() => {
        throw new Error(errorMessage);
      });
      const testData = { test: 'data' };

      await triggerCallback(mockCallback, testData);

      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Error executing agent callback'),
        expect.anything()
      );

      consoleErrorSpy.mockRestore();
    });
  });

  describe('findTool', () => {
    it('should find a tool by name', () => {
      const tools: Tool[] = [
        {
          name: 'testTool',
          description: 'A test tool',
          execute: async () => 'test result'
        },
        {
          name: 'anotherTool',
          description: 'Another test tool',
          execute: async () => 'another result'
        }
      ];

      const result = findTool('testTool', tools);

      expect(result).toBeDefined();
      expect(result?.name).toBe('testTool');
    });

    it('should return undefined if tool is not found', () => {
      const tools: Tool[] = [
        {
          name: 'testTool',
          description: 'A test tool',
          execute: async () => 'test result'
        }
      ];

      const result = findTool('nonExistentTool', tools);

      expect(result).toBeUndefined();
    });

    it('should return undefined if tools array is undefined', () => {
      const result = findTool('testTool', undefined);

      expect(result).toBeUndefined();
    });
  });
});
