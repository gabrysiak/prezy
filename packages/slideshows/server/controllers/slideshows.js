'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Slideshow = mongoose.model('Slideshow'),
    _ = require('lodash');


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
 * Create an slideshow
 */
exports.create = function(req, res) {
    var slideshow = new Slideshow(req.body);
    slideshow.user = req.user;

    slideshow.save(function(err) {
        if (err) {
       return res.jsonp(500,{
        error: 'Cannot save the slideshow'
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
        error: 'Cannot update the slideshow'
            });
    }
    res.jsonp(slideshow);

    });
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
