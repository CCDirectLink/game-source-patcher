// spec = await fetch('scope-analyzer/generator/merged.spec').then(e => e.text())
// parsed = new Parser(new Tokenizer(spec)).prog()
// parsed[0].body[1].types.splice(0)
// parsed.splice(1,2)
// new Interpreter(parsed).run()

function getVaguelySimilarObjectIndex(arr, object, key) {
    for (let i = 0; i < arr.length; ++i) {
        if (arr[i][key] === object[key]) {
            return i;
        }
    }
    return -1;
}
class Interpreter {
    constructor(ast) {
        this.ast = ast;
        this.types = {
            interface: new Map,
            enum: new Map
        };
        this.types.enum.set('RegExp', []);
        this.methods = {};
    }

    run() {
        const copy = this.ast.slice(0);
        let isEnum = false;
        // handle all enums
        for (let index = 0; index < copy.length; ++index) {
            if (copy[index].type === 'Enum') {
                this._enum(copy[index]);
                copy.splice(index, 1);
                index--;
            }
        }

        // handle all interfaces and their extensions
        for (let index = 0; index < copy.length; ++index) {
            if (copy[index].extension) {
                this._extendedInterface(copy[index]);
            } else {
                this._interface(copy[index]);
            }
            copy.splice(index, 1);
            index--;
        }

        const sortedList = this._sortByParents();

        // squash fields down to derived type
        for (const item of sortedList) {
            const name = item.name;
            const child = this.types.interface.get(name);
            const insertMap = new Map;
            let startIndex = 0;
            if (child.fields.length && child.fields[0].name === 'type') {
                startIndex = 1;
            }

            insertMap.set(startIndex, []);
            for (const parentName of item.parents) {
                const newFields = [];
                const parent = this.types.interface.get(parentName);
                let lastIndex = startIndex;
                for (const parentField of parent.fields) {
                    const indexOf = getVaguelySimilarObjectIndex(child.fields, parentField, 'name');
                    if (indexOf === -1) {
                        insertMap.get(lastIndex).push(parentField);
                    } else if (indexOf >= lastIndex) {
                        lastIndex = indexOf + 1;
                        if (!insertMap.has(lastIndex)) {
                            insertMap.set(lastIndex, []);
                        }
                    }
                }
            }

            let offset = 0;
            for (const [value, fields] of insertMap) {
                if (fields.length) {
                    const trueOffset = value + offset;
                    child.fields.splice(trueOffset, 0, ...fields);
                    offset += fields.length;
                }
            }
        }

        // merge duplicates definitions
        const uniqueTypes = new Map;
        for (const [name, value] of this.types.interface) {
            const fields = value.fields.slice(0);
            const typeIndex = this._getFieldIndex(value, 'type');
            if (typeIndex === -1) {
                continue;
            }
            const field = fields.splice(typeIndex, 1)[0];
            if (!uniqueTypes.has(field.string)) {
                const copy = JSON.parse(JSON.stringify(value));
                copy.fields = fields;
                uniqueTypes.set(field.string, copy);
            } else {
                const original = uniqueTypes.get(field.string);
                const newKeys = fields.map(e => e.name);
                for (const key of newKeys) {
                    const oField = this._getField(original, key);
                    const nField = this._getField(value, key);

                    if (oField === null) {
                        continue;
                    }

                    const diff = this._getObjectDifference(oField, nField);
                    // don't know how to handle this case
                    if (diff.array) {
                        debugger;
                    } else if (diff.nullable) {
                        oField.nullable = diff.nullable;
                    }
                }
            }
        }

        // generate code
        const classCode = [
            `
class EstreeSimplifier {
    constructor() {}

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
`.trim()];

        for (const [name, { fields, parents }] of uniqueTypes) {

            let methodCode = [
                `${name}(node) { return node;}`
            ];

            if (name === 'Identifier') {
                methodCode = [
                    `${name}(node) {`,
                    '\tif (node.name === "__") {',
                    '\t\treturn undefined;',
                    '\t}',
                    `\treturn node;`,
                    '}'
                ];
            } else if (name === 'Literal') {
                methodCode = [
                    `${name}(node) {`,
                    '\tdelete node.raw;',
                    `\treturn node;`,
                    '}'
                ];
            }

            if (fields.length) {
                methodCode[0] = `${name}(node) {`;
                let index = 0;

                for (const field of fields) {
                    if (field.delete) {
                        debugger;
                    }

                    let fieldCode;
                    if (field.array) {
                        fieldCode = [
                            `\tconst ${field.name}Object = {};`,
                            `\tfor (let i = 0; i < node.${field.name}.length; i++) {`,
                            `\t\tconst result = this._simplify(node.${field.name}[i]);`,
                            `\t\tif (result !== undefined) {`,
                            `\t\t\t${field.name}Object[i] = result;`,
                            `\t\t}`,
                            '\t}',
                            `\tif(Object.keys(${field.name}Object).length === 0) {`,
                            `\t\tdelete node.${field.name};`,
                            `\t} else {`,
                            `\t\tnode.${field.name} = ${field.name}Object;`,
                            '\t}'
                        ]
                    } else {
                        fieldCode = [
                            `\tnode.${field.name} = this._simplify(node.${field.name});`,
                            `\tif(node.${field.name} === undefined) {`,
                            `\t\tdelete node.${field.name};`,
                            '\t}'
                        ];
                    }
                    if (index > 0) {
                        methodCode.push('');
                    }
                    index++;

                    methodCode.push(...fieldCode);
                }
                methodCode.push(...[
                    `\tconst nodeKeys = Object.keys(node);`,
                    `\tif (nodeKeys.length === 1 && nodeKeys[0] === 'type') {`,
                    '\t\treturn undefined;',
                    '\t}',
                    '\treturn nodeKeys.length === 0 ? undefined : node;',
                    '}'
                ]);
            }
            classCode.push('');
            classCode.push(...methodCode.map(e => `\t${e}`));
        }
        classCode.push('}');
        return classCode.join('\n');

    }

    _getObjectDifference(oObj, newObj) {
        let diff = {};
        for (const key in newObj) {
            if (oObj[key] !== newObj[key]) {
                diff[key] = newObj[key];
            }
        }
        return diff;
    }
    _getField(node, fieldName) {
        const fields = node.fields;
        for (let i = 0; i < fields.length; ++i) {
            if (fields[i].name === fieldName) {
                return fields[i];
            }
        }
        return null;
    }
    _getFieldIndex(node, fieldName) {
        const fields = node.fields;
        for (let i = 0; i < fields.length; ++i) {
            if (fields[i].name === fieldName) {
                return i;
            }
        }
        return -1;
    }

    _sortByParents() {
        let dependencyMap = new Map;
        let graph = new DependencyGraph;

        // initial setup
        for (const [name, value] of this.types.interface) {
            const node = {
                name,
                parents: value.parents
            };
            dependencyMap.set(name, node);
            graph.addNode(node, name);
        }

        // associate child with parents
        for (const [name, value] of dependencyMap) {
            value.parents = value.parents.map(e => dependencyMap.get(e));
        }
        graph.sort();
        let sortedList = graph.getNodes();
        for (const item of sortedList) {
            item.parents = item.parents.map(e => e.name);
        }
        return sortedList;
    }

    _extendedInterface(line) {
        const original = this.types.interface.get(line.name.value);
        if (!original) {
            throw `Can not extend uninitialized type ${line.name.value}`;
        }

        const fake = {
            fields: [],
            parents: []
        };
        this._interface(line, fake);

        if (line)
            for (const field of fake.fields) {
                let found = false;
                for (const oFields of original.fields) {
                    if (oFields.name === field.name) {
                        found = true;
                    }
                }
                if (!found) {
                    original.fields.push(field);
                }
            }
    }

    _executeLine(line) {
        if (line.type === 'Interface') {
            this._interface(line);
        } else if (line.type === 'Enum') {
            this._enum(line);
        }
    }

    _interface(line, overrideData = null) {
        const name = line.name.value;
        const interfaceType = this.types.interface;
        let data;
        if (overrideData) {
            data = overrideData;
        } else if (!interfaceType.has(name)) {
            data = {
                fields: [],
                parents: []
            };
            interfaceType.set(name, data);
        } else {
            data = interfaceType.get(name);
        }

        data.parents.push(...line.parents.map(e => e.name.value));
        this._interfaceBody(line.body, data);
    }

    _interfaceBody(body, parent) {
        const lines = [];


        for (const line of body) {
            let name = line.name.value;
            let ignoreField = false;
            const info = {
                name,
                array: false
            };
            if (line.array) {
                info.array = true;
            }

            const types = [];
            for (const type of line.types) {
                if (type.type === 'Literal') {
                    info.string = type.value;
                    break;
                } else if (type.type === 'Identifier') {
                    const firstChar = type.value[0];
                    if (firstChar !== firstChar.toLowerCase()) {
                        const enums = this.types.enum;
                        if (!enums.has(type.value)) {
                            types.push(type.value);
                            this.methods[type.value] = true;
                        }
                    } else if (type.value === 'null') {
                        info.nullable = true;
                    }
                } else {
                    ignoreField = true;
                    break;
                }
            }
            if (info.string) {
                if (info.name === 'type') {
                    this.methods[info.string] = true;
                } else {
                    ignoreField = true;
                }
            } else if (!types.length) {
                ignoreField = true;
            }

            if (!ignoreField) {
                parent.fields.push(info);
            }


        }
    }

    _enum(line) {
        const enums = this.types.enum;
        const name = line.name.value;
        if (!enums.has(name)) {
            enums.set(name, []);
        }
        const values = enums.get(name);
        values.push(...line.values.map(e => e.value.value));
    }
}