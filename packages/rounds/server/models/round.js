'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    timestamps = require('mongoose-timestamp');

/**
 * Round Schema
 */
var RoundSchema = new Schema({
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
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});

/**
 * Plugins
 */
RoundSchema.plugin(timestamps, {
    createdAt: 'created'
});

/**
 * Validations
 */
RoundSchema.path('title').validate(function(title) {
    return !!title;
}, 'Title cannot be blank');


/**
 * Statics
 */
RoundSchema.statics.load = function(id, cb) {
    this.findOne({
        _id: id
    }).populate('user', 'name username').exec(cb);
};

mongoose.model('Round', RoundSchema);
