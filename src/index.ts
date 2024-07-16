import { pipeline, env } from "@xenova/transformers";

env.allowLocalModels = false;
env.useBrowserCache = false;

const MODEL = "Xenova/mobilebert-uncased-mnli";
const TASK = "zero-shot-classification";

const pipelinePromise = pipeline(TASK, MODEL, { quantized: true }).then((pipe) => {
  return pipe;
});



class ClassificationPipeline {
  static instance: any = null;

  static async getInstance(
    progress_callback: Function | undefined = undefined
  ) {
    if (this.instance === null) {
      this.instance = await pipelinePromise;
    }
    return this.instance;
  }
}

// Function to check relevance
const isRelevant = async (
  prompt: string,
  keywords: string[]
): Promise<boolean> => {
  const classifier = await ClassificationPipeline.getInstance();
  const sequence_to_classify = prompt;
  const candidate_labels = [`${keywords.join(", or ")}.`, `something else`];
  const result = await classifier(sequence_to_classify, candidate_labels);

  const irrelevantIndex = result.labels.indexOf("something else");
  const relevantIndex = irrelevantIndex === 0 ? 1 : 0;

  return result.scores[relevantIndex] > result.scores[irrelevantIndex];
}

export default isRelevant;
