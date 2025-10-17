const fs = require('fs').promises;
const path = require('path');

const DB_PATH = path.resolve(__dirname, '../../data/users.json');

async function readUsers() {
  try {
    const raw = await fs.readFile(DB_PATH, 'utf8');
    return JSON.parse(raw || '[]');
  } catch (err) {
    if (err.code === 'ENOENT') {
      await saveUsers([]);
      return [];
    }
    throw err;
  }
}

async function saveUsers(users) {
  await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
  await fs.writeFile(DB_PATH, JSON.stringify(users, null, 2), 'utf8');
}

module.exports = { readUsers, saveUsers };
