'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var Rounds = new Module('rounds');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
Rounds.register(function(app, auth, database) {

    //We enable routing. By default the Package Object is passed to the routes
    Rounds.routes(app, auth, database);

    //We are adding a link to the main menu for all authenticated users
    // Rounds.menus.add({
    //     roles: ['authenticated'],
    //     title: 'Rounds',
    //     menu: 'main',
    //     dropdown: [{
    //         title: 'Rounds list',
    //         link: 'all rounds',
    //         route: '/#!/rounds'
    //     }, {
    //         divider: true
    //     }, {
    //         title: 'Create New Round',
    //         link: 'create round',
    //         route: '/#!/rounds/create'
    //     }]
    // });

    /**
    //Uncomment to use. Requires meanio@0.3.7 or above
    // Save settings with callback
    // Use this for saving data from administration pages
    Rounds.settings({
        'someSetting': 'some value'
    }, function(err, settings) {
        //you now have the settings object
    });

    // Another save settings example this time with no callback
    // This writes over the last settings.
    Rounds.settings({
        'anotherSettings': 'some value'
    });

    // Get settings. Retrieves latest saved settigns
    Rounds.settings(function(err, settings) {
        //you now have the settings object
    });
    */

    Rounds.aggregateAsset('css', 'rounds.css');

    return Rounds;
});
