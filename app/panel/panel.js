angular.module('app.panel', ['app.graph', 'ui.slider'])
  .directive('controlPanel', function(GraphStore) {
    return {
      restrict: 'E',
      templateUrl: 'app/panel/panel.html',
      controller: function($scope, $timeout) {

        var Node = GraphStore.Node;
        var Edge = GraphStore.Edge;
        $scope.getNode = GraphStore.getNode;
        $scope.getNodes = GraphStore.sigma.graph.nodes;
        $scope.getEdge = GraphStore.getEdge;
        $scope.getEdges = GraphStore.sigma.graph.edges;
        $scope.getOppositeEdge = GraphStore.getOppositeEdge;
        $scope.setNodeBalance = GraphStore.sigma.graph.setNodeBalance;
        $scope.getNeighborIndex = GraphStore.sigma.graph.getNeighborIndex;

        $scope.selectedEdge;
        $scope.showSlider;
        $scope.sliderValue;
        $scope.sliderCeiling = 1;
        $scope.sliderFloor = -1;

        function refreshGraph() {
          updateAllNodeTotalBalances();

          GraphStore.sigma.refresh();
          $scope.nodes = $scope.getNodes();
          $scope.edges = $scope.getEdges();
        }

        $scope.addNode = function(name) {
          GraphStore.sigma.graph.addNode(new Node(name));
          delete $scope.nodeName;
          refreshGraph();
        };

        $scope.addEdge = function(n1, n2, limit) {
          limit = parseFloat(limit);
          var edgeId = Edge.prototype.generateId(n1.id, n2.id);
          var oppEdgeId = Edge.prototype.generateId(n2.id, n1.id);

          var edge = $scope.getEdge(edgeId);

          if (!edge) {
            GraphStore.sigma.graph.addEdge(new GraphStore.Edge(n1.id, n2.id, limit));
          } else {
            edge.limit += limit;
          }

          if (!$scope.getEdge(oppEdgeId)) {
            GraphStore.sigma.graph.addEdge(new GraphStore.Edge(n2.id, n1.id, 0));
          }
          var oppEdge = $scope.getEdge(oppEdgeId);
          oppEdge.balance += limit;

          delete $scope.node1;
          delete $scope.node2;
          delete $scope.limit;
          refreshGraph();
          // console.log($scope);
        };

        $scope.deleteEdge = function(edge) {

        };

        function changeEdgeBalances(edge1, edge2, sliderValue) {
          if (!edge1 ||
              !edge2 ||
            !Object.prototype.hasOwnProperty.call(edge1, 'limit') ||
            !Object.prototype.hasOwnProperty.call(edge2, 'limit')) {
            return;
          }
          sliderValue = parseFloat(sliderValue);
          edge1.balance = edge2.limit - sliderValue;
          edge2.balance = edge1.limit + sliderValue;
        }

        function updateAllNodeTotalBalances() {
          var nodes = $scope.getNodes();
          var edges = $scope.getEdges();
          if (!nodes || !edges || nodes.length === 0 || edges.length === 0) {
            return;
          }
          nodes.forEach($scope.setNodeBalance);
        }

        /*
        ** sliderValue watcher **
          on sliderChange, it needs to:
            update source node balance (whats the calculation?)
            update target node balance (whats the calculation?)
         */
        $scope.$watch('sliderValue', function(sliderValue) {
          if (!sliderValue) {
            return;
          }
          changeEdgeBalances($scope.getEdge($scope.selectedEdge.id), $scope.getEdge($scope.oppositeOfSelectedEdge.id), sliderValue);
          refreshGraph();
        });

        $scope.$watch('selectedEdge', function(edge) {
          if (!edge) { return; }
          $scope.sourceNode = $scope.getNode(edge.source);
          $scope.targetNode = $scope.getNode(edge.target);
          $scope.oppositeOfSelectedEdge = $scope.getOppositeEdge(edge.id) || {};
          $scope.sliderCeiling = $scope.oppositeOfSelectedEdge ?
            $scope.oppositeOfSelectedEdge.limit : 0;
          $scope.sliderFloor = -edge.limit;

          if ($scope.showSlider) {
            // slider has already been shown, so just update the sliderValue
            $scope.sliderValue = $scope.sliderCeiling - edge.balance;
          } else {
            // showing slider for the first time, set sliderValue in timeout
            $scope.showSlider = true;
            $timeout(function () {
              $scope.sliderValue = $scope.sliderCeiling - edge.balance;
            });
          }
        });

        $scope.$watch('oppositeOfSelectedEdge.limit', function(edgeLimit) {
          // necessary in case the active edgePair is being udpated
          $scope.sliderCeiling = edgeLimit;
        });

        $scope.$watch('selectedEdge.limit', function(edgeLimit) {
          // necessary in case the active edgePair is being udpated
          $scope.sliderFloor = -edgeLimit;
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
