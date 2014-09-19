'use strict';

var mean = require('meanio');
var config = require('../config/config');

var BitlyAPI = require('node-bitlyapi');

var Bitly = new BitlyAPI({
    client_id: config.bitly.clientID,
    client_secret: config.bitly.clientSecret    
});

Bitly.setAccessToken(config.bitly.accessToken); 

exports.bitly = function(req, res) {
    var url = 'http://' + req.headers.host + '/#!/concepts/play/' + req.params.conceptId;

    Bitly.shorten({longUrl:url}, function(err, results) {
        if (err) throw err;
        results = JSON.parse(results);        
        res.jsonp({
            shortUrl: results.data.url
        });
    });
};


exports.render = function(req, res) {
    var modules = [];

    // Preparing angular modules list with dependencies
    for (var name in mean.modules) {
        modules.push({
            name: name,
            module: 'mean.' + name,
            angularDependencies: mean.modules[name].angularDependencies
        });
    }

    function isAdmin() {
        return req.user && req.user.roles.indexOf('admin') !== -1;
    }

    // Send some basic starting info to the view
    res.render('index', {
        user: req.user ? {
            name: req.user.name,
            _id: req.user._id,
            username: req.user.username,
            roles: req.user.roles
        } : {},
        modules: modules,
        isAdmin: isAdmin,
        version: 'Beta v.0.6.1',
        adminEnabled: isAdmin() && mean.moduleEnabled('mean-admin')
    });
};
