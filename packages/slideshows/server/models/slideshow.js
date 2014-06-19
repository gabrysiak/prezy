'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


/**
 * Slideshow Schema
 */
var SlideshowSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    title: {
        type: String,
    required: true,
        trim: true
    },
    slideNumber: {
        type: Number,
    required: true,
        trim: true
    },
    content: {
        type: String,
    required: true,
        trim: true
    },
    data_x: {
        type: String,
    required: false,
        trim: true
    },
    data_y: {
        type: String,
    required: false,
        trim: true
    },
    shortUrl: {
        type: String,
    required: false,
        trim: true
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});

/**
 * Validations
 */
SlideshowSchema.path('title').validate(function(title) {
    return !!title;
}, 'Title cannot be blank');

SlideshowSchema.path('slideNumber').validate(function(slideNumber) {
    return !!slideNumber;
}, 'Slide number cannot be blank');

SlideshowSchema.path('content').validate(function(content) {
    return !!content;
}, 'Content cannot be blank');

/**
 * Statics
 */
SlideshowSchema.statics.load = function(id, cb) {
    this.findOne({
        _id: id
    }).populate('user', 'name username').exec(cb);
};

mongoose.model('Slideshow', SlideshowSchema);
