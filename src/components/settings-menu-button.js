// Get the Component base class from Video.js
var Component = videojs.getComponent('Component');
ClickableComponent
var TitleBar = videojs.extend(Component, {

// The constructor of a component receives two arguments: the
// player it will be associated with and an object of options.
constructor: function(player, options) {

  // It is important to invoke the superclass before anything else, 
  // to get all the features of components out of the box!
  Component.apply(this, arguments);

  // If a `text` option was passed in, update the text content of 
  // the component.
  if (options.text) {
    this.updateTextContent(options.text);
  }

  this.on('click', this.handleClick);

},

handleClick: function() {
 
    console.log('Enable UI'); 
    
},

// The `createEl` function of a component creates its DOM element.
createEl: function() {
  return videojs.createEl('div', {

    // Prefixing classes of elements within a player with "vjs-" 
    // is a convention used in Video.js.
    className: 'g-ranger',
    id: 'range'
  });
},

// This function could be called at any time to update the text 
// contents of the component.
updateTextContent: function(text) {

  // If no text was provided, default to "Title Unknown"
  if (typeof text !== 'string') {
    text = 'Title Unknown';
  }

  // Use Video.js utility DOM methods to manipulate the content
  // of the component's element.
  videojs.emptyEl(this.el());
  videojs.appendContent(this.el(), text);
}
});

// Register the component with Video.js, so it can be used in players.
videojs.registerComponent('TitleBar', TitleBar);