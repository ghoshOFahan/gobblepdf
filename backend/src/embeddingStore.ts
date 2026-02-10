import dotenv from "dotenv";
dotenv.config({ path: "../.env" });
import { Pinecone } from "@pinecone-database/pinecone";
import { embeddingCreate } from "./embedding.js";
if (process.env.PINECONE_KEY) {
  const pc = new Pinecone({ apiKey: process.env.PINECONE_KEY });
  const index = pc
    .index(
      "joyful-redwood",
      "https://joyful-redwood-9vsh2c5.svc.aped-4627-b74a.pinecone.io",
    );
  async function storeChunks(chunks: string[]) {
    const vectors = await Promise.all(
      chunks.map(async (chunk, i) => {
        const embedding = await embeddingCreate(chunk);
        return {
          _id: `rec${i}`,
          values: embedding,
          metadata: { text: chunk },
        };
      }),
    );
    await index.('_default_').upsert(vectors);
  }
}
