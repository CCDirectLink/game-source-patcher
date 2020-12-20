function GameSourceToModuleChunksJson(source) {
    // find first part
    const regex = /}\)\(\);/;
    const str = `})();`;
    let match = regex.exec(source);
    if (match === null) {
        throw "Invalid source provided.";
    }
    const jsonObject = {
        chunks: {},
        order: [""]
    };


    const offset = match.index + match[0].length;
    let chunkPieceOne = source.substring(0, offset);
    let remainingSource = source.substring(offset);
    let info = BuildChunk(chunkPieceOne, remainingSource);
    jsonObject.chunks[""] = info.chunk;

    do {
        // remove backed part
        chunkPieceOne = info.source.substring(0, info.match.endIndex);
        remainingSource = info.source.substring(info.match.endIndex);
        // get module name in remaining source
        info = BuildChunk(chunkPieceOne, remainingSource);
        const moduleName = GetModuleName(remainingSource);
        jsonObject.order.push(moduleName);
        jsonObject.chunks[moduleName] = info.chunk;
    } while (info.match !== null);
    return jsonObject;
}

function BuildChunk(chunkPieceOne, source) {
    let chunk = chunkPieceOne;
    const match = getBakedAssignmentMatch(source);
    let remainingSource = "";
    if (match) {
        chunk += source.substring(0, match.startIndex);
        remainingSource = source.substring(match.startIndex);
        match.endIndex -= match.startIndex;
        match.startIndex = 0;
    } else {
        chunk += source;
    }

    return {
        chunk,
        source: remainingSource,
        match,
    };
}

function GetModuleName(source) {
    const regex = /ig[\s]*\.[\s]*module[\s]*\([\s]*"([\w\.-]+)"[\s]*\)/;
    const match =  source.match(regex);
    if (!match) {
        throw "Could not find module name";
    }
    return match[1];
}

function getBakedAssignmentMatch(source) {
    const regex = /ig[\s]*\.[\s]*baked[\s]*=[\s]*![\s]*0[\s]*;/;
    const match =  source.match(regex);
    if (!match) {
        return null;
    }
    return {
        startIndex: match.index,
        endIndex: match.index + match[0].length
    }
}
