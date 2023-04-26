const AppError = require('../../utils/AppError');

class NotesCreateService {
  constructor(notesRepository) {
    this.notesRepository = notesRepository;
  }

  async execute({ title, description, rating, tags, id }) {
    try {
      const note = await this.notesRepository.create({ title, description, rating, tags, id });

      return note;
    } catch (error) {
      throw new AppError("Não foi possível cadastrar a nota.");
    }
  }
}

module.exports = NotesCreateService;

