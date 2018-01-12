/*jshint esversion: 6 */
if (process.env.NODE_ENV === 'production') {
  module.exports = {
    mongoURI: 'mongodb://fernando:olaola@ds239097.mlab.com:39097/blog-prod',
  };
} else {
  module.exports = {
    mongoURI: 'mongodb://localhost/blog-dev',
  };
}
