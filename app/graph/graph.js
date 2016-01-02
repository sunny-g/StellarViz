angular.module('app.graph', [])
  .factory('GraphStore', function() {

    /*
    CONFIG
     */
    sigma.classes.graph.addMethod('getNeighborIndex', function(nodeId) {
      return this.allNeighborsIndex[nodeId];
    });

    sigma.classes.graph.addMethod('setNodeBalance', function(node) {
      /*
        neighborIndex = {
          "na": {   // node.id
            "nb": {    // connectedNodeName
              "na|nb": Edge,
              "nb|na": Edge
            }
          }
        }
       */
      var balance = 0;
      var neighborIndex = this.allNeighborsIndex[node.id];
      // can be simplified using reduce et al
      for (var connectedNodeName in neighborIndex) {
        var edgeList = neighborIndex[connectedNodeName];
        for (var edgeId in edgeList) {
          var edge = edgeList[edgeId];
          if (edge.source === node.id) {
            balance += edge.balance;
          }
        }
      }
      node.totalBalance = balance || 0;
    });

    sigma.renderers.def = sigma.renderers.canvas;

    var s = new sigma({
      container: 'graphContainer',
      settings: {
        defaultNodeColor: '#666',
        edgeColor: 'source',
        edgeLabelSize: 'proportional',
        minEdgeSize: 10,
        arrowSizeRatio: 10,
        minArrowSize: 10
      }
    });

    sigma.plugins.dragNodes(s, s.renderers[0]);

    var Node = function(name) {
      this.label = name;
      this.id = this.getNodeIdByLabel(name);// + this.generateId();
      this.x = Math.random();
      this.y = Math.random();
      this.size = 2;
      this.totalBalance = 0;
    };

    Node.prototype.generateId = function() {
      return Math.ceil(Math.random() * 100);
    };

    Node.prototype.getNodeIdByLabel = function(label) {
      return 'n' + label;
    };

    Node.prototype.getNodeByLabel = function(label) {
      return s.graph.nodes(Node.prototype.getNodeIdByLabel(label));
    };

    var Edge = function(node1Id, node2Id, limit) {
      var node1 = s.graph.nodes(node1Id);
      this.source = this.sourceId = node1Id;
      this.sourceLabel = node1.label
      var node2 = s.graph.nodes(node2Id);
      this.target = this.targetId = node2Id;
      this.targetLabel = node2.label

      this.limit = limit;
      this.id = this.generateId(node1Id, node2Id);
      this.type = 'arrow';
      this.label = this.sourceLabel + ' -> ' + this.targetLabel;
      // this.size = limit;
      this.balance = 0;   // from perspective of edge.source
    };

    Edge.prototype.generateId = function(node1Id, node2Id) {
      return node1Id + '|' + node2Id;
    };

    Edge.prototype.nodeIdsFromEdgeId = function(edgeId) {
      return edgeId.split('|');
    };

    function getNode(nodeId) {
      if (nodeId) { return s.graph.nodes(nodeId); }
    }

    function getEdge(edgeId) {
      if (edgeId) { return s.graph.edges(edgeId); }
    }

    function getOppositeEdge(edgeId) {
      if (edgeId) {
        var nodeIds = edgeId.split('|');
        return s.graph.edges(Edge.prototype.generateId(nodeIds[1], nodeIds[0]));
      }
    }

    /************************************/
    /*          initialization          */
    /************************************/
    var alpha = ['alex', 'beth', 'miguel'];
    // create two nodes
    for (var i = 0; i < 3; i++) {
      s.graph.addNode(new Node(alpha[i]));
    }

    s.bind('dragNode', function(e) {
      console.log(e.data.node);
    });

    // Finally, let's ask our sigma instance to refresh:
    s.refresh();

    return {
      sigma: s,
      Node: Node,
      Edge: Edge,
      getNode: getNode,
      getEdge: getEdge,
      getNodes: s.graph.nodes,
      getEdges: s.graph.edges,
      getOppositeEdge: getOppositeEdge,
      setNodeBalance: s.graph.setNodeBalance,
      getNeighborIndex: s.graph.getNeighborIndex
    };
  });
