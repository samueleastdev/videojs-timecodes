import videojs from 'video.js';

import {
    version as VERSION
} from '../package.json';

import './components/clipping-ui.js';
import noUiSlider from '../node_modules/nouislider/distribute/nouislider.js';

import { BIFParser } from './parser.js';

import bifMouseTimeDisplay from './components/bif-mouse-time-display.js';

videojs.registerComponent('BIFMouseTimeDisplay', bifMouseTimeDisplay);

const VjsSeekBar = videojs.getComponent('SeekBar'); 

const vjsSeekBarChildren = VjsSeekBar.prototype.options_.children;

const mouseTimeDisplayIndex = vjsSeekBarChildren.indexOf('mouseTimeDisplay');

vjsSeekBarChildren.splice(mouseTimeDisplayIndex, 1, 'BIFMouseTimeDisplay');
 
const Plugin = videojs.getPlugin('plugin');
const MenuButton = videojs.getComponent('MenuButton');
const Menu = videojs.getComponent('Menu');
const Component = videojs.getComponent('Component');

// Default options for the plugin.
const defaults = {
    format: 'time', 
    clippingEnabled: true,
    clippingDisplayed: false,
    clippingUi: false
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

        super(player, options);

        this.options = videojs.mergeOptions(defaults, options);

        this.player.ready(() => {

            this.player.addClass('vjs-frames');

            var that = this;

            // ACTION FRAMERATE IF SET
            if(this.options.frameRate){

                this.initTimecode();

            }

            // ACTION CLIPPING IF SET
            if(this.options.clippingEnabled){

                this.initClipping();

            }

            // ACTION BIF IF SET
            if(this.options.bif){

                this.initBif();

            }

            // ACTION META IF SET
            if(this.options.meta){

                this.initMetaTimeline();

            }

            // ACTION NETWORk IF SET
            if(this.options.network){

                this.initMetaNetwork();

            }

        });

    }

    initTimecode(){

        console.log('framerate');

        // Hide the remaining time replaced by timecode
        this.player.getChild('controlBar').getChild('remainingTimeDisplay').hide();

        // Create timecode menu should only be set if a framerate is set
        this.createTimecodeMenu();

        // Show the time formatted
        this.createTimeDisplay(); 

        this.on('switchTimecode', this.switchTimecode);

        this.on('updateDisplay', this.updateDisplay);

        this.on(this.player, ['seeking'], this.updateDisplay);

        this.on('seekTo', this.seekTo);

        // Only start the timer if framerate isset
        this.listen('time');

    }

    initClipping(){
        
        var that = this;

        this.one(this.player, ['timeupdate'], function(){

            that.createClippingMenu();

        });

    }

    initBif(){

        var that = this;

        const { BIFMouseTimeDisplay } = this.player.controlBar.progressControl.seekBar;
               
        this.player.addClass('video-has-bif');

        const request = new XMLHttpRequest();

        request.open('GET', this.options.bif, true);

        request.responseType = 'arraybuffer';

        request.onload = (event) => {

            if (event.target.status !== 200) {
              return;
            }

            BIFMouseTimeDisplay.render({
              data: event.target.response,
            });

            BIFMouseTimeDisplay.renderSlider({
              data: event.target.response,
            });

        };

        request.send(null);

        this.player.controlBar.progressControl.on('mousemove', function(event) {

            if(that.options.clippingDisplayed === false){

                BIFMouseTimeDisplay.handleProgressBarMove(event, this.el().offsetLeft);

            }
         
        });

        this.player.controlBar.progressControl.on('mouseout', function(event) {

            if(that.options.clippingDisplayed === false){

                BIFMouseTimeDisplay.handleProgressBarOut();

            }

        });

        // Add listners for bif clipping
        this.on('updateClipping', this.updateClipping);

        this.on('partialRestore', this.partialRestore);

        this.on(this.player, ['timeupdate'], this.updateProgressCircle);
        
    }

    initMetaTimeline(){
        
        this.on(this.player, ['loadedmetadata'], this.createMetaDisplay);

    }

    initMetaNetwork(){
        
        this.on(this.player, ['loadedmetadata'], this.createMetaNetwork);

    }

    createMetaDisplay(){

        var that = this;

        var total = (this.player.duration()*1000);

        var gDate = '1970-01-01 00:00:00 GMT'; // Needs to be the begining of the date object

        const request = new XMLHttpRequest();

        request.open('GET', this.options.meta, true);

        request.onload = (event) => {

            if (event.target.status !== 200) {
              return;
            }

            var meta = JSON.parse(event.target.response);

            var setItems = [];
            for (var i = 0; i < meta.length; i++) {

                var time = new Date(gDate);
                time.setMilliseconds(meta[i].Timestamp);

                var end = new Date(gDate);
                end.setMilliseconds(meta[i].Timestamp + 15000);

                var d = {
                    id: i, 
                    title: meta[i].Timestamp, 
                    content: meta[i].Celebrity.Name, 
                    start: time,
                    //end: end,
                    data: meta[i]
                };

                if(i === 3){
                    //d.end = end; 
                }
                setItems.push(d);

            }

            var last = new Date(gDate);
            last.setMilliseconds(total);

            // DOM element where the Timeline will be attached
            var container = document.getElementById('visualization');

              // Create a DataSet (allows two way data-binding)
            var items = new vis.DataSet(setItems);

            //134000 full time in milliseconds

              // Configuration for the Timeline
            var options = {
                start: new Date(gDate),
                end: last,
                min: new Date(gDate),
                max: last,
                editable: false,
                showMajorLabels: false,
                format: {
                    minorLabels: function (date, scale, step) { 

                        switch (scale) {
                            case 'millisecond':
                                return new Date(date).getTime() + "ms";
                            case 'second':
                                var seconds = Math.round(new Date(date).getTime() / 1000);
                                return seconds + "s";
                            case 'minute':
                                var minutes = Math.round(new Date(date).getTime() / 1000 * 60);
                                return minutes + "m";
                            break;
                            default:

                        }

                    },
                    majorLabels: function (date, scale, step) { 
                        return "" 
                    }
                }
            };

              // Create a Timeline
            var timeline = new vis.Timeline(container, items, options);

            timeline.addCustomTime('2017-03-04 00:01:00');

            timeline.on('select', function (properties) {

                var data = items.get(properties.items)[0];

                if(data.data){
                    
                    that.player.play();

                    that.seekTo({
                        milliseconds: data.data.Timestamp
                    });

                    that.player.pause();

                }

            });

            $('[data-toggle="tooltip"]').tooltip();

        };

        request.send(null);
        

    }

    groupBy(objectArray, property) {
        
        return objectArray.reduce(function (acc, obj) {
            var key = obj[property].Name;
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(obj);
            return acc;
        }, {});
    }

    createMetaNetwork(){

        var nodes = [];
        var edges = null;
        var network = null;

        const request = new XMLHttpRequest();

        request.open('GET', this.options.network, true);

        request.onload = (event) => {

            if (event.target.status !== 200) {
              return;
            }

            var meta = JSON.parse(event.target.response);

            var grouped = this.groupBy(meta, 'Label');

            //console.log('grouped',grouped);

            var setItems = [];

            Object.keys(grouped).forEach(function(key, index) {

                //console.log(index);
                //console.log(key, grouped[key]);
                setItems.push({
                    id: index,  
                    value: grouped[key].length,  
                    label: key,  
                    data: grouped[key] 
                });

            });

            // Instantiate our network object.
            var container = document.getElementById('mynetwork');

            var nodes = new vis.DataSet(setItems);

            var data = {
                nodes: nodes,
                //edges: edges
            };
            var options = {
                nodes: {
                    shape: 'dot',
                    borderWidth: 0,
                    size: 50,
                    color: {
                        border: '#222222',
                        background: 'grey'
                    },
                    font: {
                        color: 'black',
                        size: 40,
                        face: 'arial',
                    },
                    margin: {
                        top: 20,
                        bottom: 20,
                        left: 20,
                        right: 20
                    }
                },
                physics: {
                    forceAtlas2Based: {
                        gravitationalConstant: -350,
                        centralGravity: 0.05,
                        springLength: 400,
                        springConstant: 0.01,
                        avoidOverlap: 50
                    },
                    maxVelocity: 20,
                    minVelocity: 0,
                    solver: 'forceAtlas2Based',
                    timestep: 0.10,
                    stabilization: {
                        enabled: false,
                        iterations: 0
                    }
                },
                interaction: {
                    multiselect: true,
                    dragView: true
                },
                edges: {
                    smooth: false,
                    arrows: {
                        to: true
                    }
                }
            };
            network = new vis.Network(container, data, options);

            network.on( 'click', function(properties) {
                
                var ids = properties.nodes;
                var clickedNodes = nodes.get(ids);
                //console.log('I\'m clicked',clickedNodes );

                var children = clickedNodes[0];
                if(children.data){

                    var newItems = [];
                    for (var i = 0; i < children.data.length; i++) {

                        newItems.push({
                            id: i,  
                            value: 1,  
                            label: 'Timestamp' + children.data[i].Timestamp,  
                            data: children.data[i]
                        });

                    }

                    nodes.clear();
                    nodes.update(newItems);
                    
                    network.redraw();

                }

            });

                

        };

        request.send(null);

        return;
        

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
                this.children_[0].addClass('far');
                this.children_[0].addClass('fa-clock');

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

        console.log('createClippingMenu');

        this.player.getChild('controlBar').getChild('progressControl').addChild('ClippingBar', {text: ''});

        this.player.getChild('controlBar').getChild('progressControl').getChild('ClippingBar').hide();

        var ClipButton = videojs.extend(MenuButton, {
            constructor: function() {

                MenuButton.apply(this, arguments);

                this.addClass('vjs-button');
                this.controlText("Clipping");

                this.children_[0].addClass('vjs-fa-icon');
                this.children_[0].addClass('fas');
                this.children_[0].addClass('fa-cut');

                // Get the menu ul 
                var menuUL = this.el().children[1].children[0];

                var header = document.createElement("li");
                    header.className = 'vjs-om-menu-header';
                    header.innerHTML = 'Clipping';

                menuUL.appendChild(header);

                var options = [{
                    title: 'Enable Clipping',
                    id: 'enable'
                },{
                    title: 'Partial Restore',
                    id: 'restore'
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

    initClippingUi(){

        // Only init once
        if(this.options.clippingUi === true){
            
            return;
        
        }

        this.options.clippingUi = true;

        var that = this;

        var slider = document.getElementById(this.player.id() + '_range');

        noUiSlider.create(slider, {
            start: [0, that.totalFrames()],
            connect: true,
            step: 1,
            range: {
                'min': 0,
                'max': that.totalFrames()
            }
        });

        var base = slider.getElementsByClassName('noUi-base')[0];

        var elProgress = document.createElement('div');

        elProgress.className = 'noUi-progress';

        base.appendChild(elProgress);        

        const { BIFMouseTimeDisplay } = this.player.controlBar.progressControl.seekBar;

        slider.noUiSlider.on('start', function(ind, ui, event){

            that.player.addClass('video-is-dragging');

        });

        slider.noUiSlider.on('update', function(ind, ui, event){

            var percentage = Math.floor((event[ui]/parseInt(that.totalFrames()))*100);

            that.player.pause();

            var lower = (slider.getElementsByClassName('noUi-handle-lower')[0].getBoundingClientRect().x - that.player.el().getBoundingClientRect().x);
            var upper = (slider.getElementsByClassName('noUi-handle-upper')[0].getBoundingClientRect().x - that.player.el().getBoundingClientRect().x);

            BIFMouseTimeDisplay.handleSliderMove({
                left: (ui === 0) ? Math.floor(lower + 10) : Math.floor(upper + 10),
                percentage: percentage
            });

            console.log({
                frame: Math.round(event[ui]),
                ui: ui
            });

            that.seekTo({
                frame: Math.round(event[ui]),
                ui: ui
            });

        });

        slider.noUiSlider.on('end', function(ind, ui, event){

            BIFMouseTimeDisplay.handleSliderOut();

        });

    }

    updateProgressCircle(){

        var slider = document.getElementById(this.player.id() + '_range');
        var base = slider.getElementsByClassName('noUi-progress')[0];
        if(base){
            base.style.left = (this.player.currentTime() / this.player.duration() * 100) + '%';
        }

    }

    updateClipping(event, json) {

        var slider = document.getElementById(this.player.id());
        var shortcutOverlay = slider.getElementsByClassName('shortcutOverlay')[0];

        switch (json.item) {
            case 'enable':
                
                if(this.options.clippingDisplayed){

                    // Clipping is disable
                    document.getElementById(json.item).innerText = 'Enable Clipping';

                    this.player.getChild('controlBar').getChild('progressControl').getChild('seekBar').show();

                    this.player.getChild('controlBar').getChild('progressControl').getChild('ClippingBar').hide();

                    if(shortcutOverlay){
                        shortcutOverlay.style.display = 'none';
                    }

                    this.options.clippingDisplayed = false;
                
                }else{ 

                    // Hide the focus bif functionality
                    var elements = document.getElementsByClassName('bif-thumbnail');

                    for (var i = 0; i < elements.length; i++){
                        elements[i].style.display = 'none';
                    }

                    // Clipping is enabled
                    document.getElementById(json.item).innerText = 'Disable Clipping';
                    
                    this.player.getChild('controlBar').getChild('progressControl').getChild('seekBar').hide();

                    this.player.getChild('controlBar').getChild('progressControl').getChild('ClippingBar').show();

                    if(shortcutOverlay){
                        shortcutOverlay.style.display = 'block';
                    }

                    this.options.clippingDisplayed = true;

                    this.initClippingUi();
 
                }

            break;
          case 'restore':

                this.trigger('partialRestore');

                return;

            break;
         
          default: 
            
            return;

        }

        
    }

    partialRestore(callback) {

        callback(this.options);        

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

                var slider = document.getElementById(this.player.id() + '_range');

                var restore = slider.noUiSlider.get();
                
                if(this.toFrames() >= restore[1]){

                    this.seekTo({
                        frame: restore[0]
                    });

                }

            }

        }

        const { BIFMouseTimeDisplay } = this.player.controlBar.progressControl.seekBar;

        switch (this.options.format) {
            case 'SMPTE':
                
                this.player.getChild('controlBar').getChild('timeDisplay').el().innerText = this.toSMPTE();

                BIFMouseTimeDisplay.setSliderTime(this.toSMPTE());

                return this.toSMPTE();

            break;
          case 'time':
                
                this.player.getChild('controlBar').getChild('timeDisplay').el().innerText = this.toTime();

                BIFMouseTimeDisplay.setSliderTime(this.toTime());

                return this.toTime();

            break;
          case 'frames':

                this.player.getChild('controlBar').getChild('timeDisplay').el().innerText = this.toFrames();

                BIFMouseTimeDisplay.setSliderTime(this.toFrames());

                return this.toFrames();
           
            break;
          case 'seconds':
                
                this.player.getChild('controlBar').getChild('timeDisplay').el().innerText = this.toSeconds();

                BIFMouseTimeDisplay.setSliderTime(this.toSeconds());

                return this.toSeconds();

            break;
          case 'milliseconds':
                
                this.player.getChild('controlBar').getChild('timeDisplay').el().innerText = this.toMilliseconds();

                BIFMouseTimeDisplay.setSliderTime(this.toMilliseconds());

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
            
            if(this.options.frameRate){

                return Math.floor(this.player.duration().toFixed(5) * this.options.frameRate);

            }else{

                return Math.floor(this.player.duration());
                
            }
        
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
    seekTo(config, ui) {

        var obj = config || {}, seekTime, SMPTE;

        /** Only allow one option to be passed */
        var option = Object.keys(obj)[0];

        if (option == 'SMPTE' || option == 'time') {
        
            SMPTE = obj[option];
        
            seekTime = ((this.toMilliseconds(SMPTE) / 1000) + 0.001);
        
            this.player.currentTime(seekTime);

            return;
        
        }

        console.log('obj',obj);

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

            if(obj.hasOwnProperty('ui')){

                if(obj.ui === 0){
            
                    this.options.inSMPTE  = this.toSMPTE();
                
                }else{
                    
                    this.options.outSMPTE = this.toSMPTE();

                }

            }
         
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