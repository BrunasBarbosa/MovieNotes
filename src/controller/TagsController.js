const TagsIndexService = require('../services/tags/TagsIndexService');
const TagsRepository = require('../repositories/TagsRepository');
class TagsController {
  async index(request, response) {
    const userId = request.user.id;

    const tagsRepository = new TagsRepository();
    const tagsIndexService = new TagsIndexService(tagsRepository);

    const tags = await tagsIndexService.execute(userId);

    return response.json(tags);
  }
}

module.exports = TagsController;