## Usage

Your packager must have a way to handle SVG paths in the module graph.

This is because the JS imports the spritesheet, which isn't supported by the native web -- so we need a packager plugin to interpret that import and appropriately handle URL-mapping, fingerprinting, etc.


For Vite:
https://www.npmjs.com/package/vite-plugin-svg-sprite
For Webpack:
https://www.npmjs.com/package/svg-sprite-loader

## Disclaimer

Icons are copyright by FontAwesome

https://fontawesome.com/download


The usage here is for demonstration purposes only.

