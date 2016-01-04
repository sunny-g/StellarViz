angular.module('app.panel', ['app.graph', 'ui.slider'])
  .directive('controlPanel', function(GraphStore) {
    return {
      restrict: 'E',
      templateUrl: 'app/panel/panel.html',
      controller: function($scope, $timeout) {
        $scope.nodes = GraphStore.getNodes();
        $scope.edges = GraphStore.getEdges();
        $scope.nameToAdd = ''
        $scope.selectedEdge;
        $scope.showSlider;
        $scope.sliderValue;
        $scope.sliderCeiling = 1;
        $scope.sliderFloor = -1;

        $scope.addNode = function(name) {
          GraphStore.addNode(name);
          $scope.nameToAdd = '';
          refreshGraph();
        };

        $scope.giftWhuffie = function(n1, n2, giftOrNix) {
          GraphStore.giftWhuffie(n1, n2, giftOrNix);
          delete $scope.limit;
          refreshGraph();
        };

        $scope.spendWhuffie = function(n1, n2, amount) {
          GraphStore.spendWhuffie(n1, n2, amount);
          delete $scope.spendAmount;
          refreshGraph();
        };

        $scope.deleteEdge = function(edge) {};

        /********** watchers **********/
        $scope.$watch('sliderValue', function(sliderValue) {
          if (!sliderValue) {
            return;
          }

          var edge = GraphStore.getEdge($scope.selectedEdge.id);
          var oppEdge = GraphStore.getOppositeEdge(edge.id);

          if (!edge ||
            !oppEdge ||
            !Object.prototype.hasOwnProperty.call(edge, 'limit') ||
            !Object.prototype.hasOwnProperty.call(oppEdge, 'limit')) {
            return;
          }

          sliderValue = parseFloat(sliderValue);
          edge.balance = oppEdge.limit - sliderValue;
          oppEdge.balance = edge.limit + sliderValue;
          refreshGraph();
        });

        $scope.$watch('selectedEdge', function(edge) {
          if (!edge) { return; }
          $scope.sourceNode = GraphStore.getNode(edge.source);
          $scope.targetNode = GraphStore.getNode(edge.target);
          $scope.oppositeOfSelectedEdge = GraphStore.getOppositeEdge(edge.id) || {};
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
        function refreshGraph() {
          GraphStore.refreshGraph();
          $scope.nodes = GraphStore.getNodes();
          $scope.edges = GraphStore.getEdges();
        }

        refreshGraph();
      }
    }
  });
