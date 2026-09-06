const fs = require('fs');
const path = require('path');

function scanDir(dir) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      scanDir(full);
    } else if (f.endsWith('.js') || f.endsWith('.jsx')) {
      const content = fs.readFileSync(full, 'utf8');
      const rnMatch = content.match(/import\s*\{([^}]+)\}\s*from\s*['"]react-native['"]/);
      const rnImports = rnMatch ? rnMatch[1].split(',').map(s => s.trim().replace(/\s+as\s+.*/, '')) : [];
      
      const checkSymbols = ['Platform', 'Dimensions', 'StyleSheet', 'View', 'Text', 'TouchableOpacity', 'ScrollView', 'TextInput', 'FlatList', 'Alert', 'StatusBar', 'Image', 'ActivityIndicator'];
      for (const sym of checkSymbols) {
        const regex = new RegExp('\\b' + sym + '\\b');
        if (regex.test(content)) {
          const isImported = rnImports.includes(sym) ||
            content.includes('import ' + sym) ||
            content.includes(sym + ' =') ||
            content.includes(sym + ':') ||
            content.includes('function ' + sym) ||
            content.includes('const ' + sym) ||
            content.includes('let ' + sym) ||
            content.includes('class ' + sym);
          if (!isImported) {
            console.log(`Missing import ${sym} in: ${full}`);
          }
        }
      }
    }
  }
}

scanDir(path.resolve(__dirname, '../src'));
console.log('Scan completed successfully.');
