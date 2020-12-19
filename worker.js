importScripts(
    './lib/acorn/acorn.js',
    './lib/escodegen/escodegen.browser.js',

    './utils/scope.js',

    ...
    [
        'compare',
        'patch'
    ].map(e => `./utils/traverse/${e}-traverser.js`),

    ...[
        'test-manager',
        'test',
        'test-case'
    ].map(e => `./test/${e}.js`)
)


const testManager = new TestManager;


self.onmessage = (msg) => {
    const data = msg.data;
    const response = {};
    const traverser = new EstreePatchTraverser({
        enter: function (node, state) {
            debugger;
            testManager.onEnter(node, state, traverser);
        }
    });

    for (const moduleName in data) {
        const module = data[moduleName];
        const ast = acorn.parse(module.code);
        if (module.rename) {
            testManager.reset();
            testManager.load('rename', module.rename);
            traverser.
        }

        if (module.patch) {

        }
    }
};
