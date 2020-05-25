class Parser {
    constructor(lexer) {
        this.lexer = lexer;
        this.current_token = null;
    }

    eat(type) {
        if (this.current_token === null) {
            this.current_token = this.lexer.next();
        }

        if (this.current_token.type === type) {
            const oldToken = this.current_token;

            this.current_token = this.lexer.next();
            return oldToken;
        } else {
            throw `Current token ${this.current_token.value} is not of type ${type}.`;
        }
    }

    spit() {
        this.current_token = this.lexer.previous();
    }

    prog() {
        const ast = [];
        while (!this.lexer.isFinished()) {

            let current;
            const currentToken = this.eat('reserved');
            switch (currentToken.value) {
                case 'extend': {
                    current = this.extend();
                    break;
                }
                case 'interface': {
                    current = this.interface();
                    break;
                }
                case 'enum': {
                    current = this.enum();
                    break;
                }
                default: {
                    throw `Did not expected ${currentToken.value} to start the show.`;
                }
            }

            ast.push(current);
        }
        return ast;
    }


    extend() {
        const extensionType = this.eat('reserved');
        if (!extensionType) {
            throw `Expected more for extended.`;
        }
        let ast;

        if (extensionType.value === 'interface') {
            ast = this.interface();

        } else if (extensionType.value === 'enum') {
            ast = this.enum();
        } else {
            throw `extend expects type interface or enum but got ${extensionType.value}`;
        }
        ast.extension = true;
        return ast;
    }


    anonymousInterface() {
        const ast = {
            type: 'AnonymousInterface',
            body: []
        };
        let token = this.eat('punc');
        if (this.isStartBrace(token)) {
            while (this.isId(this.current_token)) {
                ast.body.push(this.interfaceProperty());
                const currentToken = this.eat('punc');
                if (currentToken && currentToken.value !== ';') {
                    break;
                }

                if (this.isEndBrace(this.current_token)) {
                    break;
                }

            }
            token = this.eat('punc');
        }

        if (!this.isEndBrace(token)) {
            throw `No closing brace to match open brace.`;
        }
        return ast;
    }
    interface() {
        const ast = {
            type: 'Interface',
            name: this.id(),
            parents: [],
            body: []
        };

        let token = this.eat('punc');

        if (this.isExtensionToken(token)) {
            while (true) {
                ast.parents.push(this.parent());
                const currentToken = this.eat('punc');
                if (currentToken && currentToken.value !== ',') {
                    this.spit();
                    break;
                }
            }
        } else {
            this.spit();
        }
        const result = this.anonymousInterface();
        ast.body = result.body;
        return ast;
    }

    interfaceProperty() {
        const ast = {
            type: 'Property',
            name: this.id(),
            array: false,
            types: []
        };

        let token = this.eat('punc');

        if (!this.isColon(token)) {
            throw `Expected colon for interface property.`;
        }

        if (this.isStartBracket(this.current_token)) {
            ast.array = true;
            this.eat('punc');
        }

        while (true) {
            const token = this.current_token;
            let value = null;
            if (token.type === 'str') {
                value = this.str();
            } else if (token.type === 'id') {
                value = this.id();
            } else if (this.isStartBrace(token)) {
                value = this.anonymousInterface();
            }

            ast.types.push(value);
            const currentToken = this.eat('punc');
            if (currentToken && currentToken.value !== '|') {
                this.spit();
                break;
            }
        }

        if (ast.array) {
            const currentToken = this.eat('punc');
            if (!this.isEndBracket(currentToken)) {
                throw `Unclosed bracket.`;
            }
        }

        return ast;
    }



    enum() {
        const ast = {
            type: 'Enum',
            name: this.id(),
            values: []
        };

        let token = this.eat('punc');

        /*if (this.isExtensionToken(token)) {
            while (true) {
                ast.parents.push(this.parent());
                const currentToken = this.eat('punc');
                if (currentToken && currentToken.value !== ',') {
                    this.spit();
                    break;
                }
            }
            token = this.eat('punc');
        }*/

        if (this.isStartBrace(token)) {
            while (true) {
                ast.values.push(this.enumValue());
                const currentToken = this.eat('punc');
                if (currentToken && currentToken.value !== '|') {
                    break;
                }
            }
            token = this.current_token;
        }
        return ast;
    }

    enumValue() {

        const ast = {
            type: 'EnumValue',
            value: '',
        };
        const token = this.current_token;
        if (token.type === 'str') {
            ast.value = this.str();
        } else if (token.type === 'id') {
            ast.value = this.id();
        }
        return ast;
    }

    str() {
        return {
            type: 'Literal',
            value: this.eat('str').value
        };
    }

    parent() {
        return {
            type: 'Parent',
            name: this.id()
        };
    }




    isId(token) {
        return token.type === 'id';
    }

    isStartBrace(token) {
        return token.value === '{';
    }

    isEndBrace(token) {
        return token.value === '}';
    }

    isStartBracket(token) {
        return token.value === '[';
    }

    isEndBracket(token) {
        return token.value === ']';
    }
    isColon(token) {
        return token.value === ':';
    }

    isSemiColon(token) {
        return token.value === ';';
    }

    isExtensionToken(token) {
        return token.value === '<:';
    }

    id() {
        return {
            type: 'Identifier',
            value: this.eat('id').value
        };
    }
}