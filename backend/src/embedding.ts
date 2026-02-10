import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });
const openai = new OpenAI({ apiKey: process.env.OPEN_AI_KEY });

export const embeddingCreate = async (input: string) => {
  const r = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: input,
    encoding_format: "float",
  });
  return r.data[0]?.embedding;
};

console.log(embeddingCreate);
