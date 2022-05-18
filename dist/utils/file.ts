// ANCHOR 'fs' : FileSystem é uma biblioteca do nodejs
import fs from 'fs';

export const deleteFile = async (filename: string) => {
  // ANCHOR 'stat' verifica se um arquivo existe

  try {
    await fs.promises.stat(filename);
  } catch {
    return;
  }

  // ANCHOR 'unlink' exclui o arquivo
  await fs.promises.unlink(filename);
};
