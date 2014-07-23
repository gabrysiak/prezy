'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var Projects = new Module('projects');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
Projects.register(function(app, auth, database) {

    //We enable routing. By default the Package Object is passed to the routes
    Projects.routes(app, auth, database);

    //We are adding a link to the main menu for all authenticated users
    // Projects.menus.add({
    //     roles: ['authenticated'],
    //     title: 'Projects',
    //     menu: 'main',
    //     dropdown: [{
    //         title: 'Projects list',
    //         link: 'all projects',
    //         route: '/#!/projects'
    //     }, {
    //         divider: true
    //     }, {
    //         title: 'Create New Project',
    //         link: 'create project',
    //         route: '/#!/projects/create'
    //     }]
    // });

    /**
    //Uncomment to use. Requires meanio@0.3.7 or above
    // Save settings with callback
    // Use this for saving data from administration pages
    Projects.settings({
        'someSetting': 'some value'
    }, function(err, settings) {
        //you now have the settings object
    });

    // Another save settings example this time with no callback
    // This writes over the last settings.
    Projects.settings({
        'anotherSettings': 'some value'
    });

    // Get settings. Retrieves latest saved settigns
    Projects.settings(function(err, settings) {
        //you now have the settings object
    });
    */

    Projects.aggregateAsset('css', 'projects.css');

    return Projects;
});
