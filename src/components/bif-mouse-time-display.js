/* global videojs */

import videojs from 'video.js';

/* eslint-disable no-underscore-dangle */
import {
    BIFParser
} from '../parser.js';
import {
    getPointerPosition
} from '../util/dom.js';

const defaults = {
    createBIFImage: Function.prototype,
    createBIFTime: Function.prototype,
    template: Function.prototype,
};

const VjsMouseTimeDisplay = videojs.getComponent('MouseTimeDisplay');

/**
 * Extends the `MouseTimeDisplay` component with an image preview based on a the time
 * at which the user hovers over the `SeekBar`.
 *
 * @param {Object} [options]
 * @param {ArrayBuffer} options.data
 * @param {function} [options.createBIFImage]
 * @param {function} [options.createBIFTime]
 * @param {function} [options.template]
 */
export default class BIFMouseTimeDisplay extends VjsMouseTimeDisplay {
    /**
     * Create BIF element.
     *
     * @param {HTMLElement} root
     * @returns {HTMLElement} BIFElement
     */
    static createBIFElement(root) {
        const BIFElement = document.createElement('div');

        BIFElement.id = 'bif-container';
        BIFElement.className = 'bif-container';

        root.appendChild(BIFElement);

        return BIFElement;
    }

    /**
     * Create BIF image element.
     *
     * @returns {HTMLElement} BIFImage
     */
    static createBIFImage() {
        const BIFImage = document.createElement('img');

        BIFImage.className = 'bif-image';

        return BIFImage;
    }

    /**
     * Create BIF time element.
     *
     * @returns {HTMLElement} BIFTime
     */
    static createBIFTime() {
        const BIFTime = document.createElement('span');

        BIFTime.id = 'bif-time';
        BIFTime.className = 'bif-time';

        return BIFTime;
    }

    constructor(player, options = {}) {
        super(player, options);

        this.BIFElement = BIFMouseTimeDisplay.createBIFElement(player.el());

        this.render(options);

    }

    /**
     * Configures the component with new options. If one of those options is data,
     * then the component attempts to convert that data into usable BIF image previews.
     *
     * @param {Object} [options]
     * @param {ArrayBuffer} options.data
     * @param {function} [options.createBIFImage]
     * @param {function} [options.createBIFTime]
     * @param {function} [options.template]
     */
    configure(options) {
        this.options_ = videojs.mergeOptions(defaults, this.options_, options);

        const {
            data
        } = options;

        if (data instanceof ArrayBuffer) {
            this.BIFParser = new BIFParser(data);
        } else if (data != null) {
            throw new Error('Invalid BIF data.');
        }

    }

    /**
     * Gets the current BIF image at a specific time in seconds.
     *
     * @param {number} time in seconds
     * @returns {string} image base64 encoded image
     */
    getCurrentImageAtTime(time) {

        let image;

        if (this.hasImages()) {
            image = this.BIFParser.getImageDataAtSecond(time);
        }

        return image;
    }

    /**
     * Gets the current time in seconds based on the mouse position over the `SeekBar`.
     *
     * @param {Event} event
     * @returns {number} time
     */
    getCurrentTimeAtEvent(event) {

        const {
            seekBar
        } = this.player_.controlBar.progressControl;

        const position = getPointerPosition(
            event,
            seekBar.el()
        );

        return position.x * this.player_.duration();
    }

    /**
     * Gets the current time in seconds based on the mouse position over the `SeekBar`.
     *
     * @param {Event} event
     * @returns {number} time
     */
    getCurrentOMTimeAtEvent(time) {

        return (this.player_.duration() / 100 * time);
    }

    /**
     * Event that fires every time the mouse is moved, throttled, over the `ProgressControl`.
     *
     * @param {Event} event
     */
    handleSliderMove(data) {

        if (!data) {

            return;

        } 

        this.removeClass(document.getElementById("bif-container"), 'bif-container-thumbnail');
        this.addClass(document.getElementById("bif-container"), 'bif-container-full');
 
        // gets the time in seconds
        const time = this.getCurrentOMTimeAtEvent(data.percentage);

        // gets the image
        const image = this.getCurrentImageAtTime(time);

        // updates the template with new information
        this.updateTemplate({
            image: image,
            left: data.left,
            time: Math.floor(time),
            format: false
        });

    }

    handleProgressBarMove(event) {

        if (!event) {

            return;

        }

        this.removeClass(document.getElementById("bif-container"), 'bif-container-full');
        this.addClass(document.getElementById("bif-container"), 'bif-container-thumbnail');

        // gets the time in seconds
        const time = this.getCurrentTimeAtEvent(event);

        // gets the image
        const image = this.getCurrentImageAtTime(time);

        // updates the template with new information
        this.updateTemplate({
            image: image,
            left: event.clientX,
            time: Math.floor(time),
            format: true
        });

    }

    /**
     * Determines the existence of the `BIFParser` which manages the index and all
     * associated images.
     *
     * @returns {boolean}
     */
    hasImages() {
        return !!this.BIFParser;
    }

    /**
     * Renders and rerenders the BIF component. It manages the three main elements
     * of the component—`BIFImage`, `BIFTime`, and the `template`.
     *
     * @param {Object} [options]
     * @param {ArrayBuffer} options.data
     * @param {function} [options.createBIFImage]
     * @param {function} [options.createBIFTime]
     * @param {function} [options.template]
     */
    render(options) {

        this.configure(options);

        // create BIF image element

        const BIFImage = this.options_.createBIFImage.apply(this);

        if (BIFImage instanceof HTMLElement) {
            this.BIFImage = BIFImage;
        } else {
            this.BIFImage = BIFMouseTimeDisplay.createBIFImage();
        }

        // create BIF time element

        const BIFTime = this.options_.createBIFTime.apply(this);

        if (BIFTime instanceof HTMLElement) {
            this.BIFTime = BIFTime;
        } else {
            this.BIFTime = BIFMouseTimeDisplay.createBIFTime();
        }

        // create BIF template element

        let template = this.options_.template.apply(this);

        if (!(template instanceof HTMLElement)) {
            template = this.template();
        }

        // replace template contents every render

        this.BIFElement.innerHTML = '';

        this.BIFElement.appendChild(template);

    }

    /**
     * The primary template for the component. Typically houses the `BIFImage` and
     * `BIFTime` elements to be styled or altered.
     *
     * @returns {HTMLElement} template
     */
    template() {
        const template = document.createElement('div');

        template.className = 'bif';
        template.id = 'bif';

        // append image element only if the images are ready
        if (this.hasImages()) {
            template.appendChild(this.BIFImage);
        }

        template.appendChild(this.BIFTime);

        return template;
    }

    /**
     * Update template elements with new content generated on mouse move.
     *
     * @param {Object} options.image
     */
    updateTemplate(data) {

        if (data.image) {
            
            this.BIFImage.src = data.image;

            document.getElementById('bif-container').style.display = 'block';

        }

        document.getElementById("bif-container").style.left = (data.left - 15) + 'px';

        if(data.format){

            this.BIFTime.innerHTML = videojs.formatTime(data.time);

        }
        
    }

    hasClass(ele,cls) {
    
        return !!ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));
    
    }

    addClass(ele,cls) {
    
        if (!this.hasClass(ele,cls)) ele.className += " "+cls;
    
    }

    removeClass(ele,cls) {
        
        if (this.hasClass(ele,cls)) {
            var reg = new RegExp('(\\s|^)'+cls+'(\\s|$)');
            ele.className=ele.className.replace(reg,' ');
        }

    }
}