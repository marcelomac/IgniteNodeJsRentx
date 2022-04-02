import { Category } from "../infra/typeorm/entities/Category";

interface ICreateCategoryDTO {
  name: string;
  description: string;
}

/**
 * Interface que está sendo implementada por repositórios como:
 * - CategoriesRepository (usando array)
 * - PostgreCategoriesRepository (usando db)
 *
 * Essa interface é chamada na rota 'categories.routes.ts'
 */
interface ICategoriesRepository {
  create({ name, description }: ICreateCategoryDTO): Promise<void>;
  list(): Promise<Category[]>;
  findByName(name: string): Promise<Category>;
}

export { ICategoriesRepository, ICreateCategoryDTO };
