'use strict';

angular.module('mean').controller('SlideshowsController', ['$scope', '$stateParams', '$location', '$http', '$log', 'Global', 'Clients', 'Slideshows', 'Shorturls', 'Templates', '$upload', 'SlideImage',
    function($scope, $stateParams, $location, $http, $log, Global, Clients, Slideshows, Shorturls, Templates, $upload, SlideImage) {
        $scope.global = Global;
        
        // initial slide values
        $scope.slides = [];

        // populate the clients dropdown
        Clients.query(function(clients) {
            $scope.clients = [{
                value: null,
                text: 'None'
            }];
            angular.forEach(clients, function(client) {
                $scope.clients.push({
                    value: client._id,
                    text: client.title
                });
            });
        });

        // populate templates from service
        $scope.templates = Templates.all();

        // summernote options
        $scope.summernoteWysiwyg = {
            options: {
                height: '300',
                focus: true,
                toolbar: [
                    ['style', ['bold', 'italic', 'underline', 'clear']],
                    ['fontsize', ['fontsize']],
                    ['color', ['color']],
                    ['para', ['ul', 'ol', 'paragraph']],
                    ['height', ['height']],
                    ['insert', ['link', 'picture']]
                ]
            },
            imageUpload: function(files, editor, welEditable, slide) {
                var file = files[0];
                console.log($scope.slides[slide.id-1]);
                // $scope.upload = $upload.upload({
                //     url: '/uploads/slideshows', //upload.php script, node.js route, or servlet url
                //     file: file, // or list of files: $files for html5 only
                // }).progress(function(evt) {
                //     console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
                // }).success(function(data, status, headers, config) {
                //     editor.insertImage(welEditable, JSON.parse(data));
                    
                //     var imgObj = new SlideImage(file,JSON.parse(data),slide.id);
                //     slide.images.push(imgObj);
                // });
            }
        };

        //Event Listener for ng-repeat on slideshow slides.This is needed because impress tries to render the cards while ng-repeat is still populating the attributes in the template.  This works alongside the initiateImpress directive
        $scope.$on('ngRepeatFinished', function() {
             impress().init();
        });

        $scope.hasAuthorization = function(slideshow) {
            if (!slideshow || !slideshow.user) return false;
            return $scope.global.isAdmin || slideshow.user._id === $scope.global.user._id;
        };

        $scope.create = function(isValid) {
            if (isValid) {
                this.slides = $scope.slides;

                var slideshow = new Slideshows({
                    title: this.title,
                    slides: this.slides,
                    client: this.client,
                    shortUrl: null
                });
                slideshow.$save(function(response) {
                    $scope.createShortUrl(response._id);
                });

            } else {
                $scope.submitted = true;
            }
        };

        $scope.remove = function(slideshow) {
            if (slideshow) {
                slideshow.$remove();

                for (var i in $scope.slideshows) {
                    if ($scope.slideshows[i] === slideshow) {
                        $scope.slideshows.splice(i, 1);
                    }
                }
            } else {
                $scope.slideshow.$remove(function(response) {
                    $location.path('slideshows');
                });
            }
        };

        $scope.update = function(isValid) {
            if (isValid) {
                var slideshow = $scope.slideshow;

                if (!slideshow.updated) {
                    slideshow.updated = [];
                }
                slideshow.updated.push(new Date().getTime());

                slideshow.$update(function() {
                    // $location.path('slideshows/' + slideshow._id);
                    $location.path('slideshows');
                });
            } else {
                $scope.submitted = true;
            }
        };

        $scope.find = function() {
            Slideshows.query(function(slideshows) {
                $scope.slideshows = slideshows;
            });
        };

        $scope.findOne = function() {
            Slideshows.get({
                slideshowId: $stateParams.slideshowId
            }, function(slideshow) {
                $scope.$watch('clients', function(clients){
                    if (!clients) return;
                    $scope.slideshow = slideshow;
                    $scope.slides = $scope.slideshow.slides;
                }, true);
            });
        };

        $scope.duplicate = function(slideshow) {
            if (!slideshow) return;
            var slideshowDuplicate = new Slideshows({
                title: slideshow.title,
                slides: slideshow.slides,
                client: slideshow.client,
                shortUrl: null
            });
            slideshowDuplicate.$save(function(response) {
                $scope.createShortUrl(response._id, true, function(shortUrl){
                    response.shortUrl = shortUrl;
                    $scope.slideshows.push(response);
                });
            });
        };

        $scope.addSlide = function(slideshow) {
            if( !slideshow ) {
                var newItemNo = $scope.slides.length+1;
                $scope.slides.push({
                    id: newItemNo,
                    template: typeof $scope.slides.template === 'undefined' ? null : $scope.slides.template,
                    slideNumber: newItemNo,
                    content: null,
                    contentRight: null,
                    images: [],
                    data_x: null,
                    data_y: null
                });
                return;
            }

            var editItemNo = slideshow.slides.length+1;
            slideshow.slides.push({
                id: editItemNo,
                template: typeof slideshow.slides.template === 'undefined' ? null : slideshow.slides.template,
                slideNumber: editItemNo,
                content: null,
                contentRight: null,
                images: [],
                data_x: null,
                data_y: null
            });
        };

        $scope.removeSlide = function(slide) {
            // remove item from scope / model
            if( $scope.slideshow ) {
                $scope.slideshow.slides = _.filter($scope.slideshow.slides, function (slideshowSlide) {
                    return (slide.id !== slideshowSlide.id);
                });
                $scope.reorderSlides($scope.slideshow.slides);
            } else {
                $scope.slides = _.filter($scope.slides, function (slideshowSlide) {
                    return (slide.id !== slideshowSlide.id);
                });
                $scope.reorderSlides($scope.slides);
            }
        };

        $scope.createShortUrl = function(slideshowId, duplicate, callback) {
            Slideshows.get({
                slideshowId: slideshowId
            }, function(slideshow) {
                $scope.slideshow = slideshow;
            });

            $http.get('/bitly/' + slideshowId).then(function (response) {
                $scope.slideshow.shortUrl = response.data.shortUrl;
                $scope.slideshow.$update(function() {
                    if( duplicate ) {
                        callback($scope.slideshow.shortUrl);
                    } else {
                        $location.path('slideshows/' + slideshowId);
                    }  
                });
            }).catch(function (response, status, headers, config) {
                $log.error(response);  //error occured
            });
        };

        $scope.reorderSlides = function(slides) {
            angular.forEach(slides, function(value,key) {
                value.id = key+1;
                value.slideNumber = key+1;
            });
        };
    }
]);