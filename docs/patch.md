
```js
[{
    "name": "A patch",
    "module": "module.name",
    "tests": [{
        "depth": 1, // depth from Program root
        "ast-subtree": /** some ast subtree **/,
    },{
        "depth": 5, // depth from Program root
        "ast-subtree": /** some ast subtree **/,
    }],
    "patches": [{
        "type" : "REMOVE"
    }]
}]
```