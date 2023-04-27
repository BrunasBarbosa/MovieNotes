const AppError = require('../../utils/AppError');

class NotesUpdateService {
  constructor(notesRepository) {
    this.notesRepository = notesRepository;
  }

  async execute({ title, description, rating, noteId }) {
    if (!title) {
      throw new AppError('Você não adicionou um título à nota.');
    }

    return await this.notesRepository.update({ noteId, title, description, rating });
  }
}

module.exports = NotesUpdateService;