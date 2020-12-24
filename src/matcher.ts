/// <reference types="acorn" />

import ASTComparer from "./ast-comparer";

class Matcher {
    private reference: acorn.Node;
    private matchedNode: acorn.Node;
    private comparer: ASTComparer;
    
    /**
     * 
     * @param reference AST subtree reference. Must not contain a Program node.
     * @param comparer An ASTComparer Matcher will use to compare two nodes.
     */
    public Matcher(reference: acorn.Node, comparer : ASTComparer) {
        this.reference = reference;
        this.comparer = comparer;
    }

    public check(node : acorn.Node) : boolean {
        const matches = this.comparer.compare(this.reference, node); 
        if (matches) {
            this.matchedNode = node;
        }
        return matches;
    }

    public getMatchedNode() : acorn.Node {
        return this.matchedNode;
    }
}