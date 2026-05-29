/**
 * Deep i18n Scan — checks every t() call for:
 * 1. Key existence in en.json and hi.json
 * 2. All {{...}} interpolation vars match the passed object
 * 3. Extra passed vars that the template doesn't use (warn)
 * Run: node scripts/deep-i18n-scan.js
 */
const fs = require('fs')
const path = require('path')

const SRC_DIR = path.join(__dirname, '..', 'src')
const EN_JSON = path.join(SRC_DIR, 'i18n', 'en.json')
const HI_JSON = path.join(SRC_DIR, 'i18n', 'hi.json')

const enData = JSON.parse(fs.readFileSync(EN_JSON, 'utf-8'))
const hiData = JSON.parse(fs.readFileSync(HI_JSON, 'utf-8'))

// Get nested value by dot-separated key
function getByKey(obj, key) {
  const parts = key.split('.')
  let cur = obj
  for (const p of parts) {
    if (cur == null || typeof cur !== 'object') return undefined
    cur = cur[p]
  }
  return cur
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

// Extract interpolation vars from a template string like "Size {{size}}" → ['size']
function extractTemplateVars(template) {
  const regex = /\{\{(\w+)\}\}/g
  const vars = []
  let match
  while ((match = regex.exec(template)) !== null) {
    vars.push(match[1])
  }
  return vars
}

// Extract all t() calls with interpolation objects from file content
function extractTCallsDetailed(content) {
  const calls = []
  // Match t('key', { ... }) or t("key", { ... })
  // Use negative lookbehind to avoid matching get(), set(), etc.
  const tRegex = /(?<!\w)t\(\s*['"]([^'"]+)['"]\s*(?:,\s*\{([^}]*)\})?\s*\)/g
  let match
  while ((match = tRegex.exec(content)) !== null) {
    const key = match[1]
    const objStr = match[2]
    const passedVars = []
    if (objStr) {
      // Split by comma, each part is a key-value pair or shorthand
      const parts = objStr.split(',')
      for (const part of parts) {
        const trimmed = part.trim()
        if (trimmed.includes(':')) {
          // Explicit: { size: fontSize } → key is 'size'
          const key = trimmed.split(':')[0].trim().match(/\w+/)
          if (key) passedVars.push(key[0])
        } else {
          // Shorthand: { name } → key is 'name'
          const key = trimmed.match(/\w+/)
          if (key) passedVars.push(key[0])
        }
      }
    }
    calls.push({ key, passedVars })
  }
  return calls
}

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

// ── Main ──
const enKeys = new Set(flattenKeys(enData))
const hiKeys = new Set(flattenKeys(hiData))
const tsxFiles = getAllFiles(SRC_DIR)

let missingFromEn = 0
let missingFromHi = 0
let mismatchVars = 0
let totalCalls = 0

for (const file of tsxFiles) {
  const content = fs.readFileSync(file, 'utf-8')
  const calls = extractTCallsDetailed(content)
  const relPath = path.relative(SRC_DIR, file)

  for (const { key, passedVars } of calls) {
    totalCalls++

    // Skip dynamic keys (contain template literals, concatenation, or no namespace dot)
    if (key.includes('${') || key.includes('+') || key.endsWith('...') || !key.includes('.')) continue

    // 1. Check key exists in en.json
    if (!enKeys.has(key)) {
      console.log(`❌ KEY MISSING from en.json: ${relPath} — t('${key}')`)
      missingFromEn++
      continue
    }
    if (!hiKeys.has(key)) {
      console.log(`⚠️  KEY MISSING from hi.json: ${relPath} — t('${key}')`)
      missingFromHi++
    }

    // 2. Check interpolation vars match
    const enTemplate = getByKey(enData, key)
    if (typeof enTemplate !== 'string') continue

    const templateVars = extractTemplateVars(enTemplate)
    if (templateVars.length === 0) continue // no interpolation needed

    // Check each template var is provided
    for (const tv of templateVars) {
      if (!passedVars.includes(tv)) {
        console.log(`❌ VAR MISSING: ${relPath} — t('${key}') needs {{${tv}}} but got [${passedVars.join(', ')}]`)
        mismatchVars++
      }
    }

    // Check for extra passed vars that template doesn't use
    for (const pv of passedVars) {
      if (!templateVars.includes(pv)) {
        console.log(`⚠️  EXTRA VAR: ${relPath} — t('${key}') passes "${pv}" but template has [${templateVars.join(', ')}]`)
      }
    }
  }
}

console.log(`\n📊 Total t() calls scanned: ${totalCalls}`)
if (missingFromEn === 0) console.log('✅ All keys exist in en.json')
if (missingFromHi === 0) console.log('✅ All keys exist in hi.json')
if (mismatchVars === 0) console.log('✅ All interpolation variables match their templates')

let exitCode = 0
if (missingFromEn > 0) { console.log(`\n${missingFromEn} key(s) missing from en.json`); exitCode = 1 }
if (missingFromHi > 0) { console.log(`${missingFromHi} key(s) missing from hi.json`); exitCode = 1 }
if (mismatchVars > 0) { console.log(`${mismatchVars} interpolation mismatch(es) found`); exitCode = 1 }

process.exit(exitCode)
