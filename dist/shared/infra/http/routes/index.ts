import { Router } from 'express';

import { authenticateRoutes } from './authenticate.routes';
import { categoriesRoutes } from './categories.routes';
import { specificationsRoutes } from './specifications.routes';
import { usersRoutes } from './users.routes';
import { carsRoutes } from './cars.routes';
import { rentalRoutes } from './rental.routes';
import { passwordRoutes } from './password.routes';

const router = Router();

router.use('/categories', categoriesRoutes);
router.use('/cars', carsRoutes);
router.use('/specifications', specificationsRoutes);
router.use('/users', usersRoutes);
router.use('/rentals', rentalRoutes);
router.use('/password', passwordRoutes);

// para que a rota seja apenas '/':
router.use(authenticateRoutes);

export { router };
