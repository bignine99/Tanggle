import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simple manual .env parser to avoid extra dependencies
const envContent = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf-8');
const GEMINI_API_KEY = envContent.match(/GEMINI_API_KEY=([^\s]+)/)?.[1];

if (!GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY not found in .env.local");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const embeddingModel = genAI.getGenerativeModel({ model: "gemini-embedding-001" });

const DATA_PATH = path.join(__dirname, '..', '..', '02_processed_data', 'structured_data');
const OUTPUT_PATH = path.join(__dirname, '..', 'src', 'data', 'vector_index.json');

async function getEmbedding(text) {
  try {
    const result = await embeddingModel.embedContent(text);
    return result.embedding.values;
  } catch (e) {
    console.error(`Embedding failed for text: ${text.substring(0, 50)}...`, e);
    return null;
  }
}

function getAllJsonFiles(dirPath, files = []) {
  if (!fs.existsSync(dirPath)) return files;
  for (const file of fs.readdirSync(dirPath)) {
    const full = path.join(dirPath, file);
    if (fs.statSync(full).isDirectory()) {
      getAllJsonFiles(full, files);
    } else if (file.endsWith('.json')) {
      files.push(full);
    }
  }
  return files;
}

async function runIndexing() {
  console.log("🚀 Starting Aura RAG Indexing...");
  const allFiles = getAllJsonFiles(DATA_PATH);
  console.log(`Found ${allFiles.length} files to index.`);

  const vectorEntries = [];

  for (const file of allFiles) {
    try {
      const content = fs.readFileSync(file, 'utf-8');
      const data = JSON.parse(content);
      const category = path.basename(path.dirname(file));
      const title = data.metadata?.title || data.procedure_name || data.category || "정보";

      console.log(`Processing: [${category}] ${title}`);

      // 1. Create a "Main Content" chunk
      let mainText = `카테고리: ${category}\n제목: ${title}\n`;
      if (data.surgery_info) mainText += `시술정보: ${JSON.stringify(data.surgery_info)}\n`;
      if (data.procedure_overview) mainText += `개요: ${JSON.stringify(data.procedure_overview)}\n`;
      if (data.summary) mainText += `요약: ${data.summary}\n`;
      if (data.content?.summary) mainText += `요약: ${data.content.summary}\n`;

      const mainVector = await getEmbedding(mainText);
      if (mainVector) {
        vectorEntries.push({
          id: `main_${Buffer.from(file).toString('base64').substring(0, 10)}`,
          vector: mainVector,
          content: mainText,
          metadata: { source: file, type: 'main', category, title }
        });
      }

      // 2. Create individual Q&A chunks (very important for RAG accuracy)
      const qaPairs = data.content?.qa_pairs || [];
      for (let i = 0; i < qaPairs.length; i++) {
        const qa = qaPairs[i];
        const qaText = `상담 질문: ${qa.question}\n전문가 답변: ${qa.answer}\n(출처: ${category} - ${title})`;
        
        const qaVector = await getEmbedding(qaText);
        if (qaVector) {
          vectorEntries.push({
            id: `qa_${i}_${Buffer.from(file).toString('base64').substring(0, 10)}`,
            vector: qaVector,
            content: qaText,
            metadata: { source: file, type: 'qa', category, title }
          });
        }
      }
      
      // Delay slightly to avoid rate limits if many files
      await new Promise(r => setTimeout(r, 200));

    } catch (e) {
      console.error(`Error processing ${file}:`, e);
    }
  }

  // Ensure directory exists
  const outDir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(vectorEntries, null, 2));
  console.log(`✅ Indexing complete! Total vectors: ${vectorEntries.length}`);
  console.log(`Saved to: ${OUTPUT_PATH}`);
}

runIndexing();
