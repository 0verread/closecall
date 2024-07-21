/**
 * simple import xenova/transformers will throw error. read more here 
 * https://stackoverflow.com/questions/76883048/err-require-esm-for-import-with-xenova-transformers
 * @returns pipeline 
 */

async function _initXenova() {
  let TransformersApi = Function('return import("@xenova/transformers")')();
  const { pipeline, env } = await TransformersApi;
  env.allowLocalModels = false;
  env.useBrowserCache = false;
  
  return pipeline;
}

const MODEL = "Xenova/mobilebert-uncased-mnli";
let classifierInstance: any | null = null;

/**
 * initialize the classifier instance
 * @returns a classifier instance
 */
const initClassifierInstance = async () => {
  if (!classifierInstance) {
    const pipeline = await _initXenova();
    classifierInstance = await pipeline("zero-shot-classification", MODEL);;
  }
  return classifierInstance;
}

/**
 *  check if text is relevant to context
 * @param text the text to check if that's relevant to context 
 * @param keywords array of context keyword arry
 * @returns Boolean promise
 */
const classfyRelevance = async (text: string, keywords: string[]): Promise<boolean> => {
  const classfier = await initClassifierInstance();
  const labels = [`${keywords.join(', or ')}.`, 'something else'];
  const result = await classfier(text, labels);

  const relevantIndex = result.labels?.indexOf(`${keywords.join(', or ')}.`);
  const irrelevantIndex = result.label?.indexOf('something else');
  
  return result.scores[relevantIndex] > result.scores[irrelevantIndex];
}

const isPromptRelevant = async (prompt: string, keywords: string[]): Promise<boolean> => {
  return classfyRelevance(prompt, keywords);

}

export default isPromptRelevant;
