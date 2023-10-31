class GetThreadUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    this._verifyPayload(useCasePayload);
    const { threadId } = useCasePayload;

    const thread = await this._threadRepository.getThreadById(threadId);
    const comments = await this._commentRepository.getComments(threadId);

    return {
      ...thread,
      comments: await Promise.all(
        comments.map(async (comment) => {
          const replies = await this._replyRepository.getRepliesByCommnetId(
            comment.id
          );

          return {
            ...this._normalizeComment(comment),
            replies: replies.map((reply) => this._normalizeReply(reply)),
          };
        })
      ),
    };
  }

  _verifyPayload(payload) {
    const { threadId } = payload;

    if (!threadId) {
      throw new Error('GET_THREAD_USE_CASE.NOT_CONTAIN_THREAD_ID');
    }

    if (typeof threadId !== 'string') {
      throw new Error(
        'GET_THREAD_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION'
      );
    }
  }

  _normalizeComment(comment) {
    const defaultComment = {
      id: comment.id,
      content: comment.content,
      username: comment.username,
      date: comment.date,
    };
    if (comment.deleted) {
      return {
        ...defaultComment,
        content: '**komentar telah dihapus**',
      };
    }

    return defaultComment;
  }

  _normalizeReply(reply) {
    const defaultReply = {
      id: reply.id,
      content: reply.content,
      username: reply.username,
      date: reply.date,
    };
    if (reply.deleted) {
      return {
        ...defaultReply,
        content: '**balasan telah dihapus**',
      };
    }

    return defaultReply;
  }
}

module.exports = GetThreadUseCase;
