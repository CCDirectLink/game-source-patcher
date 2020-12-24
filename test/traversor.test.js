const TestManager = require("../match/test-manager.js");
const Test = require('../match/test.js');
const acorn = require('../lib/acorn/acorn.js');
const escodegen = require('escodegen');
const VariableScopeBinder = require('../variable-scope-binder.js');

test('Traverse basic tree with no errors', () => {
    const testManager = new TestManager();
    const ast = acorn.parse('var a = 2;');
    testManager.execute(ast);
});

test('Do not explore past max depth', () => {
    const testManager = new TestManager();
    const test = Test.create({
        name: "Rename test",
        tests: [{
            depth: 3,
            "ast-subtree": {
                type: "Identifier",
                name: "a"
            }
        }],
        renames : [{
            name: "owo"
        }]
    });

    testManager.addTest(test);
    
    expect(testManager.maxDepth).toBe(3);

});

test('Ability to rename variable a to owo', () => {
    const testManager = new TestManager();

    const test = Test.create({
        name: "Rename test",
        tests: [{
            depth: 3,
            "ast-subtree": {
                type: "Identifier",
                name: "a"
            }
        }],
        renames : [{
            name: "owo"
        }]
    });

    testManager.addTest(test);
    const ast = acorn.parse('var a;');
    
    VariableScopeBinder.buildBindings(ast);

    testManager.execute(ast);

    expect(escodegen.generate(ast)).toBe('var owo;');
});


test('Repeatedly declared variables inside a scope are renamed to the same thing', () => {
    const testManager = new TestManager();

    const test1 = Test.create({
        name: "Rename test",
        tests: [{
            depth: 2,
            "ast-subtree": {
                type: "Identifier",
                name: "a"
            }
        }],
        renames : [{
            name: "param1"
        }]
    });

    testManager.addTest(test1);
    const code = `
    function test(a) {
        var a = true ? a : 1;
    }
    `.trim();
    const ast = acorn.parse(code);
    
    VariableScopeBinder.buildBindings(ast);

    testManager.execute(ast);

    
    const modifiedCode = [
        'function test(param1) {',
        '    var param1 = true ? param1 : 1;',
        '}'
    ].join('\n');
    expect(escodegen.generate(ast)).toBe(modifiedCode);
});