'use strict';
angular.module('radarApp', ['radarApp.controllers', 'radarApp.directives', 'radarApp.filters', 'radarApp.services', 'ngRoute', 'ngSanitize']).config(function ($routeProvider) {
    $routeProvider.when('/', {templateUrl: '/radar/views/main.html', controller: 'MainController'}).when('/a-z', {templateUrl: '/radar/views/a-z.html', controller: 'AZController'}).when('/search', {templateUrl: '/radar/views/search.html', controller: 'SearchController'}).when('/:quadrant', {templateUrl: '/radar/views/quadrant.html', controller: 'QuadrantController'}).when('/:quadrant/:blip', {templateUrl: '/radar/views/blip.html', controller: 'BlipController'}).otherwise({redirectTo: '/'});
});
'use strict';
(function () {
    var MainController = function ($scope, dataRepository) {
        dataRepository.getLatestTrends().then(function (data) {
            $scope.latestTrends = data;
            $scope.selectedMenuEntry = "home";
        });
    };
    var QuadrantController = function ($scope, $routeParams, $location, dataRepository) {
        var names = {"platforms": "Platforms", "tools": "Tools", "techniques": "Techniques", "languages-and-frameworks": "Languages & Frameworks"};
        var ringOrder = ['Adopt', 'Trial', 'Assess', 'Hold'];
        var quadrant = $routeParams.quadrant.toLowerCase();
        if (_.has(names, quadrant)) {
            dataRepository.getWholeHistoryOfBlips().then(function (data) {
                $scope.quadrant = quadrant;
                $scope.rings = _(data.data).map(function (blipHistory) {
                    blipHistory.records[0].isNew = blipHistory.records.length == 1;
                    return blipHistory.records[0];
                }).filter(function (blip) {
                    return blip.quadrant.toLowerCase() === quadrant && blip.date === data.currentRadarDate;
                }).sortBy(function (blip) {
                    return parseInt(blip.radarId)
                }).groupBy(function (blip) {
                    return blip.ring;
                }).map(function (value, key) {
                    return{'blips': value, 'name': key}
                }).sortBy(function (ring) {
                    return _.indexOf(ringOrder, ring.name);
                }).value();
                $scope.selectedMenuEntry = quadrant;
                $scope.name = names[quadrant];
                $scope.onhover = function (blip) {
                    $scope.hovered = blip;
                    $scope.left = undefined;
                }
                $scope.onleave = function (blip) {
                    $scope.left = blip;
                    $scope.hovered = undefined;
                }
                $scope.onclick = function (blip) {
                    var descriptionId = '#blip-description-' + blip.id;
                    var slideTime = 250;
                    $('.blip-description').not(descriptionId).slideUp(slideTime);
                    $(descriptionId).delay(slideTime).slideToggle(slideTime);
                }
            });
        } else {
            $location.path('/');
        }
    };
    var SearchController = function ($scope, $routeParams, $location, dataRepository) {
        var searchTerms = _.filter($routeParams.q.split(/\s+/g), function (s) {
            return s.length > 0;
        });
        var matchesWholeWord = function (text, searchTerm) {
            var regExp = new RegExp("(\\W|\\s|\\b)" + searchTerm + "(\\W|\\s|\\b)", "gi");
            var matches = text.match(regExp);
            return matches == undefined ? 0 : matches.length;
        }
        var matchTermScore = function (blip, searchTerm) {
            return matchesWholeWord(blip.name, searchTerm) * 1000 + matchesWholeWord(blip.description, searchTerm);
        }
        var blipMatchScore = function (blip, searchTerms) {
            return _(searchTerms).map(function (term) {
                return matchTermScore(blip, term)
            }).reduce(function (a, b) {
                return a + b;
            });
        }
        var historyMatchScore = function (records, searchTerms) {
            return _(records).map(function (blip) {
                return blipMatchScore(blip, searchTerms)
            }).reduce(function (a, b) {
                return a + b;
            });
        }
        dataRepository.getWholeHistoryOfBlips().then(function (blipHistories) {
            $scope.selectedMenuEntry = "a-z";
            $scope.blips = _(blipHistories.data).map(function (blipHistory) {
                return{blip: blipHistory.records[0], score: historyMatchScore(blipHistory.records, searchTerms)}
            }).filter(function (match) {
                return match.score > 0;
            }).sortBy(function (match) {
                return match.score;
            }).map(function (match) {
                return match.blip;
            }).value().reverse();
        });
    }
    var AZController = function ($q, $scope, $routeParams, $location, dataRepository) {
        $scope.selectedMenuEntry = "a-z";
        $scope.name = "Radar A-Z";
        $scope.groups = [];
        dataRepository.getWholeHistoryOfBlips().then(function (blipHistories) {
            $scope.groups = _(blipHistories.data).map(function (blipHistory) {
                return blipHistory.records[0]
            }).sortBy(function (blip) {
                return blip.name;
            }).groupBy(function (blip) {
                return blip.name.toUpperCase()[0];
            }).value();
        });
    };
    var BlipController = function ($scope, $routeParams, $location, dataRepository) {
        dataRepository.getWholeHistoryOfBlips().then(function (blipHistories) {
            var blipHistory = _.select(blipHistories.data, {id: $routeParams.blip})[0];
            if (!_.isUndefined(blipHistory) && !_.isEmpty(blipHistory.records) && blipHistory.records[0].quadrant.toLowerCase() == $routeParams.quadrant.toLowerCase()) {
                $scope.selectedMenuEntry = blipHistory.records[0].quadrant.toLowerCase();
                $scope.blip = _.first(blipHistory.records);
                $scope.historicalBlips = _.rest(blipHistory.records);
                $scope.blip.isNew = blipHistory.records.length == 1;
            } else {
                $location.path('/');
            }
        });
    };
    angular.module('radarApp.controllers', []).controller('MainController', MainController).controller('QuadrantController', QuadrantController).controller('AZController', AZController).controller('SearchController', SearchController).controller('BlipController', BlipController).directive('blipInfo', function () {
        return{restrict: 'AE', scope: {blip: '=blip'}, templateUrl: '/radar/views/blip-info.html'};
    });
})();
(function () {
    var svgSupported = function ($window) {
        return $window.document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1");
    };
    var svgSupportClass = function ($window) {
        return svgSupported($window) ? "svg" : "nosvg";
    };
    var navEntry = function ($document) {
        var link = function (scope, element, attrs) {
            element.on('click', function (e) {
                if (element.hasClass('selected')) {
                    var nav = $document.find('#responsive-tech-radar .nav');
                    var hiddenCount = nav.find("a").filter(function (e) {
                        return $(this).css('display') == "none";
                    }).size();
                    if (hiddenCount > 0) {
                        e.stopImmediatePropagation();
                        nav.toggleClass('expanded');
                        return false;
                    } else {
                        nav.toggleClass('expanded');
                        return true;
                    }
                }
            });
            scope.$watch('selectedMenuEntry', function (newValue, oldValue) {
                var selected = newValue === attrs.navEntry;
                element.toggleClass("selected", selected);
            });
        };
        return{link: link};
    };
    var capabilities = function ($window, $document) {
        var link = function (scope, element, attrs) {
            $document.find('body').addClass(svgSupportClass($window));
        };
        return{link: link};
    };
    var searchSubmit = function ($document, $location) {
        return{link: function (scope, element, attrs) {
            element.on('click', function () {
                var query = $document.find('.radar-search .search-field').val();
                if (query.replace(/\s+/g, '').length > 0) {
                    $location.path('/search').search('q', query);
                    scope.$apply();
                }
            });
        }};
    }
    angular.module('radarApp.directives', []).directive('navEntry', navEntry).directive('capabilities', capabilities).directive('searchSubmit', searchSubmit).directive('a', function ($window, $route) {
        return{restrict: 'E', link: function (scope, elem, attrs) {
            elem.on('click', function (e) {
                e.preventDefault();
                if (attrs.href) {
                    $window.location = attrs.href;
                    $window.scrollTo(0, 0);
                }
            });
        }};
    });
    ;
})();
(function () {
    var triangle = function (svg, x, y, w) {
        return svg.append('path').attr('d', "M412.201,311.406c0.021,0,0.042,0,0.063,0c0.067,0,0.135,0,0.201,0c4.052,0,6.106-0.051,8.168-0.102c2.053-0.051,4.115-0.102,8.176-0.102h0.103c6.976-0.183,10.227-5.306,6.306-11.53c-3.988-6.121-4.97-5.407-8.598-11.224c-1.631-3.008-3.872-4.577-6.179-4.577c-2.276,0-4.613,1.528-6.48,4.699c-3.578,6.077-3.26,6.014-7.306,11.723C402.598,306.067,405.426,311.406,412.201,311.406").attr("stroke", "white").attr("stroke-width", 2).attr('transform', 'scale(' + (w / 34) + ') translate(' + (-404 + x * (34 / w) - 17) + ', ' + (-282 + y * (34 / w) - 17) + ')');
    }
    var circle = function (svg, x, y, w) {
        return svg.append('path').attr('d', "M420.084,282.092c-1.073,0-2.16,0.103-3.243,0.313c-6.912,1.345-13.188,8.587-11.423,16.874c1.732,8.141,8.632,13.711,17.806,13.711c0.025,0,0.052,0,0.074-0.003c0.551-0.025,1.395-0.011,2.225-0.109c4.404-0.534,8.148-2.218,10.069-6.487c1.747-3.886,2.114-7.993,0.913-12.118C434.379,286.944,427.494,282.092,420.084,282.092").attr("stroke", "white").attr("stroke-width", 2).attr('transform', 'scale(' + (w / 34) + ') translate(' + (-404 + x * (34 / w) - 17) + ', ' + (-282 + y * (34 / w) - 17) + ')');
    }
    var rect = function (svg, x, y, w, h) {
        return svg.append('rect').attr('x', x).attr('y', y).attr('width', w).attr('height', h);
    }
    var rad = function (deg) {
        return deg * Math.PI / 180;
    }
    var quadrantPath = function (svg, id, innerRadius, outerRadius, fill, radius, startAngle, tx, ty) {
        var arc = d3.svg.arc().innerRadius(innerRadius).outerRadius(outerRadius).startAngle(rad(startAngle)).endAngle(rad(startAngle + 90));
        svg.append('path').attr('d', arc).attr('fill', fill).attr('transform', 'translate(' + tx * radius + ', ' + ty * radius + ')');

    }
    var quadrantArc = function (svg, id, innerRadius, outerRadius, colour, radius, startAngle, tx, ty) {
        quadrantPath(svg, id, innerRadius, outerRadius, colour, radius, startAngle, tx, ty);
    }
    var addRingIdentifierText = function (svg, text, startArc, endArc, quadrantRadius, tx, ty, colour) {
        var x = (startArc + endArc) / 2;
        var y = 12;
        if (tx)
            x = quadrantRadius - x;
        if (ty)
            y = quadrantRadius - 5;
        svg.append('text').attr({'x': x, 'y': y, "text-anchor": "middle", "fill": colour}).style({'font-size': '10px', 'font-weight': 900}).text(text.toUpperCase());
    }
    var borders = function (svg, radius, tx, ty) {
        var width = 15;
        var x = 0
        if (tx)
            x = radius - width;
        var y = 0
        if (ty)
            y = radius - width;
        rect(svg, 0, y, radius, width).attr('fill', 'white').attr('opacity', 0.5);
        rect(svg, x, 0, width, radius).attr('fill', 'white').attr('opacity', 0.5);
    }
    var quadrant = function (svg, id, quadrantRadius, scale, segments, startAngle, tx, ty, textColour) {
        _(segments).each(function (segment) {
            quadrantArc(svg, id, segment.startRadius * scale, segment.endRadius * scale, segment.colour, quadrantRadius, startAngle, tx, ty);
        });
        borders(svg, quadrantRadius, tx, ty);
        _(segments).each(function (segment) {
            addRingIdentifierText(svg, segment.title, segment.startRadius * scale, segment.endRadius * scale, quadrantRadius, tx, ty, textColour);
        });
    }
    var drawKey = function (svg, quadrantRadius, tx, ty, colour) {
        var x = quadrantRadius / 10;
        var y = quadrantRadius / 10;
        var triangleKey = "New or moved";
        var circleKey = "No change";
        if (!tx)
            x = (quadrantRadius - x) - (Math.max(triangleKey.length, circleKey.length) * 10);
        if (!ty)
            y = quadrantRadius - y;
        triangle(svg, x, y - 10, 10).attr('fill', colour);
        svg.append('text').attr({'x': x + 10, 'y': y - 5, 'fill': colour, 'font-size': '0.8em'}).text(triangleKey);
        circle(svg, x, y + 10, 10).attr('fill', colour);
        svg.append('text').attr({'x': x + 10, 'y': y + 15, 'fill': colour, 'font-size': '0.8em'}).text(circleKey);
    }
    var createShape = function (blip, parent, colour, x, y, blipWidth) {
        var shapeFunction = {'t': triangle, 'c': circle}[blip.movement];
        return shapeFunction(parent, x, y, blipWidth).attr('fill', colour).attr('class', blip.ring.toLowerCase() + '-blip');
    }
    var colourLink = function (blipId, bgColor, color) {
        $('#blip-link-' + blipId).css({'background-color': bgColor, 'color': color});
    }
    var fadeOtherBlips = function (blipId) {
        d3.selectAll('a circle, a path').attr('opacity', 0.3);
        d3.select('#blip-' + blipId).selectAll('circle, path').attr('opacity', 1.0);
    }
    var restoreBlips = function () {
        d3.selectAll('a circle, a path').attr('opacity', 1.0);
    }
    var unhighlight = function (blipId, originalBlipColour, originalBlipTextColour) {
        colourLink(blipId, '', '');
        restoreBlips();
    };
    var highlight = function (blipId, blipColour, textColour) {
        colourLink(blipId, blipColour, textColour);
        fadeOtherBlips(blipId);
    };
    var blipCoord = function (blip, scaleFactor, quadrantRadius, tx, ty) {
        return{'x': Math.abs(Math.abs(blip.radius * scaleFactor * Math.cos(rad(blip.theta))) - tx * quadrantRadius), 'y': Math.abs(Math.abs(blip.radius * scaleFactor * Math.sin(rad(blip.theta))) - ty * quadrantRadius)};
    }
    var drawBlip = function (blip, svg, colour, scale, quadrantRadius, tx, ty, blipWidth, blipFontSize) {
        var coord = blipCoord(blip, scale, quadrantRadius, tx, ty);
        var link = svg.append('svg:a').attr({'id': 'blip-' + blip.id, 'xlink:href': '#/' + blip.quadrant + '/' + blip.id}).style({'text-decoration': 'none', 'cursor': 'pointer'});
        var shape = createShape(blip, link, colour, coord.x, coord.y, blipWidth);
        var textY = blip.movement == 't' ? coord.y + 6 : coord.y + 4;
        link.append('text').attr({'x': coord.x, 'y': textY, 'font-size': blipFontSize, 'font-style': 'italic', 'font-weight': 'bold', 'fill': 'white'}).text(blip.radarId).style({'text-anchor': 'middle'});
        link.on('touchstart', function () {
            highlight(blip.id, colour, 'white')
        });
        link.on('touchend', function () {
            unhighlight(blip.id, colour, 'white')
        });
        link.on('mouseenter', function () {
            highlight(blip.id, colour, 'white')
        });
        link.on('mouseleave', function () {
            unhighlight(blip.id, colour, 'white')
        });
    }
    var svgSupported = function () {
        return document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1");
    };
    var screenSizeSupported = function () {
        return $(window).width() >= 800;
    }
    var CONFIG = {'quadrantRadius': 500, 'blipWidth': 25, 'blipFontSize': '10px', 'blipColours': {'adopt': '#44b500', 'trial': '#859900', 'assess': '#99df00', 'hold': '#bb5500'}, 'textColour': '#000', 'maxRadius': 400, 'segmentData': [
        {'title': 'Adopt', 'startRadius': 0, 'endRadius': 150, 'colour': '#BFC0BF'},
        {'title': 'Trial', 'startRadius': 150, 'endRadius': 275, 'colour': '#CBCCCB'},
        {'title': 'Assess', 'startRadius': 275, 'endRadius': 350, 'colour': '#D7D8D6'},
        {'title': 'Hold', 'startRadius': 350, 'endRadius': 400, 'colour': '#E4E5E4'}
    ], 'quadrantData': {'tools': {'startAngle': 0, 'tx': 0, 'ty': 1, 'colour': '#83AD78'}, 'languages-and-frameworks': {'startAngle': 90, 'tx': 0, 'ty': 0, 'colour': '#8D2145'}, 'platforms': {'startAngle': 180, 'tx': 1, 'ty': 0, 'colour': '#E88744'}, 'techniques': {'startAngle': 270, 'tx': 1, 'ty': 1, 'colour': '#3DB5BE'}}}
    var drawQuadrant = function ($document, $routeParams) {
        var link = function (scope, element, attrs) {
            if (svgSupported() && screenSizeSupported()) {
                var svg = d3.select('#quadrant').append('svg').attr('width', CONFIG.quadrantRadius).attr('height', CONFIG.quadrantRadius);
                scope.$watch('rings', function (rings, oldValue) {
                    if (rings != undefined) {
                        var quadrantName = scope.quadrant;
                        var quadrantData = CONFIG.quadrantData[quadrantName];
                        var scaleFactor = CONFIG.quadrantRadius / CONFIG.maxRadius;
                        quadrant(svg, quadrantName, CONFIG.quadrantRadius, scaleFactor, CONFIG.segmentData, quadrantData.startAngle, quadrantData.tx, quadrantData.ty, CONFIG.textColour);
                        _(rings).each(function (ring) {
                            _(ring.blips).each(function (blip) {
                                drawBlip(blip, svg, quadrantData.colour, scaleFactor, CONFIG.quadrantRadius, quadrantData.tx, quadrantData.ty, CONFIG.blipWidth, CONFIG.blipFontSize);
                            })
                        });
                        drawKey(svg, CONFIG.quadrantRadius, quadrantData.tx, quadrantData.ty, CONFIG.textColour);
                    }
                });
                scope.$watch('hovered', function (blip, oldValue) {
                    if (blip != undefined)
                        highlight(blip.id, CONFIG.quadrantData[scope.quadrant].colour, 'white');
                });
                scope.$watch('left', function (blip, oldValue) {
                    if (blip != undefined)
                        unhighlight(blip.id, CONFIG.quadrantData[scope.quadrant].colour, 'white');
                });
            }
        }
        return{link: link}
    }
    angular.module('radarApp.directives').directive('drawQuadrant', drawQuadrant);
})();
(function () {
    var parsedate = function (string) {
        if (string == undefined)return null;
        var yearMonth = string.match(/(\d{4})-(\d{2})/);
        if (!yearMonth || yearMonth.length !== 3)return null;
        var year = yearMonth[1];
        var zeroBasedMonth = parseInt(yearMonth[2]) - 1;
        var firstDayOfMonth = 1;
        return new Date(year, zeroBasedMonth, firstDayOfMonth);
    };
    var newLines = function (text) {
        return!text || text.split(/\n/g);
    }
    angular.module('radarApp.filters', []).filter('parsedate',function () {
        return parsedate;
    }).filter('newlines', function () {
        return newLines;
    });
})();
(function () {
    var radarApi = function ($http) {
        var getResource = function (url) {
            return $http.get(url, {cache: true}).then(function (response) {
                return response.data;
            });
        };
        return{getResource: getResource}
    };
    var processAllData = function (data) {
        var current_radar_date = _(data).map(function (radar) {
            return radar.date
        }).sort().last();
        var blipHistories = _(data).map(function (radar) {
            return _.map(radar.blips, function (blip) {
                blip.date = radar.date;
                return blip;
            })
        }).flatten().groupBy(function (blip) {
            return blip.id
        }).map(function (val, key) {
            return{id: key, records: _.sortBy(val,function (blip) {
                return blip.date
            }).reverse()}
        }).value();
        return{currentRadarDate: current_radar_date, data: blipHistories};
    }
    var dataRepository = function ($q, radarApi) {
        return{getWholeHistoryOfBlips: function () {
            return radarApi.getResource('/internal/api/radar/blips').then(processAllData);
        }, getLatestTrends: function () {
            return radarApi.getResource('/internal/api/radar/latest-trends');
        }};
    };
    angular.module('radarApp.services', []).factory('radarApi', radarApi).factory('dataRepository', dataRepository);
})();



