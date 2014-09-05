'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Email = mongoose.model('Email'),
    Concept = mongoose.model('Concept'),
    Base64 = require(process.cwd() + '/server/lib/base64'),
    _ = require('lodash'),
    appUploadPath = '/public/uploads',
    uploadPath = process.cwd() + appUploadPath,
    // slidePlayUrl = '/public/play/',
    fs = require('fs'),
    api_key = 'key-3zip4qju2ns3t1cliicl3xwfb5rqk-f0',
    domain = 'prezy.mailgun.org',
    Mailgun = require('mailgun-js'),
    mailgun = new Mailgun({apiKey: api_key, domain: domain});

// var appendKey = function(linkArray, key, appUrl) {
//     var newLinks = [],
//         playUrl = appUrl + slidePlayUrl;

//     var append = function(link) {
//         link = playUrl + link + '?key=' + key;
//         newLinks.push(link);
//     };

//     _.each(linkArray, function(item) {
//         append(item);
//     });

//     return newLinks;
// };

/**
 * Find concept by id
 */
exports.concept = function(req, res, next, id) {
    Concept.load(id, function(err, concept) {
        if (err) return next(err);
        if (!concept) return next(new Error('Failed to load concept ' + id));
        req.concept = concept;
        next();
    });
};

/**
 * Show concept images
 */
exports.allUploads = function(req, res) {
    var walk = function(dir) {
        var results = [],
            rootFile,
            list = fs.readdirSync(dir);
        list.forEach(function(file) {
            rootFile = dir + '/' + file;
            var stat = fs.statSync(rootFile);
            if (stat && stat.isDirectory()) {
                results = results.concat(walk(rootFile));
            } else {
                results.push( appUploadPath + '/concepts/' + file);
            }
        });
        return results;
    };

    var files = walk( process.env.PWD + appUploadPath + '/concepts'),
        conceptImages = [];

    files.forEach(function(file) {
        conceptImages.push({
        'filelink': file, 'thumb': file, 'image': file
        });
    });
    
    res.jsonp(conceptImages);
};

/**
 * Upload a concept image
 */
exports.uploadConceptImage = function(req, res) {
    // Handle Image upload
    var fstream;
    req.pipe(req.busboy);
    req.busboy.on('file', function (fieldname, file, filename) {
        console.log('Uploading: ' + filename); 
        fstream = fs.createWriteStream(uploadPath + '/concepts/' + filename);
        file.pipe(fstream);
        fstream.on('close', function () {
            res.jsonp({'filelink': appUploadPath + '/concepts/' + filename, 'thumb': appUploadPath + '/concepts/' + filename, 'image': appUploadPath + '/concepts/' + filename});
        });
    });
};

/**
 * Show an concept
 */
exports.redirectPlay = function(req, res) {

    console.log(req.query.key);
    // Email.findOne({ 'key': req.query.key}).exec(function(err, email) {
    //     if (err) {
    //     return res.jsonp(500,{
    //     error: 'Cannot find email'
    //         });
    // }
    // res.jsonp(email);

    // });
};

/**
 * Email Concept links
 */
exports.email = function(req, res) {
    // create initial email object
    var emailData = req.body,
        base64 = new Base64(),
        date = new Date().toJSON();

    // generate random key
    var key = emailData.email + ':' + date;
    emailData.key = base64.encode(key);

    // email data
    var data = {
        from: 'Y&C Concepts <prezy@mailgun.org>',
        to: emailData.email,
        subject: 'Future subject',
        html: emailData.links
    };

    mailgun.messages().send(data, function (error, body) {
        if (error) {
            return res.jsonp(500,{
                error: error,
                detail: body
            });
        }

        // save the email which was sent successfully
        var email = new Email(email);
        email.user = req.user;

        email.save(function(err) {
            if (err) {
                return res.jsonp(500,{
                    error: 'Cannot save the email data',
                    detail: err
                });
            }
            res.jsonp(200,{
                error: false,
                detail: body
            });
        });
    });
};

/**
 * Create an concept
 */
exports.create = function(req, res) {
    var concept = new Concept(req.body);
    concept.user = req.user;

    concept.save(function(err) {
        if (err) {
            return res.jsonp(500,{
                error: 'Cannot save the concept',
                detail: err
            });
        }
    res.jsonp(concept);

    });
};

/**
 * Update an concept
 */
exports.update = function(req, res) {
    var concept = req.concept;

    concept = _.extend(concept, req.body);

    concept.save(function(err) {
        if (err) {
            return res.jsonp(500,{
            error: 'Cannot update the concept',
            detail: err
                });
        }

        Concept.saveClient(concept.client, function(err, concept) {
            if (err) {
                return res.jsonp(500,{
                        error: 'Cannot populate client',
                        detail: err
                            });
            }
        });
        res.jsonp(concept);
    });
};

/**
 * Delete an concept
 */
exports.destroy = function(req, res) {
    var concept = req.concept;

    concept.remove(function(err) {
        if (err) {
        return res.jsonp(500,{
        error: 'Cannot delete the concept'
            });
    }
    res.jsonp(concept);

    });
};

/**
 * Show an concept
 */
exports.show = function(req, res) {
    res.jsonp(req.concept);
};

/**
 * List of concepts
 */
exports.all = function(req, res) {
    Concept.find().sort('-created').populate('user', 'name username').exec(function(err, concepts) {
        if (err) {
        return res.jsonp(500,{
        error: 'Cannot list the concepts'
            });
    }
    res.jsonp(concepts);

    });
};
