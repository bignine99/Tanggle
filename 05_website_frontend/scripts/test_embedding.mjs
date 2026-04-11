import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envContent = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf-8');
const key = envContent.match(/GEMINI_API_KEY=([^\s]+)/)?.[1];

async function test() {
  const url = `https://generativelanguage.googleapis.com/v1/models/text-embedding-004:embedContent?key=${key}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      content: { parts: [{ text: "Hello world" }] }
    })
  });
  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
}

test();
