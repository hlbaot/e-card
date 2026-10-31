/* eslint-disable @typescript-eslint/no-require-imports -- Node CLI check script */
const fs = require("node:fs");
const path = require("node:path");

const MESSAGES_DIR = path.resolve(__dirname, "../src/messages");
const EN_PATH = path.join(MESSAGES_DIR, "en.json");
const VI_PATH = path.join(MESSAGES_DIR, "vi.json");

function collectKeys(obj, prefix = "") {
  const keys = [];
  if (!obj || typeof obj !== "object" || Array.isArray(obj)) {
    return keys;
  }
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object" && !Array.isArray(value)) {
      keys.push(...collectKeys(value, fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

function getByPath(obj, dotPath) {
  return dotPath.split(".").reduce((acc, part) => (acc && typeof acc === "object" ? acc[part] : undefined), obj);
}

function checkI18nParity(enMessages, viMessages) {
  const enKeys = collectKeys(enMessages);
  const viKeys = collectKeys(viMessages);
  const enSet = new Set(enKeys);
  const viSet = new Set(viKeys);

  const missingInVi = enKeys.filter((k) => !viSet.has(k));
  const extraInVi = viKeys.filter((k) => !enSet.has(k));
  const emptyInEn = enKeys.filter((k) => {
    const val = getByPath(enMessages, k);
    return typeof val !== "string" || val.trim().length === 0;
  });
  const emptyInVi = viKeys.filter((k) => {
    const val = getByPath(viMessages, k);
    return typeof val !== "string" || val.trim().length === 0;
  });

  return {
    ok:
      missingInVi.length === 0 &&
      extraInVi.length === 0 &&
      emptyInEn.length === 0 &&
      emptyInVi.length === 0,
    totalKeys: enKeys.length,
    missingInVi,
    extraInVi,
    emptyInEn,
    emptyInVi,
  };
}

if (require.main === module) {
  const en = JSON.parse(fs.readFileSync(EN_PATH, "utf8"));
  const vi = JSON.parse(fs.readFileSync(VI_PATH, "utf8"));
  const result = checkI18nParity(en, vi);

  if (!result.ok) {
    console.error("FAIL: i18n message files are out of sync.");
    if (result.missingInVi.length > 0) {
      console.error("Missing in vi.json:", result.missingInVi);
    }
    if (result.extraInVi.length > 0) {
      console.error("Extra in vi.json (not in en.json):", result.extraInVi);
    }
    if (result.emptyInEn.length > 0) {
      console.error("Empty/non-string in en.json:", result.emptyInEn);
    }
    if (result.emptyInVi.length > 0) {
      console.error("Empty/non-string in vi.json:", result.emptyInVi);
    }
    process.exit(1);
  }

  console.log(`PASS: en.json and vi.json match with ${result.totalKeys} translation keys.`);
}

module.exports = { collectKeys, checkI18nParity };

