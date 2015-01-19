angular.module('app.graph', [])
  .factory('GraphStore', function() {
    var generateId = function() {
      return Math.ceil(Math.random() * 1000);
    };

    var s = new sigma({
      container: 'graphContainer',
      settings: {
        edgeColor: 'default',
        defaultEdgeColor: 'grey'
      }
    });

    return {
      generateId: generateId,
      sigmaGraph: s
    }
  })
  .controller('GraphCtrl', function($scope, GraphStore) {
    $scope.sigmaGraph = GraphStore.sigmaGraph;

    for (var i = 0; i < 4; i++) {
      $scope.sigmaGraph.graph.addNode({
        id: 'n' + GraphStore.generateId(),
        x: Math.random(),
        y: Math.random(),
        size: 2
        // color: Math.random()
      })
    }

    // Finally, let's ask our sigma instance to refresh:
    $scope.sigmaGraph.refresh();
  });