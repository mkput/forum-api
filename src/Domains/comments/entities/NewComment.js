class NewComment {
  constructor({ content, owner, threadId }) {
    if (!content || !owner || !threadId) {
      throw new Error('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof content !== 'string' ||
      typeof owner !== 'string' ||
      typeof threadId !== 'string'
    ) {
      throw new Error('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    this.content = content;
    this.owner = owner;
    this.threadId = threadId;
  }
}

module.exports = NewComment;
