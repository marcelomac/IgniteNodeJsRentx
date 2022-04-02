import { AppError } from '@shared/errors/AppErrors';
import { CategoriesRepositoryInMemory } from '@modules/cars/repositories/in-memory/CategoriesRepositoryInMemory';
import CreateCategoryUseCase from './CreateCategoryUseCase';

let createCategoryUseCase: CreateCategoryUseCase;
let categoriesRepositoryInMemory: CategoriesRepositoryInMemory;

describe('Create Category', () => {
  beforeEach(() => {
    categoriesRepositoryInMemory = new CategoriesRepositoryInMemory();
    createCategoryUseCase = new CreateCategoryUseCase(
      categoriesRepositoryInMemory
    );
  });

  it('should be able to create a new category', async () => {
    await createCategoryUseCase.execute({
      name: 'Category Test',
      description: 'Category description Test',
    });

    const category = await categoriesRepositoryInMemory.findByName(
      'Category Test'
    );

    // console.log(category);

    // Caso a "category" seja criada com sucesso, deverá conter um 'id':
    expect(category).toHaveProperty('id');
  });

  it('should not be able to create a category with name exists', async () => {
    const category = {
      name: 'Category Test',
      description: 'Category description Test',
    };

    await createCategoryUseCase.execute({
      name: category.name,
      description: category.description,
    });

    await expect(
      createCategoryUseCase.execute({
        name: category.name,
        description: category.description,
      })
    ).rejects.toEqual(new AppError('Category already exists'));
  });
});

/** MEU TESTE:
   * 
  it('should not be able to create a category with name exists', async () => {
    let category = undefined;

    await createCategoryUseCase.execute({
      name: 'Category Test',
      description: 'Category description Test',
    });

    try {
      await createCategoryUseCase.execute({
        name: 'Category Test',
        description: 'Category description Test',
      });

      category = await categoriesRepositoryInMemory.findByName(
        'Category Test'
      );
    } catch (err) {
      // Caso a "category" seja criada com sucesso, deverá conter um 'id':
      expect(category).toBeUndefined();
    }
  });
  */
