/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.addColumn('comments', {
    deleted: {
      type: 'BOOLEAN',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumn('comments', 'deleted');
};
