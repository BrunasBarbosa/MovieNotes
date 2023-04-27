const knex = require('../database/knex');
const TagsRepository = require('./TagsRepository');

class NotesRepository {
  async create({ title, description, rating, tags, id }) {
    const noteId = await knex('movie_notes').insert({
      title,
      description,
      rating,
      user_id: id,
    });

    if (tags.length !== 0) {
      const tagsRepository = new TagsRepository();

      tagsRepository.insertTags(tags, noteId, id);
    }

    return { note_id: noteId };
  }

  async findById(id) {
    const note = await knex('movie_notes').where({ id }).first();

    return note;
  }
}

module.exports = NotesRepository;