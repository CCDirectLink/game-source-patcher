
```js
[{
    "name": "A rename",
    "module": "module.name",
    "test": [{
        "depth": 1, // depth from Program root
        "ast-subtree": /** some ast subtree **/,
    },{
        "depth": 5, // depth from Program root
        "ast-subtree": /** some ast subtree **/,
    }],
    "rename": [{
        "matchedNodeRef": 0, // use node that matched at test[0] as reference node
        "path": "blah.blah", // ast path to enter to find target Identifier
        "name": "owo"
    }]
}]
```