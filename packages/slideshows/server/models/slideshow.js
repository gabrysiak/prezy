'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    timestamps = require('mongoose-timestamp');

var Slides = new Schema({
    id: {
        type: Number,
        trim: true
    },
    template: {
        type: String,
    required: false,
        trim: true
    },
    slideNumber: {
        type: Number,
        trim: true
    },
    content: {
        type: String,
    required: false,
        trim: true
    },
    contentRight: {
        type: String,
    required: false,
        trim: true
    },
    dataX: {
        type: Number,
    required: false,
        trim: true
    },
    dataY: {
        type: Number,
    required: false,
        trim: true,
     default: 0
    },
    dataZ: {
        type: Number,
    required: false,
        trim: true,
     default: 1
    },
    dataRotate: {
        type: Number,
    required: false,
        trim: true,
     default: 0
    },
    dataScale: {
        type: Number,
    required: false,
        trim: true,
     default: 1
    }

});

/**
 * Slideshow Schema
 */
var SlideshowSchema = new Schema({
    title: {
        type: String,
    required: true,
        trim: true
    },
    slides: [Slides],
    shortUrl: {
        type: String,
    required: false,
        trim: true
    },
    client: {
        type: Schema.ObjectId,
         ref: 'Client',
    required: true
    },
    project: {
        type: Schema.ObjectId,
         ref: 'Project',
    required: true
    },
    round: {
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
 * Plugins
 */
SlideshowSchema.plugin(timestamps, {
    createdAt: 'created'
});

/**
 * Validations
 */
SlideshowSchema.path('title').validate(function(title) {
    return !!title;
}, 'Title cannot be blank');

SlideshowSchema.path('client').validate(function(client) {
    return !!client;
}, 'Please select a client');

SlideshowSchema.path('project').validate(function(project) {
    return !!project;
}, 'Please select a project');

/**
 * Statics
 */
SlideshowSchema.statics.load = function(id, cb) {
    this.findOne({
        _id: id
    }).populate('user', 'name username').exec(cb);
};

SlideshowSchema.statics.saveClient = function(id, cb) {
    this.findOne({
        _id: id
    }).populate('client', 'title content contactName contactEmail').exec(cb);
};

mongoose.model('Slideshow', SlideshowSchema);
