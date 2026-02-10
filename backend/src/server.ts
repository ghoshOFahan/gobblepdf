import type { Request, Response } from "express";
import express from "express";
import chalk from "chalk";
import multer from "multer";
import pdf from "pdf-parse";
import fs from "fs";
import { embeddingCreate } from "./embedding.js";
const upload = multer({ dest: "uploads/" });
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});
const pdfingest = async (req: Request, res: Response) => {
  try {
    let dataBuffer = fs.readFileSync(req.file!.path);
    pdf(dataBuffer).then((data) => {
      console.log(chalk.bgBlueBright(chunkText(data.text)));
      res.status(200).send(data.text);
    });
  } catch (error) {
    console.log(chalk.red(error));
  }
};
const chunkText = (text: string, size: number = 500, overlap: number = 100) => {
  const chunks = [];
  for (let i = 0; i < text.length; i += size - overlap) {
    chunks.push(text.slice(i, i + size));
  }
  return chunks;
};

app.post("/uploadpdf", (req: Request, res: Response) => {
  upload.single("SourcePDF")(req, res, async (err) => {
    if (err) {
      console.log(err);
      return res.status(400).send("Upload error");
    }
    await pdfingest(req, res);
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
