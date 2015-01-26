angular.module('app.panel', ['app.graph', 'ui.slider'])
  .directive('controlPanel', function(GraphStore) {
    return {
      restrict: 'E',
      templateUrl: 'app/panel/panel.html',
      controller: function($scope) {

        $scope.addNode = function(name) {
          GraphStore.sigma.graph.addNode(new GraphStore.Node(name));
          refreshGraph();
        };

        $scope.addEdge = function(n1, n2, limit) {
          GraphStore.sigma.graph.addEdge(new GraphStore.Edge(n1.id, n2.id, limit));
          refreshGraph();
        };

        $scope.getNode = GraphStore.getNode;
        $scope.getEdge = GraphStore.getEdge;
        $scope.getOppositeEdgeFromId = GraphStore.getOppositeEdgeFromId;


//        $scope.animate = function() {
//          sigma.plugins.animate(
//            GraphStore.sigma,
//            {
//              size: 5,
//              color: '#333333'
//            },
//            {
//              nodes: [$scope.nodesList[0], $scope.nodesList[1]]
//            }
//          );
//        }

        function refreshGraph() {
          GraphStore.sigma.refresh();
          console.log($scope);
          $scope.nodes = GraphStore.sigma.graph.nodes();
          $scope.edges = GraphStore.sigma.graph.edges();
        }

        refreshGraph();
      }
    }
  });
