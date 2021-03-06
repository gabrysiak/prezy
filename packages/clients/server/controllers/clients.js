'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');

var Client = mongoose.model('Client'),
    Concept = require('../../../concepts/server/models/concept'),
    Project = require('../../../projects/server/models/project'),
    _ = require('lodash'),
    appUploadPath = '/public/uploads',
    uploadPath = process.cwd() + appUploadPath,
    fs = require('fs');

Project = mongoose.model('Project');
Concept = mongoose.model('Concept');

/**
 * Search directory for files
 * @param  {string} dir Directory path
 * @param  {string} dir Directory path
 * @return {array}     Array of files found
 */
var walk = function(dir, subDir) {
    var results = [],
        rootFile,
        list = fs.readdirSync(dir);

    list.forEach(function(file) {
        rootFile = dir + '/' + file;
        var stat = fs.statSync(rootFile);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(rootFile));
        } else {
            if (typeof subDir !== 'undefined') {
                results.push( appUploadPath + subDir + '/' + file);
            }
        }
    });
    return results;
};

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
 * Get all logos
 */
exports.allLogos = function(req, res) {
    var logosFolder = '/logos',
        files = walk( process.env.PWD + appUploadPath + logosFolder, logosFolder ),
        logos = [];

    files.forEach(function(file) {
        logos.push({
        'filelink': file, 'thumb': file, 'image': file
        });
    });
    
    res.jsonp(logos);
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
 * Get Client Concepts
 */
exports.clientConcepts = function(req, res, next) {
    var clientId = req.param('clientId');
    Concept.find({client: clientId}).populate('user', 'name username').exec(function(err, concepts){
        if (err) {
            return res.jsonp(500,{
                error: 'Cannot find concepts belonging to clientId: ' + clientId
            });
        }
        res.jsonp(concepts);
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
