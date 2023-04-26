const NotesCreateService = require('../services/notes/NoteCreateService');
const NotesRepository = require('../repositories/NotesRepository');
const AppError = require('../utils/AppError');
const knex = require('../database/knex');

const notesRepository = new NotesRepository();
class NotesController {
  async create(request, response) {

    const { title, description, rating, tags } = request.body;
    const userId = request.user.id;

    const notesCreateService = new NotesCreateService(notesRepository);

    await notesCreateService.execute({ title, description, rating, tags, id: userId });

    return response.json();
  }

  async show(request, response) {
    const { id } = request.params;

    const note = await knex('movie_notes').where({ id }).first();
    const tags = await knex('movie_tags').where({ note_id: id }).orderBy('name');

    return response.json({
      ...note,
      tags
    });
  }

  async update(request, response) {
    const { id } = request.params;
    const { title, description, rating, tags } = request.body;
    const user_id = request.user.id;

    if (!title) {
      throw new AppError('Você não adicionou um título à nota.');
    }

    await knex('movie_notes')
      .where({ id })
      .update({ title, description, rating, updated_at: knex.fn.now() });

    await knex('movie_tags')
      .where({ note_id: id })
      .delete();

    if (tags.length !== 0) {
      const tagsInsert = tags.map(name => {
        return {
          note_id: id,
          name,
          user_id
        };
      });

      await knex('movie_tags').insert(tagsInsert);
    }

    return response.json();
  }

  async delete(request, response) {
    const { id } = request.params;

    await knex('movie_notes').where({ id }).delete();

    return response.json();
  }

  async index(request, response) {
    const { title, tag } = request.query;

    const user_id = request.user.id;

    let notes;

    if (tag) {
      notes = await knex('movie_tags')
        .innerJoin('movie_notes', 'movie_notes.id', 'movie_tags.note_id')
        .where('movie_notes.user_id', user_id)
        .whereLike('title', `%${title}%`)
        .whereLike('name', tag)
        .orderBy('movie_notes.title');

    } else {
      notes = await knex('movie_notes')
        .where({ user_id })
        .whereLike('title', `%${title}%`)
        .orderBy('title');
    }

    const userTags = await knex('movie_tags').where({ user_id });

    const notesWithTags = notes.map(note => {
      const noteTags = userTags.filter(tag => tag.note_id === note.id);

      return {
        ...note,
        tags: noteTags
      };
    });

    return response.json(notesWithTags);
  }
}

module.exports = NotesController;