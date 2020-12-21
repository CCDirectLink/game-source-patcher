class TestCase {
    constructor(code, depth) {
        this.code = code;
        this.depth = depth;
        this.ignore = true;
    }
}


// https://stackoverflow.com/a/5197219
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TestCase;
}
