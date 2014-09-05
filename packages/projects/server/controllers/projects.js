'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    async = require('async'),
    Project = mongoose.model('Project'),
    Round = require('../../../rounds/server/models/round'),
    Concept = mongoose.model('Concept'),
    _ = require('lodash');

Round = mongoose.model('Round');
/**
 * Find project by id
 */
exports.project = function(req, res, next, id) {
    Project.load(id, function(err, project) {
        if (err) return next(err);
        if (!project) return next(new Error('Failed to load project ' + id));
        req.project = project;
        next();
    });
};

/**
 * Create an project
 */
exports.create = function(req, res) {

    var project = new Project(req.body);
    project.user = req.user;
    project.save(function(err) {
        if (err) {
            return res.jsonp(500,{
                error: 'Cannot save the project'
            });
        }
        res.jsonp(project);
    });
};

/**
 * Update an project
 */
exports.update = function(req, res) {
    var project = req.project;

    project = _.extend(project, req.body);

    project.save(function(err) {
        if (err) {
            return res.jsonp(500,{
                error: 'Cannot update the project'
            });
        }
        res.jsonp(project);
    });
};

/**
 * Delete an project
 */
exports.destroy = function(req, res) {
    var project = req.project;

    project.remove(function(err) {
        if (err) {
            return res.jsonp(500,{
                error: 'Cannot delete the project'
            });
        }
        res.jsonp(project);
    });
};

/**
 * Show an project
 */
exports.show = function(req, res) {
    res.jsonp(req.project);
};

/**
 * List of projects
 */
exports.all = function(req, res) {
    Project.find().sort('-created').populate('user', 'name username').exec(function(err, projects) {
        if (err) {
            return res.jsonp(500,{
                error: 'Cannot list the projects'
            });
        }
        res.jsonp(projects);
    });
};

/**
 * Get Project Concepts
 */
exports.projectConcepts = function(req, res, next) {
    var projectId = req.param('projectId');
    Concept.find({project: projectId}).sort('-created').populate('user', 'name username').exec(function(err, concepts) {
        if (err) {
            return res.jsonp(500,{
                error: 'Cannot find concepts belonging to projectId: ' + projectId
            });
        }
        res.jsonp(concepts);
    });
};

/**
 * Get Project Rounds
 */
exports.projectRounds = function(req, res, next) {
    var projectId = req.param('projectId'),
        clientId = req.param('clientId'),
        rounds = [];

    Concept.find({project: projectId, client: clientId}, function(err, concepts){
        if (err) {
            return res.jsonp(500,{
                error: 'Cannot find concepts belonging to projectId: ' + projectId
            });
        }

        async.each(concepts, function(concept, callback) {
            if (!concept) return;

            Round.find({_id: concept.round}, function(err, round){
                if (err) {
                    return res.jsonp(500,{
                        error: 'Cannot find round belonging to concept: ' + concept._id
                    });
                }
                rounds.push(round[0]);
                callback();
            });

        }, function(err) {
            if (err) {
                return res.jsonp(500,{
                    error: 'Something went wrong with async function'
                });
            }
            res.jsonp(rounds);
        });
    });
};
