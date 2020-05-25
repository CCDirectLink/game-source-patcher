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
        this.methods = {

        };
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
                    if (!oField) {
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

        const classCode = [
            `
export default class EstreeCompare {
    constructor(options) {
        this.options = options || {};
        this.state = {};
    }

    compare(node, testNode) {
        if (!node || !testNode) {
            return false;
        }

        if (node.type !== testNode.type) {
            return false;
        }

        return this[node.type](node, testNode);
    }
`.trim()];
        for (const [name, { fields }] of uniqueTypes) {
            let methodCode = [
                `${name}(node, testNode) { return true; }`
            ];

            if (fields.length) {
                let hasParents = methodCode.length === 2;
                methodCode[0] = `${name}(node, testNode) {`;
                let index = 0;
                for (const field of fields) {
                    let fieldCode;
                    if (field.array) {
                        if (field.type === 'builtin') {
                            debugger;
                        }
                        fieldCode = [
                            `\tif (typeof testNode.${field.name} === 'object') {`,
                            `\t\tfor (const index in testNode.${field.name}) {`,
                            `\t\t\tconst original = node.${field.name}[index];`,
                            `\t\t\tconst test = testNode.${field.name}[index];`,
                            `\t\t\tif (!this.compare(original, test)) {`,
                            `\t\t\t\treturn false;`,
                            `\t\t\t}`,
                            `\t\t}`,
                            `\t}`
                        ]
                    } else {
                        if (field.type === 'builtin') {
                            fieldCode = [
                                `\tif (testNode.${field.name} !== undefined) {`,
                                `\t\tif (node.${field.name} !== testNode.${field.name}) {`,
                                '\t\t\treturn false;',
                                '\t\t}',
                                '\t}'
                            ];
                        } else {
                            fieldCode = [
                                `\tif (testNode.${field.name} !== undefined) {`,
                                `\t\tif (!this.compare(node.${field.name}, testNode.${field.name})) {`,
                                '\t\t\treturn false;',
                                '\t\t}',
                                '\t}'
                            ];
                        }
                    }
                    if (index > 0) {
                        methodCode.push('');
                    }
                    index++;
                    methodCode.push(...fieldCode);
                }
                methodCode.push('\treturn true;');
                methodCode.push('}');
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
                type: 'builtin',
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
                    if (!this.types.enum.has(type.value) && firstChar !== firstChar.toLowerCase()) {
                        this.methods[type.value] = true;
                        info.type = 'recursive';
                    } else if (type.value === 'null') {
                        info.nullable = true;
                    }
                }
            }
            if (info.string) {
                if (info.name === 'type') {
                    this.methods[info.string] = true;
                }
            }

            if (!ignoreField) {
                parent.fields.push(info);
            } else {
                console.log('Ignoring', line, info);
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