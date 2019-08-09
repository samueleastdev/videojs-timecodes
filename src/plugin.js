import videojs from 'video.js';
import {
    version as VERSION
} from '../package.json';

import './components/clipping-ui.js';
import noUiSlider from '../node_modules/nouislider/distribute/nouislider.js';
 
const Plugin = videojs.getPlugin('plugin');
const MenuButton = videojs.getComponent('MenuButton');
const Menu = videojs.getComponent('Menu');
const Component = videojs.getComponent('Component');

// Default options for the plugin.
const defaults = {
    format: 'time',
    frameRate: 24,
    clippingEnabled: true,
    clippingDisplayed: false
};

/*
    film: 24,
    NTSC : 29.97,
    NTSC_Film: 23.98,
    NTSC_HD : 59.94,
    PAL: 25,
    PAL_HD: 50,
    web: 30,
    high: 60
*/

/**
 * An advanced Video.js plugin. For more information on the API
 *
 * See: https://blog.videojs.com/feature-spotlight-advanced-plugins/
 */
class Frames extends Plugin {
 
    /**
     * Create a Frames plugin instance.
     *
     * @param  {Player} player
     *         A Video.js Player instance.
     *
     * @param  {Object} [options]
     *         An optional options object.
     *
     *         While not a core part of the Video.js plugin architecture, a
     *         second argument of options is a convenient way to accept inputs
     *         from your plugin's caller.
     */
    constructor(player, options) {

        super(player);

        this.options = videojs.mergeOptions(defaults, options);

        // Hide the remaining time replaced by timecode
        this.player.getChild('controlBar').getChild('remainingTimeDisplay').hide();

        this.player.ready(() => {

            this.player.addClass('vjs-frames');

            console.info('Player ready...');

            // Check if clipping should be enabled
            if(this.options.clippingEnabled){
                
                console.info('Clipping menu enabled');
                this.createClippingMenu(); 

            }

            this.createTimecodeMenu();

            this.createTimeDisplay(); 

            this.listen('time'); // start listening to the time 

        });

        this.on('switchTimecode', this.switchTimecode);

        this.on('updateDisplay', this.updateDisplay);

        this.on(player, ['seeking'], this.updateDisplay);

        this.on('seekTo', this.seekTo);

        this.on('updateClipping', this.updateClipping);


    }

    createTimeDisplay(){

        var that = this; 

        var TimeDisplay = videojs.extend(MenuButton, {
            constructor: function() {

                MenuButton.apply(this, arguments);

                this.addClass('vjs-timecode-menu');

            },

            handleClick: function() {

                that.trigger('switchTimecode', {
                    format: 'frames'
                });

            }
        });

        videojs.registerComponent('timeDisplay', TimeDisplay);

        this.player.getChild('controlBar').addChild('timeDisplay', {});

        this.player.getChild('controlBar').el().insertBefore(
            this.player.getChild('controlBar').getChild('timeDisplay').el(),
            this.player.getChild('controlBar').getChild('progressControl').el()
        );


    }

    createTimecodeMenu(){
 
        var that = this; 

        var TimecodeButton = videojs.extend(MenuButton, {
            constructor: function() {

                MenuButton.apply(this, arguments);

                this.addClass('vjs-button');
                this.controlText("Timecode");

                this.children_[0].addClass('vjs-fa-icon');
                this.children_[0].addClass('fa');
                this.children_[0].addClass('fa-clock-o');

                // Get the menu ul 
                var menuUL = this.el().children[1].children[0];

                var header = document.createElement("li");
                    header.className = 'vjs-om-menu-header';
                    header.innerHTML = 'Settings';

                menuUL.appendChild(header);

                var options = [{
                    title: 'Timecode',
                    id: 'SMPTE'
                },{
                    title: 'Frames',
                    id: 'frames'
                },{
                    title: 'Seconds',
                    id: 'seconds'
                },{
                    title: 'Milliseconds',
                    id: 'milliseconds'
                },{
                    title: 'Time',
                    id: 'time'
                }];

                var i;
                var classIndex = 100;
                for (i = 0; i < options.length; i++) {


                    var child = document.createElement("li");

                    child.className = 'vjs-menu-item';
                    
                    child.id = options[i].id;
                    
                    child.innerHTML = options[i].title + ' <span class="vjs-control-text"></span>';
                    
                    child.addEventListener('click', function() {
                        
                        that.trigger('switchTimecode', {
                            format: this.id
                        });

                        that.trigger('updateDisplay');

                    });

                    menuUL.appendChild(child);

                }

                this.el().children[1].appendChild(menuUL);

            },
            handleClick: function() {}
        });

        videojs.registerComponent('timecodeButton', TimecodeButton);

        this.player.getChild('controlBar').addChild('timecodeButton', {});

        this.player.getChild('controlBar').el().insertBefore(
            this.player.getChild('controlBar').getChild('timecodeButton').el(),
            this.player.getChild('controlBar').getChild('progressControl').el()
        );

    }

    createClippingMenu(){
 
        var that = this; 

        this.player.getChild('controlBar').getChild('progressControl').addChild('ClippingBar', {text: ''});

        var slider = document.getElementById('range');

        noUiSlider.create(slider, {
            start: [0, that.totalFrames()],
            connect: true,
            step: 1,
            range: {
                'min': 0,
                'max': parseInt(that.totalFrames())
            }
        });

        slider.noUiSlider.on('update', function(ind, ui){

            that.player.pause();
                
            if (ui === 0) {
                
                 that.seekTo({
                    frame: Math.round(ind[0])
                });
            
            } else {

                 that.seekTo({
                    frame: Math.round(ind[1])
                });
            
            }

        });

        this.player.getChild('controlBar').getChild('progressControl').getChild('ClippingBar').hide();

        var ClipButton = videojs.extend(MenuButton, {
            constructor: function() {

                MenuButton.apply(this, arguments);

                this.addClass('vjs-button');
                this.controlText("Clipping");

                this.children_[0].addClass('vjs-fa-icon');
                this.children_[0].addClass('fa');
                this.children_[0].addClass('fa-scissors');

                // Get the menu ul 
                var menuUL = this.el().children[1].children[0];

                var header = document.createElement("li");
                    header.className = 'vjs-om-menu-header';
                    header.innerHTML = 'Settings';

                menuUL.appendChild(header);

                var options = [{
                    title: 'Shortcuts',
                    id: 'shortcuts'
                },{
                    title: 'Partial Restore',
                    id: 'restore'
                },{
                    title: 'Enable',
                    id: 'enable'
                }];

                var i;
                var classIndex = 100;
                for (i = 0; i < options.length; i++) {


                    var child = document.createElement("li");
                    
                    child.className = 'vjs-menu-item';
                    
                    child.id = options[i].id;
                    
                    child.innerHTML = options[i].title + ' <span class="vjs-control-text"></span>';

                    child.addEventListener('click', function() {
                        
                        that.trigger('updateClipping', {
                            item: this.id
                        });

                    });
                    
                    menuUL.appendChild(child);

                }

                this.el().children[1].appendChild(menuUL);

            },
            handleClick: function() {}
        });

        videojs.registerComponent('clipButton', ClipButton);

        this.player.getChild('controlBar').addChild('clipButton', {});

        this.player.getChild('controlBar').el().insertBefore(
            this.player.getChild('controlBar').getChild('clipButton').el(),
            this.player.getChild('controlBar').getChild('progressControl').el()
        );

    }

    updateClipping(event, json) {

        switch (json.item) {
            case 'enable':
                
                if(this.options.clippingDisplayed){

                    this.player.getChild('controlBar').getChild('progressControl').getChild('seekBar').show();

                    this.player.getChild('controlBar').getChild('progressControl').getChild('ClippingBar').hide();
                    
                    this.options.clippingDisplayed = false;
                
                }else{ 
                    
                    this.player.getChild('controlBar').getChild('progressControl').getChild('seekBar').hide();

                    this.player.getChild('controlBar').getChild('progressControl').getChild('ClippingBar').show();

                    this.options.clippingDisplayed = true;
 
                }

            break;
          case 'restore':
                
                var slider = document.getElementById('range');

                var restore = slider.noUiSlider.get();

                alert(JSON.stringify(restore));

                return;

            break;
         
          default: 
            
            return;

        }

        
    }

    listen(format, tick) {

        var that = this;

        this.interval = setInterval(function() {

            if (that.player.paused() || that.player.ended()) {

                return;
 
            }

            that.trigger('updateDisplay');

        }, (tick ? tick : 1000 / this.options.frameRate));

    }

    updateDisplay(){

        // Create a loop if clipping enabled
        if(this.options.clippingEnabled && this.options.clippingDisplayed){
 
            if (!this.player.paused()){

                var slider = document.getElementById('range');

                var restore = slider.noUiSlider.get();
                
                if(this.toFrames() >= restore[1]){

                    this.seekTo({
                        frame: restore[0]
                    });

                }

            }

        }

        switch (this.options.format) {
            case 'SMPTE':
                
                this.player.getChild('controlBar').getChild('timeDisplay').el().innerText = this.toSMPTE();
                return this.toSMPTE();

            break;
          case 'time':
                
                this.player.getChild('controlBar').getChild('timeDisplay').el().innerText = this.toTime();
                return this.toTime();

            break;
          case 'frames':

                this.player.getChild('controlBar').getChild('timeDisplay').el().innerText = this.toFrames();
                return this.toFrames();
           
            break;
          case 'seconds':
                
                this.player.getChild('controlBar').getChild('timeDisplay').el().innerText = this.toSeconds();
                return this.toSeconds();

            break;
          case 'milliseconds':
                
                this.player.getChild('controlBar').getChild('timeDisplay').el().innerText = this.toMilliseconds();
                return this.toMilliseconds();

            break;
          default: 
            
            return this.toTime();

        }

    }

    stopListen() {

        clearInterval(this.interval);

    }

    getFrames() {
 
        return Math.floor(this.player.currentTime().toFixed(5) * this.options.frameRate);
    
    }

    totalFrames() {

        if(this.player.duration()){
        
            return Math.floor(this.player.duration().toFixed(5) * this.options.frameRate);
        
        }else{
            
            return 100;

        }
        
    }

    switchTimecode(event, json) {

        this.options.format = json.format;

    }    

    /**
     * Returns the current time code in the video in HH:MM:SS format
     * - used internally for conversion to SMPTE format.
     * 
     * @param  {Number} frames - The current time in the video
     * @return {String} Returns the time code in the video
     */
    toTime(frames) {
  
        var time = (typeof frames !== 'number' ? this.player.currentTime() : frames),
            frameRate = this.options.frameRate;
        
        var dt = (new Date()),
            format = 'hh:mm:ss' + (typeof frames === 'number' ? ':ff' : '');
        
        dt.setHours(0);
        
        dt.setMinutes(0);
        
        dt.setSeconds(0);
        
        dt.setMilliseconds(time * 1000);

        function wrap(n) {
            return ((n < 10) ? '0' + n : n);
        }

        return format.replace(/hh|mm|ss|ff/g, function(format) {
            switch (format) {
                case "hh":
                    return wrap(dt.getHours() < 13 ? dt.getHours() : (dt.getHours() - 12));
                case "mm":
                    return wrap(dt.getMinutes());
                case "ss":
                    return wrap(dt.getSeconds());
                case "ff":
                    return wrap(Math.floor(((time % 1) * frameRate)));
            }
        });

    }

    /**
     * Returns the current SMPTE Time code in the video.
     * - Can be used as a conversion utility.
     * 
     * @param  {Number} frame - OPTIONAL: Frame number for conversion to it's equivalent SMPTE Time code.
     * @return {String} Returns a SMPTE Time code in HH:MM:SS:FF format
     */
    toSMPTE(frame) {

        if (!frame) {
            
            return this.toTime(this.player.currentTime());

        }
        
        var frameNumber = Number(frame);
        
        var fps = this.options.frameRate;

        function wrap(n) {
            return ((n < 10) ? '0' + n : n);
        }
        
        var _hour = ((fps * 60) * 60),
            _minute = (fps * 60);
        
        var _hours = (frameNumber / _hour).toFixed(0);
        
        var _minutes = (Number((frameNumber / _minute).toString().split('.')[0]) % 60);
        
        var _seconds = (Number((frameNumber / fps).toString().split('.')[0]) % 60);
        
        var SMPTE = (wrap(_hours) + ':' + wrap(_minutes) + ':' + wrap(_seconds) + ':' + wrap(frameNumber % fps));
        
        return SMPTE;

    }

    /**
     * Converts a SMPTE Time code to Seconds
     * 
     * @param  {String} SMPTE - a SMPTE time code in HH:MM:SS:FF format
     * @return {Number} Returns the Second count of a SMPTE Time code
     */
    toSeconds(SMPTE) {

        if (!SMPTE) {
            return Math.floor(this.player.currentTime());
        }
        
        var time = SMPTE.split(':');
        
        return (((Number(time[0]) * 60) * 60) + (Number(time[1]) * 60) + Number(time[2]));

    }

    /**
     * Converts a SMPTE Time code, or standard time code to Milliseconds
     * 
     * @param  {String} SMPTE OPTIONAL: a SMPTE time code in HH:MM:SS:FF format,
     * or standard time code in HH:MM:SS format.
     * @return {Number} Returns the Millisecond count of a SMPTE Time code
     */
    toMilliseconds(SMPTE) {
   
        var frames = (!SMPTE) ? Number(this.toSMPTE().split(':')[3]) : Number(SMPTE.split(':')[3]);
        
        var milliseconds = (1000 / this.options.frameRate) * (isNaN(frames) ? 0 : frames);
        
        return Math.floor(((this.toSeconds(SMPTE) * 1000) + milliseconds));

    }

    /**
     * Converts a SMPTE Time code to it's equivalent frame number
     * 
     * @param  {String} SMPTE - OPTIONAL: a SMPTE time code in HH:MM:SS:FF format
     * @return {Number} Returns the long running video frame number
     */
    toFrames(SMPTE) {

        var time = (!SMPTE) ? this.toSMPTE().split(':') : SMPTE.split(':');
        
        var frameRate = this.options.frameRate;
        
        var hh = (((Number(time[0]) * 60) * 60) * frameRate);
        
        var mm = ((Number(time[1]) * 60) * frameRate);
        
        var ss = (Number(time[2]) * frameRate);
        
        var ff = Number(time[3]);
        
        return Math.floor((hh + mm + ss + ff));

    }

    /**
     * Private - seek method used internally for the seeking functionality.
     * 
     * @param  {String} direction - Accepted Values are: forward, backward
     * @param  {Number} frames - Number of frames to seek by.
     */
    seek(direction, frames) {
        
        if (!this.player.paused()) { this.player.pause(); }

        var frame = Number(this.getFrames());
        /** To seek forward in the video, we must add 0.00001 to the video runtime for proper interactivity */

        var currentTime = ((((direction === 'backward' ? (frame - frames) : (frame + frames))) / this.options.frameRate) + 0.00001);
        
        this.player.currentTime(currentTime);

    }

    /**
     * Seeks forward [X] amount of frames in the video.
     * 
     * @param  {Number} frames - Number of frames to seek by.
     * @param  {Function} callback - Callback function to execute once seeking is complete.
     */
    seekForward(frames, callback) {
        
        if (!frames) { frames = 1; }
        
        this.seek('forward', Number(frames));
        
        this.trigger('updateDisplay');
        
        return (callback ? callback() : true);

    }

    /**
     * Seeks backward [X] amount of frames in the video.
     * 
     * @param  {Number} frames - Number of frames to seek by.
     * @param  {Function} callback - Callback function to execute once seeking is complete.
     */
    seekBackward(frames, callback) {

        if (!frames) { frames = 1; }
        
        this.seek('backward', Number(frames));
        
        this.trigger('updateDisplay');
        
        return (callback ? callback() : true);

    }

    /**
     * For seeking to a certain SMPTE time code, standard time code, frame, second, or millisecond in the video.
     * - Was previously deemed not feasible. Veni, vidi, vici.
     *  
     * @param  {Object} option - Configuration Object for seeking allowed keys are SMPTE, time, frame, seconds, and milliseconds
     * example: { SMPTE: '00:01:12:22' }, { time: '00:01:12' },  { frame: 1750 }, { seconds: 72 }, { milliseconds: 72916 }
     */
    seekTo(config) {

        var obj = config || {}, seekTime, SMPTE;

        /** Only allow one option to be passed */
        var option = Object.keys(obj)[0];

        if (option == 'SMPTE' || option == 'time') {
        
            SMPTE = obj[option];
        
            seekTime = ((this.toMilliseconds(SMPTE) / 1000) + 0.001);
        
            this.player.currentTime(seekTime);

            return;
        
        }

        console.log('seekTo: option',option);

        switch(option) {

            case 'frame':
            
                SMPTE = this.toSMPTE(obj[option]);
            
                seekTime = ((this.toMilliseconds(SMPTE) / 1000) + 0.001);
            
                break;
            
            case 'seconds':
            
                seekTime = Number(obj[option]);
            
                break;
            
            case 'milliseconds':
            
                seekTime = ((Number(obj[option]) / 1000) + 0.001);
            
                break;
        
        }
        
        if (!isNaN(seekTime)) {

            this.player.currentTime(seekTime);
         
        }

    }

}

// Define default values for the plugin's `state` object here.
Frames.defaultState = {};

// Include the version number.
Frames.VERSION = VERSION;

// Register the plugin with video.js.
videojs.registerPlugin('frames', Frames);

export default Frames;