angular.module('app.graph', [])
  .factory('GraphStore', function() {

    /*
    CONFIG
     */
    sigma.classes.graph.addMethod('logNeighbors', function() {
      return this.allNeighborsIndex['na'];
    });

    sigma.classes.graph.addMethod('getNodeBalance', function(nodeId) {
      /*
      neighborIndex = {
        nodeName: {
          connectedNodeName: {
            edge1: Edge,
            edge2: Edge
          }
        }
      }
       */
      var balance = 0;
      _.forIn(this.allNeighborsIndex[nodeId], function(edgeList) {
        balance += _.reduce(edgeList, function(prev, currentEdge) {
          if (currentEdge.source === nodeId) {
            console.log(prev, currentEdge.balance);
            return currentEdge.balance;
          }
        }, 0);
      });
      return balance;
    });

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
      this.totalBalance = 0;
    };

    Node.prototype.generateId = function() {
      return Math.ceil(Math.random() * 100);
    };

    var Edge = function(node1Id, node2Id, limit) {
      this.source = node1Id;
      this.target = node2Id;
      this.limit = limit;
      this.id = this.generateId(node1Id, node2Id);
      this.type = 'arrow';
      this.label = s.graph.nodes(node1Id).label +
        '>' + s.graph.nodes(node2Id).label;
      // this.size = limit;
      this.balance = 0;   // from perspective of edge.source
    };

    Edge.prototype.generateId = function(node1Id, node2Id) {
      return node1Id + '|' + node2Id;
    };

    var getNode = function(nodeId) {
      if (nodeId) { return s.graph.nodes(nodeId); }
    };

    var getEdge = function(edgeId) {
      if (edgeId) { return s.graph.edges(edgeId); }
    };

    var getOppositeEdge = function(edgeId) {
      if (edgeId) {
        var nodeIds = edgeId.split('|');
        return s.graph.edges(Edge.prototype.generateId(nodeIds[1], nodeIds[0]));
      }
    };

    return {
      Node: Node,
      Edge: Edge,
      sigma: s,
      getNode: getNode,
      getEdge: getEdge,
      getOppositeEdge: getOppositeEdge
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