const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '..', '02_processed_data', 'structured_data');

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

const allFiles = getAllJsonFiles(dataPath);
let totalBytes = 0;
const folderStats = {};

for (const f of allFiles) {
  const size = fs.statSync(f).size;
  totalBytes += size;
  const folder = path.basename(path.dirname(f));
  if (!folderStats[folder]) folderStats[folder] = { count: 0, bytes: 0 };
  folderStats[folder].count++;
  folderStats[folder].bytes += size;
}

// Now try to concatenate all data to measure token-equivalent size
let allText = '';
for (const f of allFiles) {
  const content = fs.readFileSync(f, 'utf-8');
  const data = JSON.parse(content);
  const title = data.metadata?.title || data.procedure_name || data.category || '';
  const summary = data.content?.summary || data.summary || '';
  allText += `${title}: ${summary}\n`;
}

const result = {
  totalFiles: allFiles.length,
  totalSizeKB: Math.round(totalBytes / 1024),
  totalSizeMB: (totalBytes / (1024*1024)).toFixed(2),
  estimatedTokens: Math.round(totalBytes / 3), // rough: ~3 bytes per token for mixed content
  allTextPreviewLength: allText.length,
  folders: folderStats
};

fs.writeFileSync(path.join(__dirname, '_data_audit_result.json'), JSON.stringify(result, null, 2));
console.log('Done');
