class EstreeGenericTraverser {
    constructor(options) {
        this.options = options || {};
        this.state = {};
    }

    traverse(node) {
        this.state = {
            depth: 1,
            skip: false,
            stop: false,
            parents: [],
            keys: []
        };
        this._traverse(node);
    }

    _traverse(node) {
        if (this.state.stop) return;

        if (!this[node.type]) {
            throw node.type + ' does not exist.';
        }

        const { enter, exit } = this.options;

        if (typeof enter === 'function') {
            enter(node, this.state);
        }
        if (this.state.stop) return;

        if (!this.state.skip) {
            this.state.depth++;
            this.state.parents.push(node);
            this[node.type](node);
            this.state.parents.pop();
            this.state.depth--;
        }

        if (typeof exit === 'function') {
            exit(node, this.state);
        }
        this.state.skip = false;
    }

    // Parents: Expression, Pattern
    Identifier() { }

    // Parent: Expression
    Literal() { }

    // Parent: Node
    Program(node) {
        const lastIndex = this.state.keys.push([]) - 1
        for (let i = 0; i < node.body.length; i++) {
            this.state.keys[lastIndex] = ['body', i]
            this._traverse(node.body[i]);
            if (this.state.stop) {
                i = node.body.length;
            }
        }
        this.state.keys.pop()
    }

    // Parent: Statement
    ExpressionStatement(node) {
        const lastIndex = this.state.keys.push([]) - 1
        this.state.keys[lastIndex] = ['expression']
        this._traverse(node.expression);
        this.state.keys.pop()
    }

    // Parent: Statement
    BlockStatement(node) {
        const lastIndex = this.state.keys.push([]) - 1
        for (let i = 0; i < node.body.length; i++) {
            this.state.keys[lastIndex] = ['body', i]
            this._traverse(node.body[i]);
            if (this.state.stop) {
                i = node.body.length;
            }
        }
        this.state.keys.pop()
    }

    // Parent: Statement
    EmptyStatement() { }

    // Parent: Statement
    DebuggerStatement() { }

    // Parent: Statement
    WithStatement(node) {
        const lastIndex = this.state.keys.push([]) - 1
        this.state.keys[lastIndex] = ['object']
        this._traverse(node.object);

        this.state.keys[lastIndex] = ['body']
        this._traverse(node.body);
        this.state.keys.pop()
    }

    // Parent: Statement
    ReturnStatement(node) {
        const lastIndex = this.state.keys.push([]) - 1
        if (node.argument != null) {
            this.state.keys[lastIndex] = ['argument'];
            this._traverse(node.argument);
        }
        this.state.keys.pop()
    }

    // Parent: Statement
    LabeledStatement(node) {
        const lastIndex = this.state.keys.push([]) - 1
        this.state.keys[lastIndex] = ['label']
        this._traverse(node.label);

        this.state.keys[lastIndex] = ['body']
        this._traverse(node.body);
        this.state.keys.pop()
    }

    // Parent: Statement
    BreakStatement(node) {
        const lastIndex = this.state.keys.push([]) - 1
        if (node.label != null) {
            this.state.keys[lastIndex] = ['label'];
            this._traverse(node.label);
        }
        this.state.keys.pop()
    }

    // Parent: Statement
    ContinueStatement(node) {
        const lastIndex = this.state.keys.push([]) - 1
        if (node.label != null) {
            this.state.keys[lastIndex] = ['label'];
            this._traverse(node.label);
        }
        this.state.keys.pop()
    }

    // Parent: Statement
    IfStatement(node) {
        const lastIndex = this.state.keys.push([]) - 1
        this.state.keys[lastIndex] = ['test']
        this._traverse(node.test);

        this.state.keys[lastIndex] = ['consequent']
        this._traverse(node.consequent);

        if (node.alternate != null) {
            this.state.keys[lastIndex] = ['alternate'];
            this._traverse(node.alternate);
        }
        this.state.keys.pop()
    }

    // Parent: Statement
    SwitchStatement(node) {
        const lastIndex = this.state.keys.push([]) - 1
        this.state.keys[lastIndex] = ['discriminant']
        this._traverse(node.discriminant);

        for (let i = 0; i < node.cases.length; i++) {
            this.state.keys[lastIndex] = ['cases', i]
            this._traverse(node.cases[i]);
            if (this.state.stop) {
                i = node.cases.length;
            }
        }
        this.state.keys.pop()
    }

    // Parent: Node
    SwitchCase(node) {
        const lastIndex = this.state.keys.push([]) - 1
        if (node.test != null) {
            this.state.keys[lastIndex] = ['test'];
            this._traverse(node.test);
        }

        for (let i = 0; i < node.consequent.length; i++) {
            this.state.keys[lastIndex] = ['consequent', i]
            this._traverse(node.consequent[i]);
            if (this.state.stop) {
                i = node.consequent.length;
            }
        }
        this.state.keys.pop()
    }

    // Parent: Statement
    ThrowStatement(node) {
        const lastIndex = this.state.keys.push([]) - 1
        this.state.keys[lastIndex] = ['argument']
        this._traverse(node.argument);
        this.state.keys.pop()
    }

    // Parent: Statement
    TryStatement(node) {
        const lastIndex = this.state.keys.push([]) - 1
        this.state.keys[lastIndex] = ['block']
        this._traverse(node.block);

        if (node.handler != null) {
            this.state.keys[lastIndex] = ['handler'];
            this._traverse(node.handler);
        }

        if (node.finalizer != null) {
            this.state.keys[lastIndex] = ['finalizer'];
            this._traverse(node.finalizer);
        }
        this.state.keys.pop()
    }

    // Parent: Node
    CatchClause(node) {
        const lastIndex = this.state.keys.push([]) - 1
        this.state.keys[lastIndex] = ['param']
        this._traverse(node.param);

        this.state.keys[lastIndex] = ['body']
        this._traverse(node.body);
        this.state.keys.pop()
    }

    // Parent: Statement
    WhileStatement(node) {
        const lastIndex = this.state.keys.push([]) - 1
        this.state.keys[lastIndex] = ['test']
        this._traverse(node.test);

        this.state.keys[lastIndex] = ['body']
        this._traverse(node.body);
        this.state.keys.pop()
    }

    // Parent: Statement
    DoWhileStatement(node) {
        const lastIndex = this.state.keys.push([]) - 1
        this.state.keys[lastIndex] = ['body']
        this._traverse(node.body);

        this.state.keys[lastIndex] = ['test']
        this._traverse(node.test);
        this.state.keys.pop()
    }

    // Parent: Statement
    ForStatement(node) {
        const lastIndex = this.state.keys.push([]) - 1
        if (node.init != null) {
            this.state.keys[lastIndex] = ['init'];
            this._traverse(node.init);
        }

        if (node.test != null) {
            this.state.keys[lastIndex] = ['test'];
            this._traverse(node.test);
        }

        if (node.update != null) {
            this.state.keys[lastIndex] = ['update'];
            this._traverse(node.update);
        }

        this.state.keys[lastIndex] = ['body']
        this._traverse(node.body);
        this.state.keys.pop()
    }

    // Parent: Statement
    ForInStatement(node) {
        const lastIndex = this.state.keys.push([]) - 1
        this.state.keys[lastIndex] = ['left']
        this._traverse(node.left);

        this.state.keys[lastIndex] = ['right']
        this._traverse(node.right);

        this.state.keys[lastIndex] = ['body']
        this._traverse(node.body);
        this.state.keys.pop()
    }

    // Parents: Function, Declaration
    FunctionDeclaration(node) {
        const lastIndex = this.state.keys.push([]) - 1
        if (node.id != null) {
            this.state.keys[lastIndex] = ['id'];
            this._traverse(node.id);
        }

        for (let i = 0; i < node.params.length; i++) {
            this.state.keys[lastIndex] = ['params', i]
            this._traverse(node.params[i]);
            if (this.state.stop) {
                i = node.params.length;
            }
        }

        this.state.keys[lastIndex] = ['body']
        this._traverse(node.body);
        this.state.keys.pop()
    }

    // Parent: Declaration
    VariableDeclaration(node) {
        const lastIndex = this.state.keys.push([]) - 1
        for (let i = 0; i < node.declarations.length; i++) {
            this.state.keys[lastIndex] = ['declarations', i]
            this._traverse(node.declarations[i]);
            if (this.state.stop) {
                i = node.declarations.length;
            }
        }
        this.state.keys.pop()
    }

    // Parent: Node
    VariableDeclarator(node) {
        const lastIndex = this.state.keys.push([]) - 1
        this.state.keys[lastIndex] = ['id']
        this._traverse(node.id);

        if (node.init != null) {
            this.state.keys[lastIndex] = ['init'];
            this._traverse(node.init);
        }
        this.state.keys.pop()
    }

    // Parent: Expression
    ThisExpression() { }

    // Parent: Expression
    ArrayExpression(node) {
        const lastIndex = this.state.keys.push([]) - 1
        for (let i = 0; i < node.elements.length; i++) {
            if (node.elements[i] != null) {
                this.state.keys[lastIndex] = ['elements', i]
            }
            this._traverse(node.elements[i]);
            if (this.state.stop) {
                i = node.elements.length;
            }
        }
        this.state.keys.pop()
    }

    // Parent: Expression
    ObjectExpression(node) {
        const lastIndex = this.state.keys.push([]) - 1
        for (let i = 0; i < node.properties.length; i++) {
            this.state.keys[lastIndex] = ['properties', i]
            this._traverse(node.properties[i]);
            if (this.state.stop) {
                i = node.properties.length;
            }
        }
        this.state.keys.pop()
    }

    // Parent: Node
    Property(node) {
        const lastIndex = this.state.keys.push([]) - 1
        this.state.keys[lastIndex] = ['key']
        this._traverse(node.key);

        this.state.keys[lastIndex] = ['value']
        this._traverse(node.value);
        this.state.keys.pop()
    }

    // Parents: Function, Expression
    FunctionExpression(node) {
        const lastIndex = this.state.keys.push([]) - 1
        if (node.id != null) {
            this.state.keys[lastIndex] = ['id'];
            this._traverse(node.id);
        }

        for (let i = 0; i < node.params.length; i++) {
            this.state.keys[lastIndex] = ['params', i]
            this._traverse(node.params[i]);
            if (this.state.stop) {
                i = node.params.length;
            }
        }

        this.state.keys[lastIndex] = ['body']
        this._traverse(node.body);
        this.state.keys.pop()
    }

    // Parent: Expression
    UnaryExpression(node) {
        const lastIndex = this.state.keys.push([]) - 1
        this.state.keys[lastIndex] = ['argument']
        this._traverse(node.argument);
        this.state.keys.pop()
    }

    // Parent: Expression
    UpdateExpression(node) {
        const lastIndex = this.state.keys.push([]) - 1
        this.state.keys[lastIndex] = ['argument']
        this._traverse(node.argument);
        this.state.keys.pop()
    }

    // Parent: Expression
    BinaryExpression(node) {
        const lastIndex = this.state.keys.push([]) - 1
        this.state.keys[lastIndex] = ['left']
        this._traverse(node.left);

        this.state.keys[lastIndex] = ['right']
        this._traverse(node.right);
        this.state.keys.pop()
    }

    // Parent: Expression
    AssignmentExpression(node) {
        const lastIndex = this.state.keys.push([]) - 1
        this.state.keys[lastIndex] = ['left']
        this._traverse(node.left);

        this.state.keys[lastIndex] = ['right']
        this._traverse(node.right);
        this.state.keys.pop()
    }

    // Parent: Expression
    LogicalExpression(node) {
        const lastIndex = this.state.keys.push([]) - 1
        this.state.keys[lastIndex] = ['left']
        this._traverse(node.left);

        this.state.keys[lastIndex] = ['right']
        this._traverse(node.right);
        this.state.keys.pop()
    }

    // Parents: Expression, Pattern
    MemberExpression(node) {
        const lastIndex = this.state.keys.push([]) - 1
        this.state.keys[lastIndex] = ['object']
        this._traverse(node.object);

        this.state.keys[lastIndex] = ['property']
        this._traverse(node.property);
        this.state.keys.pop()
    }

    // Parent: Expression
    ConditionalExpression(node) {
        const lastIndex = this.state.keys.push([]) - 1
        this.state.keys[lastIndex] = ['test']
        this._traverse(node.test);

        this.state.keys[lastIndex] = ['alternate']
        this._traverse(node.alternate);

        this.state.keys[lastIndex] = ['consequent']
        this._traverse(node.consequent);
        this.state.keys.pop()
    }

    // Parent: Expression
    CallExpression(node) {
        const lastIndex = this.state.keys.push([]) - 1
        this.state.keys[lastIndex] = ['callee']
        this._traverse(node.callee);

        for (let i = 0; i < node.arguments.length; i++) {
            this.state.keys[lastIndex] = ['arguments', i]
            this._traverse(node.arguments[i]);
            if (this.state.stop) {
                i = node.arguments.length;
            }
        }
        this.state.keys.pop()
    }

    // Parent: Expression
    NewExpression(node) {
        const lastIndex = this.state.keys.push([]) - 1
        this.state.keys[lastIndex] = ['callee']
        this._traverse(node.callee);

        for (let i = 0; i < node.arguments.length; i++) {
            this.state.keys[lastIndex] = ['arguments', i]
            this._traverse(node.arguments[i]);
            if (this.state.stop) {
                i = node.arguments.length;
            }
        }
        this.state.keys.pop()
    }

    // Parent: Expression
    SequenceExpression(node) {
        const lastIndex = this.state.keys.push([]) - 1
        for (let i = 0; i < node.expressions.length; i++) {
            this.state.keys[lastIndex] = ['expressions', i]
            this._traverse(node.expressions[i]);
            if (this.state.stop) {
                i = node.expressions.length;
            }
        }
        this.state.keys.pop()
    }

    // Parent: ForInStatement
    ForOfStatement(node) {
        const lastIndex = this.state.keys.push([]) - 1
        this.state.keys[lastIndex] = ['left']
        this._traverse(node.left);

        this.state.keys[lastIndex] = ['right']
        this._traverse(node.right);

        this.state.keys[lastIndex] = ['body']
        this._traverse(node.body);
        this.state.keys.pop()
    }

    // Parent: Node
    Super() { }

    // Parent: Node
    SpreadElement(node) {
        const lastIndex = this.state.keys.push([]) - 1
        this.state.keys[lastIndex] = ['argument']
        this._traverse(node.argument);
        this.state.keys.pop()
    }

    // Parents: Function, Expression
    ArrowFunctionExpression(node) {
        const lastIndex = this.state.keys.push([]) - 1
        if (node.id != null) {
            this.state.keys[lastIndex] = ['id'];
            this._traverse(node.id);
        }

        for (let i = 0; i < node.params.length; i++) {
            this.state.keys[lastIndex] = ['params', i]
            this._traverse(node.params[i]);
            if (this.state.stop) {
                i = node.params.length;
            }
        }

        this.state.keys[lastIndex] = ['body']
        this._traverse(node.body);
        this.state.keys.pop()
    }

    // Parent: Expression
    YieldExpression(node) {
        const lastIndex = this.state.keys.push([]) - 1
        if (node.argument != null) {
            this.state.keys[lastIndex] = ['argument'];
            this._traverse(node.argument);
        }
        this.state.keys.pop()
    }

    // Parent: Expression
    TemplateLiteral(node) {
        const lastIndex = this.state.keys.push([]) - 1
        for (let i = 0; i < node.quasis.length; i++) {
            this.state.keys[lastIndex] = ['quasis', i]
            this._traverse(node.quasis[i]);
            if (this.state.stop) {
                i = node.quasis.length;
            }
        }

        for (let i = 0; i < node.expressions.length; i++) {
            this.state.keys[lastIndex] = ['expressions', i]
            this._traverse(node.expressions[i]);
            if (this.state.stop) {
                i = node.expressions.length;
            }
        }
        this.state.keys.pop()
    }

    // Parent: Expression
    TaggedTemplateExpression(node) {
        const lastIndex = this.state.keys.push([]) - 1
        this.state.keys[lastIndex] = ['tag']
        this._traverse(node.tag);

        this.state.keys[lastIndex] = ['quasi']
        this._traverse(node.quasi);
        this.state.keys.pop()
    }

    // Parent: Node
    TemplateElement() { }

    // Parent: Pattern
    ObjectPattern(node) {
        const lastIndex = this.state.keys.push([]) - 1
        for (let i = 0; i < node.properties.length; i++) {
            this.state.keys[lastIndex] = ['properties', i]
            this._traverse(node.properties[i]);
            if (this.state.stop) {
                i = node.properties.length;
            }
        }
        this.state.keys.pop()
    }

    // Parent: Pattern
    ArrayPattern(node) {
        const lastIndex = this.state.keys.push([]) - 1
        for (let i = 0; i < node.elements.length; i++) {
            if (node.elements[i] != null) {
                this.state.keys[lastIndex] = ['elements', i]
            }
            this._traverse(node.elements[i]);
            if (this.state.stop) {
                i = node.elements.length;
            }
        }
        this.state.keys.pop()
    }

    // Parent: Pattern
    RestElement(node) {
        const lastIndex = this.state.keys.push([]) - 1
        this.state.keys[lastIndex] = ['argument']
        this._traverse(node.argument);
        this.state.keys.pop()
    }

    // Parent: Pattern
    AssignmentPattern(node) {
        const lastIndex = this.state.keys.push([]) - 1
        this.state.keys[lastIndex] = ['left']
        this._traverse(node.left);

        this.state.keys[lastIndex] = ['right']
        this._traverse(node.right);
        this.state.keys.pop()
    }

    // Parent: Node
    ClassBody(node) {
        const lastIndex = this.state.keys.push([]) - 1
        for (let i = 0; i < node.body.length; i++) {
            this.state.keys[lastIndex] = ['body', i]
            this._traverse(node.body[i]);
            if (this.state.stop) {
                i = node.body.length;
            }
        }
        this.state.keys.pop()
    }

    // Parent: Node
    MethodDefinition(node) {
        const lastIndex = this.state.keys.push([]) - 1
        this.state.keys[lastIndex] = ['key']
        this._traverse(node.key);

        this.state.keys[lastIndex] = ['value']
        this._traverse(node.value);
        this.state.keys.pop()
    }

    // Parents: Class, Declaration
    ClassDeclaration(node) {
        const lastIndex = this.state.keys.push([]) - 1
        if (node.id != null) {
            this.state.keys[lastIndex] = ['id'];
            this._traverse(node.id);
        }

        if (node.superClass != null) {
            this.state.keys[lastIndex] = ['superClass'];
            this._traverse(node.superClass);
        }

        this.state.keys[lastIndex] = ['body']
        this._traverse(node.body);
        this.state.keys.pop()
    }

    // Parents: Class, Expression
    ClassExpression(node) {
        const lastIndex = this.state.keys.push([]) - 1
        if (node.id != null) {
            this.state.keys[lastIndex] = ['id'];
            this._traverse(node.id);
        }

        if (node.superClass != null) {
            this.state.keys[lastIndex] = ['superClass'];
            this._traverse(node.superClass);
        }

        this.state.keys[lastIndex] = ['body']
        this._traverse(node.body);
        this.state.keys.pop()
    }

    // Parent: Expression
    MetaProperty(node) {
        const lastIndex = this.state.keys.push([]) - 1
        this.state.keys[lastIndex] = ['meta']
        this._traverse(node.meta);

        this.state.keys[lastIndex] = ['property']
        this._traverse(node.property);
        this.state.keys.pop()
    }

    // Parent: ModuleDeclaration
    ImportDeclaration(node) {
        const lastIndex = this.state.keys.push([]) - 1
        for (let i = 0; i < node.specifiers.length; i++) {
            this.state.keys[lastIndex] = ['specifiers', i]
            this._traverse(node.specifiers[i]);
            if (this.state.stop) {
                i = node.specifiers.length;
            }
        }

        this.state.keys[lastIndex] = ['source']
        this._traverse(node.source);
        this.state.keys.pop()
    }

    // Parent: ModuleSpecifier
    ImportSpecifier(node) {
        const lastIndex = this.state.keys.push([]) - 1
        this.state.keys[lastIndex] = ['local']
        this._traverse(node.local);

        this.state.keys[lastIndex] = ['imported']
        this._traverse(node.imported);
        this.state.keys.pop()
    }

    // Parent: ModuleSpecifier
    ImportDefaultSpecifier(node) {
        const lastIndex = this.state.keys.push([]) - 1
        this.state.keys[lastIndex] = ['local']
        this._traverse(node.local);
        this.state.keys.pop()
    }

    // Parent: ModuleSpecifier
    ImportNamespaceSpecifier(node) {
        const lastIndex = this.state.keys.push([]) - 1
        this.state.keys[lastIndex] = ['local']
        this._traverse(node.local);
        this.state.keys.pop()
    }

    // Parent: ModuleDeclaration
    ExportNamedDeclaration(node) {
        const lastIndex = this.state.keys.push([]) - 1
        if (node.declaration != null) {
            this.state.keys[lastIndex] = ['declaration'];
            this._traverse(node.declaration);
        }

        for (let i = 0; i < node.specifiers.length; i++) {
            this.state.keys[lastIndex] = ['specifiers', i]
            this._traverse(node.specifiers[i]);
            if (this.state.stop) {
                i = node.specifiers.length;
            }
        }

        if (node.source != null) {
            this.state.keys[lastIndex] = ['source'];
            this._traverse(node.source);
        }
        this.state.keys.pop()
    }

    // Parent: ModuleSpecifier
    ExportSpecifier(node) {
        const lastIndex = this.state.keys.push([]) - 1
        this.state.keys[lastIndex] = ['local']
        this._traverse(node.local);

        this.state.keys[lastIndex] = ['exported']
        this._traverse(node.exported);
        this.state.keys.pop()
    }

    // Parent: ModuleDeclaration
    ExportDefaultDeclaration(node) {
        const lastIndex = this.state.keys.push([]) - 1
        this.state.keys[lastIndex] = ['declaration']
        this._traverse(node.declaration);
        this.state.keys.pop()
    }

    // Parent: ModuleDeclaration
    ExportAllDeclaration(node) {
        const lastIndex = this.state.keys.push([]) - 1
        this.state.keys[lastIndex] = ['source']
        this._traverse(node.source);

        if (node.exported != null) {
            this.state.keys[lastIndex] = ['exported'];
            this._traverse(node.exported);
        }
        this.state.keys.pop()
    }

    // Parent: Expression
    AwaitExpression(node) {
        const lastIndex = this.state.keys.push([]) - 1
        this.state.keys[lastIndex] = ['argument']
        this._traverse(node.argument);
        this.state.keys.pop()
    }

    // Parent: Expression
    ImportExpression(node) {
        const lastIndex = this.state.keys.push([]) - 1
        this.state.keys[lastIndex] = ['source']
        this._traverse(node.source);
        this.state.keys.pop()
    }
}
window.ES11 = ES11;