const CommentRepository = require('../../Domains/comments/CommentRepository');
const InvariantError = require('../../Commons/exceptions/InvariantError');
const AddedComment = require('../../Domains/comments/entities/AddedComment');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(newComment) {
    const { content, owner, threadId } = newComment;
    const id = `comment-${this._idGenerator()}`;
    const date = new Date().toISOString();

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner',
      values: [id, owner, content, date, threadId],
    };

    const result = await this._pool.query(query);

    return new AddedComment({ ...result.rows[0] });
  }

  async getComments(id) {
    const query = {
      text: 'SELECT comments.*, users.username FROM comments LEFT JOIN users ON comments.owner = users.id WHERE comments.threads_id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }

  async deleteComment(id) {
    const query = {
      text: 'UPDATE comments SET deleted = true WHERE id = $1',
      values: [id],
    };

    await this._pool.query(query);
  }

  async getCommnetById(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('comment tidak ditemukan');
    }

    return result.rows[0];
  }

  async verifyAvailableComment(id) {
    const query = {
      text: 'SELECT id FROM comments where id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Komentar tidak tersedia');
    }
  }

  async verifyCommentOwner(owner, commentId) {
    const query = {
      text: 'SELECT owner FROM comments WHERE id=$1',
      values: [commentId],
    };

    const result = await this._pool.query(query);

    if (result.rowCount === 0) {
      throw new NotFoundError('comment tidak ditemukan');
    }
    if (result.rows[0].owner !== owner) {
      throw new AuthorizationError(
        'tidak dapat menghapus comment. tidak berhak mengakses resourse ini'
      );
    }
  }
}

module.exports = CommentRepositoryPostgres;
