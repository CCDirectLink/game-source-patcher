class Test {
    constructor(type, instructions) {
        this.type = type;
        this.instructions = instructions;
        this.caseIndex = 0;
        this.cases = [];
        this.maxDepth = 0;
        this.compareObject = null;
    }

    addCompareObject(compare) {
        this.compareObject = compare;
    }

    addCase(caseData) {

        this.cases.push(new TestCase(caseData.code, caseData.settings));

        if (this.cases.length === 1) {
            this.cases[0].ignore = false;
        }
    }

    getCases() {
        return this.cases;
    }

    isFinished() {
        return this.caseIndex === this.cases.length;
    }

    onEnter(node, state) {
        const depth = state.depth;
        const currentCase = this.cases[this.caseIndex];
        if (currentCase.depth === depth) {
            if (this.compareObject.compare(node, currentCase.code)) {
                if (this.caseIndex + 1 < this.cases.length) {
                    currentCase.ignore = true;
                    this.caseIndex++;
                    this.cases[this.caseIndex].ignore = false;
                    this.maxDepth = this.cases[this.caseIndex].depth;
                } else {
                    return true;
                }
            }
        }
        return false;
    }

    onComplete(node, state, traverser) {
        // todo on complete
        if (this.type === 'patch') {
            for (const instruction of this.instructions) {
                let code = instruction.code;
                if (typeof code === 'string') {
                    code = acorn.parse(code).body;
                }

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

        } else if (this.type === 'rename') {
            for (const { path, name } of this.instructions) {
                let parent = node;
                let failed = false;
                for (const part of path.split('.')) {
                    parent = parent[part];
                    if (!parent) {
                        failed = true;
                        break;
                    }
                }

                if (!failed) {
                    parent.bindings.rename(name);
                }
            }
        }
    }
}
