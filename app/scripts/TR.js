'use strict';
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
    var mpath = svg.append('path').attr('d', arc).attr('fill', fill).attr('transform', 'translate(' + tx * radius + ', ' + ty * radius + ')');
    var radius = (outerRadius - innerRadius)/2 + innerRadius;
    mpath.datum({radius: radius});
    var oldColor;
    mpath.on('mouseenter', function () {
//        var item = d3.select(this);
        console.log('On mouse enter');
        //if (DragDropManager.droppable)
        //{

            //oldColor = null;

        //}
    });
    mpath.on('mouseleave', function () {
        //if (DragDropManager.droppable && oldColor)
        //{

//            console.log('On mouse leave');
        //}
    });
    mpath.on('mouseover', function (d,i) {
        oldColor = d3.select(this).style("fill");
        d3.select(this).style("fill", "aliceblue");
        DragDropManager.droppable = d3.select(this);
        console.log('On mouse over: ' + DragDropManager.droppable);
    });
    mpath.on('mouseout', function (e) {
        d3.select(this).style("fill", oldColor);
        DragDropManager.droppable = null;
        //console.log('On mouse out');
    });
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
var CONFIG = {'quadrantRadius': 500, 'blipWidth': 25, 'blipFontSize': '10px', 'blipColours': {'adopt': '#44b500', 'trial': '#859900', 'assess': '#99df00', 'hold': '#bb5500'}, 'textColour': '#000', 'maxRadius': 400,
    'segmentData': [
    {'title': 'Yes', 'startRadius': 0, 'endRadius': 150, 'colour': '#BFC0BF'},
    {'title': 'Maybe', 'startRadius': 150, 'endRadius': 275, 'colour': '#CBCCCB'},
    {'title': 'No', 'startRadius': 275, 'endRadius': 350, 'colour': '#D7D8D6'}
    //{'title': 'No', 'startRadius': 350, 'endRadius': 400, 'colour': '#E4E5E4'}
], 'quadrantData': {'tools': {'startAngle': 0, 'tx': 0, 'ty': 1, 'colour': '#83AD78'}, 'languages-and-frameworks': {'startAngle': 90, 'tx': 0, 'ty': 0, 'colour': '#8D2145'}, 'platforms': {'startAngle': 180, 'tx': 1, 'ty': 0, 'colour': '#E88744'}, 'techniques': {'startAngle': 270, 'tx': 1, 'ty': 1, 'colour': '#3DB5BE'}}}

var drawQuadrant = function () {
    var svg = d3.select('#radar').append('svg').attr('width', CONFIG.quadrantRadius).attr('height', CONFIG.quadrantRadius);
    var quadrantName = 'tools';
    var quadrantData = CONFIG.quadrantData[quadrantName];
    var scaleFactor = CONFIG.quadrantRadius / CONFIG.maxRadius;
    quadrant(svg, quadrantName, CONFIG.quadrantRadius, scaleFactor, CONFIG.segmentData, quadrantData.startAngle, quadrantData.tx, quadrantData.ty, CONFIG.textColour);
    createBlip('453', '300');
}

var createBlip = function(value, radius)
{
    var svg = d3.select('#radar svg');
    var quadrantName = 'tools';
    var quadrantData = CONFIG.quadrantData[quadrantName];
    var scaleFactor = CONFIG.quadrantRadius / CONFIG.maxRadius;
    var mb= {"radarId":value,"urlLabel":"","radius":radius,"quadrant":"languages-and-frameworks",
            "lastModified":"2012-10","description":"nothing new. – Move Clojure to Adopt.","quadrantSortOrder":"1",
            "ring":"Trial","ringSortOrder":"3","id":"719","faded":"","movement":"c","name":"Clojure",
            "editStatus":"Include w/o Write Up","type":"Blip","theta":"45","date":"2014-01","isNew":false};
    drawBlip(mb, svg, quadrantData.colour, scaleFactor, CONFIG.quadrantRadius, quadrantData.tx, quadrantData.ty, CONFIG.blipWidth, CONFIG.blipFontSize);
}


// ---
// Handle dragging from HTML to dropping on SVG
// ---
var DragDropManager = {
    dragged: null,
    droppable: null,
    draggedMatchesTarget: function() {
        if (!this.droppable) return false;
        return true;
    }
}



