// https://stackoverflow.com/a/5197219
if (typeof module !== 'undefined' && module.exports) {
    global.Rename = require("./rename.js");
    global.Patch = require("./patch.js");
}

class Test {
    constructor(patchObject) {
        this.patchObject = patchObject;
        this.caseIndex = 0;
        this.cases = [];
        this.nodeMatches = [];
        this.maxDepth = 0;
        this.compareObject = null;
    }

    static create(testData) {
        let patchObject;
        if (testData.renames) {
            patchObject = new Rename(testData.renames);

        } else if (testData.patches) {
            patchObject = new Patch(testData.patches);
        }
        const instance = new Test(patchObject);

        for (const testCase of testData.tests) {
            instance.addCase(testCase);
        }
        return instance;
    }

    addCompareObject(compare) {
        this.compareObject = compare;
    }

    addCase(aCase) {

        this.maxDepth = Math.max(this.maxDepth, aCase.depth || 0);

        this.cases.push(aCase);

        aCase.ignore = this.cases.length !== 1;
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
            if (this.compareObject.compare(node, currentCase["ast-subtree"])) {
                this.nodeMatches.push(node);
                if (this.caseIndex + 1 < this.cases.length) {
                    currentCase.ignore = true;
                    this.caseIndex++;
                    this.cases[this.caseIndex].ignore = false;
                    this.maxDepth = this.cases[this.caseIndex].depth;
                } else {
                    this.caseIndex++;
                    return true;
                }
            }
        }
        return false;
    }

    onComplete(traverser) {
        if (this.patchObject) {
            this.patchObject.on(this.nodeMatches, traverser);
        } else {
            console.log('Matched!');
        }
    }
}


// https://stackoverflow.com/a/5197219
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Test;
}