'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Slideshow = mongoose.model('Slideshow'),
    _ = require('lodash'),
    appUploadPath = '/public/uploads',
    uploadPath = process.cwd() + appUploadPath,
    fs = require('fs'),
    api_key = 'key-3zip4qju2ns3t1cliicl3xwfb5rqk-f0',
    domain = 'prezy.mailgun.org',
    Mailgun = require('mailgun-js'),
    mailgun = new Mailgun({apiKey: api_key, domain: domain});


/**
 * Find slideshow by id
 */
exports.slideshow = function(req, res, next, id) {
    Slideshow.load(id, function(err, slideshow) {
        if (err) return next(err);
        if (!slideshow) return next(new Error('Failed to load slideshow ' + id));
        req.slideshow = slideshow;
        next();
    });
};

/**
 * Show slideshow images
 */
exports.allUploads = function(req, res) {
    var walk = function(dir) {
        var results = [],
            rootFile,
            list = fs.readdirSync(dir);
        list.forEach(function(file) {
            rootFile = dir + '/' + file;
            var stat = fs.statSync(rootFile);
            if (stat && stat.isDirectory()) {
                results = results.concat(walk(rootFile));
            } else {
                results.push( appUploadPath + '/slideshows/' + file);
            }
        });
        return results;
    };

    var files = walk( process.env.PWD + appUploadPath + '/slideshows'),
        slideshowImages = [];

    files.forEach(function(file) {
        slideshowImages.push({
        'filelink': file, 'thumb': file, 'image': file
        });
    });
    
    res.jsonp(slideshowImages);
};

/**
 * Upload a slideshow image
 */
exports.uploadSlideshowImage = function(req, res) {
    // Handle Image upload
    var fstream;
    req.pipe(req.busboy);
    req.busboy.on('file', function (fieldname, file, filename) {
        console.log('Uploading: ' + filename); 
        fstream = fs.createWriteStream(uploadPath + '/slideshows/' + filename);
        file.pipe(fstream);
        fstream.on('close', function () {
            res.jsonp({'filelink': appUploadPath + '/slideshows/' + filename, 'thumb': appUploadPath + '/slideshows/' + filename, 'image': appUploadPath + '/slideshows/' + filename});
        });
    });
};

/**
 * Email Slideshow links
 */
exports.email = function(req, res) {
    var data = {
        from: 'No-Reply <prezy@mailgun.org>',
        to: req.param('email'),
        subject: 'Prezy Links',
        html: req.param('links')
    };

    mailgun.messages().send(data, function (error, body) {
        if (error) {
            return res.jsonp(500,{
                error: error,
                detail: body
            });
        }
        res.jsonp(200,{
            error: false,
            detail: body
        });
    });
};

/**
 * Create an slideshow
 */
exports.create = function(req, res) {
    var slideshow = new Slideshow(req.body);
    slideshow.user = req.user;

    slideshow.save(function(err) {
        if (err) {
            return res.jsonp(500,{
                error: 'Cannot save the slideshow',
                detail: err
            });
        }
    res.jsonp(slideshow);

    });
};

/**
 * Update an slideshow
 */
exports.update = function(req, res) {
    var slideshow = req.slideshow;

    slideshow = _.extend(slideshow, req.body);

    slideshow.save(function(err) {
        if (err) {
            return res.jsonp(500,{
            error: 'Cannot update the slideshow',
            detail: err
                });
        }

        Slideshow.saveClient(slideshow.client, function(err, slideshow) {
            if (err) {
                return res.jsonp(500,{
                        error: 'Cannot populate client',
                        data: slideshow,
                        detail: err
                            });
            }
        });
    });
    res.jsonp(slideshow);
};

/**
 * Delete an slideshow
 */
exports.destroy = function(req, res) {
    var slideshow = req.slideshow;

    slideshow.remove(function(err) {
        if (err) {
        return res.jsonp(500,{
        error: 'Cannot delete the slideshow'
            });
    }
    res.jsonp(slideshow);

    });
};

/**
 * Show an slideshow
 */
exports.show = function(req, res) {
    res.jsonp(req.slideshow);
};

/**
 * List of slideshows
 */
exports.all = function(req, res) {
    Slideshow.find().sort('-created').populate('user', 'name username').exec(function(err, slideshows) {
        if (err) {
        return res.jsonp(500,{
        error: 'Cannot list the slideshows'
            });
    }
    res.jsonp(slideshows);

    });
};
