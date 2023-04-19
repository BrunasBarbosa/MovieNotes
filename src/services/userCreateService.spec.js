const UserCreateServices = require('./UserCreateService');
const UserReposytoryInMemory = require('../repositories/UserReposytoryInMemory');
const AppError = require('../utils/AppError');

describe('UserCreateService', () => {
  it('user should be create', async () => {
    const userReposytory = new UserReposytoryInMemory();
    const userCreateServices = new UserCreateServices(userReposytory);

    const user = {
      name: 'Test',
      email: 'user@test.com',
      password: '123'
    };

    const userCreated = await userCreateServices.execute(user);

    expect(userCreated).toHaveProperty('id');
  });

  it('user should not be create if email already exists', async () => {
    const user1 = {
      name: 'User1',
      email: 'user@test.com',
      password: '123'
    };

    const user2 = {
      name: 'User2',
      email: 'user@test.com',
      password: '456'
    };

    const userReposytory = new UserReposytoryInMemory();
    const userCreateServices = new UserCreateServices(userReposytory);

    await userCreateServices.execute(user1);

    await expect(userCreateServices.execute(user2)).rejects.toEqual(new AppError('Este e-mail já está em uso.'));
  });
});