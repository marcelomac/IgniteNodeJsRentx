import fs from 'fs';
import { S3 } from 'aws-sdk';

import mime from 'mime';
import { IStorageProvider } from '../IStorageProvider';
import { resolve } from 'path';
import upload from '@config/upload';

class S3StorageProvider implements IStorageProvider {
  private client: S3;

  constructor() {
    this.client = new S3({
      region: process.env.AWS_BUCKET_REGION,
    });
  }
  async save(file: string, folder: string): Promise<string> {
    const originalName = resolve(upload.tmpFolder, file);

    console.log(originalName);

    // para realizar o upload para o S3 é necessário fazer a leitura do arquivo:
    const fileContent = await fs.promises.readFile(originalName);

    // usando a lib 'mime' para obter o content type do arquivo (file):
    const ContentType = mime.getType(originalName);

    // insere o objeto no 'client' e transforma em uma promise:
    await this.client
      .putObject({
        Bucket: `${process.env.AWS_BUCKET}/${folder}`,
        Key: file,
        ACL: 'public-read',
        Body: fileContent,
        ContentType,
      })
      .promise();

    // após inserir no S3, remove da pasta local:
    await fs.promises.unlink(originalName);

    return file;
  }

  async delete(file: string, folder: string): Promise<void> {
    // removendo do S3:

    console.log('tenta apagar');
    await this.client
      .deleteObject({
        Bucket: `${process.env.AWS_BUCKET}/${folder}`,
        Key: file,
      })
      .promise();
  }
}

export { S3StorageProvider };
