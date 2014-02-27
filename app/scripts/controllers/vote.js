'use strict';

angular.module('techRadarApp')
  .controller('VoteCtrl', function ($scope) {
   /* $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];*/
/*
        var radar = new d3.Panel Panel()
            .width(1024)
            .height(800)
            .canvas('radar');

// arcs
        radar.add(pv.Dot)
            .data(radar_arcs)
            .left(w/2)
            .bottom(h/2)
            .radius(function(d){return d.r;})
            .strokeStyle("#ccc")
            .anchor("top")
            .add(pv.Label).text(function(d) { return d.name;});

        radar.anchor('radar');
        radar.render();*/
/*
        var sampleSVG = d3.select("#radar")
            .append("svg")
            .attr("width", 1024)
            .attr("height", 800);

        sampleSVG.append("circle")
            .style("stroke", "gray")
            .style("fill", "white")
            .attr("r", 40)
            .attr("cx", 50)
            .attr("cy", 50)
            .on("mouseover", function(){d3.select(this).style("fill", "aliceblue");})
            .on("mouseout", function(){d3.select(this).style("fill", "white");});*/
        drawQuadrant();

  });
