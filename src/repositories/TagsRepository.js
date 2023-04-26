const knex = require('../database/knex');

class TagsRepository {
  async fetchTags( id ) {
    const tags = await knex('movie_tags')
      .where({ user_id: id })
      .groupBy('name');

    return tags;
  }
}

module.exports = TagsRepository;