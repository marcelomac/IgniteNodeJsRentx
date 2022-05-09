import upload from '@config/upload';
import fs from 'fs';
import { resolve } from 'path';
import { IStorageProvider } from '../IStorageProvider';

class LocalStorageProvider implements IStorageProvider {
  async save(file: string, folder: string): Promise<string> {

    // fs.promises.rename(oldPath, newPath)
    // remove da primeira pasta (oldPath) e move para a segunda (newPath):
    await fs.promises.rename(
      resolve(upload.tmpFolder, file),
      resolve(`${upload.tmpFolder}/${folder}`, file)
    );

    return file;
  }
  async delete(file: string, folder: string): Promise<void> {
    const filename = resolve(`${upload.tmpFolder}/${folder}`, file)

    // ANCHOR 'stat' verifica se um arquivo existe:
    try {
      await fs.promises.stat(filename);
    } catch {
      return;
    }
  
    // ANCHOR 'unlink' exclui o arquivo:
    await fs.promises.unlink(filename);
  }
}

export { LocalStorageProvider };
