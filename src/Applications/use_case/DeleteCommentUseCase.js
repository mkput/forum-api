class DeleteCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    await this._verifyPayload(useCasePayload);
    const { threadId, commentId, owner } = useCasePayload;

    await this._threadRepository.verifyAvailableThread(threadId);
    await this._commentRepository.verifyCommentOwner(owner, commentId);
    await this._commentRepository.deleteComment(commentId);
  }

  async _verifyPayload(payload) {
    const { threadId, commentId, owner } = payload;

    if (!threadId || !commentId || !owner) {
      throw new Error(
        'DELETE_COMMENT_USE_CASE.PAYLOAD_NOT_CONTAIN_NEEDED_PROPERTY'
      );
    }

    if (
      typeof threadId !== 'string' ||
      typeof commentId !== 'string' ||
      typeof owner !== 'string'
    ) {
      throw new Error(
        'DELETE_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION'
      );
    }
  }
}

module.exports = DeleteCommentUseCase;
