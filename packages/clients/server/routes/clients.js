'use strict';

var clients = require('../controllers/clients');

// Client authorization helpers
var hasAuthorization = function(req, res, next) {
    if (!req.user.isAdmin && req.client.user.id !== req.user.id) {
        return res.send(401, 'User is not authorized');
    }
    next();
};

module.exports = function(Clients, app, auth) {

    app.route('/clients')
        .get(clients.all)
        .post(auth.requiresLogin, clients.create);
    app.route('/clients/:clientId')
        .get(clients.show)
        .put(auth.requiresLogin, hasAuthorization, clients.update)
        .delete(auth.requiresLogin, hasAuthorization, clients.destroy);

    // Finish with setting up the clientId param
    app.param('clientId', clients.client);
};
