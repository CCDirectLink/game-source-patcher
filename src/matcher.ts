
class Matcher {
    private reference: unknown;
    private matchedNode: unknown;
    
    /**
     * 
     * @param reference - AST subtree reference. Must not contain a Program node. 
     */
    public Matcher(reference: unknown) { // Note: Should convert unknown to a type that accepts various ast types
        this.reference = reference;
    }

    public check(node : unknown) : boolean {
        if () {

        }
        return true;
    }
}