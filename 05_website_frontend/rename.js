const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filepath = path.join(dir, file);
        const stats = fs.statSync(filepath);
        if (stats.isDirectory()) {
            walk(filepath, callback);
        } else if (stats.isFile()) {
            if (filepath.endsWith('.ts') || filepath.endsWith('.tsx')) {
                callback(filepath);
            }
        }
    }
}

walk(path.join(__dirname, 'src'), (filepath) => {
    let content = fs.readFileSync(filepath, 'utf8');
    let original = content;
    
    // Replace names
    content = content.replace(/탱글성형외과/g, "Aura Clinic");
    content = content.replace(/탱글의/g, "아우라의");
    content = content.replace(/탱글 AI/g, "Aura AI");
    content = content.replace(/탱글/g, "아우라");
    content = content.replace(/TANGGLE CLINIC/g, "AURA CLINIC");
    content = content.replace(/TANGGLE/g, "AURA");

    if (content !== original) {
        fs.writeFileSync(filepath, content, 'utf8');
        console.log("Updated", filepath);
    }
});
