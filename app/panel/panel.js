angular.module('app.panel', ['app.graph'])
  .controller('ControlPanelCtrl', function($scope, GraphStore) {

    $scope.addNode = function() {
      GraphStore.sigmaGraph.graph.addNode({
        id: 'n' + GraphStore.generateId(),
        x: Math.random(),
        y: Math.random(),
        size: 2
      });
      GraphStore.sigmaGraph.refresh();
    }

  });