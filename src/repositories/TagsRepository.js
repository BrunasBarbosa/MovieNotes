const knex = require('../database/knex');

class TagsRepository {
  async fetchTags(id) {
    const tags = await knex('movie_tags')
      .where({ user_id: id })
      .groupBy('name');

    return tags;
  }

  async insertTags(tagsInsert) {

    return await knex('movie_tags').insert(tagsInsert);
  }

  async findByNoteId(id) {
    const tags = await knex('movie_tags').where({ note_id: id }).orderBy('name');

    return tags;
  }
}

module.exports = TagsRepository;