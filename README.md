## closecall

a lightweight npm package to keep llm calls within the relevant keywords.

### Use case

AI-powered chatbots can be abused with irrelevant queries, making LLM cost higher and expensive. Use this simple package to keep your LLM calls within relevant keywords. 

### Usage

1. Install the package
```bash
npm i closecall
```

```js
import isPromptRelevant from "closecall";

const keywords = ["Soccer", "game", "summer", "play"]
var prompt = "I want to play soccer";


const MakeAPICall = async () => {
  const isRelevant = await isPromptRelevant(prompt, keywords);
  if(!isRelevant) {
    throw new Error("Can't make API call with irrelevant prompt");
  } else {
    // make api call
  }
  console.log(isRelevant)
}
```

### License

under [MIT](LICENSE) License
