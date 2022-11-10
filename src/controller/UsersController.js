const { hash, compare } = require('bcryptjs');

const AppError = require('../utils/AppError');

// const sqliteConnection = require('../database/sqlite');

class UsersController {
  async creat(request, response) {
    const { name, email, password } = request.body;
    // const database = await sqliteConnection();
    
    response.send({ name, email, password });

    const hashedPassword = await hash(password, 8);
  }
}

module.exports = UsersController;