const { hash, compare } = require('bcryptjs');

const AppError = require('../utils/AppError');

const knex = require('../database/knex');

const sqliteConnection = require('../database/sqlite');

class UsersController {
  async creat(request, response) {
    const { name, email, password } = request.body;

    const checkUserExists = await knex('users').where('email', email);

    if (checkUserExists.length > 0) {
      throw new AppError('Este e-mail já está em uso.');
    }

    const hashedPassword = await hash(password, 8);

    await knex('users').insert({
      name,
      email,
      password: hashedPassword
    });

    return response.status(201).json();
  }

  async update(request, response) {
    const { name, email, password, old_password, confirm_password } = request.body;
    const { id } = request.params;

    const database = await sqliteConnection();
    const user = await database.get('SELECT * FROM users WHERE id = (?)', [id]);

    if (!user) {
      throw new AppError('Usuário não encontrado.');
    }

    const userWithUpdatedEmail = await database.get('SELECT * FROM users WHERE email = (?)', [email]);

    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
      throw new AppError('Este e-mail já está em uso.');
    }

    user.name = name ?? user.name;
    user.email = email ?? user.email;

    if (password && !old_password) {
      throw new AppError('Você precisa informar a senha antiga.');
    }

    if (password && old_password) {

      const checkOldPassword = await compare(old_password, user.password);

      if (!checkOldPassword) {
        throw new AppError('A senha antiga não é compatível.');
      } else if (password === old_password) {
        throw new AppError('A nova senha não pode ser igual a senha antiga.');
      }

      if (password !== confirm_password) {
        throw new AppError('As senhas não são compatíveis.');
      }

      user.password = await hash(password, 8);
    }

    await database.run(`
      UPDATE users SET 
      name = ?,
      email = ?,
      password = ?,
      updated_at = DATETIME('now')
      WHERE id = ?`,
      [user.name, user.email, user.password, id]
    );

    return response.json();
  }
}

module.exports = UsersController;