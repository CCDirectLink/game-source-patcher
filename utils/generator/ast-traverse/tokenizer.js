class Tokenizer {
    constructor(input) {
        this.input = input;
        this.tokens = this._parseInput();
        this.index = -1;
    }

    isFinished() {
        return this.index === this.tokens.length;
    }

    current() {
        if (this.index < 0) {
            return null;
        }
        return this.tokens[this.index];
    }

    previous() {
        if (this.index > 0) {
            this.index--;
            return this.tokens[this.index];
        }
        return null;
    }

    peek(forward = 1) {
        if (this.index + forward >= this.tokens.length) {
            return null;
        }
        return this.tokens[this.index + forward];
    }

    next() {
        this.index += 1;
        return this.tokens[this.index];
    }

    _parseInput() {
        const regexpOrder = ['ws', 'reserved', 'id', 'str', 'punc', 'comment'];
        const regexps = {
            ws: /^([\s\r\n]+)/,
            reserved: /^(interface|enum|extend)/,
            id: /^([a-zA-Z]+)/,
            punc: /^({|}|\[|\]|\||,|<:|:|;)/,
            str: /^"([\\\"]|[^\"]+)"/,
            comment: /\/\/([^\r\n]+)/,
        }
        let input = this.input;
        const tokens = [];
        while (input.length) {
            let matched = false;
            for (const key of regexpOrder) {
                const match = input.match(regexps[key]);
                if (match) {
                    matched = true;
                    if (key !== 'ws' && key !== 'comment') {
                        tokens.push({
                            type: key,
                            value: match[1]
                        });
                    }
                    input = input.substring(match[0].length);
                }
                if (matched) {
                    break;
                }
            }
            if (!matched) {
                throw "avoided infinite loop";
            }
        }
        return tokens;
    }
}