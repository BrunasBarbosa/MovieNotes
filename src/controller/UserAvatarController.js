const UserRepository = require('../repositories/UserRepository');
const UserAvatarService = require('../services/user/UserAvatarService');
class UserAvatarController {
  async update(request, response) {

    const userId = request.user.id;
    const avatarFileName = request.file.filename;

    const userRepository = new UserRepository();
    const userAvatarService = new UserAvatarService(userRepository);

    const user = await userAvatarService.execute(userId, avatarFileName);

    return response.json(user);
  }
}

module.exports = UserAvatarController;