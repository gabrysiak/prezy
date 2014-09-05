'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var Concepts = new Module('concepts');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
Concepts.register(function(app, auth, database) {

    //We enable routing. By default the Package Object is passed to the routes
    Concepts.routes(app, auth, database);

    //We are adding a link to the main menu for all authenticated users
    Concepts.menus.add({
        roles: ['authenticated'],
        title: 'Concepts',
        menu: 'main',
        dropdown: [{
            title: 'Concepts list',
            link: 'View All',
            route: '/#!/concepts'
        }, {
            divider: true
        }, {
            title: 'Create New Concept',
            link: 'Create',
            route: '/#!/concepts/create'
        }]
    });

    /**
    //Uncomment to use. Requires meanio@0.3.7 or above
    // Save settings with callback
    // Use this for saving data from administration pages
    Concepts.settings({
        'someSetting': 'some value'
    }, function(err, settings) {
        //you now have the settings object
    });

    // Another save settings example this time with no callback
    // This writes over the last settings.
    Concepts.settings({
        'anotherSettings': 'some value'
    });

    // Get settings. Retrieves latest saved settigns
    Concepts.settings(function(err, settings) {
        //you now have the settings object
    });
    */

    Concepts.aggregateAsset('css', 'concepts.css');

    return Concepts;
});
