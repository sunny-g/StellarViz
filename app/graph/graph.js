angular.module('app.graph', [])
  .factory('GraphStore', function() {

    /*
    CONFIG
     */
    sigma.renderers.def = sigma.renderers.canvas;

    var s = new sigma({
      container: 'graphContainer',
      settings: {
        defaultEdgeColor: 'grey',
        edgeLabelSize: 'proportional'
      }
    });

    sigma.plugins.dragNodes(s, s.renderers[0]);

    var Node = function(name) {
      this.label = name;
      this.id = 'n' + name;// + this.generateId();
      this.x = Math.random();
      this.y = Math.random();
      this.size = 2;
      this.balance = 0;
    };

    Node.prototype.generateId = function() {
      return Math.ceil(Math.random() * 100);
    };

    var Edge = function(node1Id, node2Id, limit) {
      this.source = node1Id;
      this.target = node2Id;
      this.limit = limit;
      this.id = this.source + '|' + this.target;
      this.type = 'arrow';
      this.label = s.graph.nodes(node1Id).label +
        '>' + s.graph.nodes(node2Id).label;
      // this.size = limit;
    };

    var getNode = function(nodeId) {
      if (nodeId) { return s.graph.nodes(nodeId); }
    };

    var getEdge = function(edgeId) {
      if (edgeId) { return s.graph.edges(edgeId); }
    };

    var getOppositeEdgeFromId = function(edgeId) {
      if (edgeId) {
        edgeId = edgeId.split('|');
        return s.graph.edges(edgeId[1] + '|' + edgeId[0]);
      }
    };

    return {
      Node: Node,
      Edge: Edge,
      sigma: s,
      getNode: getNode,
      getEdge: getEdge,
      getOppositeEdgeFromId: getOppositeEdgeFromId
    }
  })
  .controller('GraphCtrl', function($scope, GraphStore) {
    $scope.sigma = GraphStore.sigma;

    // create some nodes
    var alpha = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k'];
    for (var i = 0; i < 2; i++) {
      GraphStore.sigma.graph.addNode(new GraphStore.Node(alpha[i]));
      GraphStore.sigma.refresh();
    }

    GraphStore.sigma.bind('dragNode', function(e) {
      console.log(e.data.node);
    });

    // Finally, let's ask our sigma instance to refresh:
    $scope.sigma.refresh();
  });