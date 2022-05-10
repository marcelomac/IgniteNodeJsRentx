import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '@config/upload';

import { CreateUserController } from '@modules/accounts/useCases/createUser/CreateUserController';
import { UpdateUserAvatarController } from '@modules/accounts/useCases/updateUserAvatar/UpdateUserAvatarController';
import { ensureAuthenticated } from '@shared/infra/http/middlewares/ensureAuthenticated';
const usersRoutes = Router();

/**
 * ANCHOR multer upload
 *
 * multer() aguarda como parâmetro um objeto com as options, que é retornado pela
 * function upload():
 *
 * LINK src\config\upload.ts
 */

const uploadAvatar = multer(uploadConfig);

const createUserController = new CreateUserController();
const updateUserAvatarController = new UpdateUserAvatarController();

usersRoutes.post('/', createUserController.handle);

usersRoutes.patch(
  '/avatar',
  ensureAuthenticated,
  uploadAvatar.single('avatar'),
  updateUserAvatarController.handle
);

export { usersRoutes };
