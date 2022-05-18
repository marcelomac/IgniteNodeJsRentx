import { inject, injectable } from 'tsyringe';
import { IStorageProvider } from '@shared/container/providers/StorageProvider/IStorageProvider';
import { IUsersRepository } from '../../repositories/IUsersRepository';

interface IRequest {
  user_id: string;
  avatar_file: string;
}

@injectable()
class UpdateUserAvatarUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('StorageProvider')
    private storageProvider: IStorageProvider
  ) {}

  async execute({ user_id, avatar_file }: IRequest): Promise<void> {
    const user = await this.usersRepository.findById(user_id);

    // primeiro deleta o arquivo da pasta:
    if (user.avatar) {
      await this.storageProvider.delete(user.avatar, 'avatar');
    }

    // em seguida salva o arquivo na pasta:
    await this.storageProvider.save(avatar_file, 'avatar');

    user.avatar = avatar_file;

    await this.usersRepository.create(user);
  }
}

export { UpdateUserAvatarUseCase };
