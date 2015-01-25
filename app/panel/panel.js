angular.module('app.panel', ['app.graph'])
  .directive('controlPanel', function(GraphStore) {
    return {
      restrict: 'E',
      templateUrl: 'app/panel/panel.html',
      controller: function($scope) {
        refreshGraph();

        $scope.addNode = function(name) {
          GraphStore.sigma.graph.addNode(new GraphStore.Node(name));
          refreshGraph();
        };

        $scope.addEdge = function(n1, n2, limit) {
          var n1Id = n1.id;
          var n2Id = n2.id;
          GraphStore.sigma.graph.addEdge(new GraphStore.Edge(n1Id, n2Id, limit));
          refreshGraph();
        };

        $scope.currentEdge = function(edge) {
          console.log(edge);
        };

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
      }
    }
  });
