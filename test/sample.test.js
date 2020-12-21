
const EstreePatchTraverser = require("../utils/traverse/patch-traverser.js");
const TestManager = require("../match/test-manager.js");
const Test = require('../match/test.js');
const acorn = require('../lib/acorn/acorn.js');
const escodegen = require('escodegen');
const VariableScopeBinder = require('../variable-scope-binder.js');
const Rename = require('../match/rename.js');

test('Traverse basic tree with no errors', () => {
    const testManager = new TestManager();
    const ast = acorn.parse('var a = 2;');
    const traverser = new EstreePatchTraverser({
        enter: function (node, state) {
            testManager.onEnter(node, state, traverser);
        }
    });

    traverser.traverse(ast);
});

test('Do not explore past max depth', () => {
    const testManager = new TestManager();
    const test = new Test(new Rename([{
        name: "owo"
    }]));
    test.addCase({
        depth: 3,
        "ast-subtree": {
            type: "Identifier",
            name: "a"
        }
    });
    testManager.addTest(test);
    const ast = acorn.parse('var a = function() { var b = 3;}');
    
    VariableScopeBinder.buildBindings(ast);

    let maxDepth = 0;
    const traverser = new EstreePatchTraverser({
        enter: function (node, state) {
            if (state.depth > maxDepth) {
                maxDepth = state.depth;
            }
            testManager.onEnter(node, state, traverser);
        }
    });
    traverser.traverse(ast);

    expect(maxDepth).toBe(3);

});

test('Ability to rename variable a to owo', () => {
    const testManager = new TestManager();
    const test = new Test(new Rename([{
        name: "owo"
    }]));
    test.addCase({
        depth: 3,
        "ast-subtree": {
            type: "Identifier",
            name: "a"
        }
    });

    testManager.addTest(test);
    const ast = acorn.parse('var a;');
    
    VariableScopeBinder.buildBindings(ast);

    const traverser = new EstreePatchTraverser({
        enter: function (node, state) {
            testManager.onEnter(node, state, traverser);
        }
    });
    traverser.traverse(ast);
    expect(escodegen.generate(ast)).toBe('var owo;');
});