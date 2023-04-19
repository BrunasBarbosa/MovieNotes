const UserCreateServices = require('./UserCreateService');
const UserReposytoryInMemory = require('../repositories/UserReposytoryInMemory')

it('user should be create', async () => {
  const userReposytoryInMemory = new UserReposytoryInMemory();
  const userCreateServices = new UserCreateServices(userReposytoryInMemory);
  
  const user = {
    name: 'Test',
    email: 'user@test.com',
    password: '123'
  };
  
  const userCreated = await userCreateServices.execute(user);

  expect(userCreated).toHaveProperty('id');
});