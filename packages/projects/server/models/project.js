'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    timestamps = require('mongoose-timestamp');

/**
 * Project Schema
 */
var ProjectSchema = new Schema({
    title: {
        type: String,
    required: true,
        trim: true
    },
    content: {
        type: String,
    required: false,
        trim: true
    },
    client: {
        type: Schema.ObjectId,
         ref: 'Client'
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});

/**
 * Plugins
 */
ProjectSchema.plugin(timestamps, {
    createdAt: 'created'
});

/**
 * Validations
 */
ProjectSchema.path('title').validate(function(title) {
    return !!title;
}, 'Title cannot be blank');


/**
 * Statics
 */
ProjectSchema.statics.load = function(id, cb) {
    this.findOne({
        _id: id
    }).populate('user', 'name username').populate('client', '_id title').exec(cb);
};

mongoose.model('Project', ProjectSchema);
