
```js
[{
    "name": "A rename",
    "module": "module.name",
    "test": [{
        "depth": 1, // depth from Program root
        "object": /** some ast subtree **/,
    },{
        "depth": 5, // depth from Program root
        "object": /** some ast subtree **/,
    }],
    "rename": [{
        "matched-node-ref": 0, // node that matched at test[0]
        "path": "blah.blah", // ast path to enter to find target Identifier
        "name": "owo"
    }]
}]
```