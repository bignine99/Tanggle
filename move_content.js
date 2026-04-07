const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, '02_processed_data', 'structured_data');
const foldersToProcess = ['쇼츠', '홈페이지추출'];

const keywordMap = {
  '가슴거상': ['가슴', '유방', '유두', '가슴거상'],
  '팔거상': ['팔', '팔뚝', '팔거상'],
  '복부거상': ['복부', '배', '복부거상', '처진 배'],
  '허벅지거상': ['허벅지', '허벅지거상'],
  '엉덩이성형': ['엉덩이', '힙업', '힙'],
  '지방흡입': ['지방흡입', '지흡', '지방 추출'],
  '남성여유증': ['여유증', '남성'],
  '이마거상': ['이마', '이마거상', '내시경 이마'],
  '얼굴거상': ['얼굴', '안면', '안면거상', '얼굴거상', '미니거상', '스마스'],
  '목거상': ['목거상', '목 주름'],
  '바디필러': ['바디필러', '골반필러', '필러'],
  '동안성형': ['동안', '리프팅', '슈링크', '울쎄라', '안티에이징'],
};

foldersToProcess.forEach(folder => {
  const folderPath = path.join(baseDir, folder);
  if (!fs.existsSync(folderPath)) return;

  const files = fs.readdirSync(folderPath);
  files.forEach(file => {
    if (!file.endsWith('.json')) return;
    const filePath = path.join(folderPath, file);
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const data = JSON.parse(content);
      
      let textToSearch = (data.title || '') + ' ' + 
                         (data.summary || '') + ' ' + 
                         (JSON.stringify(data.content || '')) + ' ' +
                         (data.procedure_name || '');
      
      let matchedCategory = '기타';
      
      // Match keywords
      for (const [cat, keywords] of Object.entries(keywordMap)) {
        if (keywords.some(k => textToSearch.includes(k))) {
          matchedCategory = cat;
          break; // Assign to first matched logic
        }
      }

      const targetDir = path.join(baseDir, matchedCategory);
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      // Move file
      const destPath = path.join(targetDir, file);
      fs.renameSync(filePath, destPath);
      console.log(`Moved ${file} -> ${matchedCategory}`);
    } catch (e) {
      console.error(`Error processing ${file}`, e.message);
    }
  });

  // Try to remove the empty directory
  try {
    fs.rmdirSync(folderPath);
    console.log(`Deleted folder ${folder}`);
  } catch (e) {
    console.error(`Could not delete folder ${folder}`, e.message);
  }
});
