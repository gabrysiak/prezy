'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    // load Email and URL type from npm package
    mongooseTypes = require('mongoose-types');
    mongooseTypes.loadTypes(mongoose);

var Email = mongoose.SchemaTypes.Email;
// var Url = mongoose.SchemaTypes.Url;

/**
 * Client Schema
 */
var ClientSchema = new Schema({
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
    contactName: {
        type: String,
    required: false,
        trim: true
    },
    contactEmail: {
        type: Email,
    required: false,
        trim: true
    },
    logo: {
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
ClientSchema.path('title').validate(function(title) {
    return !!title;
}, 'Title cannot be blank');

ClientSchema.path('content').validate(function(content) {
    return !!content;
}, 'Content cannot be blank');

/**
 * Statics
 */
ClientSchema.statics.load = function(id, cb) {
    this.findOne({
        _id: id
    }).populate('user', 'name username').exec(cb);
};

mongoose.model('Client', ClientSchema);
