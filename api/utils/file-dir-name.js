import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

export default ((meta) => {
  const __filename = fileURLToPath(meta.url);

  const __dirname = dirname(__filename);

  return { __dirname, __filename };
});