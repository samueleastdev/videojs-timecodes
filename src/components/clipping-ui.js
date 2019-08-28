
import videojs from 'video.js';

var Component = videojs.getComponent('Component');

var ClippingBar = videojs.extend(Component, {

    constructor: function(player, options) {

        Component.apply(this, arguments);

        this.on('click', this.handleClick);

    },

    handleClick: function() {



    },

    createEl: function() {
        return videojs.dom.createEl('div', {
            className: 'g-ranger',
            id: 'range'
        });
    },

});

videojs.registerComponent('ClippingBar', ClippingBar);