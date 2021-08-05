# Get started

## Install
Run VSC, open the terminal tab and navigate to `https://gitlab.web-arts.de:2443/webarts-engineers/Boilerplate/tree/master/Debugging%20Toolbar/node_module/kk-debugger`.

```
# Create a symlink folder
$ sudo npm install -g kk-debugger
```

## Basic usage
Navigate to the `debugging` folder in your project. 

```
$ kk-debugger
```

Prepend the `/debugging/enable.js` file into your `/src/variation-01/script.js` or `/src/global/global.js`.
```javascript
// @codekit-prepend "../../../debugging/enabled.js";
```