angular.module('app.table', [])
  // .filter('', function() {
    // return function(optionList) {};
  // })
  .directive('edgeTable', function(GraphStore) {
    return {
      restrict: 'E',
      templateUrl: 'app/graph/table.html',
      controller: function($scope) {
        $scope.maxLimit = function(edge) {
          return edge.limit + GraphStore.getOppositeEdge(edge.id).limit;
        };
        $scope.$watch(
          function() {
            return $scope.edges;
          }, function() {}
        );
      }
    }
  });
