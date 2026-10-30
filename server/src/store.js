import fs from 'node:fs';
import path from 'node:path';

export function createStore(filePath = null) {
  let items = [];

  if (filePath && fs.existsSync(filePath)) {
    try {
      items = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch {
      items = [];
    }
  }

  const persist = () => {
    if (!filePath) return;
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(items, null, 2));
  };

  return {
    add(submission) {
      const record = {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        ...submission,
        submittedAt: new Date().toISOString(),
      };
      items.push(record);
      persist();
      return record;
    },
    all() {
      return [...items];
    },
    clear() {
      items = [];
      persist();
    },
  };
}