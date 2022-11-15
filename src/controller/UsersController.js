const { hash, compare } = require('bcryptjs');

const AppError = require('../utils/AppError');

const knex = require('../database/knex');

class UsersController {
  async creat(request, response) {
    const { name, email, password } = request.body;

    const checkUserExists = await knex('users').where({ email }).first();

    if (checkUserExists) {
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

    const user = await knex('users').where({ id }).first();

    if (!user) {
      throw new AppError('Usuário não encontrado.');
    }

    if (email) {
      const userWithUpdatedEmail = await knex('users').where({ email }).first();

      if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
        throw new AppError('Este e-mail já está em uso.');
      }
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

    await knex('users')
      .where({ id })
      .update({ name: user.name, email: user.email, password: user.password, updated_at: knex.fn.now() });

    return response.json();
  }
}

module.exports = UsersController;