import { CarImage } from '../infra/typeorm/entities/CarImage';

/**
 * Interface para forçar o retorno de array no método 'findById'
 * - Não consta nas aulas do curso.  */
interface IImages {
  image_name: string;
}

interface ICarsImagesRepository {
  create(car_id: string, image_name: string): Promise<CarImage>;

  /** métodos 'delete' e 'findById' não constam nas aulas do curos */
  delete(car_id: string): Promise<void>;
  findById(car_id: string): Promise<IImages[]>;
}

export { ICarsImagesRepository };
