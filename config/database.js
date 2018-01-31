/*jshint esversion: 6 */
if (process.env.NODE_ENV === 'production') {
  module.exports = {
    mongoURI: 'mongodb://localhost/blog-dev',
  };
} else {
  module.exports = {
    mongoURI: 'mongodb://localhost/blog-dev',
  };
}
