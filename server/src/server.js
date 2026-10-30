import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createApp } from './app.js';
import { createStore } from './store.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataFile = path.join(__dirname, '..', 'data', 'submissions.json');

const PORT = process.env.PORT || 3000;
const app = createApp(createStore(dataFile));

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});