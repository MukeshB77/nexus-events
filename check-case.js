const fs = require('fs');
const path = require('path');

function checkFileExistsCaseSensitive(filepath) {
    const dir = path.dirname(filepath);
    const base = path.basename(filepath);
    if (!fs.existsSync(dir)) return false;
    const files = fs.readdirSync(dir);
    return files.includes(base);
}

function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDirectory(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            const importRegex = /from\s+['"]([^'"]+)['"]/g;
            let match;
            while ((match = importRegex.exec(content)) !== null) {
                const importPath = match[1];
                if (importPath.startsWith('.')) {
                    // Local import
                    let resolvedPath = path.resolve(path.dirname(fullPath), importPath);
                    // Add extensions to test
                    let exts = ['.ts', '.tsx', '/index.ts', '/index.tsx'];
                    let found = false;
                    for (const ext of exts) {
                        if (checkFileExistsCaseSensitive(resolvedPath + ext)) {
                            found = true;
                            break;
                        }
                    }
                    if (!found && fs.existsSync(resolvedPath)) {
                        console.log(`CASE MISMATCH or NOT FOUND: ${importPath} in ${fullPath}`);
                    }
                } else if (importPath.startsWith('@/')) {
                    // Alias import
                    let resolvedPath = path.join(__dirname, 'apps/web', importPath.substring(2));
                    let exts = ['.ts', '.tsx', '/index.ts', '/index.tsx', '.js', '.jsx'];
                    let found = false;
                    for (const ext of exts) {
                        if (checkFileExistsCaseSensitive(resolvedPath + ext)) {
                            found = true;
                            break;
                        }
                    }
                    if (!found && fs.existsSync(resolvedPath)) {
                        console.log(`CASE MISMATCH or NOT FOUND: ${importPath} in ${fullPath}`);
                    }
                }
            }
        }
    }
}

processDirectory(path.join(__dirname, 'apps/web/app'));
processDirectory(path.join(__dirname, 'apps/web/components'));
