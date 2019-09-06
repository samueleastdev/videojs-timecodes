
import videojs from 'video.js';

var Component = videojs.getComponent('Component');

var ClippingBar = videojs.extend(Component, {

    constructor: function(player, options) {

        Component.apply(this, arguments);

    },

    createEl: function() {

        return videojs.dom.createEl('div', {
            className: 'g-ranger',
            id: this.player().id() + '_range'
        });
    },

});

videojs.registerComponent('ClippingBar', ClippingBar);