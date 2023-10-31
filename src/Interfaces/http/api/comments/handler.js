const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase');

class CommentsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadsCommentHandler = this.postThreadsCommentHandler.bind(this);
    this.deleteThreadsCommentByIdHandler =
      this.deleteThreadsCommentByIdHandler.bind(this);
  }

  async postThreadsCommentHandler(request, h) {
    const { id } = request.auth.credentials;
    const { threadId } = request.params;
    const addComment = this._container.getInstance(AddCommentUseCase.name);
    const addedComment = await addComment.execute({
      ...request.payload,
      owner: id,
      threadId,
    });

    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });
    response.code(201);
    return response;
  }

  async deleteThreadsCommentByIdHandler(request, h) {
    const { id } = request.auth.credentials;
    const { threadId, commentId } = request.params;
    const deleteComment = await this._container.getInstance(
      DeleteCommentUseCase.name
    );

    await deleteComment.execute({
      owner: id,
      threadId,
      commentId,
    });

    const response = h.response({
      status: 'success',
    });
    return response;
  }
}

module.exports = CommentsHandler;
