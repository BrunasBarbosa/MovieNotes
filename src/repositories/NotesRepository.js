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

  async findByTag(tag, userId) {
    const notes = await knex('movie_tags')
      .innerJoin('movie_notes', 'movie_notes.id', 'movie_tags.note_id')
      .where('movie_notes.user_id', userId)
      .whereLike('name', tag)
      .orderBy('movie_notes.title');
    return notes;
  }

  async findByTitle(title, userId) {
    const notes = await knex('movie_notes')
      .where({ user_id: userId })
      .whereLike('title', `%${title}%`)
      .orderBy('title');

    return notes;
  }
}

module.exports = NotesRepository;