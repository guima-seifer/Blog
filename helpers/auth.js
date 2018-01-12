/*jshint esversion: 6 */
module.exports = {
  ensureAutheticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }

    req.flash('error_msg', 'Por favor, inicie sessão primeiro');
    res.redirect('/users/login');
  },
};
