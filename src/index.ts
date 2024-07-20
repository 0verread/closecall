async function _initXenova() {
  let TransformersApi = Function('return import("@xenova/transformers")')();
  const { pipeline, env } = await TransformersApi;
  env.allowLocalModels = false;
  env.useBrowserCache = false;
  
  return pipeline;
}

const MODEL = "Xenova/mobilebert-uncased-mnli";
let classifierInstance: any | null = null;

const initClassifierInstance = async () => {
  if (!classifierInstance) {
    const pipeline = await _initXenova();
    classifierInstance = await pipeline("zero-shot-classification", MODEL);;
  }
  return classifierInstance;
}

const classfyRelevance = async (text: string, keywords: string[]): Promise<boolean> => {
  const classfier = await initClassifierInstance();
  const labels = [`${keywords.join(', or ')}.`, 'something else'];
  const result = await classfier(text, labels);

  console.log(result);
  const relevantIndex = result.labels?.indexOf(`${keywords.join(', or ')}.`);
  const irrelevantIndex = result.label?.indexOf('something else');
  
  return result.scores[relevantIndex] > result.scores[irrelevantIndex];
}

const isPromptRelevant = async (prompt: string, keywords: string[]): Promise<boolean> => {
  return classfyRelevance(prompt, keywords);

}

const text = 'I have a problem with my iphone that needs to be resolved asap!';
const labels = [ 'urgent', 'not urgent', 'phone', 'tablet', 'computer' ];

const ress = async () => {
  const re = await isPromptRelevant(text, labels);
  console.log(re);
}
ress();

export {};


