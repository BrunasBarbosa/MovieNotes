const TagsRepository = require('../../repositories/TagsRepository');

class NotesIndexService {
  constructor(notesRepository) {
    this.notesRepository = notesRepository;
  }

  async execute({ tag, userId, title }) {
    const tagsRepository = new TagsRepository();
    let notes;

    if (tag) {
      notes = await this.notesRepository.findByTag(tag, userId);
    } else {
      notes = await this.notesRepository.findByTitle(title, userId);
    }

    const userTags = await tagsRepository.fetchTags(userId);

    const notesWithTags = notes.map(note => {
      const noteTags = userTags.filter(tag => tag.note_id === note.id);

      return {
        ...note,
        tags: noteTags
      };
    });

    return notesWithTags;
  }
}

module.exports = NotesIndexService;