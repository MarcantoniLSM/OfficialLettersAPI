const fs = require('fs').promises;
const path = require('path');

const DB_PATH = path.resolve(__dirname, '../../data/officialLetters.json');

async function readLetters() {
  try {
    const raw = await fs.readFile(DB_PATH, 'utf8');
    return JSON.parse(raw || '[]');
  } catch (err) {
    if (err.code === 'ENOENT') {
      await saveLetters([]);
      return [];
    }
    throw err;
  }
}

async function saveLetters(letters) {
  await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
  await fs.writeFile(DB_PATH, JSON.stringify(letters, null, 2), 'utf8');
}

module.exports = { readLetters, saveLetters };
