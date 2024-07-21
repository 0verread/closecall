import isPromptRelevant from '../src';

// Mock the dynamic import
jest.mock('@xenova/transformers', () => ({
  pipeline: jest.fn(),
  env: {
    allowLocalModels: false,
    useBrowserCache: false,
  },
}), { virtual: true });

describe('Xenova Classifier and isPromptRelevant', () => {
  let mockPipeline: jest.Mock;
  let mockClassifier: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockClassifier = jest.fn();
    mockPipeline = jest.fn().mockResolvedValue(mockClassifier);

    // Mock the dynamic import
    (global as any).Function = jest.fn().mockReturnValue(() => Promise.resolve({
      pipeline: mockPipeline,
      env: {
        allowLocalModels: false,
        useBrowserCache: false,
      },
    }));
  });

  it('should classify text as relevant when the model returns a higher score for the relevant label', async () => {
    mockClassifier.mockResolvedValue({
      labels: ['test, or example, or prompt, or testing.', 'something else'],
      scores: [0.7, 0.1],
    });

    const result = await isPromptRelevant('This is a test prompt', ['test', 'example', 'prompt', 'testing']);
    expect(result).toBe(true);
  });

  it('should classify text as irrelevant when the model returns a higher score for the irrelevant label', async () => {
    mockClassifier.mockResolvedValue({
      labels: ['test, or example.', 'something else'],
      scores: [0.3, 0.7],
    });

    const result = await isPromptRelevant('This is an unrelated prompt', ['test', 'example']);
    expect(result).toBe(false);
  });
});

