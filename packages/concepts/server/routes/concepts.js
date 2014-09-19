'use strict';

var concepts = require('../controllers/concepts');

// Concept authorization helpers
var hasAuthorization = function(req, res, next) {
    if (!req.user.isAdmin && req.concept.user.id !== req.user.id) {
        return res.send(401, 'User is not authorized');
    }
    next();
};

module.exports = function(Concepts, app, auth) {

    app.route('/concepts')
        .get(concepts.all)
        .post(auth.requiresLogin, concepts.create);
    app.route('/concepts/:conceptId')
        .get(concepts.show)
        .put(auth.requiresLogin, hasAuthorization, concepts.update)
        .delete(auth.requiresLogin, hasAuthorization, concepts.destroy);
    app.route('/concepts/play/:conceptId')
        .get(concepts.show);
    app.route('/public/play')
        .get(concepts.redirectPlay);
    app.route('/uploads/concepts')
        .get(concepts.allUploads)
        .post(auth.requiresLogin, concepts.uploadConceptImage);
    app.route('/uploads/concepts/backgrounds')
        .get(concepts.allBackgrounds)
        .post(auth.requiresLogin, concepts.uploadSlideBkg);
    app.route('/email/concepts')
        .post(auth.requiresLogin, concepts.email);
    app.route('/uploads/concepts/:conceptId')
        .get(concepts.show)
        .put(auth.requiresLogin, hasAuthorization, concepts.update);

    // Finish with setting up the conceptId param
    app.param('conceptId', concepts.concept);
};
