angular.module('app.panel', ['app.graph', 'ui.slider'])
  .directive('controlPanel', function(GraphStore) {
    return {
      restrict: 'E',
      templateUrl: 'app/panel/panel.html',
      controller: function($scope) {

        $scope.sliderValue = '0';
        $scope.getNode = GraphStore.getNode;
        $scope.getEdge = GraphStore.getEdge;
        $scope.getOppositeEdgeFromId = GraphStore.getOppositeEdgeFromId;

        function refreshGraph() {
          GraphStore.sigma.refresh();
          console.log($scope);
          $scope.nodes = GraphStore.sigma.graph.nodes();
          $scope.edges = GraphStore.sigma.graph.edges();
        }

        $scope.addNode = function(name) {
          GraphStore.sigma.graph.addNode(new GraphStore.Node(name));
          delete $scope.nodeName;
          refreshGraph();
        };

        $scope.addEdge = function(n1, n2, limit) {
          // this function extends trust limit and updates node balances
          limit = parseFloat(limit);
          n2.balance += limit;
          var edge = $scope.getEdge(GraphStore.Edge.prototype.generateId(n1.id, n2.id));
          if (edge) {
            edge.limit += limit;
          } else {
            GraphStore.sigma.graph.addEdge(new GraphStore.Edge(n1.id, n2.id, limit));
          }
          delete $scope.node1;
          delete $scope.node2;
          delete $scope.limit;
          refreshGraph();
        };

        $scope.deleteEdge = function(edge) {

        };

        /*
        ** sliderValue watcher **
          on change, it needs to:
            update source node balance (whats the calculation?)
            update target node balance (whats the calculation?)
         */
        $scope.$watch('sliderValue', function(sliderValue) {
          var source = $scope.sourceNode;
          var target = $scope.targetNode;

          refreshGraph();
        });

        $scope.$watch('selectedEdge', function(edge) {
          if (!edge) { return; }
          console.log(edge, $scope);
          $scope.sourceNode = $scope.getNode(edge.source);
          $scope.targetNode = $scope.getNode(edge.target);
        });

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

        refreshGraph();
      }
    }
  });
