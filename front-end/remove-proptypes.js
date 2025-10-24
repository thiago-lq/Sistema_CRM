// remove-proptypes.js
// 🧹 Remove automaticamente todas as importações e validações de PropTypes em projetos React/Vite (.js e .jsx)

import { readdirSync, statSync, readFileSync, writeFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

// 🧭 Suporte ESM: resolve __dirname e __filename
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function walkDir(dir) {
  const files = readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      walkDir(fullPath);
    } else if (file.endsWith(".js") || file.endsWith(".jsx")) {
      cleanFile(fullPath);
    }
  }
}

function cleanFile(filePath) {
  let content = readFileSync(filePath, "utf-8");
  let original = content;

  // 🧽 Remove importações de prop-types
  content = content.replace(/^import\s+PropTypes\s+from\s+["']prop-types["'];?\s*\n?/gm, "");

  // 🧽 Remove blocos de validação .propTypes = { ... };
  content = content.replace(
    /^[A-Za-z0-9_]+\s*\.propTypes\s*=\s*\{[\s\S]*?\};?\s*/gm,
    ""
  );

  if (content !== original) {
    writeFileSync(filePath, content, "utf-8");
    console.log(`✅ Limpou: ${filePath}`);
  }
}

console.log("🧹 Limpando todas as referências a prop-types...\n");
walkDir(__dirname);
console.log("\n✨ Concluído! Todas as referências a prop-types foram removidas com sucesso.");
