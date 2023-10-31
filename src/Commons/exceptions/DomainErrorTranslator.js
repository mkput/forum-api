const InvariantError = require('./InvariantError');

const DomainErrorTranslator = {
  translate(error) {
    return DomainErrorTranslator._directories[error.message] || error;
  },
};

DomainErrorTranslator._directories = {
  'REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    'tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada'
  ),
  'REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    'tidak dapat membuat user baru karena tipe data tidak sesuai'
  ),
  'REGISTER_USER.USERNAME_LIMIT_CHAR': new InvariantError(
    'tidak dapat membuat user baru karena karakter username melebihi batas limit'
  ),
  'REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER': new InvariantError(
    'tidak dapat membuat user baru karena username mengandung karakter terlarang'
  ),
  'USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    'harus mengirimkan username dan password'
  ),
  'USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    'username dan password harus string'
  ),
  'REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN':
    new InvariantError('harus mengirimkan token refresh'),
  'REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION':
    new InvariantError('refresh token harus string'),
  'DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN':
    new InvariantError('harus mengirimkan token refresh'),
  'DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION':
    new InvariantError('refresh token harus string'),
  'NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    'tidak dapat membuat thread baru karna properti yang diperlukan tidak ada'
  ),
  'NEW_THREAD.NOT_MEET_DATA_SPECIFICATION': new InvariantError(
    'tidak dapat membuat thread baru karna tipe data tidak sesuai'
  ),
  'NEW_THREAD.LIMIT_CHAR': new InvariantError(
    'tidak dapat membuat thread baru karna karakter title melebihi batas batas'
  ),
  'NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    'tidak dapat membuat comment baru karna properti yang diperlukan tidak ada'
  ),
  'NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    'tidak dapat membuat comment baru karna tipe data tidak sesuai'
  ),
  'DELETE_COMMENT_USE_CASE.PAYLOAD_NOT_CONTAIN_NEEDED_PROPERTY':
    new InvariantError(
      'tidak dapat menghapus commnet karna properti yang diperlukan tidak ada'
    ),
  'DELETE_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION':
    new InvariantError(
      'tidak dapat menghapus comment karna tipe data tidak sesuai'
    ),
  'REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED': new InvariantError(
    'properti yang diperlukan tidak ada'
  ),
  'ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    'properti yang diperlukan tidak ada'
  ),
  'ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    'type data tidak sesuai'
  ),
  'ADDED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    'properti yang diperlukan tidak ada'
  ),
  'ADDED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    'type data tidak sesuai'
  ),
  'DELETE_REPLY_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    'properti yang diperlukan tidak ada'
  ),
  'DELETE_REPLY_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    'type data tidak sesuai'
  ),
};

module.exports = DomainErrorTranslator;
