class EstreeCompare {
    constructor(options) {
        this.options = options || {};
        this.state = {};
    }

    compare(node, testNode) {
        if (!node || !testNode) {
            return false;
        }

        if (node.type !== testNode.type) {
            return false;
        }

        return this[node.type](node, testNode);
    }

    Identifier(node, testNode) {
        if (testNode.name !== undefined) {
            if (node.name !== testNode.name) {
                return false;
            }
        }
        return true;
    }

    Literal(node, testNode) {
        if (testNode.value !== undefined) {
            if (node.value !== testNode.value) {
                return false;
            }
        }
        return true;
    }

    Program(node, testNode) {
        if (typeof testNode.body === 'object') {
            for (const index in testNode.body) {
                const original = node.body[index];
                const test = testNode.body[index];
                if (!this.compare(original, test)) {
                    return false;
                }
            }
        }

        if (testNode.sourceType !== undefined) {
            if (node.sourceType !== testNode.sourceType) {
                return false;
            }
        }
        return true;
    }

    ExpressionStatement(node, testNode) {
        if (testNode.expression !== undefined) {
            if (!this.compare(node.expression, testNode.expression)) {
                return false;
            }
        }
        return true;
    }

    BlockStatement(node, testNode) {
        if (typeof testNode.body === 'object') {
            for (const index in testNode.body) {
                const original = node.body[index];
                const test = testNode.body[index];
                if (!this.compare(original, test)) {
                    return false;
                }
            }
        }
        return true;
    }

    EmptyStatement(node, testNode) { return true; }

    DebuggerStatement(node, testNode) { return true; }

    WithStatement(node, testNode) {
        if (testNode.object !== undefined) {
            if (!this.compare(node.object, testNode.object)) {
                return false;
            }
        }

        if (testNode.body !== undefined) {
            if (!this.compare(node.body, testNode.body)) {
                return false;
            }
        }
        return true;
    }

    ReturnStatement(node, testNode) {
        if (testNode.argument !== undefined) {
            if (!this.compare(node.argument, testNode.argument)) {
                return false;
            }
        }
        return true;
    }

    LabeledStatement(node, testNode) {
        if (testNode.label !== undefined) {
            if (!this.compare(node.label, testNode.label)) {
                return false;
            }
        }

        if (testNode.body !== undefined) {
            if (!this.compare(node.body, testNode.body)) {
                return false;
            }
        }
        return true;
    }

    BreakStatement(node, testNode) {
        if (testNode.label !== undefined) {
            if (!this.compare(node.label, testNode.label)) {
                return false;
            }
        }
        return true;
    }

    ContinueStatement(node, testNode) {
        if (testNode.label !== undefined) {
            if (!this.compare(node.label, testNode.label)) {
                return false;
            }
        }
        return true;
    }

    IfStatement(node, testNode) {
        if (testNode.test !== undefined) {
            if (!this.compare(node.test, testNode.test)) {
                return false;
            }
        }

        if (testNode.consequent !== undefined) {
            if (!this.compare(node.consequent, testNode.consequent)) {
                return false;
            }
        }

        if (testNode.alternate !== undefined) {
            if (!this.compare(node.alternate, testNode.alternate)) {
                return false;
            }
        }
        return true;
    }

    SwitchStatement(node, testNode) {
        if (testNode.discriminant !== undefined) {
            if (!this.compare(node.discriminant, testNode.discriminant)) {
                return false;
            }
        }

        if (typeof testNode.cases === 'object') {
            for (const index in testNode.cases) {
                const original = node.cases[index];
                const test = testNode.cases[index];
                if (!this.compare(original, test)) {
                    return false;
                }
            }
        }
        return true;
    }

    SwitchCase(node, testNode) {
        if (testNode.test !== undefined) {
            if (!this.compare(node.test, testNode.test)) {
                return false;
            }
        }

        if (typeof testNode.consequent === 'object') {
            for (const index in testNode.consequent) {
                const original = node.consequent[index];
                const test = testNode.consequent[index];
                if (!this.compare(original, test)) {
                    return false;
                }
            }
        }
        return true;
    }

    ThrowStatement(node, testNode) {
        if (testNode.argument !== undefined) {
            if (!this.compare(node.argument, testNode.argument)) {
                return false;
            }
        }
        return true;
    }

    TryStatement(node, testNode) {
        if (testNode.block !== undefined) {
            if (!this.compare(node.block, testNode.block)) {
                return false;
            }
        }

        if (testNode.handler !== undefined) {
            if (!this.compare(node.handler, testNode.handler)) {
                return false;
            }
        }

        if (testNode.finalizer !== undefined) {
            if (!this.compare(node.finalizer, testNode.finalizer)) {
                return false;
            }
        }
        return true;
    }

    CatchClause(node, testNode) {
        if (testNode.param !== undefined) {
            if (!this.compare(node.param, testNode.param)) {
                return false;
            }
        }

        if (testNode.body !== undefined) {
            if (!this.compare(node.body, testNode.body)) {
                return false;
            }
        }
        return true;
    }

    WhileStatement(node, testNode) {
        if (testNode.test !== undefined) {
            if (!this.compare(node.test, testNode.test)) {
                return false;
            }
        }

        if (testNode.body !== undefined) {
            if (!this.compare(node.body, testNode.body)) {
                return false;
            }
        }
        return true;
    }

    DoWhileStatement(node, testNode) {
        if (testNode.body !== undefined) {
            if (!this.compare(node.body, testNode.body)) {
                return false;
            }
        }

        if (testNode.test !== undefined) {
            if (!this.compare(node.test, testNode.test)) {
                return false;
            }
        }
        return true;
    }

    ForStatement(node, testNode) {
        if (testNode.init !== undefined) {
            if (!this.compare(node.init, testNode.init)) {
                return false;
            }
        }

        if (testNode.test !== undefined) {
            if (!this.compare(node.test, testNode.test)) {
                return false;
            }
        }

        if (testNode.update !== undefined) {
            if (!this.compare(node.update, testNode.update)) {
                return false;
            }
        }

        if (testNode.body !== undefined) {
            if (!this.compare(node.body, testNode.body)) {
                return false;
            }
        }
        return true;
    }

    ForInStatement(node, testNode) {
        if (testNode.left !== undefined) {
            if (!this.compare(node.left, testNode.left)) {
                return false;
            }
        }

        if (testNode.right !== undefined) {
            if (!this.compare(node.right, testNode.right)) {
                return false;
            }
        }

        if (testNode.body !== undefined) {
            if (!this.compare(node.body, testNode.body)) {
                return false;
            }
        }
        return true;
    }

    FunctionDeclaration(node, testNode) {
        if (testNode.id !== undefined) {
            if (!this.compare(node.id, testNode.id)) {
                return false;
            }
        }

        if (typeof testNode.params === 'object') {
            for (const index in testNode.params) {
                const original = node.params[index];
                const test = testNode.params[index];
                if (!this.compare(original, test)) {
                    return false;
                }
            }
        }

        if (testNode.body !== undefined) {
            if (!this.compare(node.body, testNode.body)) {
                return false;
            }
        }

        if (testNode.generator !== undefined) {
            if (node.generator !== testNode.generator) {
                return false;
            }
        }

        if (testNode.async !== undefined) {
            if (node.async !== testNode.async) {
                return false;
            }
        }
        return true;
    }

    VariableDeclaration(node, testNode) {
        if (typeof testNode.declarations === 'object') {
            for (const index in testNode.declarations) {
                const original = node.declarations[index];
                const test = testNode.declarations[index];
                if (!this.compare(original, test)) {
                    return false;
                }
            }
        }

        if (testNode.kind !== undefined) {
            if (node.kind !== testNode.kind) {
                return false;
            }
        }
        return true;
    }

    VariableDeclarator(node, testNode) {
        if (testNode.id !== undefined) {
            if (!this.compare(node.id, testNode.id)) {
                return false;
            }
        }

        if (testNode.init !== undefined) {
            if (!this.compare(node.init, testNode.init)) {
                return false;
            }
        }
        return true;
    }

    ThisExpression(node, testNode) { return true; }

    ArrayExpression(node, testNode) {
        if (typeof testNode.elements === 'object') {
            for (const index in testNode.elements) {
                const original = node.elements[index];
                const test = testNode.elements[index];
                if (!this.compare(original, test)) {
                    return false;
                }
            }
        }
        return true;
    }

    ObjectExpression(node, testNode) {
        if (typeof testNode.properties === 'object') {
            for (const index in testNode.properties) {
                const original = node.properties[index];
                const test = testNode.properties[index];
                if (!this.compare(original, test)) {
                    return false;
                }
            }
        }
        return true;
    }

    Property(node, testNode) {
        if (testNode.key !== undefined) {
            if (!this.compare(node.key, testNode.key)) {
                return false;
            }
        }

        if (testNode.value !== undefined) {
            if (!this.compare(node.value, testNode.value)) {
                return false;
            }
        }

        if (testNode.kind !== undefined) {
            if (node.kind !== testNode.kind) {
                return false;
            }
        }

        if (testNode.method !== undefined) {
            if (node.method !== testNode.method) {
                return false;
            }
        }

        if (testNode.shorthand !== undefined) {
            if (node.shorthand !== testNode.shorthand) {
                return false;
            }
        }

        if (testNode.computed !== undefined) {
            if (node.computed !== testNode.computed) {
                return false;
            }
        }
        return true;
    }

    FunctionExpression(node, testNode) {
        if (testNode.id !== undefined) {
            if (!this.compare(node.id, testNode.id)) {
                return false;
            }
        }

        if (typeof testNode.params === 'object') {
            for (const index in testNode.params) {
                const original = node.params[index];
                const test = testNode.params[index];
                if (!this.compare(original, test)) {
                    return false;
                }
            }
        }

        if (testNode.body !== undefined) {
            if (!this.compare(node.body, testNode.body)) {
                return false;
            }
        }

        if (testNode.generator !== undefined) {
            if (node.generator !== testNode.generator) {
                return false;
            }
        }

        if (testNode.async !== undefined) {
            if (node.async !== testNode.async) {
                return false;
            }
        }
        return true;
    }

    UnaryExpression(node, testNode) {
        if (testNode.operator !== undefined) {
            if (node.operator !== testNode.operator) {
                return false;
            }
        }

        if (testNode.prefix !== undefined) {
            if (node.prefix !== testNode.prefix) {
                return false;
            }
        }

        if (testNode.argument !== undefined) {
            if (!this.compare(node.argument, testNode.argument)) {
                return false;
            }
        }
        return true;
    }

    UpdateExpression(node, testNode) {
        if (testNode.operator !== undefined) {
            if (node.operator !== testNode.operator) {
                return false;
            }
        }

        if (testNode.argument !== undefined) {
            if (!this.compare(node.argument, testNode.argument)) {
                return false;
            }
        }

        if (testNode.prefix !== undefined) {
            if (node.prefix !== testNode.prefix) {
                return false;
            }
        }
        return true;
    }

    BinaryExpression(node, testNode) {
        if (testNode.operator !== undefined) {
            if (node.operator !== testNode.operator) {
                return false;
            }
        }

        if (testNode.left !== undefined) {
            if (!this.compare(node.left, testNode.left)) {
                return false;
            }
        }

        if (testNode.right !== undefined) {
            if (!this.compare(node.right, testNode.right)) {
                return false;
            }
        }
        return true;
    }

    AssignmentExpression(node, testNode) {
        if (testNode.operator !== undefined) {
            if (node.operator !== testNode.operator) {
                return false;
            }
        }

        if (testNode.left !== undefined) {
            if (!this.compare(node.left, testNode.left)) {
                return false;
            }
        }

        if (testNode.right !== undefined) {
            if (!this.compare(node.right, testNode.right)) {
                return false;
            }
        }
        return true;
    }

    LogicalExpression(node, testNode) {
        if (testNode.operator !== undefined) {
            if (node.operator !== testNode.operator) {
                return false;
            }
        }

        if (testNode.left !== undefined) {
            if (!this.compare(node.left, testNode.left)) {
                return false;
            }
        }

        if (testNode.right !== undefined) {
            if (!this.compare(node.right, testNode.right)) {
                return false;
            }
        }
        return true;
    }

    MemberExpression(node, testNode) {
        if (testNode.object !== undefined) {
            if (!this.compare(node.object, testNode.object)) {
                return false;
            }
        }

        if (testNode.property !== undefined) {
            if (!this.compare(node.property, testNode.property)) {
                return false;
            }
        }

        if (testNode.computed !== undefined) {
            if (node.computed !== testNode.computed) {
                return false;
            }
        }
        return true;
    }

    ConditionalExpression(node, testNode) {
        if (testNode.test !== undefined) {
            if (!this.compare(node.test, testNode.test)) {
                return false;
            }
        }

        if (testNode.alternate !== undefined) {
            if (!this.compare(node.alternate, testNode.alternate)) {
                return false;
            }
        }

        if (testNode.consequent !== undefined) {
            if (!this.compare(node.consequent, testNode.consequent)) {
                return false;
            }
        }
        return true;
    }

    CallExpression(node, testNode) {
        if (testNode.callee !== undefined) {
            if (!this.compare(node.callee, testNode.callee)) {
                return false;
            }
        }

        if (typeof testNode.arguments === 'object') {
            for (const index in testNode.arguments) {
                const original = node.arguments[index];
                const test = testNode.arguments[index];
                if (!this.compare(original, test)) {
                    return false;
                }
            }
        }
        return true;
    }

    NewExpression(node, testNode) {
        if (testNode.callee !== undefined) {
            if (!this.compare(node.callee, testNode.callee)) {
                return false;
            }
        }

        if (typeof testNode.arguments === 'object') {
            for (const index in testNode.arguments) {
                const original = node.arguments[index];
                const test = testNode.arguments[index];
                if (!this.compare(original, test)) {
                    return false;
                }
            }
        }
        return true;
    }

    SequenceExpression(node, testNode) {
        if (typeof testNode.expressions === 'object') {
            for (const index in testNode.expressions) {
                const original = node.expressions[index];
                const test = testNode.expressions[index];
                if (!this.compare(original, test)) {
                    return false;
                }
            }
        }
        return true;
    }

    ForOfStatement(node, testNode) {
        if (testNode.left !== undefined) {
            if (!this.compare(node.left, testNode.left)) {
                return false;
            }
        }

        if (testNode.right !== undefined) {
            if (!this.compare(node.right, testNode.right)) {
                return false;
            }
        }

        if (testNode.body !== undefined) {
            if (!this.compare(node.body, testNode.body)) {
                return false;
            }
        }

        if (testNode.await !== undefined) {
            if (node.await !== testNode.await) {
                return false;
            }
        }
        return true;
    }

    Super(node, testNode) { return true; }

    SpreadElement(node, testNode) {
        if (testNode.argument !== undefined) {
            if (!this.compare(node.argument, testNode.argument)) {
                return false;
            }
        }
        return true;
    }

    ArrowFunctionExpression(node, testNode) {
        if (testNode.id !== undefined) {
            if (!this.compare(node.id, testNode.id)) {
                return false;
            }
        }

        if (typeof testNode.params === 'object') {
            for (const index in testNode.params) {
                const original = node.params[index];
                const test = testNode.params[index];
                if (!this.compare(original, test)) {
                    return false;
                }
            }
        }

        if (testNode.body !== undefined) {
            if (!this.compare(node.body, testNode.body)) {
                return false;
            }
        }

        if (testNode.generator !== undefined) {
            if (node.generator !== testNode.generator) {
                return false;
            }
        }

        if (testNode.async !== undefined) {
            if (node.async !== testNode.async) {
                return false;
            }
        }

        if (testNode.expression !== undefined) {
            if (node.expression !== testNode.expression) {
                return false;
            }
        }
        return true;
    }

    YieldExpression(node, testNode) {
        if (testNode.argument !== undefined) {
            if (!this.compare(node.argument, testNode.argument)) {
                return false;
            }
        }

        if (testNode.delegate !== undefined) {
            if (node.delegate !== testNode.delegate) {
                return false;
            }
        }
        return true;
    }

    TemplateLiteral(node, testNode) {
        if (typeof testNode.quasis === 'object') {
            for (const index in testNode.quasis) {
                const original = node.quasis[index];
                const test = testNode.quasis[index];
                if (!this.compare(original, test)) {
                    return false;
                }
            }
        }

        if (typeof testNode.expressions === 'object') {
            for (const index in testNode.expressions) {
                const original = node.expressions[index];
                const test = testNode.expressions[index];
                if (!this.compare(original, test)) {
                    return false;
                }
            }
        }
        return true;
    }

    TaggedTemplateExpression(node, testNode) {
        if (testNode.tag !== undefined) {
            if (!this.compare(node.tag, testNode.tag)) {
                return false;
            }
        }

        if (testNode.quasi !== undefined) {
            if (!this.compare(node.quasi, testNode.quasi)) {
                return false;
            }
        }
        return true;
    }

    TemplateElement(node, testNode) {
        if (testNode.tail !== undefined) {
            if (node.tail !== testNode.tail) {
                return false;
            }
        }

        if (testNode.value !== undefined) {
            if (node.value !== testNode.value) {
                return false;
            }
        }
        return true;
    }

    ObjectPattern(node, testNode) {
        if (typeof testNode.properties === 'object') {
            for (const index in testNode.properties) {
                const original = node.properties[index];
                const test = testNode.properties[index];
                if (!this.compare(original, test)) {
                    return false;
                }
            }
        }
        return true;
    }

    ArrayPattern(node, testNode) {
        if (typeof testNode.elements === 'object') {
            for (const index in testNode.elements) {
                const original = node.elements[index];
                const test = testNode.elements[index];
                if (!this.compare(original, test)) {
                    return false;
                }
            }
        }
        return true;
    }

    RestElement(node, testNode) {
        if (testNode.argument !== undefined) {
            if (!this.compare(node.argument, testNode.argument)) {
                return false;
            }
        }
        return true;
    }

    AssignmentPattern(node, testNode) {
        if (testNode.left !== undefined) {
            if (!this.compare(node.left, testNode.left)) {
                return false;
            }
        }

        if (testNode.right !== undefined) {
            if (!this.compare(node.right, testNode.right)) {
                return false;
            }
        }
        return true;
    }

    ClassBody(node, testNode) {
        if (typeof testNode.body === 'object') {
            for (const index in testNode.body) {
                const original = node.body[index];
                const test = testNode.body[index];
                if (!this.compare(original, test)) {
                    return false;
                }
            }
        }
        return true;
    }

    MethodDefinition(node, testNode) {
        if (testNode.key !== undefined) {
            if (!this.compare(node.key, testNode.key)) {
                return false;
            }
        }

        if (testNode.value !== undefined) {
            if (!this.compare(node.value, testNode.value)) {
                return false;
            }
        }

        if (testNode.kind !== undefined) {
            if (node.kind !== testNode.kind) {
                return false;
            }
        }

        if (testNode.computed !== undefined) {
            if (node.computed !== testNode.computed) {
                return false;
            }
        }

        if (testNode.static !== undefined) {
            if (node.static !== testNode.static) {
                return false;
            }
        }
        return true;
    }

    ClassDeclaration(node, testNode) {
        if (testNode.id !== undefined) {
            if (!this.compare(node.id, testNode.id)) {
                return false;
            }
        }

        if (testNode.superClass !== undefined) {
            if (!this.compare(node.superClass, testNode.superClass)) {
                return false;
            }
        }

        if (testNode.body !== undefined) {
            if (!this.compare(node.body, testNode.body)) {
                return false;
            }
        }
        return true;
    }

    ClassExpression(node, testNode) {
        if (testNode.id !== undefined) {
            if (!this.compare(node.id, testNode.id)) {
                return false;
            }
        }

        if (testNode.superClass !== undefined) {
            if (!this.compare(node.superClass, testNode.superClass)) {
                return false;
            }
        }

        if (testNode.body !== undefined) {
            if (!this.compare(node.body, testNode.body)) {
                return false;
            }
        }
        return true;
    }

    MetaProperty(node, testNode) {
        if (testNode.meta !== undefined) {
            if (!this.compare(node.meta, testNode.meta)) {
                return false;
            }
        }

        if (testNode.property !== undefined) {
            if (!this.compare(node.property, testNode.property)) {
                return false;
            }
        }
        return true;
    }

    ImportDeclaration(node, testNode) {
        if (typeof testNode.specifiers === 'object') {
            for (const index in testNode.specifiers) {
                const original = node.specifiers[index];
                const test = testNode.specifiers[index];
                if (!this.compare(original, test)) {
                    return false;
                }
            }
        }

        if (testNode.source !== undefined) {
            if (!this.compare(node.source, testNode.source)) {
                return false;
            }
        }
        return true;
    }

    ImportSpecifier(node, testNode) {
        if (testNode.local !== undefined) {
            if (!this.compare(node.local, testNode.local)) {
                return false;
            }
        }

        if (testNode.imported !== undefined) {
            if (!this.compare(node.imported, testNode.imported)) {
                return false;
            }
        }
        return true;
    }

    ImportDefaultSpecifier(node, testNode) {
        if (testNode.local !== undefined) {
            if (!this.compare(node.local, testNode.local)) {
                return false;
            }
        }
        return true;
    }

    ImportNamespaceSpecifier(node, testNode) {
        if (testNode.local !== undefined) {
            if (!this.compare(node.local, testNode.local)) {
                return false;
            }
        }
        return true;
    }

    ExportNamedDeclaration(node, testNode) {
        if (testNode.declaration !== undefined) {
            if (!this.compare(node.declaration, testNode.declaration)) {
                return false;
            }
        }

        if (typeof testNode.specifiers === 'object') {
            for (const index in testNode.specifiers) {
                const original = node.specifiers[index];
                const test = testNode.specifiers[index];
                if (!this.compare(original, test)) {
                    return false;
                }
            }
        }

        if (testNode.source !== undefined) {
            if (!this.compare(node.source, testNode.source)) {
                return false;
            }
        }
        return true;
    }

    ExportSpecifier(node, testNode) {
        if (testNode.local !== undefined) {
            if (!this.compare(node.local, testNode.local)) {
                return false;
            }
        }

        if (testNode.exported !== undefined) {
            if (!this.compare(node.exported, testNode.exported)) {
                return false;
            }
        }
        return true;
    }

    ExportDefaultDeclaration(node, testNode) {
        if (testNode.declaration !== undefined) {
            if (!this.compare(node.declaration, testNode.declaration)) {
                return false;
            }
        }
        return true;
    }

    ExportAllDeclaration(node, testNode) {
        if (testNode.source !== undefined) {
            if (!this.compare(node.source, testNode.source)) {
                return false;
            }
        }

        if (testNode.exported !== undefined) {
            if (!this.compare(node.exported, testNode.exported)) {
                return false;
            }
        }
        return true;
    }

    AwaitExpression(node, testNode) {
        if (testNode.argument !== undefined) {
            if (!this.compare(node.argument, testNode.argument)) {
                return false;
            }
        }
        return true;
    }

    ImportExpression(node, testNode) {
        if (testNode.source !== undefined) {
            if (!this.compare(node.source, testNode.source)) {
                return false;
            }
        }
        return true;
    }
}

// https://stackoverflow.com/a/5197219
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EstreeCompare;
}