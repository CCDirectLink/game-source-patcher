

// https://stackoverflow.com/a/5197219
if (typeof module !== 'undefined' && module.exports) {
    global.Scope = require('./utils/scope.js');
    global.ES11 = require('./utils/traverse/patch-traverser.js');
}

class VariableScopeBinder {
    static buildBindings(ast) {
        const scopeState = {
            currentScope: null,
            scopes: []
        };
        const es11 = new ES11({
            enter: function(node, state) {
                VariableScopeBinder.onEnter(node, state, scopeState);
            },
            exit: function(node, state) {
                VariableScopeBinder.onExit(node, scopeState);
            }
        });
        es11.traverse(ast);
    }

    static onEnter(node, state, scopeState) {
        switch (node.type) {
            case 'Program':
            case 'ArrowFunctionExpression':
            case 'FunctionDeclaration':
            case 'FunctionExpression': {
                const scopeType = node.type === "Program" ? "Global" : "Function";
                const currentScope = new Scope(scopeType, scopeState.currentScope);
                scopeState.scopes.push(currentScope);
                scopeState.currentScope = currentScope;
                break;
            }
            case 'Identifier': {
                VariableScopeBinder.handleIdentifier(node, state, scopeState);
                break;
            }
        }
    } 

    static handleIdentifier(node, state, scopeState) {
        const currentScope = scopeState.currentScope;
        const parent = state.parents.slice(-1)[0];
        const key = state.keys.slice(-1)[0];
        if (parent.type === 'FunctionDeclaration') {
            VariableScopeBinder.handleFunctionDeclarationId(node, state, scopeState);
        } else if (parent.type === 'FunctionExpression' || parent.type === 'ArrowFunctionExpression') {
            VariableScopeBinder.handleFunctionExpressionId(node, state, scopeState);
        } else if (parent.type === 'AssignmentPattern') {
            VariableScopeBinder.handleAssignmentPatternId(node, state, scopeState);
        } else if (parent.type === 'VariableDeclarator' && key[0] === 'id') {
            node.bindings = currentScope.addVariable(node.name, node);
        } else if (parent.type === 'MemberExpression' && key[0] === 'property' && !parent.computed) {
        } else if (parent.type === 'MemberExpression' && parent.object.name === 'window') {
            node.bindings = scopes[0].addBinding(node.name, node);
        } else if (parent.type.endsWith('Expression')) {
            VariableScopeBinder.handleExpressionId(node, state, scopeState);
        } else {
            // default
            node.bindings = currentScope.addBinding(node.name, node);
        }
    }

    static handleFunctionDeclarationId(node, state, scopeState) {
        const currentScope = scopeState.currentScope;
        if (key[0] === 'id') {
            node.bindings = currentScope.parent.addVariable(node.name, node);
            
        } else if (key[0] === 'params') {
            node.bindings = currentScope.addParam(node.name, node);
        }
    }

    static handleFunctionExpressionId(node, state, scopeState) {
        const currentScope = scopeState.currentScope;
        if (key[0] === 'id') {
            node.bindings = currentScope.addId(node.name, node);
        } else if (key[0] === 'params') {
            node.bindings = currentScope.addParam(node.name, node);
        }
    }

    static handleAssignmentPatternId(node, state, scopeState) {
        const currentScope = scopeState.currentScope;
        if (key[0] === 'left') {
            if (state.keys.last(2)[0] === 'params') {
                node.bindings = currentScope.addParam(node.name, node);
            } else {
                node.bindings = currentScope.addVariable(node.name, node);
            }
        }
    }

    static handleExpressionId(node, state, scopeState) {
        let backIndex = 1;
        let parentType = null;
        let parent = null;
        while ((parent = state.parents.last(backIndex))) {
            parentType = parent.type;
            backIndex++;
            if (parentType === 'VariableDeclarator') {
                break;
            }
        }

        if (parentType === 'VariableDeclarator') {
            const varRef = currentScope.var.get(node.name);
            if (varRef) {
                if (varRef.references.length > 1) {
                    node.bindings = currentScope.addBinding(node.name, node);
                    return;
                }
            }
            const paramRef = currentScope.param.get(node.name);

            if (paramRef) {
                node.bindings = currentScope.addParam(node.name, node);
                return;
            }
        }
        node.bindings = currentScope.addBinding(node.name, node);
    }

    static onExit(node, scopeState) {
        const type = node.type;
        const scopes = scopeState.scopes;
        switch (node.type) {
            case 'ArrowFunctionExpression':
            case 'FunctionDeclaration':
            case 'FunctionExpression': {
                scopeState.currentScope = scopeState.currentScope.parent;
                break;
            }
            case 'Program': {
                for (const scope of scopes) {
                    scope.resolveUndefined();
                }
                break;
            }
        }
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = VariableScopeBinder;
}