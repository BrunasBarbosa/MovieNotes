const TagsRepository = require('../../repositories/TagsRepository');

class NotesShowService {
  constructor(notesRepository) {
    this.notesRepository = notesRepository;
  }

  async show(id) {
    const tagsRepository = new TagsRepository();

    const note = await this.notesRepository.findById(id);
    const tags = await tagsRepository.findByNoteId(id);

    return {
      ...note,
      tags
    };
  }
}

module.exports = NotesShowService;