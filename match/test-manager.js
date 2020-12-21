


// https://stackoverflow.com/a/34550964
if (typeof module !== 'undefined' && module.exports) {
    global.EstreeCompare = require('../utils/traverse/compare-traverser.js');
}



class TestManager {
    constructor() {
        this.depths = [];
        this.tests = [];
        this.maxDepth = 0;
        this.estreeCompare = new EstreeCompare();
    }

    reset() {
        this.depths = [];
        this.tests = [];
        this.maxDepth = 0;
    }

    addTestAtDepth(depth, test) {
        if (this.depths.length < depth) {
            let insertAmount = depth - this.depths.length + 1;
            while (insertAmount > 0) {
                this.depths.push([]);
                insertAmount--;
            }
        }
        this.depths[depth].push(test);
    }

    removeTestAtDepth(depth, test) {
        const testSet = this.depths[depth];
        const index = testSet.indexOf(test);

        if (index > -1) {
            testSet.splice(index, 1);
        }
    }

    addTest(test) {
        if (this.tests.indexOf(test) === -1) {
            this.tests.push(test);

            test.addCompareObject(this.estreeCompare);

            for (const testCase of test.getCases()) {
                this.addTestAtDepth(testCase.depth, test);
            }
            this.maxDepth = Math.max(test.maxDepth, this.maxDepth);
        }
    }

    recalculateMaxDepth() {
        this.maxDepth = 0;
        for (const test of this.tests) {
            this.maxDepth = Math.max(test.maxDepth, this.maxDepth);
        }
    }


    removeTest(test) {
        for (const testCase of test.getCases()) {
            this.removeTestAtDepth(testCase.depth, test);
        }
    }

    onEnter(node, state, traverser) {
        const depth = state.depth;
        if (this.maxDepth <= depth) {
            state.skip = true;
        }

        if (this.depths[depth] && this.depths[depth].length > 0) {
            const tests = this.depths[depth];
            for (let index = 0; index < tests.length; ++index) {
                const test = tests[index];
                if (test.onEnter(node, state)) {
                    if (test.isFinished()) {
                        this.removeTest(test);
                        test.onComplete(traverser);
                        index--;
                    }

                    this.recalculateMaxDepth();
                }
            }
        }
    }
}

// https://stackoverflow.com/a/5197219
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TestManager;
}