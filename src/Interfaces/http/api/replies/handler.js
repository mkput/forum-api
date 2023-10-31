const AddReplyUseCase = require('../../../../Applications/use_case/AddReplyUseCase');
const DeleteReplyUseCase = require('../../../../Applications/use_case/DeleteReplyUseCase');

class RepliesHandler {
  constructor(container) {
    this._container = container;

    this.postThreadCommentReplyHandler =
      this.postThreadCommentReplyHandler.bind(this);
    this.deleteThreadCommentReplyByIdHandler =
      this.deleteThreadCommentReplyByIdHandler.bind(this);
  }

  async postThreadCommentReplyHandler(request, h) {
    const { threadId, commentId } = request.params;
    const { id } = request.auth.credentials;
    const { content } = request.payload;

    const addReply = this._container.getInstance(AddReplyUseCase.name);

    const addedReply = await addReply.execute({
      threadId,
      commentId,
      content,
      owner: id,
    });

    const response = h.response({
      status: 'success',
      data: { addedReply },
    });
    response.code(201);
    return response;
  }

  async deleteThreadCommentReplyByIdHandler(request) {
    const { threadId, commentId, replyId } = request.params;
    const { id } = request.auth.credentials;

    const deleteReply = this._container.getInstance(DeleteReplyUseCase.name);

    await deleteReply.execute({ threadId, commentId, replyId, owner: id });

    return {
      status: 'success',
    };
  }
}

module.exports = RepliesHandler;
