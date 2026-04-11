const fs = require('fs');
const path = require('path');

const RAW_DIR = path.join(__dirname, '..', '01_raw_data', 'sample_simulation');
const TARGET_DIR = path.join(__dirname, 'public', 'images', 'simulations');

if (!fs.existsSync(TARGET_DIR)) {
  fs.mkdirSync(TARGET_DIR, { recursive: true });
}

// Procedure mapping based on filenames:
// Sample_가슴거상_after.png -> Has after
// Sample_가슴거상_brefoe.png -> Has before
// Sample_바디필러_after.png
// Sample_바디필러_before.png
// Sample_남성거유증_before.jpeg -> Needs after
// Sample_얼굴거상.png -> Needs after
// Sample_이마거상.png -> Needs after
// Sample_팔거상.jpeg -> Needs after
// Sample_복부거상.jpeg -> Needs after
// Sample_허벅지거상.webp -> Needs after
// Sample_동안성형.png -> Needs after
// Sample_엉덩이성형.jpeg -> Needs after

const items = [
  { file: 'Sample_남성거유증_before.jpeg', procedure: '남성여유증', name: '남성여유증' },
  { file: 'Sample_얼굴거상.png', procedure: '얼굴거상', name: '얼굴거상' },
  { file: 'Sample_이마거상.png', procedure: '이마거상', name: '이마거상' },
  { file: 'Sample_팔거상.jpeg', procedure: '팔거상', name: '팔거상' },
  { file: 'Sample_복부거상.jpeg', procedure: '복부거상', name: '복부거상' },
  { file: 'Sample_허벅지거상.webp', procedure: '허벅지거상', name: '허벅지거상' },
  { file: 'Sample_동안성형.png', procedure: '동안성형', name: '동안성형' },
  { file: 'Sample_엉덩이성형.jpeg', procedure: '엉덩이성형', name: '엉덩이성형' }
];

async function generateAI() {
  console.log("Starting AI Generation...");
  for (const item of items) {
    const filePath = path.join(RAW_DIR, item.file);
    if (!fs.existsSync(filePath)) {
      console.log(`[!] Missing file: ${item.file}`);
      continue;
    }

    const beforeDest = path.join(TARGET_DIR, `${item.name}_before.${item.file.split('.').pop()}`);
    fs.copyFileSync(filePath, beforeDest);
    console.log(`Copied ${item.file} to target directory.`);

    // Read to base64
    const buffer = fs.readFileSync(filePath);
    const mimeType = item.file.endsWith('png') ? 'image/png' : item.file.endsWith('webp') ? 'image/webp' : 'image/jpeg';
    const base64Data = `data:${mimeType};base64,${buffer.toString('base64')}`;

    console.log(`Calling API for ${item.procedure}...`);
    try {
      const response = await fetch('http://localhost:3000/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: base64Data,
          procedure: item.procedure
        })
      });

      const data = await response.json();
      if (data.error) {
        console.error(`Error for ${item.procedure}:`, data.error);
        continue;
      }

      // decode base64 out
      const outData = data.image.split(',')[1];
      const afterDest = path.join(TARGET_DIR, `${item.name}_after.jpeg`);
      fs.writeFileSync(afterDest, Buffer.from(outData, 'base64'));
      console.log(`[SUCCESS] Generated AFTER for ${item.procedure}`);

    } catch (e) {
      console.error(`Request failed for ${item.procedure}`, e);
    }
  }

  // Handle explicit before/after pairs
  const explicit = [
    { bf: 'Sample_가슴거상_brefoe.png', af: 'Sample_가슴거상_after.png', name: '가슴거상' },
    { bf: 'Sample_바디필러_before.png', af: 'Sample_바디필러_after.png', name: '바디필러' }
  ];

  for(const ex of explicit) {
    const bfPath = path.join(RAW_DIR, ex.bf);
    const afPath = path.join(RAW_DIR, ex.af);
    if (fs.existsSync(bfPath)) fs.copyFileSync(bfPath, path.join(TARGET_DIR, `${ex.name}_before.png`));
    if (fs.existsSync(afPath)) fs.copyFileSync(afPath, path.join(TARGET_DIR, `${ex.name}_after.png`));
  }
}

generateAI();
