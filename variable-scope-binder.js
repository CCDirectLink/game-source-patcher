class VariableScopeBinder {
    constructor(ast) {
        let currentScope = null;
        let scopes = [];

    }

    buildBindings(ast) {
        const es11 = new ES11({
            enter: this.onEnter.bind(this),
            exit: this.onExit.bind(this)
        });
        es11.traverse(ast);
    }

    addScope(type) {
        const scopeType = type === "Program" ? "Global" : "Function";
        this.currentScope = new Scope(scopeType, this.currentScope);
        this.scopes.push(this.currentScope);
    }

    onEnter(node, state) {
        switch (node.type) {
            case 'Program':
            case 'ArrowFunctionExpression':
            case 'FunctionDeclaration':
            case 'FunctionExpression': {
                this.addScope(node.type)
                break;
            }
            case 'Identifier': {
                this.handleIdentifier(node, state);
                break;
            }
        }
    } 

    handleIdentifier(node, state) {

        const parent = state.parents.last();
        const key = state.keys.last();
        if (parent.type === 'FunctionDeclaration') {
            this.handleFunctionDeclarationId(node, state);
        } else if (parent.type === 'FunctionExpression' || parent.type === 'ArrowFunctionExpression') {
            this.handleFunctionExpressionId(node, state);
        } else if (parent.type === 'AssignmentPattern') {
            this.handleAssignmentPatternId(node, state);
        } else if (parent.type === 'VariableDeclarator' && key[0] === 'id') {
            node.bindings = currentScope.addVariable(node.name, node);
        } else if (parent.type === 'MemberExpression' && key[0] === 'property' && !parent.computed) {
        } else if (parent.type === 'MemberExpression' && parent.object.name === 'window') {
            node.bindings = scopes[0].addBinding(node.name, node);
        } else if (parent.type.endsWith('Expression')) {
            this.handleExpressionId(node, state);
        } else {
            // default
            node.bindings = currentScope.addBinding(node.name, node);
        }
    }

    handleFunctionDeclarationId(node, state) {
        if (key[0] === 'id') {
            node.bindings = currentScope.parent.addVariable(node.name, node);
            
        } else if (key[0] === 'params') {
            node.bindings = currentScope.addParam(node.name, node);
        }
    }

    handleFunctionExpressionId(node, state) {
        if (key[0] === 'id') {
            node.bindings = currentScope.addId(node.name, node);
        } else if (key[0] === 'params') {
            node.bindings = currentScope.addParam(node.name, node);
        }
    }

    handleAssignmentPatternId(node, state) {
        if (key[0] === 'left') {
            if (state.keys.last(2)[0] === 'params') {
                node.bindings = currentScope.addParam(node.name, node);
            } else {
                node.bindings = currentScope.addVariable(node.name, node);
            }
        }
    }

    handleExpressionId(node, state) {
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

    onExit(node) {
        const type = node.type;
        switch (node.type) {
            case 'ArrowFunctionExpression':
            case 'FunctionDeclaration':
            case 'FunctionExpression': {
                currentScope = currentScope.parent
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