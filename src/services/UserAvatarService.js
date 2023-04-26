const DiskStorage = require('../providers/DiskStorage');
const AppError = require('../utils/AppError');

class UserAvatarService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(id, filename) {

    const user = await this.userRepository.findById(id);

    const diskStorage = new DiskStorage();

    if (!user) {
      throw new AppError('Somente usuários autenticados podem mudar o avatar.', 401);
    }

    if (user.avatar) {
      await diskStorage.deleteFile(user.avatar);
    }

    const fileName = await diskStorage.saveFile(filename);

    user.avatar = fileName;

    const userAvatarUpdated = await this.userRepository.avatarUpdate({ user, id: user.id });
    
    return userAvatarUpdated;
  }
}

module.exports = UserAvatarService;