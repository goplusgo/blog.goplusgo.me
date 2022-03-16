---
layout: post
title: "How to set up Flow in React Project"
tags: [React, Flow]
---
### What's Flow?
[Flow](https://flow.org/en/docs/react/) is a static type checker developed by Meta (aka, Facebook), Inc. There are some cool features in Flow: 
- Type Annotations
- Enum
- Union Types
- Maybe Types

and etc.

### Setup Flow

#### Install dev tools and plugins
```shell
yarn add --dev flow-bin
yarn add flow-enums-runtime
yarn add --dev babel-plugin-transform-flow-enums customize-cra eslint-plugin-fb-flow eslint-plugin-ft-flow react-app-rewired
```

#### Create react-app-rewired config overrides
Create a file named `config-overrides.js`:
```javascript
const { override, useBabelRc } = require("customize-cra");

module.exports = override(useBabelRc(), (config, env) => {
  config.plugins.find(
    (p) => p.key === "ESLintWebpackPlugin"
  ).options.useEslintrc = true;
  return config;
});

```
#### Setup babel and eslint
Create `.babelrc` file:
```json
{
    "plugins": [
      "babel-plugin-transform-flow-enums"
    ]
}
```
and `eslintrc`:
```json
{
    "extends": ["react-app"],
    "plugins": ["ft-flow", "fb-flow"]
}
```
#### Initialize flow config
```shell
yarn run flow init
```
which generates the `.flowconfig` locally. Override the file with the following contents:
```json
[ignore]
<PROJECT_ROOT>/.history/.*
<PROJECT_ROOT>/node_modules/resolve/test/resolver/malformed_package_json/package.json

[include]

[libs]

[lints]

[options]
enums=true
react.runtime=automatic

[strict]

``` 

#### Update package.json scripts
```json
"scripts": {
  "flow": "flow",
  "start": "react-app-rewired start",
  "build": "react-app-rewired build",
  "test": "react-app-rewired test",
},
```

Done! Now you're able to use Flow in your React project!

### Flow Examples
#### Enum
```javascript
enum ActionType {
    Add,
    Remove,
}
```
#### Union Types
```javascript
// @flow
function toStringPrimitives(value: number | boolean | string) {
  return String(value);
}

toStringPrimitives(1);       // Works!
toStringPrimitives(true);    // Works!
toStringPrimitives('three'); // Works!
```
#### Maybe Types
Maybe types accept the provided type as well as `null` or `undefined`. So `?number` would mean `number`, `null`, or `undefined`.
```javascript
// @flow
function acceptsMaybeNumber(value: ?number) {
  // ...
}

acceptsMaybeNumber(42);        // Works!
acceptsMaybeNumber();          // Works!
acceptsMaybeNumber(undefined); // Works!
acceptsMaybeNumber(null);      // Works!
acceptsMaybeNumber("42");      // Error!
```

There are lots of other cool features in Flow. For more, see [here](https://flow.org/en/docs/);
