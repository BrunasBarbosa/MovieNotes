const knex = require('../database/knex');
class NotesRepository {
  async create({ title, description, rating, id }) {
    const noteId = await knex('movie_notes').insert({
      title,
      description,
      rating,
      user_id: id,
    });

    return noteId;
  }

  async findById(id) {
    const note = await knex('movie_notes').where({ id }).first();

    return note;
  }

  async update({ noteId, title, description, rating }) {

    return await knex('movie_notes')
      .where({ id: noteId })
      .update({ title, description, rating, updated_at: knex.fn.now() });
  }
}

module.exports = NotesRepository;