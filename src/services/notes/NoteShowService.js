
const TagsRepository = require('../../repositories/TagsRepository');

class NoteShowService {
  constructor(noteRepository) {
    this.noteRepository = noteRepository;
  }

  async show(id) {
    const tagsRepository = new TagsRepository();

    const note = await this.noteRepository.findById(id);
    const tags = await tagsRepository.findByNoteId(id);

    return {
      ...note,
      tags
    };
  }
}

module.exports = NoteShowService;