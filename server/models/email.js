'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    // load Email and URL type from npm package
    mongooseTypes = require('mongoose-types'),
    timestamps = require('mongoose-timestamp');
    mongooseTypes.loadTypes(mongoose, 'email');

var Email = mongoose.SchemaTypes.Email;
// var Url = mongoose.SchemaTypes.Url;

/**
 * Email Schema
 */
var EmailSchema = new Schema({
    key: {
        type: String,
    required: true,
        trim: true,
      unique: true,
   dropDupes: true
    },
    links: [String],
    name: {
        type: String,
    required: true,
        trim: true
    },
    email: {
        type: Email,
    required: true,
        trim: true
    },
    expired: {
        type: Boolean
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});

/**
 * Plugins
 */
EmailSchema.plugin(timestamps, {
    createdAt: 'created'
});

/**
 * Validations
 */
EmailSchema.path('key').validate(function(key) {
    return !!key;
}, 'Key cannot be blank and has to be unique');

EmailSchema.path('name').validate(function(name) {
    return !!name;
}, 'Email name cannot be blank');

EmailSchema.path('email').validate(function(email) {
    return !!email;
}, 'Email cannot be blank');


/**
 * Statics
 */
EmailSchema.statics.load = function(id, cb) {
    this.findOne({
        _id: id
    }).populate('user', 'name username').exec(cb);
};

mongoose.model('Email', EmailSchema);
