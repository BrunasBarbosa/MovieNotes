class TagsIndexService {
  constructor(tagsRepository) {
    this.tagsRepository = tagsRepository
  }

  async execute( id ) {
    const tags = await this.tagsRepository.fetchTags(id);

    return tags;
  }
}

module.exports = TagsIndexService;