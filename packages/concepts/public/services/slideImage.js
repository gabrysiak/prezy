'use strict';

//Templates service used for concept slides
angular.module('mean')
.factory('SlideImage', function () {
    
    // instantiate our initial object
    var SlideImage = function(file, path, slideId){
        this.slideId = slideId;
        this.path = path;
        this.name = file.name;
        this.size = file.size;
        this.type = file.type;
        this.lastModifiedDate = file.lastModifiedDate;
    };

    return SlideImage;
});