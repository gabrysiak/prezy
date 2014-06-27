'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var Slideshows = new Module('slideshows');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
Slideshows.register(function(app, auth, database) {

    //We enable routing. By default the Package Object is passed to the routes
    Slideshows.routes(app, auth, database);

    //We are adding a link to the main menu for all authenticated users
    Slideshows.menus.add({
        roles: ['authenticated'],
        title: 'Slideshows',
        menu: 'main',
        dropdown: [{
            title: 'Slideshows list',
            link: 'all slideshows',
            route: '/#!/slideshows'
        }, {
            divider: true
        }, {
            title: 'Create New Slideshow',
            link: 'create slideshow',
            route: '/#!/slideshows/create'
        }]
    });

    /**
    //Uncomment to use. Requires meanio@0.3.7 or above
    // Save settings with callback
    // Use this for saving data from administration pages
    Slideshows.settings({
        'someSetting': 'some value'
    }, function(err, settings) {
        //you now have the settings object
    });

    // Another save settings example this time with no callback
    // This writes over the last settings.
    Slideshows.settings({
        'anotherSettings': 'some value'
    });

    // Get settings. Retrieves latest saved settigns
    Slideshows.settings(function(err, settings) {
        //you now have the settings object
    });
    */

    Slideshows.aggregateAsset('css', 'slideshows.css');

    return Slideshows;
});
