'use strict';

var rounds = require('../controllers/rounds');

// Round authorization helpers
var hasAuthorization = function(req, res, next) {
    if (!req.user.isAdmin && req.round.user.id !== req.user.id) {
        return res.send(401, 'User is not authorized');
    }
    next();
};

module.exports = function(Rounds, app, auth) {

    app.route('/rounds')
        .get(rounds.all)
        .post(auth.requiresLogin, rounds.create);
    app.route('/rounds/:roundId')
        .get(rounds.show)
        .put(auth.requiresLogin, hasAuthorization, rounds.update)
        .delete(auth.requiresLogin, hasAuthorization, rounds.destroy);
    app.route('/rounds/:roundId/concepts')
        .get(rounds.roundConcepts);    
    // Finish with setting up the roundId param
    app.param('roundId', rounds.round);
};
