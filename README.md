# videojs-frames

Framerate plugin

## Table of Contents

<!-- START doctoc -->
<!-- END doctoc -->
## Installation

```sh
npm install --save videojs-frames
```

## Running the project locally on your computer with local server.

```sh
git clone https://github.com/samueleastdev/videojs-timecodes.git
```

```sh
cd videojs-timecodes
```

```sh
npm install
```

```sh
npm start
```

## Live Example

[JsBin Example](https://output.jsbin.com/semolid)


## Usage

To include videojs-frames on your website or web application, use any of the following methods.

### `<script>` Tag

This is the simplest case. Get the script in whatever way you prefer and include the plugin _after_ you include [video.js][videojs], so that the `videojs` global is available.

```html
<script src="//path/to/video.min.js"></script>
<script src="//path/to/videojs-frames.min.js"></script>
<script>
  var player = videojs('my-video');

  player.frames();
</script>
```

### Browserify/CommonJS

When using with Browserify, install videojs-frames via npm and `require` the plugin as you would any other module.

```js
var videojs = require('video.js');

// The actual plugin function is exported by this module, but it is also
// attached to the `Player.prototype`; so, there is no need to assign it
// to a variable.
require('videojs-frames');

var player = videojs('my-video');

player.frames();
```

### RequireJS/AMD

When using with RequireJS (or another AMD library), get the script in whatever way you prefer and `require` the plugin as you normally would:

```js
require(['video.js', 'videojs-frames'], function(videojs) {
  var player = videojs('my-video');

  player.frames();
});
```

## License

MIT. Copyright (c) Samuel East


[videojs]: http://videojs.com/
