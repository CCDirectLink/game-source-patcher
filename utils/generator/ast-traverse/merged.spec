// From es5

interface Node {
    type: string;
    loc: SourceLocation | null;
}

interface SourceLocation {
    source: string | null;
    start: Position;
    end: Position;
}

interface Position {
    line: number; // >= 1
    column: number; // >= 0
}

interface Identifier <: Expression, Pattern {
    type: "Identifier";
    name: string;
}

interface Literal <: Expression {
    type: "Literal";
    value: string | boolean | null | number | RegExp;
}

interface RegExpLiteral <: Literal {
  regex: {
    pattern: string;
    flags: string;
  };
}

interface Program <: Node {
    type: "Program";
    body: [ Directive | Statement ];
}

interface Function <: Node {
    id: Identifier | null;
    params: [ Pattern ];
    body: FunctionBody;
}

interface Statement <: Node { }

interface ExpressionStatement <: Statement {
    type: "ExpressionStatement";
    expression: Expression;
}

interface Directive <: Node {
    type: "ExpressionStatement";
    expression: Literal;
    directive: string;
}

interface BlockStatement <: Statement {
    type: "BlockStatement";
    body: [ Statement ];
}

interface FunctionBody <: BlockStatement {
    body: [ Directive | Statement ];
}

interface EmptyStatement <: Statement {
    type: "EmptyStatement";
}

interface DebuggerStatement <: Statement {
    type: "DebuggerStatement";
}

interface WithStatement <: Statement {
    type: "WithStatement";
    object: Expression;
    body: Statement;
}

interface ReturnStatement <: Statement {
    type: "ReturnStatement";
    argument: Expression | null;
}

interface LabeledStatement <: Statement {
    type: "LabeledStatement";
    label: Identifier;
    body: Statement;
}

interface BreakStatement <: Statement {
    type: "BreakStatement";
    label: Identifier | null;
}

interface ContinueStatement <: Statement {
    type: "ContinueStatement";
    label: Identifier | null;
}

interface IfStatement <: Statement {
    type: "IfStatement";
    test: Expression;
    consequent: Statement;
    alternate: Statement | null;
}

interface SwitchStatement <: Statement {
    type: "SwitchStatement";
    discriminant: Expression;
    cases: [ SwitchCase ];
}

interface SwitchCase <: Node {
    type: "SwitchCase";
    test: Expression | null;
    consequent: [ Statement ];
}

interface ThrowStatement <: Statement {
    type: "ThrowStatement";
    argument: Expression;
}

interface TryStatement <: Statement {
    type: "TryStatement";
    block: BlockStatement;
    handler: CatchClause | null;
    finalizer: BlockStatement | null;
}

interface CatchClause <: Node {
    type: "CatchClause";
    param: Pattern;
    body: BlockStatement;
}

interface WhileStatement <: Statement {
    type: "WhileStatement";
    test: Expression;
    body: Statement;
}

interface DoWhileStatement <: Statement {
    type: "DoWhileStatement";
    body: Statement;
    test: Expression;
}

interface ForStatement <: Statement {
    type: "ForStatement";
    init: VariableDeclaration | Expression | null;
    test: Expression | null;
    update: Expression | null;
    body: Statement;
}

interface ForInStatement <: Statement {
    type: "ForInStatement";
    left: VariableDeclaration |  Pattern;
    right: Expression;
    body: Statement;
}

interface Declaration <: Statement { }

interface FunctionDeclaration <: Function, Declaration {
    type: "FunctionDeclaration";
    id: Identifier;
}

interface VariableDeclaration <: Declaration {
    type: "VariableDeclaration";
    declarations: [ VariableDeclarator ];
    kind: "var";
}

interface VariableDeclarator <: Node {
    type: "VariableDeclarator";
    id: Pattern;
    init: Expression | null;
}

interface Expression <: Node { }

interface ThisExpression <: Expression {
    type: "ThisExpression";
}

interface ArrayExpression <: Expression {
    type: "ArrayExpression";
    elements: [ Expression | null ];
}

interface ObjectExpression <: Expression {
    type: "ObjectExpression";
    properties: [ Property ];
}

interface Property <: Node {
    type: "Property";
    key: Literal | Identifier;
    value: Expression;
    kind: "init" | "get" | "set";
}

interface FunctionExpression <: Function, Expression {
    type: "FunctionExpression";
}

interface UnaryExpression <: Expression {
    type: "UnaryExpression";
    operator: UnaryOperator;
    prefix: boolean;
    argument: Expression;
}

enum UnaryOperator {
    "-" | "+" | "!" | "~" | "typeof" | "void" | "delete"
}

interface UpdateExpression <: Expression {
    type: "UpdateExpression";
    operator: UpdateOperator;
    argument: Expression;
    prefix: boolean;
}

enum UpdateOperator {
    "++" | "--"
}

interface BinaryExpression <: Expression {
    type: "BinaryExpression";
    operator: BinaryOperator;
    left: Expression;
    right: Expression;
}

enum BinaryOperator {
    "==" | "!=" | "===" | "!=="
         | "<" | "<=" | ">" | ">="
         | "<<" | ">>" | ">>>"
         | "+" | "-" | "*" | "/" | "%"
         | "|" | "^" | "&" | "in"
         | "instanceof"
}

interface AssignmentExpression <: Expression {
    type: "AssignmentExpression";
    operator: AssignmentOperator;
    left: Pattern | Expression;
    right: Expression;
}

enum AssignmentOperator {
    "=" | "+=" | "-=" | "*=" | "/=" | "%="
        | "<<=" | ">>=" | ">>>="
        | "|=" | "^=" | "&="
}

interface LogicalExpression <: Expression {
    type: "LogicalExpression";
    operator: LogicalOperator;
    left: Expression;
    right: Expression;
}

enum LogicalOperator {
    "||" | "&&"
}

interface MemberExpression <: Expression, Pattern {
    type: "MemberExpression";
    object: Expression;
    property: Expression;
    computed: boolean;
}

interface ConditionalExpression <: Expression {
    type: "ConditionalExpression";
    test: Expression;
    alternate: Expression;
    consequent: Expression;
}

interface CallExpression <: Expression {
    type: "CallExpression";
    callee: Expression;
    arguments: [ Expression ];
}

interface NewExpression <: Expression {
    type: "NewExpression";
    callee: Expression;
    arguments: [ Expression ];
}

interface SequenceExpression <: Expression {
    type: "SequenceExpression";
    expressions: [ Expression ];
}

interface Pattern <: Node { }

// From es2015

extend interface Program {
    sourceType: "script" | "module";
    body: [ Statement | ModuleDeclaration ];
}

extend interface Function {
    generator: boolean;
}

interface ForOfStatement <: ForInStatement {
    type: "ForOfStatement";
}

extend interface VariableDeclaration {
    kind: "var" | "let" | "const";
}

interface Super <: Node {
    type: "Super";
}

extend interface CallExpression {
    callee: Expression | Super;
}

extend interface MemberExpression {
    object: Expression | Super;
}

interface SpreadElement <: Node {
    type: "SpreadElement";
    argument: Expression;
}

extend interface ArrayExpression {
    elements: [ Expression | SpreadElement | null ];
}

extend interface CallExpression {
    arguments: [ Expression | SpreadElement ];
}

extend interface NewExpression {
    arguments: [ Expression | SpreadElement ];
}

extend interface AssignmentExpression {
    left: Pattern;
}

extend interface Property {
    key: Expression;
    method: boolean;
    shorthand: boolean;
    computed: boolean;
}

interface ArrowFunctionExpression <: Function, Expression {
    type: "ArrowFunctionExpression";
    body: FunctionBody | Expression;
    expression: boolean;
}

interface YieldExpression <: Expression {
    type: "YieldExpression";
    argument: Expression | null;
    delegate: boolean;
}

interface TemplateLiteral <: Expression {
    type: "TemplateLiteral";
    quasis: [ TemplateElement ];
    expressions: [ Expression ];
}

interface TaggedTemplateExpression <: Expression {
    type: "TaggedTemplateExpression";
    tag: Expression;
    quasi: TemplateLiteral;
}

interface TemplateElement <: Node {
    type: "TemplateElement";
    tail: boolean;
    value: {
        cooked: string;
        raw: string;
    };
}

interface AssignmentProperty <: Property {
    type: "Property"; // inherited
    value: Pattern;
    kind: "init";
    method: false;
}

interface ObjectPattern <: Pattern {
    type: "ObjectPattern";
    properties: [ AssignmentProperty ];
}

interface ArrayPattern <: Pattern {
    type: "ArrayPattern";
    elements: [ Pattern | null ];
}

interface RestElement <: Pattern {
    type: "RestElement";
    argument: Pattern;
}

interface AssignmentPattern <: Pattern {
    type: "AssignmentPattern";
    left: Pattern;
    right: Expression;
}

interface Class <: Node {
    id: Identifier | null;
    superClass: Expression | null;
    body: ClassBody;
}

interface ClassBody <: Node {
    type: "ClassBody";
    body: [ MethodDefinition ];
}

interface MethodDefinition <: Node {
    type: "MethodDefinition";
    key: Expression;
    value: FunctionExpression;
    kind: "constructor" | "method" | "get" | "set";
    computed: boolean;
    static: boolean;
}

interface ClassDeclaration <: Class, Declaration {
    type: "ClassDeclaration";
    id: Identifier;
}

interface ClassExpression <: Class, Expression {
    type: "ClassExpression";
}

interface MetaProperty <: Expression {
    type: "MetaProperty";
    meta: Identifier;
    property: Identifier;
}

interface ModuleDeclaration <: Node { }

interface ModuleSpecifier <: Node {
    local: Identifier;
}

interface ImportDeclaration <: ModuleDeclaration {
    type: "ImportDeclaration";
    specifiers: [ ImportSpecifier | ImportDefaultSpecifier | ImportNamespaceSpecifier ];
    source: Literal;
}

interface ImportSpecifier <: ModuleSpecifier {
    type: "ImportSpecifier";
    imported: Identifier;
}

interface ImportDefaultSpecifier <: ModuleSpecifier {
    type: "ImportDefaultSpecifier";
}

interface ImportNamespaceSpecifier <: ModuleSpecifier {
    type: "ImportNamespaceSpecifier";
}

interface ExportNamedDeclaration <: ModuleDeclaration {
    type: "ExportNamedDeclaration";
    declaration: Declaration | null;
    specifiers: [ ExportSpecifier ];
    source: Literal | null;
}

interface ExportSpecifier <: ModuleSpecifier {
    type: "ExportSpecifier";
    exported: Identifier;
}

interface AnonymousDefaultExportedFunctionDeclaration <: Function {
    type: "FunctionDeclaration";
    id: null;
}

interface AnonymousDefaultExportedClassDeclaration <: Class {
    type: "ClassDeclaration";
    id: null;
}

interface ExportDefaultDeclaration <: ModuleDeclaration {
    type: "ExportDefaultDeclaration";
    declaration: AnonymousDefaultExportedFunctionDeclaration | FunctionDeclaration | AnonymousDefaultExportedClassDeclaration | ClassDeclaration | Expression;
}

interface ExportAllDeclaration <: ModuleDeclaration {
    type: "ExportAllDeclaration";
    source: Literal;
}

// From es2016

extend enum BinaryOperator {
    "**"
}

extend enum AssignmentOperator {
    "**="
}

// From es2017

extend interface Function {
    async: boolean;
}

interface AwaitExpression <: Expression {
    type: "AwaitExpression";
    argument: Expression;
}

// From es2018

extend interface ForOfStatement {
  await: boolean;
}

extend interface ObjectExpression {
    properties: [ Property | SpreadElement ];
}

extend interface TemplateElement {
    value: {
        cooked: string | null;
        raw: string;
    };
}

extend interface ObjectPattern {
    properties: [ AssignmentProperty | RestElement ];
}

// From es2019

extend interface CatchClause {
    param: Pattern | null;
}

// From es2020

extend interface Literal <: Expression {
    type: "Literal";
    value: string | boolean | null | number | RegExp | bigint;
}

interface BigIntLiteral <: Literal {
  bigint: string;
}

interface ImportExpression <: Expression {
  type: "ImportExpression";
  source: Expression;
}

extend enum LogicalOperator {
    "||" | "&&" | "??"
}

extend interface ExportAllDeclaration {
  exported: Identifier | null;
}