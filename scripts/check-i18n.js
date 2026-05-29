/**
 * i18n Key Validator
 * Checks that all `t('...')` calls in source code have matching keys in en.json
 * Run: node scripts/check-i18n.js
 */
const fs = require('fs')
const path = require('path')

const SRC_DIR = path.join(__dirname, '..', 'src')
const EN_JSON = path.join(SRC_DIR, 'i18n', 'en.json')

// Extract all flat keys from nested JSON
function flattenKeys(obj, prefix = '') {
  let keys = []
  for (const [k, v] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${k}` : k
    if (typeof v === 'object' && v !== null) {
      keys.push(...flattenKeys(v, fullKey))
    } else {
      keys.push(fullKey)
    }
  }
  return keys
}

// Extract all `t('...')` calls from a file
function extractTCalls(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8')
  const regex = /t\(['"]([^'"]+)['"]\)/g
  const keys = []
  let match
  while ((match = regex.exec(content)) !== null) {
    const key = match[1]
    if (!key.includes('.')) continue
    keys.push(key)
  }
  return keys
}

function getAllFiles(dir, ext = '.tsx') {
  const files = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory() && !entry.name.startsWith('.')) {
      files.push(...getAllFiles(fullPath, ext))
    } else if (entry.isFile() && entry.name.endsWith(ext)) {
      files.push(fullPath)
    }
  }
  return files
}

// Main
const jsonKeys = new Set(flattenKeys(JSON.parse(fs.readFileSync(EN_JSON, 'utf-8'))))
const tsxFiles = getAllFiles(SRC_DIR)
let errors = 0

for (const file of tsxFiles) {
  const codeKeys = extractTCalls(file)
  for (const key of codeKeys) {
    if (key.endsWith('...')) continue // skip dynamic keys
    if (!jsonKeys.has(key)) {
      const relPath = path.relative(SRC_DIR, file)
      console.log(`❌ MISSING: ${relPath} — t('${key}') not found in en.json`)
      errors++
    }
  }
}

if (errors === 0) {
  console.log('✅ All i18n keys match en.json')
} else {
  console.log(`\n${errors} missing key(s) found`)
  process.exit(1)
}
