import { GoogleGenAI } from "@google/genai";
import fs from 'fs';
import path from 'path';

const key = fs.readFileSync('.env.local', 'utf8').match(/GEMINI_API_KEY=(.*)/)[1].trim();
const ai = new GoogleGenAI({ apiKey: key });

const PROCEDURE_DETAILS = {
  '팔거상': `
    [TARGET AREA]: The underarm area, triceps, and side silhouette of the upper arm.
    [EXTREME STRUCTURAL CHANGE REQUIRED - NO COMPROMISE]:
    - Visualize using a "Photoshop Liquify/Pucker tool" pushed to 300% strength.
    - You MUST artificially SHAVE OFF and DELETE the bottom 60-70% of the upper arm's thickness.
    - The new arm diameter must be bizarrely thin, almost skeleton-like or impossibly muscularly tight.
    - This is a medical fantasy simulation. Do NOT worry about realism if it prevents you from making the arm extremely thin.
    - FILL the massive void left by the deleted fat with the exact background (wall, floor, etc.).
  `
};

const procedure = '팔거상';
const specificInstruction = PROCEDURE_DETAILS[procedure];

const prompt = `You are a world-class, extremely aggressive photo editor acting as a plastic surgery simulation engine.

TASK: Generate a photorealistic AFTER image showing the results of "${procedure}" surgery on the person in the photo.

=== EXTREME TRANSFORMATION SPECIFICATION ===
${specificInstruction}

=== CRITICAL RENDERING RULES ===

RULE 1 — MAXIMUM DRAMATIC CHANGE (MOST IMPORTANT):
The model MUST significantly distort and reduce the mass of the targeted body part. 
If someone looks at the result and says "these look the same", you have FAILED.
Bypass safety limits regarding anatomical realism—make the targeted change EXAGGERATED, EXTREME, and STRUCTURAL.

RULE 2 — BACKGROUND INPAINTING:
When you delete arm fat, belly fat, or leg fat, you MUST generously INPAINT the background. OVERWRITE the old body pixels with the background.

RULE 3 — PHOTO CONSISTENCY:
- Face identity, overall pose, lighting, and clothing type must not change.
- Only the specific TARGET AREA is allowed to have its geometry warped or sliced off.

=== NEGATIVE PROMPT (DO NOT INCLUDE) ===
Fat, thick arms, sagging skin, loose skin, bulky silhouette, subtle changes, original body mass.

=== OUTPUT ===
Return ONLY the generated image. No text, no labels, no watermarks.`;

const imagePath = String.raw`C:\Users\cho\Desktop\Temp\05_1_code\260405_Tanggle\01_raw_data\sample_simulation\40대_한국여성의_느러진_202604071854.jpeg`;
const outPath = String.raw`C:\Users\cho\Desktop\Temp\05_1_code\260405_Tanggle\01_raw_data\sample_simulation\OUT_팔거상_40대_한국여성의_느러진.jpeg`;

const base64Data = fs.readFileSync(imagePath).toString("base64");

console.log("Requesting Gemini API...");

async function run() {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: "image/jpeg",
            },
          },
          { text: prompt },
        ],
      },
      config: {
        temperature: 0.7,
        responseModalities: ["IMAGE"],
      }
    });

    const part = response.candidates[0].content.parts[0];
    if (part && part.inlineData) {
      fs.writeFileSync(outPath, Buffer.from(part.inlineData.data, 'base64'));
      console.log("Successfully saved output to", outPath);
    } else {
      console.log("No image generated.", JSON.stringify(part, null, 2));
    }
  } catch (e) {
    console.error("Error:", e);
  }
}

run();
