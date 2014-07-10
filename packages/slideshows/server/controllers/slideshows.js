'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Slideshow = mongoose.model('Slideshow'),
    _ = require('lodash'),
    appUploadPath = '/public/uploads',
    uploadPath = process.cwd() + appUploadPath,
    fs = require('fs');


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
            res.jsonp(appUploadPath + '/slideshows/' + filename);
        });
    });
};

/**
 * Delete a slideshow image
 */
exports.destroySlideshowImage = function(req, res) {
    // logo will include path /public/uploads/slideshows/img.png
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
