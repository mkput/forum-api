const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const GetThreadUseCase = require('../GetThreadUseCase');

describe('GetThreadUseCase', () => {
  it('should throw error when use case payload not contain thread id', async () => {
    // Arrange
    const useCasePayload = {};
    const getThreadUseCase = new GetThreadUseCase({});

    // Action and Assert
    await expect(getThreadUseCase.execute(useCasePayload)).rejects.toThrowError(
      'GET_THREAD_USE_CASE.NOT_CONTAIN_THREAD_ID'
    );
  });

  it('should throw error if thread id not string', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 12,
    };
    const getThreadUseCase = new GetThreadUseCase({});

    // Action and Assert
    await expect(getThreadUseCase.execute(useCasePayload)).rejects.toThrowError(
      'GET_THREAD_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should orchestrating to get thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
    };
    const expectedThread = {
      id: 'thread-123',
      title: 'sebuah title',
      body: 'sebuah body',
      date: '12 Agustus 2023',
      username: 'dicoding',
      comments: [],
    };

    // creating depedency use case
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    // mocking
    mockThreadRepository.getThreadById = jest.fn().mockImplementation(() =>
      Promise.resolve({
        id: 'thread-123',
        title: 'sebuah title',
        body: 'sebuah body',
        date: '12 Agustus 2023',
        username: 'dicoding',
        comments: [],
      })
    );
    mockCommentRepository.getComments = jest
      .fn()
      .mockImplementation(() => Promise.resolve([]));
    mockReplyRepository.getRepliesByCommnetId = jest
      .fn()
      .mockImplementation(() => Promise.resolve([]));

    // create use case instance
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const getThread = await getThreadUseCase.execute(useCasePayload);

    // Assert
    expect(getThread).toStrictEqual(expectedThread);
    expect(mockCommentRepository.getComments).toBeCalledWith(
      useCasePayload.threadId
    );
    expect(mockThreadRepository.getThreadById).toBeCalledWith(
      useCasePayload.threadId
    );
  });
  it('should orchestrating to get thread action when there is comment correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
    };
    const comment = {
      id: 'comment-123',
      username: 'dicoding',
      date: '12 agustus 2023',
      content: 'sebuah comment',
      replies: [],
    };
    const expectedThread = {
      id: 'thread-123',
      title: 'sebuah title',
      body: 'sebuah body',
      date: '12 Agustus 2023',
      username: 'dicoding',
      comments: [comment],
    };

    // creating depedency use case
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    // mocking
    mockThreadRepository.getThreadById = jest.fn().mockImplementation(() =>
      Promise.resolve({
        id: 'thread-123',
        title: 'sebuah title',
        body: 'sebuah body',
        date: '12 Agustus 2023',
        username: 'dicoding',
        comments: [comment],
      })
    );
    mockCommentRepository.getComments = jest
      .fn()
      .mockImplementation(() => Promise.resolve([{ ...comment }]));
    mockReplyRepository.getRepliesByCommnetId = jest
      .fn()
      .mockImplementation(() => Promise.resolve([]));

    // create use case instance
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const getThread = await getThreadUseCase.execute(useCasePayload);

    // Assert
    expect(getThread).toStrictEqual(expectedThread);
    expect(mockCommentRepository.getComments).toBeCalledWith(
      useCasePayload.threadId
    );
    expect(mockThreadRepository.getThreadById).toBeCalledWith(
      useCasePayload.threadId
    );
    expect(mockReplyRepository.getRepliesByCommnetId).toBeCalledWith(
      comment.id
    );
  });
  it('should orchestrating to get thread action when there is a deleted comment correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
    };
    const comment = {
      id: 'comment-123',
      username: 'dicoding',
      date: '12 agustus 2023',
      content: 'sebuah comment',
      replies: [],
    };
    const expectedThread = {
      id: 'thread-123',
      title: 'sebuah title',
      body: 'sebuah body',
      date: '12 Agustus 2023',
      username: 'dicoding',
      comments: [{ ...comment, content: '**komentar telah dihapus**' }],
    };

    // creating depedency use case
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    // mocking
    mockThreadRepository.getThreadById = jest.fn().mockImplementation(() =>
      Promise.resolve({
        id: 'thread-123',
        title: 'sebuah title',
        body: 'sebuah body',
        date: '12 Agustus 2023',
        username: 'dicoding',
        comments: [{ ...comment, content: '**komentar telah dihapus**' }],
      })
    );
    mockCommentRepository.getComments = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve([{ ...comment, deleted: true }])
      );
    mockReplyRepository.getRepliesByCommnetId = jest
      .fn()
      .mockImplementation(() => Promise.resolve([]));

    // create use case instance
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const getThread = await getThreadUseCase.execute(useCasePayload);

    // Assert
    expect(getThread).toStrictEqual(expectedThread);
    expect(mockCommentRepository.getComments).toBeCalledWith(
      useCasePayload.threadId
    );
    expect(mockThreadRepository.getThreadById).toBeCalledWith(
      useCasePayload.threadId
    );
    expect(mockReplyRepository.getRepliesByCommnetId).toBeCalledWith(
      comment.id
    );
  });

  it('should orchestrating to get thread action when there is commnet and reply correctly', async () => {
    const useCasePayload = {
      threadId: 'thread-123',
    };
    const reply = {
      id: 'reply-123',
      content: 'isi reply',
      username: 'dicoding',
      date: '12 agustus 2023',
    };

    const comment = {
      id: 'comment-123',
      content: 'isi comment',
      username: 'dicoding',
      date: '12 agustus 2023',
      replies: [reply],
    };

    const expectedThread = {
      id: useCasePayload.threadId,
      title: 'sebuah title',
      body: 'sebuah body',
      date: '12 agustus 2023',
      comments: [comment],
    };

    // creating depedency use case
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    // mocking
    mockThreadRepository.getThreadById = jest.fn().mockImplementation(() =>
      Promise.resolve({
        id: useCasePayload.threadId,
        title: 'sebuah title',
        body: 'sebuah body',
        date: '12 agustus 2023',
        comments: [comment],
      })
    );
    mockCommentRepository.getComments = jest
      .fn()
      .mockImplementation(() => Promise.resolve([{ ...comment }]));
    mockReplyRepository.getRepliesByCommnetId = jest
      .fn()
      .mockImplementation(() => Promise.resolve([{ ...reply }]));

    // create use case instance
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const getThread = await getThreadUseCase.execute(useCasePayload);

    // Assert
    expect(getThread).toStrictEqual(expectedThread);
    expect(mockCommentRepository.getComments).toBeCalledWith(
      useCasePayload.threadId
    );
    expect(mockThreadRepository.getThreadById).toBeCalledWith(
      useCasePayload.threadId
    );
    expect(mockReplyRepository.getRepliesByCommnetId).toBeCalledWith(
      comment.id
    );
  });
  it('should orchestrating to get thread action when there is commnet and a deleted reply correctly', async () => {
    const useCasePayload = {
      threadId: 'thread-123',
    };
    const reply = {
      id: 'reply-123',
      content: 'isi reply',
      username: 'dicoding',
      date: '12 agustus 2023',
    };

    const comment = {
      id: 'comment-123',
      content: 'isi comment',
      username: 'dicoding',
      date: '12 agustus 2023',
      replies: [reply],
    };

    const expectedThread = {
      id: useCasePayload.threadId,
      title: 'sebuah title',
      body: 'sebuah body',
      date: '12 agustus 2023',
      comments: [
        {
          ...comment,
          replies: [{ ...reply, content: '**balasan telah dihapus**' }],
        },
      ],
    };

    // creating depedency use case
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    // mocking
    mockThreadRepository.getThreadById = jest.fn().mockImplementation(() =>
      Promise.resolve({
        id: useCasePayload.threadId,
        title: 'sebuah title',
        body: 'sebuah body',
        date: '12 agustus 2023',
        comments: [comment],
      })
    );
    mockCommentRepository.getComments = jest
      .fn()
      .mockImplementation(() => Promise.resolve([{ ...comment }]));
    mockReplyRepository.getRepliesByCommnetId = jest
      .fn()
      .mockImplementation(() => Promise.resolve([{ ...reply, deleted: true }]));

    // create use case instance
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const getThread = await getThreadUseCase.execute(useCasePayload);

    // Assert
    expect(getThread).toStrictEqual(expectedThread);
    expect(mockCommentRepository.getComments).toBeCalledWith(
      useCasePayload.threadId
    );
    expect(mockThreadRepository.getThreadById).toBeCalledWith(
      useCasePayload.threadId
    );
    expect(mockReplyRepository.getRepliesByCommnetId).toBeCalledWith(
      comment.id
    );
  });
});
