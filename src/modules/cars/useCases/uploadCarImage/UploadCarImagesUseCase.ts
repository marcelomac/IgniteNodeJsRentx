import { ICarsImagesRepository } from '@modules/cars/repositories/ICarsImagesRepository';
import { ICarsRepository } from '@modules/cars/repositories/ICarsRepository';
import { AppError } from '@shared/errors/AppErrors';
import { deleteFile } from '@utils/file';
import { inject, injectable } from 'tsyringe';

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
    private carsImagesRepository: ICarsImagesRepository
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

    /**
     * apaga os arquivos do array na pasta */
    if (images_db.length) {
      images_db.map(async (image) => {
        await deleteFile(`./tmp/cars/${image.image_name}`);
      });
    }

    /**
     * apaga os todos os registros da tabela referentes ao 'car_id  */
    this.carsImagesRepository.delete(car.id);

    /**
     * cria novos resgistros na tabela 'cars_images' */
    images_name.map(async (image) => {
      await this.carsImagesRepository.create(car_id, image);
    });
  }
}

export { UploadCarImagesUseCase };
