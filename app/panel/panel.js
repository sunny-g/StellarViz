angular.module('app.panel', ['app.graph', 'ui.slider'])
  .directive('controlPanel', function(GraphStore) {
    return {
      restrict: 'E',
      templateUrl: 'app/panel/panel.html',
      controller: function($scope, $timeout) {

        var Node = $scope.Node = GraphStore.Node;
        var Edge = $scope.Edge = GraphStore.Edge;
        var sigma = $scope.sigma = GraphStore.sigma;

        $scope.getNode = GraphStore.getNode;
        $scope.getEdge = GraphStore.getEdge;
        $scope.getOppositeEdge = GraphStore.getOppositeEdge;
        $scope.getNodes = GraphStore.getNodes;
        $scope.getEdges = GraphStore.getEdges;
        $scope.setNodeBalance = GraphStore.setNodeBalance;
        $scope.getNeighborIndex = GraphStore.getNeighborIndex;

        $scope.selectedEdge;
        $scope.showSlider;
        $scope.sliderValue;
        $scope.sliderCeiling = 1;
        $scope.sliderFloor = -1;

        $scope.addNode = function(name) {
          sigma.graph.addNode(new Node(name));
          delete $scope.nodeName;
          refreshGraph();
        };

        $scope.giftWhuffie = function(n1, n2, limit) {
          // TODO: throw error is NaN
          limit = parseFloat(limit);
          var edgeId = Edge.prototype.generateId(n1.id, n2.id);
          var oppEdgeId = Edge.prototype.generateId(n2.id, n1.id);

          var edge = $scope.getEdge(edgeId);

          if (!edge) {
            sigma.graph.addEdge(new Edge(n1.id, n2.id, limit));
          } else {
            edge.limit += limit;
          }

          if (!$scope.getEdge(oppEdgeId)) {
            sigma.graph.addEdge(new Edge(n2.id, n1.id, 0));
          }
          var oppEdge = $scope.getEdge(oppEdgeId);
          oppEdge.balance += limit;

          delete $scope.node1;
          delete $scope.node2;
          delete $scope.limit;
          refreshGraph();
          // console.log($scope);
        };

        $scope.deleteEdge = function(edge) {};


        /********** sliderValue watchers **********
          on sliderChange, it needs to:
            update source node balance (whats the calculation?)
            update target node balance (whats the calculation?)
         */
        $scope.$watch('sliderValue', function(sliderValue) {
          if (!sliderValue) {
            return;
          }
          changeEdgeBalances(
            $scope.getEdge($scope.selectedEdge.id), 
            $scope.getEdge($scope.oppositeOfSelectedEdge.id),
            sliderValue
          );
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

        /*
          $scope.animate = function() {
            sigma.plugins.animate(
              sigma,
              {
                size: 5,
                color: '#333333'
              }, {
                nodes: [$scope.nodesList[0], $scope.nodesList[1]]
              }
            );
          };
         */

        /************ helper functions ************/
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

        function refreshGraph() {
          updateAllNodeTotalBalances();

          sigma.refresh();
          $scope.nodes = $scope.getNodes();
          $scope.edges = $scope.getEdges();
        }

        refreshGraph();
      }
    }
  });
