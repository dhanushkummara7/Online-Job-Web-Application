import express from 'express';
import { companyController, notificationController } from '../controllers/companyController.js';

export const companyRouter = express.Router();
companyRouter.get('/', companyController.getCompanies);
companyRouter.get('/:id', companyController.getCompanyById);

export const notificationRouter = express.Router();
notificationRouter.get('/:userId', notificationController.getNotifications);
notificationRouter.put('/:id/read', notificationController.markRead);
notificationRouter.post('/read-all', notificationController.markAllRead);
