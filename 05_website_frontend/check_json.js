const fs = require('fs');
const path = require('path');

let count = 0;
function find(d) {
  for (const f of fs.readdirSync(d)) {
    const p = path.join(d, f);
    if (fs.statSync(p).isDirectory()) {
      find(p);
    } else if (p.endsWith('.json')) {
      count++;
      try {
        JSON.parse(fs.readFileSync(p, 'utf8'));
      } catch (e) {
        console.log('INVALID JSON:', p);
        console.log(e.message);
      }
    }
  }
}
find(path.join(__dirname, '../02_processed_data/structured_data'));
console.log('Checked files:', count);
