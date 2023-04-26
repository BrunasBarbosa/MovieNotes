const { hash, compare } = require('bcryptjs');

const AppError = require('../../utils/AppError');

class UserUpdateService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute({ name, email, password, old_password, confirm_password, id }) {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new AppError('Usuário não encontrado.');
    }

    if (email) {
      const userWithUpdatedEmail = await this.userRepository.findByEmail(email);

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

    const userUpdated = await this.userRepository.update({ name, email, password: user.password, id: user.id });

    return userUpdated;
  }
}

module.exports = UserUpdateService;