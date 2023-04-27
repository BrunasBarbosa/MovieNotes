const NotesCreateService = require('../services/notes/NotesCreateService');
const NotesUpdateService = require('../services/notes/NotesUpdateService');
const NotesShowService = require('../services/notes/NotesShowService');
const NotesRepository = require('../repositories/NotesRepository');
const knex = require('../database/knex');

const TagsRepository = require('../repositories/TagsRepository');
const TagsInsertService = require('../services/tags/TagsInsertService');

const tagsRepository = new TagsRepository();
const tagsInsertService = new TagsInsertService(tagsRepository);

const notesRepository = new NotesRepository();
class NotesController {
  async create(request, response) {
    const { title, description, rating, tags } = request.body;
    const userId = request.user.id;

    const notesCreateService = new NotesCreateService(notesRepository);

    const noteId = await notesCreateService.execute({ title, description, rating, id: userId });

    if (tags.length !== 0) {
      await tagsInsertService.execute(tags, noteId, userId);
    }

    return response.json();
  }

  async show(request, response) {
    const { id } = request.params;

    const notesShowService = new NotesShowService(notesRepository);

    const details = await notesShowService.show(id);

    return response.json(details);
  }

  async update(request, response) {
    const { id } = request.params;
    const { title, description, rating, tags } = request.body;
    const userId = request.user.id;

    const notesUpdateService = new NotesUpdateService(notesRepository);

    await notesUpdateService.execute({ title, description, rating, noteId: id });

    await tagsRepository.deleteTags(id);

    if (tags.length !== 0) {
      await tagsInsertService.execute({ tags, noteId: id, userId });
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