angular.module('app.graph', [])
  .factory('GraphStore', function() {

    /*
    CONFIG
     */
    sigma.classes.graph.addMethod('getNeighborIndex', function(nodeId) {
      return this.allNeighborsIndex[nodeId];
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

    /************************
     * Node-related functions
     */
    var Node = function(name) {
      this.label = name;
      this.id = generateNodeId(this);
      this.x = Math.random();
      this.y = Math.random();
      this.size = 2;
      this.totalBalance = 0;
    };

    function generateNodeId(node) {
      // return Math.ceil(Math.random() * 100);
      return 'n' + node.label;
    }

    function addNode(name) {
      return s.graph.addNode(new Node(name));
    }

    function getNode(nodeId) {
      if (nodeId) { return s.graph.nodes(nodeId); }
    }

    function updateNodeTotalBalance(node) {
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
      var neighborIndex = s.graph.getNeighborIndex(node.id);
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
      return node.totalBalance;
    }

    function updateAllNodeTotalBalances() {
      var nodes = s.graph.nodes();
      var edges = s.graph.edges();
      if (!nodes || !edges || nodes.length === 0 || edges.length === 0) {
        return;
      }
      nodes.forEach(updateNodeTotalBalance);
    }

    /************************
     * Edge-related functions
     */
    var Edge = function(n1, n2, limit) {
      this.id = generateEdgeId(n1, n2);
      this.source = this.sourceId = n1.id;
      this.sourceLabel = n1.label
      this.target = this.targetId = n2.id;
      this.targetLabel = n2.label

      this.limit = limit;
      this.type = 'arrow';
      this.label = this.sourceLabel + ' -> ' + this.targetLabel;
      // this.size = limit;
      this.balance = 0;   // from perspective of source
    };
    
    function generateEdgeId(n1, n2) {
      return n1.id + '|' + n2.id;
    }

    function getNodeIdsFromEdgeId(edgeId) {
      return edgeId.split('|');
    }

    function getEdgeFromNodes(n1, n2) {
      return getEdge(generateEdgeId(n1, n2));
    }

    function addEdge(n1, n2, limit) {
      return s.graph.addEdge(new Edge(n1, n2, limit));
    }

    function getEdge(edgeId) {
      if (edgeId) { return s.graph.edges(edgeId); }
    }

    function getOppositeEdge(edgeId) {
      var nodeIds = edgeId.split('|');
      return getEdge(generateEdgeId(getNode(nodeIds[1]), getNode(nodeIds[0])));
    }

    /**
     * changes edge balances based on some objective amount, based on slider value
     */
    function changeEdgeBalances(edge, amount) {
      var oppEdge = getOppositeEdge(edge.id);
      if (!edge ||
        !oppEdge ||
        !Object.prototype.hasOwnProperty.call(edge, 'limit') ||
        !Object.prototype.hasOwnProperty.call(oppEdge, 'limit')) {
        return;
      }
      amount = parseFloat(amount);
      edge.balance = oppEdge.limit - amount;
      oppEdge.balance = edge.limit + amount;
      refreshGraph();
    }

    function giftWhuffie(n1, n2, giftOrNix) {
      giftOrNix = parseFloat(giftOrNix);
      var edgeId = generateEdgeId(n1, n2);
      var oppEdgeId = generateEdgeId(n2, n1);

      var edge = getEdge(edgeId);

      if (!edge) {
        addEdge(n1, n2, giftOrNix);
        addEdge(n2, n1, 0);
      } else {
        // increases this edge's limit by limit
        edge.limit += giftOrNix;
      }
      
      var oppEdge = getEdge(oppEdgeId);
      // increase opposite edge's balance by limit
      oppEdge.balance += giftOrNix;
      refreshGraph();
    }

    function spendWhuffie(n1, n2, amount) {
      return _directSpendWhuffie(n1, n2, amount);

      function _directSpendWhuffie(n1, n2, amount) {
        amount = parseFloat(amount);
        var edge = getEdgeFromNodes(n1, n2);
        var oppEdge = getEdgeFromNodes(n2, n1);

        if (amount < 0 ||
          edge.balance < amount ||
          oppEdge.balance + amount > oppEdge.limit) {
          return null;
        }
        
        edge.balance -= amount;
        oppEdge.balance += amount;
        refreshGraph();
        return true;
      }
    }

    function refreshGraph() {
      updateAllNodeTotalBalances();
      s.refresh();
    }

    /************************************/
    /*          initialization          */
    /************************************/
    var names = ['alex', 'beth', 'miguel'];
    // create two nodes
    for (var i = 0; i < 3; i++) {
      addNode(names[i]);
    }

    s.bind('dragNode', function(e) {
      console.log(e.data.node);
    });

    // Finally, let's ask our sigma instance to refresh:
    refreshGraph();

    return {
      refreshGraph: refreshGraph,
      addNode: addNode,
      addEdge: addEdge,
      getNode: getNode,
      getEdge: getEdge,
      getNodes: s.graph.nodes,
      getEdges: s.graph.edges,
      getOppositeEdge: getOppositeEdge,
      getEdgeFromNodes: getEdgeFromNodes,
      generateEdgeId: generateEdgeId,
      giftWhuffie: giftWhuffie,
      spendWhuffie: spendWhuffie
    };
  });
