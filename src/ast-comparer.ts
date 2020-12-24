
export default interface ASTComparer {
    compare(referece: acorn.Node, target: acorn.Node);
}