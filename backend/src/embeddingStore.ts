import dotenv from "dotenv";
dotenv.config({ path: "../.env" });
import { Pinecone } from "@pinecone-database/pinecone";
let pc: Pinecone;
if (process.env.PINECONE_KEY) {
  pc = new Pinecone({ apiKey: process.env.PINECONE_KEY });
} else {
  throw new Error("Missing PINECONE_KEY");
}
const namespace = pc
  .index(
    "boundless",
    "https://boundless-9vsh2c5.svc.aped-4627-b74a.pinecone.io",
  )
  .namespace("__default__");
export async function storeChunks(chunks: string[]) {
  const records = chunks.map((chunk, i) => ({
    id: `rec${i}`,
    text: chunk,
  }));

  await namespace.upsertRecords({ records });
}
export async function ask(question: string) {
  const response = await namespace.searchRecords({
    query: {
      topK: 5,
      inputs: { text: `${question}` },
    },
  });
  return response;
}
