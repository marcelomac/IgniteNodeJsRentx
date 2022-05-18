import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateCategoryUseCase from './CreateCategoryUseCase';



/** Por que UseCase e Controller?
 * Isso acontece para contemplar um dos princípios do SOLID, onde não atribuímos duas
 * responsabilidades diferente em "arquivo" apenas. Ou seja:
 * 
 * o useCase se preocupa apenas em contemplar as regras de negócio para posteriormente fazer 
 * as inserções no banco chamando o repositório. 
 * 
 * Já o controller se preocupa apenas em receber as requisições juntamente com o express.
 * 
 * E quando é que queremos criar um UserController isolado?
 * R: Durante os testes. É uma prática comum durante os testes simular ou falsificar 
 * dependências do módulo atual para isolar e testar diferentes comportamentos.
 *  
 * */

class CreateCategoryController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { name, description } = request.body;

    /**
     * "container.resolve" serve para criar a instância da classe CreateCategoryUseCase,
     * novamente sem o uso do new. Isso só é possivel devido a classe CreateCategoryUseCase
     * ter o decorator @injectable()
     */

    const createCategoryUseCase = container.resolve(CreateCategoryUseCase)

    await createCategoryUseCase.execute({ name, description });

    return response.status(201).send();
  }
}

export { CreateCategoryController };
