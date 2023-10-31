const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommnetsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const AddReply = require('../../../Domains/replies/entities/AddReply');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const pool = require('../../database/postgres/pool');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const ClientError = require('../../../Commons/exceptions/ClientError');

describe('ReplyRepositoryPostgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({});
    await ThreadsTableTestHelper.addThread({});
    await CommnetsTableTestHelper.addComment({});
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommnetsTableTestHelper.clearTable();
    await RepliesTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addReply function', () => {
    it('should persist add reply correctly and return added reply', async () => {
      // Arrange
      const addReply = new AddReply({
        threadId: 'thread-123',
        commentId: 'comment-123',
        content: 'isi reply',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      const addedReply = await replyRepositoryPostgres.addReply(addReply);

      // Assert
      const reply = await RepliesTableTestHelper.findReplyById('reply-123');
      expect(reply).toHaveLength(1);
      expect(addedReply).toStrictEqual(
        new AddedReply({
          id: 'reply-123',
          content: addReply.content,
          owner: addReply.owner,
        })
      );
    });
  });

  describe('deleteReply function', () => {
    it('should persist delete reply correctly', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action
      await replyRepositoryPostgres.deleteReply('reply-123');
      const comment = await RepliesTableTestHelper.findReplyById('reply-123');

      // Assert
      expect(comment[0].deleted).toEqual(true);
    });
  });

  describe('verifyReplyOwner function', () => {
    it('should throw NotFoundError when reply not found', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action and Assert
      await expect(() =>
        replyRepositoryPostgres.verifyReplyOwner('reply-122', 'user-123')
      ).rejects.toThrowError(NotFoundError);
    });

    it('should throw AuthorizationError when owner is not valid', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action and Assert
      await expect(() =>
        replyRepositoryPostgres.verifyReplyOwner('reply-123', 'user-122')
      ).rejects.toThrowError(AuthorizationError);
    });

    it('should not throw ClientError instance when reply found and owner is valid', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action and Assert
      expect(() =>
        replyRepositoryPostgres.verifyReplyOwner('reply-123', 'user-123')
      ).not.toThrow(ClientError);
    });
  });

  describe('getReplyById function', () => {
    it('should throw NotFoundError when reply not found', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action and Assert
      await expect(() =>
        replyRepositoryPostgres.getReplyById('reply-122')
      ).rejects.toThrowError(NotFoundError);
    });

    it('should return reply object correctly', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action
      const reply = await replyRepositoryPostgres.getReplyById('reply-123');

      // Assert
      expect(reply.id).toEqual('reply-123');
      expect(reply.comment_id).toEqual('comment-123');
      expect(reply.owner).toEqual('user-123');
      expect(reply.content).toEqual('isi reply');
    });
  });

  describe('getRepliesByCommentId function', () => {
    it('should return empty array when replies not found', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      await CommnetsTableTestHelper.addComment({ id: 'comment-144' });

      // Action
      const replies = await replyRepositoryPostgres.getRepliesByCommnetId(
        'comment-144'
      );

      // Assert
      expect(replies).toBeDefined();
      expect(replies).toHaveLength(0);
    });

    it('should return replies object correctly', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action
      const replies = await replyRepositoryPostgres.getRepliesByCommnetId(
        'comment-123'
      );

      // Assert
      expect(replies).toHaveLength(1);
      expect(replies[0].id).toEqual('reply-123');
      expect(replies[0].content).toEqual('isi reply');
      expect(replies[0].username).toEqual('dicoding');
      expect(replies[0].date).toBeDefined();
    });
  });

  describe('verifyAvailableReply function', () => {
    it('should throw error when reply not found', async () => {
      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      return expect(
        replyRepositoryPostgres.verifyAvailableReply('reply-fake')
      ).rejects.toThrowError(NotFoundError);
    });

    it('should not throw error when reply is found', async () => {
      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      return expect(
        replyRepositoryPostgres.verifyAvailableReply('reply-123')
      ).resolves.not.toThrowError(NotFoundError);
    });
  });
});
