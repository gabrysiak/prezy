'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    mongooseTypes = require('mongoose-types'),
    useTimestamps = mongooseTypes.useTimestamps;
    mongooseTypes.loadTypes(mongoose);

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
    required: true,
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
    data_x: {
        type: Number,
    required: false,
        trim: true
    },
    data_y: {
        type: Number,
    required: false,
        trim: true
    }
});

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
SlideshowSchema.plugin(useTimestamps);

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

Slides.path('slideNumber').validate(function(slideNumber) {
    return !!slideNumber;
}, 'Slide number cannot be blank');

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
