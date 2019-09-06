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
    static createBIFElement(root, cls) {
        
        const BIFElement = document.createElement('div');

        BIFElement.className = cls;

        root.appendChild(BIFElement);

        return BIFElement;

    }

    /**
     * Create BIF image element.
     *
     * @returns {HTMLElement} BIFImage
     */
    static createBIFImage(cls) {

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

        BIFTime.className = 'bif-time';

        return BIFTime;

    }

    constructor(player, options = {}) {

        super(player, options);

        this.BIFElement = BIFMouseTimeDisplay.createBIFElement(player.el(), 'bif-thumbnail');

        this.render(options);

        this.BIFElementSlider = BIFMouseTimeDisplay.createBIFElement(player.el(), 'bif-slider');

        this.renderSlider(options);

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
 
        // gets the time in seconds 
        const time = this.getCurrentOMTimeAtEvent(data.percentage);

        // gets the image
        const image = this.getCurrentImageAtTime(time);

        if (videojs(this.player().id()).hasClass('video-is-dragging')) {

                this.BIFElementSlider.style.display = 'block';
        
        }
        
        this.BIFElementSlider.style.left    = (data.left) + 'px';

        if (image) {
            
            this.BIFImageSlider.src = image;

        }

    }

    handleSliderOut() {

        this.BIFElementSlider.style.display = 'none';

    }   

    handleProgressBarMove(event, parent) {

        if (!event) {

            return;

        }

        // gets the time in seconds
        const time = this.getCurrentTimeAtEvent(event);

        // gets the image
        const image = this.getCurrentImageAtTime(time);

        this.BIFElement.style.display = 'block';
        this.BIFElement.style.left    = (event.offsetX + parent) + 'px';

        if (image) {
            
            this.BIFImage.src = image;

        }

        this.BIFTime.innerHTML        = videojs.formatTime(Math.floor(time));

    }

    handleProgressBarOut() {

        this.BIFElement.style.display = 'none';

    }   

    setSliderTime(time){

        this.BIFTimeSlider.innerText = time;

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

        // append image element only if the images are ready
        if (this.hasImages()) {
            template.appendChild(this.BIFImage);
        }

        template.appendChild(this.BIFTime);

        return template;
    }

    renderSlider(options) {

        this.configure(options);

        // create BIF image element

        const BIFImageSlider = this.options_.createBIFImage.apply(this);

        if (BIFImageSlider instanceof HTMLElement) {
            this.BIFImageSlider = BIFImageSlider;
        } else {
            this.BIFImageSlider = BIFMouseTimeDisplay.createBIFImage();
        }

        // create BIF time element

        const BIFTimeSlider = this.options_.createBIFTime.apply(this);

        if (BIFTimeSlider instanceof HTMLElement) {
            this.BIFTimeSlider = BIFTimeSlider;
        } else {
            this.BIFTimeSlider = BIFMouseTimeDisplay.createBIFTime();
        }

        // create BIF template element

        let template = this.options_.template.apply(this);

        if (!(template instanceof HTMLElement)) {
            template = this.templateSlider();
        }

        // replace template contents every render

        this.BIFElementSlider.innerHTML = '';

        this.BIFElementSlider.appendChild(template);

    }

    /**
     * The primary template for the component. Typically houses the `BIFImage` and
     * `BIFTime` elements to be styled or altered.
     *
     * @returns {HTMLElement} template
     */
    templateSlider() {
        const template = document.createElement('div');

        template.className = 'bif';

        // append image element only if the images are ready
        if (this.hasImages()) {
            template.appendChild(this.BIFImageSlider);
        }

        template.appendChild(this.BIFTimeSlider);

        return template;
    }

}