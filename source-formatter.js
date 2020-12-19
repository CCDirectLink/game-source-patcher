function GameSourceToModuleChunksJson(source) {
    const ast = acorn.parse(source);
    const body = ast.body;
    let startIndex;
    let endIndex = 0;
    const astPieces = [];
    // separate each section of the code
    do {
        startIndex = endIndex;
        endIndex = FindBakedIndex(body, startIndex + 1);
        const subAst = acorn.parse('');
        if (endIndex == -1) {
            subAst.body.push(...body.slice(startIndex));
        } else {
            subAst.body.push(...body.slice(startIndex, endIndex));
        }
        astPieces.push(subAst);
    } while (endIndex != -1);

    // find the names of each part
    // know the first section has no definite name

    const jsonObject = {
        order: [],
        chunks: {},
    };
    jsonObject.order.push("");
    jsonObject.chunks[""] = escodegen.generate(astPieces[0]);
    for (let i = 1; i < astPieces.length; i++) {
        const astPiece = astPieces[i];
        const moduleName = GetModuleName(astPiece);
        jsonObject.order.push(moduleName);
        jsonObject.chunks[moduleName] = escodegen.generate(astPiece);
    }
    return jsonObject;
}


function GetModuleName(astPiece) {
    const body = astPiece.body;
    for (let index = 0; index <  body.length; index++) {
        const statement = body[index];
        const moduleName = FindModuleName(statement.expression);
        if (moduleName) {
            return moduleName;
        }
    }
    return "";
}

function FindModuleName(node, parents = []) {
    if (!node)
        return "";
    if (node.type === "CallExpression") {
        parents.push(node);
        return FindModuleName(node.callee, parents);
    } else if (node.type === "MemberExpression") {
        const object = node.object;
        const property = node.property;
        if (object.type !== "Identifier") {
            parents.push(node);
            return FindModuleName(object, parents);
        } else if (property.name === "module") {
            const parent = parents.pop();

            if (parent.type === "CallExpression") {
                const args = parent.arguments;
                if (args.length === 1) {
                    return args[0].value;
                }
            }
        }
        
    }
    return "";
}

function FindBakedIndex(body, startIndex = 0) {
    for (let i = startIndex; i < body.length; i++) {
        const statement = body[i];
        const bodyExpression = statement.expression;
        const isAssignmentExpression = bodyExpression && 
                                       bodyExpression.type === "AssignmentExpression";

        if (isAssignmentExpression) {
            const leftExpression = bodyExpression.left;
            const isMemberProperty = leftExpression.type === "MemberExpression";
            if (isMemberProperty) {
                if (leftExpression.property.name === "baked") {
                    return i;
                }
            } 
        }
    }
    return -1;
}