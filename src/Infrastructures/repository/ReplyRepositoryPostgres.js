const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const ReplyRepository = require('../../Domains/replies/ReplyRepository');
const AddedReply = require('../../Domains/replies/entities/AddedReply');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(addReply) {
    const { commentId, content, owner } = addReply;
    const id = `reply-${this._idGenerator()}`;
    const date = new Date().toISOString();

    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner',
      values: [id, content, date, commentId, owner],
    };

    const result = await this._pool.query(query);

    return new AddedReply({ ...result.rows[0] });
  }

  async deleteReply(id) {
    const query = {
      text: 'UPDATE replies SET deleted = true WHERE id = $1',
      values: [id],
    };

    await this._pool.query(query);
  }

  async getReplyById(id) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('reply tidak ditemukan');
    }

    return result.rows[0];
  }

  async getRepliesByCommnetId(commnetId) {
    const query = {
      text: 'SELECT replies.*, users.username FROM replies LEFT JOIN users ON replies.owner = users.id WHERE replies.comment_id = $1 ORDER BY date ASC',
      values: [commnetId],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }

  async verifyAvailableReply(id) {
    const query = {
      text: 'SELECT id FROM replies where id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Balasan tidak tersedia');
    }
  }

  async verifyReplyOwner(id, owner) {
    const reply = await this.getReplyById(id);
    if (owner !== reply.owner) {
      throw new AuthorizationError('anda tidak berhak mengakses resourse ini');
    }
  }
}

module.exports = ReplyRepositoryPostgres;
