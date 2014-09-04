'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');

var Client = mongoose.model('Client'),
    Slideshow = mongoose.model('Slideshow'),
    Project = require('../../../projects/server/models/project'),
    _ = require('lodash'),
    appUploadPath = '/public/uploads',
    uploadPath = process.cwd() + appUploadPath,
    fs = require('fs');

mongoose.model('Project');
/**
 * Find client by id
 */
exports.client = function(req, res, next, id) {
    Client.load(id, function(err, client) {
        if (err) return next(err);
        if (!client) return next(new Error('Failed to load client ' + id));
        req.client = client;
        next();
    });
};

/**
 * Create an client
 */
exports.create = function(req, res) {

    var client = new Client(req.body);
    client.user = req.user;
    client.save(function(err) {
        if (err) {
            return res.jsonp(500,{
                error: 'Cannot save the client'
            });
        }
        res.jsonp(client);
    });
};

/**
 * Upload a logo
 */
exports.uploadLogo = function(req, res) {
    // Handle Image upload
    var fstream;
    req.pipe(req.busboy);
    req.busboy.on('file', function (fieldname, file, filename) {
        console.log('Uploading: ' + filename); 
        fstream = fs.createWriteStream(uploadPath + '/logos/' + filename);
        file.pipe(fstream);
        fstream.on('close', function () {
            res.jsonp(appUploadPath + '/logos/' + filename);
        });
    });
};

/**
 * Update an client
 */
exports.update = function(req, res) {
    var client = req.client;

    client = _.extend(client, req.body);

    client.save(function(err) {
        if (err) {
            return res.jsonp(500,{
                error: err.code === 11000 ? 'That abbr already exists, please try again.' : 'Cannot update the client',
                status: 'danger'
            });
        }
        res.jsonp(client);
    });
};

/**
 * Delete an client
 */
exports.destroy = function(req, res) {
    var client = req.client;

    client.remove(function(err) {
        if (err) {
            return res.jsonp(500,{
                error: 'Cannot delete the client'
            });
        }
        res.jsonp(client);
    });
};

/**
 * Delete a logo
 */
exports.destroyLogo = function(req, res) {
    // logo will include path /public/uploads/logos/mylogo.png
    var logo = req.client.logo;
    var delPath = process.cwd() + logo;
    fs.exists(delPath, function(exists) {
        if(exists) {
            fs.unlink(delPath, function (err) {
                if (err) throw err;
                console.log('successfully deleted : '+ delPath );
                return res.jsonp(200,{
                    success: 'successfully deleted : ' + delPath
                });
            });
        }
    });
};

/**
 * Show an client
 */
exports.show = function(req, res) {
    res.jsonp(req.client);
};

/**
 * List of clients
 */
exports.all = function(req, res) {
    Client.find().sort('-created').populate('user', 'name username').exec(function(err, clients) {
        if (err) {
            return res.jsonp(500,{
                error: 'Cannot list the clients'
            });
        }
        res.jsonp(clients);
    });
};

/**
 * Get Client Slideshows
 */
exports.clientSlideshows = function(req, res, next) {
    var clientId = req.param('clientId');
    Slideshow.find({client: clientId}).populate('user', 'name username').exec(function(err, slideshows){
        if (err) {
            return res.jsonp(500,{
                error: 'Cannot find slideshows belonging to clientId: ' + clientId
            });
        }
        res.jsonp(slideshows);
    });

};

/**
 * Get Client Projects
 */
exports.clientProjects = function(req, res, next) {
    var clientId = req.param('clientId');
    Project.find({client: clientId}).populate('user', 'name username').exec(function(err, projects){
        if (err) {
            return res.jsonp(500,{
                error: 'Cannot find projects belonging to clientId: ' + clientId
            });
        }
        res.jsonp(projects);
    });

};
