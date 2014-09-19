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
    bkgColor: {
        type: String,
    required: false,
        trim: true
    },
    bkgImage: {
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
 * Concept Schema
 */
var ConceptSchema = new Schema({
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
        type: Schema.ObjectId,
         ref: 'Round'
    },
    user: {
        type: Schema.ObjectId,
         ref: 'User'
    }
});

/**
 * Plugins
 */
ConceptSchema.plugin(timestamps, {
    createdAt: 'created'
});

/**
 * Validations
 */
ConceptSchema.path('title').validate(function(title) {
    return !!title;
}, 'Title cannot be blank');

ConceptSchema.path('client').validate(function(client) {
    return !!client;
}, 'Please select a client');

ConceptSchema.path('project').validate(function(project) {
    return !!project;
}, 'Please select a project');

/**
 * Statics
 */
ConceptSchema.statics.load = function(id, cb) {
    this.findOne({
        _id: id
    }).populate('user', 'name username').populate('client', '_id logo').exec(cb);
};

ConceptSchema.statics.saveClient = function(id, cb) {
    this.findOne({
        _id: id
    }).populate('client', 'title content contactName contactEmail').exec(cb);
};

mongoose.model('Concept', ConceptSchema);
