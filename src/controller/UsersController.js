const UserCreateServices = require('../services/UserCreateService');

const UserRepository = require('../repositories/UserRepository');

const UserUpdateService = require('../services/UserUpdateService');

const userRepository = new UserRepository();

class UsersController {

  async creat(request, response) {
    const { name, email, password } = request.body;

    const userCreateServices = new UserCreateServices(userRepository);

    await userCreateServices.execute({ name, email, password });

    return response.status(201).json();
  }

  async update(request, response) {
    const { name, email, password, old_password, confirm_password } = request.body;
    const user_id = request.user.id;

    const userUpdateServices = new UserUpdateService(userRepository);

    await userUpdateServices.execute({ name, email, password, old_password, confirm_password, id: user_id });

    return response.json();
  }
}

module.exports = UsersController;