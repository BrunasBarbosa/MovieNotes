// const sqliteConnection = require('../database/sqlite');

class UsersController {
  async creat(request, response) {
    const { name, email, password } = request.body;
    // const database = await sqliteConnection;
    response.send({ name, email, password });
  }
}

module.exports = UsersController;