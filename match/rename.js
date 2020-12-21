class Rename {
    constructor(instructions) {
        this.instructions = instructions;
    }

    on(matchedNodes, traverser) {
        const node = matchedNodes.slice(-1)[0];
        for (const { path, name, matchedNodeRef} of this.instructions) {
            let parent;
            if (matchedNodeRef == undefined) {
                parent = node;
            } else {
                parent = matchedNodes[matchedNodeRef];
            }
            let failed = false;
            if (path && path.trim()) {
                for (const part of path.split('.')) {
                    parent = parent[part];
                    if (!parent) {
                        failed = true;
                        break;
                    }
                }
            }


            if (!failed) {
                parent.bindings.rename(name);
            }
        }
    }
}

// https://stackoverflow.com/a/5197219
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Rename;
}