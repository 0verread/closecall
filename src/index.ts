import { pipeline, env } from "@xenova/transformers";

env.allowLocalModels = false;
env.useBrowserCache = false;

const MODEL = "Xenova/mobilebert-uncased-mnli";

const pipelinePromise = pipeline("zero-shot-classification", MODEL, { quantized: true }).then((pipe) => {
  return pipe;
});

const initInstance = async () => {
  let instance  = await pipelinePromise;
  return instance;
}



