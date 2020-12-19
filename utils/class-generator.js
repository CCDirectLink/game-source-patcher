class ClassGenerator {
    constructor(className, baseIndention = 0) {
        this.className = className;
        this.methods = new Map;
        this.focusMethod = "";
        this.baseIndention = baseIndention;
        this.indention = 1;
    
    }

    setFocusMethod(name) {
        if (!this.methods.has(name)) {
            this.methods.set(name, []);
        }
        this.focusMethod = name;
    }

    getFocusMethod() {
        return this.methods.get(this.focusMethod);
    }

    withIndention(lineOfCode) {
        return '\t'.repeat(this.indention) + lineOfCode;
    }

    incrementIndention() {
        this.indention++;
    }

    decrementIndention() {
        this.indention++;
    }

    addStartOfFor(init, condition, increment) {
        const body = this.getFocusMethod();
        body.push(this.withIndention(`for (${init}; ${condition}; ${increment})`));
        this.openScope();
    }

    addStartOfIf(condition) {
        const body = this.getFocusMethod();
        body.push(this.withIndention(`if (${condition})`));
        this.openScope();
    }

    openScope() {
        const body = this.getFocusMethod();
        body.push(body.pop() + " {");
        this.indention++;
    }


    addStatement(statement) {
        const body = this.getFocusMethod();
        body.push(this.withIndention(statement));
    }

    closeScope() {
        this.indention--;
        const body = this.getFocusMethod();
        body.push(this.withIndention('}'));
        
    }

    generate() {
        const targetClassBody = [
            `class ${this.className} {`
        ];
        for (const [methodName, methodBody] of this.methods) {
            targetClassBody.push('');
            const targetMethodBody = [
                `${methodName}() {`,
                ...methodBody,
                '}',
            ].map(e => `\t`.repeat(this.baseIndention) + e);
            targetClassBody.push(...targetMethodBody)
        }
        targetClassBody.push('}');
        targetClassBody.push('');
        return targetClassBody.join('\n');
    }
}

/**
classB = new ClassGenerator('B', 2);
 classB.setFocusMethod('a');
 classB.addStartOfFor('let i = 0', 'i < 10', 'i++');
 classB.addStartOfFor('let i = 0', 'i < 10', 'i++');
 classB.addStatement('console.log(i);');
 classB.closeScope();
 classB.generate()
 */