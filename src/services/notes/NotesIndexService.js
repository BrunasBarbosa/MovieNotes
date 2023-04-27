const TagsRepository = require('../../repositories/TagsRepository');
const TagsIndexService = require('../tags/TagsIndexService');

class NotesIndexService {
  constructor(notesRepository) {
    this.notesRepository = notesRepository;
  }

  async execute({ tag, userId, title }) {
    const tagsRepository = new TagsRepository();
    const tagsIndexService = new TagsIndexService(tagsRepository);
    
    let notes;

    if (tag) {
      notes = await this.notesRepository.findByTag(tag, userId);
    } else {
      notes = await this.notesRepository.findByTitle(title, userId);
    }

    const userTags = await tagsIndexService.execute(userId);

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