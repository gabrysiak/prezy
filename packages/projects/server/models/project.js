'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    mongooseTypes = require('mongoose-types'),
    useTimestamps = mongooseTypes.useTimestamps;
    mongooseTypes.loadTypes(mongoose);

/**
 * Project Schema
 */
var ProjectSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
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
ProjectSchema.plugin(useTimestamps);

/**
 * Validations
 */
ProjectSchema.path('title').validate(function(title) {
    return !!title;
}, 'Title cannot be blank');

ProjectSchema.path('content').validate(function(content) {
    return !!content;
}, 'Content cannot be blank');


/**
 * Statics
 */
ProjectSchema.statics.load = function(id, cb) {
    this.findOne({
        _id: id
    }).populate('user', 'name username').exec(cb);
};

mongoose.model('Project', ProjectSchema);
