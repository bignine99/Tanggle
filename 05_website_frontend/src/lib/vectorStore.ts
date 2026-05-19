import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";

export interface VectorEntry {
  id: string;
  vector: number[];
  content: string;
  metadata: any;
}

export class AuraVectorStore {
  private entries: VectorEntry[] = [];
  private apiKey: string;
  private genAI: GoogleGenerativeAI;
  private indexPath: string;

  constructor(apiKey: string, indexPath?: string) {
    this.apiKey = apiKey;
    this.genAI = new GoogleGenerativeAI(this.apiKey);
    this.indexPath = indexPath || path.join(process.cwd(), "src", "data", "vector_index.json");
    this.loadIndex();
  }

  private loadIndex() {
    if (fs.existsSync(this.indexPath)) {
      try {
        const data = fs.readFileSync(this.indexPath, "utf-8");
        this.entries = JSON.parse(data);
        console.log(`[VectorStore] Loaded ${this.entries.length} vectors from ${this.indexPath}`);
      } catch (e) {
        console.error("[VectorStore] Failed to load index:", e);
        this.entries = [];
      }
    }
  }

  async saveIndex() {
    const dir = path.dirname(this.indexPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(this.indexPath, JSON.stringify(this.entries, null, 2));
    console.log(`[VectorStore] Saved ${this.entries.length} vectors to ${this.indexPath}`);
  }

  async getEmbedding(text: string): Promise<number[]> {
    const model = this.genAI.getGenerativeModel({ model: "gemini-embedding-001" });
    const result = await model.embedContent(text);
    return result.embedding.values;
  }

  async addEntry(content: string, metadata: any) {
    const vector = await this.getEmbedding(content);
    const id = Buffer.from(content.substring(0, 50) + Math.random()).toString("base64");
    this.entries.push({ id, vector, content, metadata });
  }

  private cosineSimilarity(vecA: number[], vecB: number[]): number {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        normA += vecA[i] * vecA[i];
        normB += vecB[i] * vecB[i];
    }
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  async search(query: string, topK: number = 5): Promise<VectorEntry[]> {
    const queryVector = await this.getEmbedding(query);
    
    const results = this.entries.map(entry => ({
      ...entry,
      score: this.cosineSimilarity(queryVector, entry.vector)
    }));

    // Sort by score descending
    results.sort((a, b) => b.score - a.score);
    
    return results.slice(0, topK);
  }

  clear() {
    this.entries = [];
  }
}
