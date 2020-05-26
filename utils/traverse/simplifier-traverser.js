class EstreeSimplifier {
    constructor() { }

    simplify(node, options = {}) {
        const simpleNode = this._simplify(node);
        if (typeof options.extract === 'string') {
            for (const pathPart of options.extract.split(".")) {
                if (node[pathPart]) {
                    node = node[pathPart];
                } else {
                    node = null;
                }
            }
        }
        return node;
    }

    _simplify(node) {
        if (node === null) {
            return undefined;
        }

        delete node.start;
        delete node.end;
        return this[node.type](node);
    }

    Identifier(node) {
        if (node.name === "__") {
            return undefined;
        }
        return node;
    }

    Literal(node) {
        delete node.raw;
        return node;
    }

    Program(node) {
        const bodyObject = {};
        for (let i = 0; i < node.body.length; i++) {
            const result = this._simplify(node.body[i]);
            if (result !== undefined) {
                bodyObject[i] = result;
            }
        }
        node.body = bodyObject
        return Object.keys(node).length === 0 ? undefined : node;
    }

    ExpressionStatement(node) {
        node.expression = this._simplify(node.expression);
        if (node.expression === undefined) {
            delete node.expression;
        }
        return Object.keys(node).length === 0 ? undefined : node;
    }

    BlockStatement(node) {
        const bodyObject = {};
        for (let i = 0; i < node.body.length; i++) {
            const result = this._simplify(node.body[i]);
            if (result !== undefined) {
                bodyObject[i] = result;
            }
        }
        node.body = bodyObject
        return Object.keys(node).length === 0 ? undefined : node;
    }

    EmptyStatement(node) { return node; }

    DebuggerStatement(node) { return node; }

    WithStatement(node) {
        node.object = this._simplify(node.object);
        if (node.object === undefined) {
            delete node.object;
        }

        node.body = this._simplify(node.body);
        if (node.body === undefined) {
            delete node.body;
        }
        return Object.keys(node).length === 0 ? undefined : node;
    }

    ReturnStatement(node) {
        node.argument = this._simplify(node.argument);
        if (node.argument === undefined) {
            delete node.argument;
        }
        return Object.keys(node).length === 0 ? undefined : node;
    }

    LabeledStatement(node) {
        node.label = this._simplify(node.label);
        if (node.label === undefined) {
            delete node.label;
        }

        node.body = this._simplify(node.body);
        if (node.body === undefined) {
            delete node.body;
        }
        return Object.keys(node).length === 0 ? undefined : node;
    }

    BreakStatement(node) {
        node.label = this._simplify(node.label);
        if (node.label === undefined) {
            delete node.label;
        }
        return Object.keys(node).length === 0 ? undefined : node;
    }

    ContinueStatement(node) {
        node.label = this._simplify(node.label);
        if (node.label === undefined) {
            delete node.label;
        }
        return Object.keys(node).length === 0 ? undefined : node;
    }

    IfStatement(node) {
        node.test = this._simplify(node.test);
        if (node.test === undefined) {
            delete node.test;
        }

        node.consequent = this._simplify(node.consequent);
        if (node.consequent === undefined) {
            delete node.consequent;
        }

        node.alternate = this._simplify(node.alternate);
        if (node.alternate === undefined) {
            delete node.alternate;
        }
        return Object.keys(node).length === 0 ? undefined : node;
    }

    SwitchStatement(node) {
        node.discriminant = this._simplify(node.discriminant);
        if (node.discriminant === undefined) {
            delete node.discriminant;
        }

        const casesObject = {};
        for (let i = 0; i < node.cases.length; i++) {
            const result = this._simplify(node.cases[i]);
            if (result !== undefined) {
                casesObject[i] = result;
            }
        }
        node.cases = casesObject
        return Object.keys(node).length === 0 ? undefined : node;
    }

    SwitchCase(node) {
        node.test = this._simplify(node.test);
        if (node.test === undefined) {
            delete node.test;
        }

        const consequentObject = {};
        for (let i = 0; i < node.consequent.length; i++) {
            const result = this._simplify(node.consequent[i]);
            if (result !== undefined) {
                consequentObject[i] = result;
            }
        }
        node.consequent = consequentObject
        return Object.keys(node).length === 0 ? undefined : node;
    }

    ThrowStatement(node) {
        node.argument = this._simplify(node.argument);
        if (node.argument === undefined) {
            delete node.argument;
        }
        return Object.keys(node).length === 0 ? undefined : node;
    }

    TryStatement(node) {
        node.block = this._simplify(node.block);
        if (node.block === undefined) {
            delete node.block;
        }

        node.handler = this._simplify(node.handler);
        if (node.handler === undefined) {
            delete node.handler;
        }

        node.finalizer = this._simplify(node.finalizer);
        if (node.finalizer === undefined) {
            delete node.finalizer;
        }
        return Object.keys(node).length === 0 ? undefined : node;
    }

    CatchClause(node) {
        node.param = this._simplify(node.param);
        if (node.param === undefined) {
            delete node.param;
        }

        node.body = this._simplify(node.body);
        if (node.body === undefined) {
            delete node.body;
        }
        return Object.keys(node).length === 0 ? undefined : node;
    }

    WhileStatement(node) {
        node.test = this._simplify(node.test);
        if (node.test === undefined) {
            delete node.test;
        }

        node.body = this._simplify(node.body);
        if (node.body === undefined) {
            delete node.body;
        }
        return Object.keys(node).length === 0 ? undefined : node;
    }

    DoWhileStatement(node) {
        node.body = this._simplify(node.body);
        if (node.body === undefined) {
            delete node.body;
        }

        node.test = this._simplify(node.test);
        if (node.test === undefined) {
            delete node.test;
        }
        return Object.keys(node).length === 0 ? undefined : node;
    }

    ForStatement(node) {
        node.init = this._simplify(node.init);
        if (node.init === undefined) {
            delete node.init;
        }

        node.test = this._simplify(node.test);
        if (node.test === undefined) {
            delete node.test;
        }

        node.update = this._simplify(node.update);
        if (node.update === undefined) {
            delete node.update;
        }

        node.body = this._simplify(node.body);
        if (node.body === undefined) {
            delete node.body;
        }
        return Object.keys(node).length === 0 ? undefined : node;
    }

    ForInStatement(node) {
        node.left = this._simplify(node.left);
        if (node.left === undefined) {
            delete node.left;
        }

        node.right = this._simplify(node.right);
        if (node.right === undefined) {
            delete node.right;
        }

        node.body = this._simplify(node.body);
        if (node.body === undefined) {
            delete node.body;
        }
        return Object.keys(node).length === 0 ? undefined : node;
    }

    FunctionDeclaration(node) {
        node.id = this._simplify(node.id);
        if (node.id === undefined) {
            delete node.id;
        }

        const paramsObject = {};
        for (let i = 0; i < node.params.length; i++) {
            const result = this._simplify(node.params[i]);
            if (result !== undefined) {
                paramsObject[i] = result;
            }
        }
        node.params = paramsObject

        node.body = this._simplify(node.body);
        if (node.body === undefined) {
            delete node.body;
        }
        return Object.keys(node).length === 0 ? undefined : node;
    }

    VariableDeclaration(node) {
        const declarationsObject = {};
        for (let i = 0; i < node.declarations.length; i++) {
            const result = this._simplify(node.declarations[i]);
            if (result !== undefined) {
                declarationsObject[i] = result;
            }
        }
        node.declarations = declarationsObject
        return Object.keys(node).length === 0 ? undefined : node;
    }

    VariableDeclarator(node) {
        node.id = this._simplify(node.id);
        if (node.id === undefined) {
            delete node.id;
        }

        node.init = this._simplify(node.init);
        if (node.init === undefined) {
            delete node.init;
        }
        return Object.keys(node).length === 0 ? undefined : node;
    }

    ThisExpression(node) { return node; }

    ArrayExpression(node) {
        const elementsObject = {};
        for (let i = 0; i < node.elements.length; i++) {
            const result = this._simplify(node.elements[i]);
            if (result !== undefined) {
                elementsObject[i] = result;
            }
        }
        node.elements = elementsObject
        return Object.keys(node).length === 0 ? undefined : node;
    }

    ObjectExpression(node) {
        const propertiesObject = {};
        for (let i = 0; i < node.properties.length; i++) {
            const result = this._simplify(node.properties[i]);
            if (result !== undefined) {
                propertiesObject[i] = result;
            }
        }
        node.properties = propertiesObject
        return Object.keys(node).length === 0 ? undefined : node;
    }

    Property(node) {
        node.key = this._simplify(node.key);
        if (node.key === undefined) {
            delete node.key;
        }

        node.value = this._simplify(node.value);
        if (node.value === undefined) {
            delete node.value;
        }
        return Object.keys(node).length === 0 ? undefined : node;
    }

    FunctionExpression(node) {
        node.id = this._simplify(node.id);
        if (node.id === undefined) {
            delete node.id;
        }

        const paramsObject = {};
        for (let i = 0; i < node.params.length; i++) {
            const result = this._simplify(node.params[i]);
            if (result !== undefined) {
                paramsObject[i] = result;
            }
        }
        node.params = paramsObject

        node.body = this._simplify(node.body);
        if (node.body === undefined) {
            delete node.body;
        }
        return Object.keys(node).length === 0 ? undefined : node;
    }

    UnaryExpression(node) {
        node.argument = this._simplify(node.argument);
        if (node.argument === undefined) {
            delete node.argument;
        }
        return Object.keys(node).length === 0 ? undefined : node;
    }

    UpdateExpression(node) {
        node.argument = this._simplify(node.argument);
        if (node.argument === undefined) {
            delete node.argument;
        }
        return Object.keys(node).length === 0 ? undefined : node;
    }

    BinaryExpression(node) {
        node.left = this._simplify(node.left);
        if (node.left === undefined) {
            delete node.left;
        }

        node.right = this._simplify(node.right);
        if (node.right === undefined) {
            delete node.right;
        }
        return Object.keys(node).length === 0 ? undefined : node;
    }

    AssignmentExpression(node) {
        node.left = this._simplify(node.left);
        if (node.left === undefined) {
            delete node.left;
        }

        node.right = this._simplify(node.right);
        if (node.right === undefined) {
            delete node.right;
        }
        return Object.keys(node).length === 0 ? undefined : node;
    }

    LogicalExpression(node) {
        node.left = this._simplify(node.left);
        if (node.left === undefined) {
            delete node.left;
        }

        node.right = this._simplify(node.right);
        if (node.right === undefined) {
            delete node.right;
        }
        return Object.keys(node).length === 0 ? undefined : node;
    }

    MemberExpression(node) {
        node.object = this._simplify(node.object);
        if (node.object === undefined) {
            delete node.object;
        }

        node.property = this._simplify(node.property);
        if (node.property === undefined) {
            delete node.property;
        }
        return Object.keys(node).length === 0 ? undefined : node;
    }

    ConditionalExpression(node) {
        node.test = this._simplify(node.test);
        if (node.test === undefined) {
            delete node.test;
        }

        node.alternate = this._simplify(node.alternate);
        if (node.alternate === undefined) {
            delete node.alternate;
        }

        node.consequent = this._simplify(node.consequent);
        if (node.consequent === undefined) {
            delete node.consequent;
        }
        return Object.keys(node).length === 0 ? undefined : node;
    }

    CallExpression(node) {
        node.callee = this._simplify(node.callee);
        if (node.callee === undefined) {
            delete node.callee;
        }

        const argumentsObject = {};
        for (let i = 0; i < node.arguments.length; i++) {
            const result = this._simplify(node.arguments[i]);
            if (result !== undefined) {
                argumentsObject[i] = result;
            }
        }
        node.arguments = argumentsObject
        return Object.keys(node).length === 0 ? undefined : node;
    }

    NewExpression(node) {
        node.callee = this._simplify(node.callee);
        if (node.callee === undefined) {
            delete node.callee;
        }

        const argumentsObject = {};
        for (let i = 0; i < node.arguments.length; i++) {
            const result = this._simplify(node.arguments[i]);
            if (result !== undefined) {
                argumentsObject[i] = result;
            }
        }
        node.arguments = argumentsObject
        return Object.keys(node).length === 0 ? undefined : node;
    }

    SequenceExpression(node) {
        const expressionsObject = {};
        for (let i = 0; i < node.expressions.length; i++) {
            const result = this._simplify(node.expressions[i]);
            if (result !== undefined) {
                expressionsObject[i] = result;
            }
        }
        node.expressions = expressionsObject
        return Object.keys(node).length === 0 ? undefined : node;
    }

    ForOfStatement(node) {
        node.left = this._simplify(node.left);
        if (node.left === undefined) {
            delete node.left;
        }

        node.right = this._simplify(node.right);
        if (node.right === undefined) {
            delete node.right;
        }

        node.body = this._simplify(node.body);
        if (node.body === undefined) {
            delete node.body;
        }
        return Object.keys(node).length === 0 ? undefined : node;
    }

    Super(node) { return node; }

    SpreadElement(node) {
        node.argument = this._simplify(node.argument);
        if (node.argument === undefined) {
            delete node.argument;
        }
        return Object.keys(node).length === 0 ? undefined : node;
    }

    ArrowFunctionExpression(node) {
        node.id = this._simplify(node.id);
        if (node.id === undefined) {
            delete node.id;
        }

        const paramsObject = {};
        for (let i = 0; i < node.params.length; i++) {
            const result = this._simplify(node.params[i]);
            if (result !== undefined) {
                paramsObject[i] = result;
            }
        }
        node.params = paramsObject

        node.body = this._simplify(node.body);
        if (node.body === undefined) {
            delete node.body;
        }
        return Object.keys(node).length === 0 ? undefined : node;
    }

    YieldExpression(node) {
        node.argument = this._simplify(node.argument);
        if (node.argument === undefined) {
            delete node.argument;
        }
        return Object.keys(node).length === 0 ? undefined : node;
    }

    TemplateLiteral(node) {
        const quasisObject = {};
        for (let i = 0; i < node.quasis.length; i++) {
            const result = this._simplify(node.quasis[i]);
            if (result !== undefined) {
                quasisObject[i] = result;
            }
        }
        node.quasis = quasisObject

        const expressionsObject = {};
        for (let i = 0; i < node.expressions.length; i++) {
            const result = this._simplify(node.expressions[i]);
            if (result !== undefined) {
                expressionsObject[i] = result;
            }
        }
        node.expressions = expressionsObject
        return Object.keys(node).length === 0 ? undefined : node;
    }

    TaggedTemplateExpression(node) {
        node.tag = this._simplify(node.tag);
        if (node.tag === undefined) {
            delete node.tag;
        }

        node.quasi = this._simplify(node.quasi);
        if (node.quasi === undefined) {
            delete node.quasi;
        }
        return Object.keys(node).length === 0 ? undefined : node;
    }

    TemplateElement(node) { return node; }

    ObjectPattern(node) {
        const propertiesObject = {};
        for (let i = 0; i < node.properties.length; i++) {
            const result = this._simplify(node.properties[i]);
            if (result !== undefined) {
                propertiesObject[i] = result;
            }
        }
        node.properties = propertiesObject
        return Object.keys(node).length === 0 ? undefined : node;
    }

    ArrayPattern(node) {
        const elementsObject = {};
        for (let i = 0; i < node.elements.length; i++) {
            const result = this._simplify(node.elements[i]);
            if (result !== undefined) {
                elementsObject[i] = result;
            }
        }
        node.elements = elementsObject
        return Object.keys(node).length === 0 ? undefined : node;
    }

    RestElement(node) {
        node.argument = this._simplify(node.argument);
        if (node.argument === undefined) {
            delete node.argument;
        }
        return Object.keys(node).length === 0 ? undefined : node;
    }

    AssignmentPattern(node) {
        node.left = this._simplify(node.left);
        if (node.left === undefined) {
            delete node.left;
        }

        node.right = this._simplify(node.right);
        if (node.right === undefined) {
            delete node.right;
        }
        return Object.keys(node).length === 0 ? undefined : node;
    }

    ClassBody(node) {
        const bodyObject = {};
        for (let i = 0; i < node.body.length; i++) {
            const result = this._simplify(node.body[i]);
            if (result !== undefined) {
                bodyObject[i] = result;
            }
        }
        node.body = bodyObject
        return Object.keys(node).length === 0 ? undefined : node;
    }

    MethodDefinition(node) {
        node.key = this._simplify(node.key);
        if (node.key === undefined) {
            delete node.key;
        }

        node.value = this._simplify(node.value);
        if (node.value === undefined) {
            delete node.value;
        }
        return Object.keys(node).length === 0 ? undefined : node;
    }

    ClassDeclaration(node) {
        node.id = this._simplify(node.id);
        if (node.id === undefined) {
            delete node.id;
        }

        node.superClass = this._simplify(node.superClass);
        if (node.superClass === undefined) {
            delete node.superClass;
        }

        node.body = this._simplify(node.body);
        if (node.body === undefined) {
            delete node.body;
        }
        return Object.keys(node).length === 0 ? undefined : node;
    }

    ClassExpression(node) {
        node.id = this._simplify(node.id);
        if (node.id === undefined) {
            delete node.id;
        }

        node.superClass = this._simplify(node.superClass);
        if (node.superClass === undefined) {
            delete node.superClass;
        }

        node.body = this._simplify(node.body);
        if (node.body === undefined) {
            delete node.body;
        }
        return Object.keys(node).length === 0 ? undefined : node;
    }

    MetaProperty(node) {
        node.meta = this._simplify(node.meta);
        if (node.meta === undefined) {
            delete node.meta;
        }

        node.property = this._simplify(node.property);
        if (node.property === undefined) {
            delete node.property;
        }
        return Object.keys(node).length === 0 ? undefined : node;
    }

    ImportDeclaration(node) {
        const specifiersObject = {};
        for (let i = 0; i < node.specifiers.length; i++) {
            const result = this._simplify(node.specifiers[i]);
            if (result !== undefined) {
                specifiersObject[i] = result;
            }
        }
        node.specifiers = specifiersObject

        node.source = this._simplify(node.source);
        if (node.source === undefined) {
            delete node.source;
        }
        return Object.keys(node).length === 0 ? undefined : node;
    }

    ImportSpecifier(node) {
        node.local = this._simplify(node.local);
        if (node.local === undefined) {
            delete node.local;
        }

        node.imported = this._simplify(node.imported);
        if (node.imported === undefined) {
            delete node.imported;
        }
        return Object.keys(node).length === 0 ? undefined : node;
    }

    ImportDefaultSpecifier(node) {
        node.local = this._simplify(node.local);
        if (node.local === undefined) {
            delete node.local;
        }
        return Object.keys(node).length === 0 ? undefined : node;
    }

    ImportNamespaceSpecifier(node) {
        node.local = this._simplify(node.local);
        if (node.local === undefined) {
            delete node.local;
        }
        return Object.keys(node).length === 0 ? undefined : node;
    }

    ExportNamedDeclaration(node) {
        node.declaration = this._simplify(node.declaration);
        if (node.declaration === undefined) {
            delete node.declaration;
        }

        const specifiersObject = {};
        for (let i = 0; i < node.specifiers.length; i++) {
            const result = this._simplify(node.specifiers[i]);
            if (result !== undefined) {
                specifiersObject[i] = result;
            }
        }
        node.specifiers = specifiersObject

        node.source = this._simplify(node.source);
        if (node.source === undefined) {
            delete node.source;
        }
        return Object.keys(node).length === 0 ? undefined : node;
    }

    ExportSpecifier(node) {
        node.local = this._simplify(node.local);
        if (node.local === undefined) {
            delete node.local;
        }

        node.exported = this._simplify(node.exported);
        if (node.exported === undefined) {
            delete node.exported;
        }
        return Object.keys(node).length === 0 ? undefined : node;
    }

    ExportDefaultDeclaration(node) {
        node.declaration = this._simplify(node.declaration);
        if (node.declaration === undefined) {
            delete node.declaration;
        }
        return Object.keys(node).length === 0 ? undefined : node;
    }

    ExportAllDeclaration(node) {
        node.source = this._simplify(node.source);
        if (node.source === undefined) {
            delete node.source;
        }

        node.exported = this._simplify(node.exported);
        if (node.exported === undefined) {
            delete node.exported;
        }
        return Object.keys(node).length === 0 ? undefined : node;
    }

    AwaitExpression(node) {
        node.argument = this._simplify(node.argument);
        if (node.argument === undefined) {
            delete node.argument;
        }
        return Object.keys(node).length === 0 ? undefined : node;
    }

    ImportExpression(node) {
        node.source = this._simplify(node.source);
        if (node.source === undefined) {
            delete node.source;
        }
        return Object.keys(node).length === 0 ? undefined : node;
    }
}