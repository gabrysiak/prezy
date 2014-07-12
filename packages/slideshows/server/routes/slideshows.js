'use strict';

var slideshows = require('../controllers/slideshows');

// Slideshow authorization helpers
var hasAuthorization = function(req, res, next) {
    if (!req.user.isAdmin && req.slideshow.user.id !== req.user.id) {
        return res.send(401, 'User is not authorized');
    }
    next();
};

module.exports = function(Slideshows, app, auth) {

    app.route('/slideshows')
        .get(slideshows.all)
        .post(auth.requiresLogin, slideshows.create);
    app.route('/slideshows/:slideshowId')
        .get(slideshows.show)
        .put(auth.requiresLogin, hasAuthorization, slideshows.update)
        .delete(auth.requiresLogin, hasAuthorization, slideshows.destroy);
    app.route('/slideshows/play/:slideshowId')
        .get(slideshows.show);
    app.route('/uploads/slideshows')
        .get(slideshows.allUploads)
        .post(auth.requiresLogin, slideshows.uploadSlideshowImage);
    app.route('/uploads/slideshows/:slideshowId')
        .get(slideshows.show)
        .put(auth.requiresLogin, hasAuthorization, slideshows.update)
        .delete(auth.requiresLogin, hasAuthorization, slideshows.destroySlideshowImage);

    // Finish with setting up the slideshowId param
    app.param('slideshowId', slideshows.slideshow);
};
