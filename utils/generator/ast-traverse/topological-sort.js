function TopologicalSortHelper(node, nodes, visited, stack) {
    if (!visited[getName(node)]) {
        visited[getName(node)] = true;
        const nodeIndex = nodes.indexOf(node);
        nodes.splice(nodeIndex, 1);

        if (node.parents) {
            for (const parent of node.parents) {
                TopologicalSortHelper(parent, nodes, visited, stack);
            }
        }
        stack.push(node);
    }

}

function getName(node) {
    return node.name;
}

class DependencyGraph {
    constructor() {
        this.nodes = [];
        this.names = {};
    }

    addNode(node, name) {
        this.nodes.push(node);

        this.names[name] = node;
    }

    sort() {
        const visited = {};
        const stack = [];
        const unvisitedNodes = this.nodes.slice(0);

        while (unvisitedNodes.length > 0) {
            TopologicalSortHelper(unvisitedNodes[0], unvisitedNodes, visited, stack);
        }

        this.nodes.splice(0);
        this.nodes.push(...stack);
    }

    getNodes() {
        return this.nodes;
    }

    reset() {
        this.names = {};
        this.nodes.splice(0).map(e => e.reset());
    }

    hasNode(name) {
        for (const node of this.nodes) {
            if (node.name === name) {
                return true;
            }
        }
        return false;
    }
}