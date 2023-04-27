class TagsInsertService {
  constructor(tagsRepository) {
    this.tagsRepository = tagsRepository;
  }

  async execute({ tags, noteId, userId }) {
    
    const tagsInsert = tags.map(name => {
      return {
        note_id: noteId,
        name,
        user_id: userId
      };
    });

    return await this.tagsRepository.insertTags(tagsInsert);
  }
}

module.exports = TagsInsertService;