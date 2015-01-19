angular.module('app.graph', [])
  .directive('sigmaGraph', function() {
    return {
      restrict: 'E',
      template: '<div id="graphContainer"></div>',
      scope: {

      },
      link: function(scope, element, attrs) {
        var s = new sigma({
          container: 'graphContainer',
          edgeColor: 'default',
          defaultEdgeColor: 'grey'
        });

        // generate random nodes
        for (var i = 0; i < 5; i++) {
          s.graph.addNode({
            id: 'n' + i,
            x: Math.random(),
            y: Math.random(),
            size: 2,
            // color: Math.random()
          });
        }

        s.refresh();

      }
    }
  });
  /*
  .controller(function() {
    var s = new sigma('graphContainer');

    s.settings({
      edgeColor: 'default',
      defaultEdgeColor: 'grey'
    });

    for (var i = 0; i < 5; i++) {
      s.graph.addNode({
        id: 'n' + i,
        x: Math.random(),
        y: Math.random(),
        size: 2,
        // color: Math.random()
      })
    }

    // Finally, let's ask our sigma instance to refresh:
    s.refresh();
  });
   */