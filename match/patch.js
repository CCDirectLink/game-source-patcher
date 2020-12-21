class Patch {
    constructor(instructions) {
        this.instructions = instructions;
    }

    on(matchedNodes, traverser) {
        for (const instruction of this.instructions) {
            let code = instruction.code;
            switch (instruction.type) {
                case 'REMOVE': {
                    traverser.removeNode();
                    break;
                }
                case 'REPLACE': {
                    traverser.replaceNode(code[0]);
                    if (code.length > 1) {
                        traverser.insertAfter(code.slice(1));
                    }
                    break;
                }
                case 'INSERT_AFTER': {
                    traverser.insertAfter(code);
                    break;
                }
                case 'INSERT_BEFORE': {
                    traverser.insertBefore(code);
                    break;
                }
            }
        }
    }
}

// https://stackoverflow.com/a/5197219
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Patch;
}