const { Router } = require('express');

const uploadConfig = require('../configs/upload');
const multer = require('multer');

const UsersController = require('../controller/UsersController');

const ensureAuthenticated = require('../middlewares/ensureAuthenticated');

const usersRoutes = Router();
const upload = multer(uploadConfig.MULTER);

const usersController = new UsersController();

usersRoutes.post('/', usersController.creat);
usersRoutes.put('/', ensureAuthenticated, usersController.update);
usersRoutes.patch('/avatar', ensureAuthenticated, upload.single('avatar'), (req, res) => {
  console.log(req.file.filename);
  res.json();
});

module.exports = usersRoutes;