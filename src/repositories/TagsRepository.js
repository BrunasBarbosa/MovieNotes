const knex = require('../database/knex');

class TagsRepository {
  async fetchTags(id) {
    const tags = await knex('movie_tags')
      .where({ user_id: id })
      .groupBy('name');

    return tags;
  }

  async insertTags(tags, noteId, userId) {
    const tagsInsert = tags.map(name => {
      return {
        note_id: noteId,
        name,
        user_id: userId
      };
    });

    await knex('movie_tags').insert(tagsInsert);
  }
}

module.exports = TagsRepository;