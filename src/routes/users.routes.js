const { Router } = require('express');

const uploadConfig = require('../configs/upload');
const multer = require('multer');

const UsersController = require('../controller/UsersController');
const UserAvatarController = require('../controller/UserAvatarController');

const ensureAuthenticated = require('../middlewares/ensureAuthenticated');

const usersRoutes = Router();
const upload = multer(uploadConfig.MULTER);

const usersController = new UsersController();
const userAvatarController = new UserAvatarController()

usersRoutes.post('/', usersController.creat);
usersRoutes.put('/', ensureAuthenticated, usersController.update);
usersRoutes.patch('/avatar', ensureAuthenticated, upload.single('avatar'), userAvatarController.update);

module.exports = usersRoutes;