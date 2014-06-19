'use strict';

module.exports = function(app) {

    // Home route
    var index = require('../controllers/index');

    app.route('/')
        .get(index.render);
    app.route('/bitly/:slideshowId')
        .get(index.bitly);

};
