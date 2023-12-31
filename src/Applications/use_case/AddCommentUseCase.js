const NewComment = require('../../Domains/comments/entities/NewComment');

class AddCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const newComment = new NewComment(useCasePayload);

    await this._threadRepository.verifyAvailableThread(useCasePayload.threadId);
    return await this._commentRepository.addComment(newComment);
  }
}

module.exports = AddCommentUseCase;
