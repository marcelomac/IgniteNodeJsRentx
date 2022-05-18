import { inject, injectable } from 'tsyringe';
import { ICarsImagesRepository } from '@modules/cars/repositories/ICarsImagesRepository';
import { ICarsRepository } from '@modules/cars/repositories/ICarsRepository';
import { AppError } from '@shared/errors/AppErrors';
import { deleteFile } from '@utils/file';
import { IStorageProvider } from '@shared/container/providers/StorageProvider/IStorageProvider';

interface IRequest {
  car_id: string;
  images_name: string[];
}

@injectable()
class UploadCarImagesUseCase {
  constructor(
    @inject('CarsRepository')
    private carsRepository: ICarsRepository,

    @inject('CarsImagesRepository')
    private carsImagesRepository: ICarsImagesRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider
  ) {}

  async execute({ car_id, images_name }: IRequest): Promise<void> {
    const car = await this.carsRepository.findById(car_id);

    if (!car) {
      throw new AppError('Car does not exists');
    }

    /**
     * retorna um array com os dados da coluna 'images_name' da tabela 'cars_images' pertencentes
     * ao 'car_id' passado. */
      const images_db = await this.carsImagesRepository.findById(car_id);

    // apaga a imagem com mesmo nome no storage (local ou s3):
    images_db.map(async (image) => {
      await this.storageProvider.delete(image.image_name, 'cars');
    });

    // apaga os todos os registros da tabela referentes ao 'car_id':
    this.carsImagesRepository.delete(car.id);

    images_name.map(async (image) => {
      // cria novos registros na tabela 'cars_images':
      await this.carsImagesRepository.create(car_id, image);
      // salva a imagem no storage (local ou s3:)
      await this.storageProvider.save(image, 'cars');
    });
  }
}

export { UploadCarImagesUseCase };
