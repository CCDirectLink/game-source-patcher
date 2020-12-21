class Scope {
    constructor(name, parent = null) {
        this.name = name;
        this.id = null;
        this.undef = new Map;
        this.param = new Map;
        this.var = new Map;
        this.parent = parent;
    }

    _generateBinding(type, name) {
        return {
            type: type,
            name: name,
            references: [],
            rename: function (newName) {
                this.rename(type, name, newName);
            }.bind(this)
        };
    }

    hasBinding(name) {
        return this.var.has(name) || this.param.has(name) || (this.id && this.id.name === name);
    }

    addParam(name, node) {
        let meta = null;
        if (!this.param.has(name)) {
            meta = this._generateBinding('param', name);
            this.param.set(name, meta);
        } else {
            meta = this.param.get(name);
        }
        meta.references.push(node);
        return meta;
    }


    addVariable(name, node) {
        let meta = null;
        if (!this.var.has(name)) {
            meta = this._generateBinding('var', name);
            this.var.set(name, meta);
        } else {
            meta = this.var.get(name);
        }
        meta.references.push(node);
        return meta;
    }

    addUndefined(name, node) {
        let meta = null;
        if (!this.undef.has(name)) {
            meta = this._generateBinding('undef', name);
            this.undef.set(name, meta);
        } else {
            meta = this.undef.get(name);
        }
        meta.references.push(node);
        return meta;
    }

    addId(name, node) {
        if (!this.id) {
            this.id = this._generateBinding('id', name);
        }
        this.id.references.push(node);
        return this.id;
    }

    addBinding(name, node) {
        if (!this.var.has(name)) {
            if (this.param.has(name)) {
                return this.addParam(name, node);
            } else if (this.id && this.id.name === name) {
                return this.addId(name, node);
            }
            // resolve when finished doing all known bindings 
            return this.addUndefined(name, node);
        }
        return this.addVariable(name, node);
    }

    rename(type, oldName, newName) {
        if (type === 'id') {
            this.id.references.forEach((ref) => ref.name = newName);
            this.id.name = newName;
            return;
        }

        let map = null;
        if (type === 'var') {
            map = this.var;
        } else if (type === 'param') {
            map = this.param;
        } else {
            throw `${type} is not a valid type!`;
        }
        let newBindings = null;
        if (map.has(newName)) {
            newBindings = map.get(newName);
        } else {
            newBindings = this._generateBinding(type, newName);
            map.set(newName, newBindings);
        }


        const oldBindings = map.get(oldName);
        oldBindings.references.map(e => {
            e.bindings = newBindings;
            e.name = newName;
        });
        newBindings.references.push(...oldBindings.references);
        map.delete(oldName);
    }

    resolveUndefined() {
        for (const [name, value] of this.undef) {
            let currentScope = this;
            let found = false;
            let index = 0;
            while (currentScope) {
                if (currentScope.hasBinding(name)) {
                    found = true;
                    for (const reference of value.references) {
                        reference.bindings = undefined;
                        currentScope.addBinding(name, reference);
                    }
                    break;
                }
                if (currentScope.name === 'Global') {
                    break;
                }
                currentScope = currentScope.parent;
            }

            if (!found) {
                // assume it is global
                for (const reference of value.references) {
                    reference.bindings = undefined;
                    currentScope.addVariable(name, reference);
                }
            }
        }
        this.undef.clear();
    }
}

// https://stackoverflow.com/a/5197219
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Scope;
}