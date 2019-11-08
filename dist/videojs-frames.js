/*! @name videojs-frames @version 0.0.4 @license MIT */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('video.js')) :
  typeof define === 'function' && define.amd ? define(['video.js'], factory) :
  (global = global || self, global.videojsFrames = factory(global.videojs));
}(this, function (videojs) { 'use strict';

  videojs = videojs && videojs.hasOwnProperty('default') ? videojs['default'] : videojs;

  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;
    subClass.__proto__ = superClass;
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  var version = "0.0.4";

  var Component = videojs.getComponent('Component');
  var ClippingBar = videojs.extend(Component, {
    constructor: function constructor(player, options) {
      Component.apply(this, arguments);
    },
    createEl: function createEl() {
      return videojs.dom.createEl('div', {
        className: 'g-ranger',
        id: this.player().id() + '_range'
      });
    }
  });
  videojs.registerComponent('ClippingBar', ClippingBar);

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var nouislider = createCommonjsModule(function (module, exports) {
  /*! nouislider - 14.0.2 - 6/28/2019 */
  (function(factory) {
      {
          // Node/CommonJS
          module.exports = factory();
      }
  })(function() {

      var VERSION = "14.0.2";

      //region Helper Methods

      function isValidFormatter(entry) {
          return typeof entry === "object" && typeof entry.to === "function" && typeof entry.from === "function";
      }

      function removeElement(el) {
          el.parentElement.removeChild(el);
      }

      function isSet(value) {
          return value !== null && value !== undefined;
      }

      // Bindable version
      function preventDefault(e) {
          e.preventDefault();
      }

      // Removes duplicates from an array.
      function unique(array) {
          return array.filter(function(a) {
              return !this[a] ? (this[a] = true) : false;
          }, {});
      }

      // Round a value to the closest 'to'.
      function closest(value, to) {
          return Math.round(value / to) * to;
      }

      // Current position of an element relative to the document.
      function offset(elem, orientation) {
          var rect = elem.getBoundingClientRect();
          var doc = elem.ownerDocument;
          var docElem = doc.documentElement;
          var pageOffset = getPageOffset(doc);

          // getBoundingClientRect contains left scroll in Chrome on Android.
          // I haven't found a feature detection that proves this. Worst case
          // scenario on mis-match: the 'tap' feature on horizontal sliders breaks.
          if (/webkit.*Chrome.*Mobile/i.test(navigator.userAgent)) {
              pageOffset.x = 0;
          }

          return orientation
              ? rect.top + pageOffset.y - docElem.clientTop
              : rect.left + pageOffset.x - docElem.clientLeft;
      }

      // Checks whether a value is numerical.
      function isNumeric(a) {
          return typeof a === "number" && !isNaN(a) && isFinite(a);
      }

      // Sets a class and removes it after [duration] ms.
      function addClassFor(element, className, duration) {
          if (duration > 0) {
              addClass(element, className);
              setTimeout(function() {
                  removeClass(element, className);
              }, duration);
          }
      }

      // Limits a value to 0 - 100
      function limit(a) {
          return Math.max(Math.min(a, 100), 0);
      }

      // Wraps a variable as an array, if it isn't one yet.
      // Note that an input array is returned by reference!
      function asArray(a) {
          return Array.isArray(a) ? a : [a];
      }

      // Counts decimals
      function countDecimals(numStr) {
          numStr = String(numStr);
          var pieces = numStr.split(".");
          return pieces.length > 1 ? pieces[1].length : 0;
      }

      // http://youmightnotneedjquery.com/#add_class
      function addClass(el, className) {
          if (el.classList) {
              el.classList.add(className);
          } else {
              el.className += " " + className;
          }
      }

      // http://youmightnotneedjquery.com/#remove_class
      function removeClass(el, className) {
          if (el.classList) {
              el.classList.remove(className);
          } else {
              el.className = el.className.replace(
                  new RegExp("(^|\\b)" + className.split(" ").join("|") + "(\\b|$)", "gi"),
                  " "
              );
          }
      }

      // https://plainjs.com/javascript/attributes/adding-removing-and-testing-for-classes-9/
      function hasClass(el, className) {
          return el.classList
              ? el.classList.contains(className)
              : new RegExp("\\b" + className + "\\b").test(el.className);
      }

      // https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollY#Notes
      function getPageOffset(doc) {
          var supportPageOffset = window.pageXOffset !== undefined;
          var isCSS1Compat = (doc.compatMode || "") === "CSS1Compat";
          var x = supportPageOffset
              ? window.pageXOffset
              : isCSS1Compat
                  ? doc.documentElement.scrollLeft
                  : doc.body.scrollLeft;
          var y = supportPageOffset
              ? window.pageYOffset
              : isCSS1Compat
                  ? doc.documentElement.scrollTop
                  : doc.body.scrollTop;

          return {
              x: x,
              y: y
          };
      }

      // we provide a function to compute constants instead
      // of accessing window.* as soon as the module needs it
      // so that we do not compute anything if not needed
      function getActions() {
          // Determine the events to bind. IE11 implements pointerEvents without
          // a prefix, which breaks compatibility with the IE10 implementation.
          return window.navigator.pointerEnabled
              ? {
                    start: "pointerdown",
                    move: "pointermove",
                    end: "pointerup"
                }
              : window.navigator.msPointerEnabled
                  ? {
                        start: "MSPointerDown",
                        move: "MSPointerMove",
                        end: "MSPointerUp"
                    }
                  : {
                        start: "mousedown touchstart",
                        move: "mousemove touchmove",
                        end: "mouseup touchend"
                    };
      }

      // https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md
      // Issue #785
      function getSupportsPassive() {
          var supportsPassive = false;

          /* eslint-disable */
          try {
              var opts = Object.defineProperty({}, "passive", {
                  get: function() {
                      supportsPassive = true;
                  }
              });

              window.addEventListener("test", null, opts);
          } catch (e) {}
          /* eslint-enable */

          return supportsPassive;
      }

      function getSupportsTouchActionNone() {
          return window.CSS && CSS.supports && CSS.supports("touch-action", "none");
      }

      //endregion

      //region Range Calculation

      // Determine the size of a sub-range in relation to a full range.
      function subRangeRatio(pa, pb) {
          return 100 / (pb - pa);
      }

      // (percentage) How many percent is this value of this range?
      function fromPercentage(range, value) {
          return (value * 100) / (range[1] - range[0]);
      }

      // (percentage) Where is this value on this range?
      function toPercentage(range, value) {
          return fromPercentage(range, range[0] < 0 ? value + Math.abs(range[0]) : value - range[0]);
      }

      // (value) How much is this percentage on this range?
      function isPercentage(range, value) {
          return (value * (range[1] - range[0])) / 100 + range[0];
      }

      function getJ(value, arr) {
          var j = 1;

          while (value >= arr[j]) {
              j += 1;
          }

          return j;
      }

      // (percentage) Input a value, find where, on a scale of 0-100, it applies.
      function toStepping(xVal, xPct, value) {
          if (value >= xVal.slice(-1)[0]) {
              return 100;
          }

          var j = getJ(value, xVal);
          var va = xVal[j - 1];
          var vb = xVal[j];
          var pa = xPct[j - 1];
          var pb = xPct[j];

          return pa + toPercentage([va, vb], value) / subRangeRatio(pa, pb);
      }

      // (value) Input a percentage, find where it is on the specified range.
      function fromStepping(xVal, xPct, value) {
          // There is no range group that fits 100
          if (value >= 100) {
              return xVal.slice(-1)[0];
          }

          var j = getJ(value, xPct);
          var va = xVal[j - 1];
          var vb = xVal[j];
          var pa = xPct[j - 1];
          var pb = xPct[j];

          return isPercentage([va, vb], (value - pa) * subRangeRatio(pa, pb));
      }

      // (percentage) Get the step that applies at a certain value.
      function getStep(xPct, xSteps, snap, value) {
          if (value === 100) {
              return value;
          }

          var j = getJ(value, xPct);
          var a = xPct[j - 1];
          var b = xPct[j];

          // If 'snap' is set, steps are used as fixed points on the slider.
          if (snap) {
              // Find the closest position, a or b.
              if (value - a > (b - a) / 2) {
                  return b;
              }

              return a;
          }

          if (!xSteps[j - 1]) {
              return value;
          }

          return xPct[j - 1] + closest(value - xPct[j - 1], xSteps[j - 1]);
      }

      function handleEntryPoint(index, value, that) {
          var percentage;

          // Wrap numerical input in an array.
          if (typeof value === "number") {
              value = [value];
          }

          // Reject any invalid input, by testing whether value is an array.
          if (!Array.isArray(value)) {
              throw new Error("noUiSlider (" + VERSION + "): 'range' contains invalid value.");
          }

          // Covert min/max syntax to 0 and 100.
          if (index === "min") {
              percentage = 0;
          } else if (index === "max") {
              percentage = 100;
          } else {
              percentage = parseFloat(index);
          }

          // Check for correct input.
          if (!isNumeric(percentage) || !isNumeric(value[0])) {
              throw new Error("noUiSlider (" + VERSION + "): 'range' value isn't numeric.");
          }

          // Store values.
          that.xPct.push(percentage);
          that.xVal.push(value[0]);

          // NaN will evaluate to false too, but to keep
          // logging clear, set step explicitly. Make sure
          // not to override the 'step' setting with false.
          if (!percentage) {
              if (!isNaN(value[1])) {
                  that.xSteps[0] = value[1];
              }
          } else {
              that.xSteps.push(isNaN(value[1]) ? false : value[1]);
          }

          that.xHighestCompleteStep.push(0);
      }

      function handleStepPoint(i, n, that) {
          // Ignore 'false' stepping.
          if (!n) {
              return;
          }

          // Step over zero-length ranges (#948);
          if (that.xVal[i] === that.xVal[i + 1]) {
              that.xSteps[i] = that.xHighestCompleteStep[i] = that.xVal[i];

              return;
          }

          // Factor to range ratio
          that.xSteps[i] =
              fromPercentage([that.xVal[i], that.xVal[i + 1]], n) / subRangeRatio(that.xPct[i], that.xPct[i + 1]);

          var totalSteps = (that.xVal[i + 1] - that.xVal[i]) / that.xNumSteps[i];
          var highestStep = Math.ceil(Number(totalSteps.toFixed(3)) - 1);
          var step = that.xVal[i] + that.xNumSteps[i] * highestStep;

          that.xHighestCompleteStep[i] = step;
      }

      //endregion

      //region Spectrum

      function Spectrum(entry, snap, singleStep) {
          this.xPct = [];
          this.xVal = [];
          this.xSteps = [singleStep || false];
          this.xNumSteps = [false];
          this.xHighestCompleteStep = [];

          this.snap = snap;

          var index;
          var ordered = []; // [0, 'min'], [1, '50%'], [2, 'max']

          // Map the object keys to an array.
          for (index in entry) {
              if (entry.hasOwnProperty(index)) {
                  ordered.push([entry[index], index]);
              }
          }

          // Sort all entries by value (numeric sort).
          if (ordered.length && typeof ordered[0][0] === "object") {
              ordered.sort(function(a, b) {
                  return a[0][0] - b[0][0];
              });
          } else {
              ordered.sort(function(a, b) {
                  return a[0] - b[0];
              });
          }

          // Convert all entries to subranges.
          for (index = 0; index < ordered.length; index++) {
              handleEntryPoint(ordered[index][1], ordered[index][0], this);
          }

          // Store the actual step values.
          // xSteps is sorted in the same order as xPct and xVal.
          this.xNumSteps = this.xSteps.slice(0);

          // Convert all numeric steps to the percentage of the subrange they represent.
          for (index = 0; index < this.xNumSteps.length; index++) {
              handleStepPoint(index, this.xNumSteps[index], this);
          }
      }

      Spectrum.prototype.getMargin = function(value) {
          var step = this.xNumSteps[0];

          if (step && (value / step) % 1 !== 0) {
              throw new Error("noUiSlider (" + VERSION + "): 'limit', 'margin' and 'padding' must be divisible by step.");
          }

          return this.xPct.length === 2 ? fromPercentage(this.xVal, value) : false;
      };

      Spectrum.prototype.toStepping = function(value) {
          value = toStepping(this.xVal, this.xPct, value);

          return value;
      };

      Spectrum.prototype.fromStepping = function(value) {
          return fromStepping(this.xVal, this.xPct, value);
      };

      Spectrum.prototype.getStep = function(value) {
          value = getStep(this.xPct, this.xSteps, this.snap, value);

          return value;
      };

      Spectrum.prototype.getDefaultStep = function(value, isDown, size) {
          var j = getJ(value, this.xPct);

          // When at the top or stepping down, look at the previous sub-range
          if (value === 100 || (isDown && value === this.xPct[j - 1])) {
              j = Math.max(j - 1, 1);
          }

          return (this.xVal[j] - this.xVal[j - 1]) / size;
      };

      Spectrum.prototype.getNearbySteps = function(value) {
          var j = getJ(value, this.xPct);

          return {
              stepBefore: {
                  startValue: this.xVal[j - 2],
                  step: this.xNumSteps[j - 2],
                  highestStep: this.xHighestCompleteStep[j - 2]
              },
              thisStep: {
                  startValue: this.xVal[j - 1],
                  step: this.xNumSteps[j - 1],
                  highestStep: this.xHighestCompleteStep[j - 1]
              },
              stepAfter: {
                  startValue: this.xVal[j],
                  step: this.xNumSteps[j],
                  highestStep: this.xHighestCompleteStep[j]
              }
          };
      };

      Spectrum.prototype.countStepDecimals = function() {
          var stepDecimals = this.xNumSteps.map(countDecimals);
          return Math.max.apply(null, stepDecimals);
      };

      // Outside testing
      Spectrum.prototype.convert = function(value) {
          return this.getStep(this.toStepping(value));
      };

      //endregion

      //region Options

      /*	Every input option is tested and parsed. This'll prevent
          endless validation in internal methods. These tests are
          structured with an item for every option available. An
          option can be marked as required by setting the 'r' flag.
          The testing function is provided with three arguments:
              - The provided value for the option;
              - A reference to the options object;
              - The name for the option;

          The testing function returns false when an error is detected,
          or true when everything is OK. It can also modify the option
          object, to make sure all values can be correctly looped elsewhere. */

      var defaultFormatter = {
          to: function(value) {
              return value !== undefined && value.toFixed(2);
          },
          from: Number
      };

      function validateFormat(entry) {
          // Any object with a to and from method is supported.
          if (isValidFormatter(entry)) {
              return true;
          }

          throw new Error("noUiSlider (" + VERSION + "): 'format' requires 'to' and 'from' methods.");
      }

      function testStep(parsed, entry) {
          if (!isNumeric(entry)) {
              throw new Error("noUiSlider (" + VERSION + "): 'step' is not numeric.");
          }

          // The step option can still be used to set stepping
          // for linear sliders. Overwritten if set in 'range'.
          parsed.singleStep = entry;
      }

      function testRange(parsed, entry) {
          // Filter incorrect input.
          if (typeof entry !== "object" || Array.isArray(entry)) {
              throw new Error("noUiSlider (" + VERSION + "): 'range' is not an object.");
          }

          // Catch missing start or end.
          if (entry.min === undefined || entry.max === undefined) {
              throw new Error("noUiSlider (" + VERSION + "): Missing 'min' or 'max' in 'range'.");
          }

          // Catch equal start or end.
          if (entry.min === entry.max) {
              throw new Error("noUiSlider (" + VERSION + "): 'range' 'min' and 'max' cannot be equal.");
          }

          parsed.spectrum = new Spectrum(entry, parsed.snap, parsed.singleStep);
      }

      function testStart(parsed, entry) {
          entry = asArray(entry);

          // Validate input. Values aren't tested, as the public .val method
          // will always provide a valid location.
          if (!Array.isArray(entry) || !entry.length) {
              throw new Error("noUiSlider (" + VERSION + "): 'start' option is incorrect.");
          }

          // Store the number of handles.
          parsed.handles = entry.length;

          // When the slider is initialized, the .val method will
          // be called with the start options.
          parsed.start = entry;
      }

      function testSnap(parsed, entry) {
          // Enforce 100% stepping within subranges.
          parsed.snap = entry;

          if (typeof entry !== "boolean") {
              throw new Error("noUiSlider (" + VERSION + "): 'snap' option must be a boolean.");
          }
      }

      function testAnimate(parsed, entry) {
          // Enforce 100% stepping within subranges.
          parsed.animate = entry;

          if (typeof entry !== "boolean") {
              throw new Error("noUiSlider (" + VERSION + "): 'animate' option must be a boolean.");
          }
      }

      function testAnimationDuration(parsed, entry) {
          parsed.animationDuration = entry;

          if (typeof entry !== "number") {
              throw new Error("noUiSlider (" + VERSION + "): 'animationDuration' option must be a number.");
          }
      }

      function testConnect(parsed, entry) {
          var connect = [false];
          var i;

          // Map legacy options
          if (entry === "lower") {
              entry = [true, false];
          } else if (entry === "upper") {
              entry = [false, true];
          }

          // Handle boolean options
          if (entry === true || entry === false) {
              for (i = 1; i < parsed.handles; i++) {
                  connect.push(entry);
              }

              connect.push(false);
          }

          // Reject invalid input
          else if (!Array.isArray(entry) || !entry.length || entry.length !== parsed.handles + 1) {
              throw new Error("noUiSlider (" + VERSION + "): 'connect' option doesn't match handle count.");
          } else {
              connect = entry;
          }

          parsed.connect = connect;
      }

      function testOrientation(parsed, entry) {
          // Set orientation to an a numerical value for easy
          // array selection.
          switch (entry) {
              case "horizontal":
                  parsed.ort = 0;
                  break;
              case "vertical":
                  parsed.ort = 1;
                  break;
              default:
                  throw new Error("noUiSlider (" + VERSION + "): 'orientation' option is invalid.");
          }
      }

      function testMargin(parsed, entry) {
          if (!isNumeric(entry)) {
              throw new Error("noUiSlider (" + VERSION + "): 'margin' option must be numeric.");
          }

          // Issue #582
          if (entry === 0) {
              return;
          }

          parsed.margin = parsed.spectrum.getMargin(entry);

          if (!parsed.margin) {
              throw new Error("noUiSlider (" + VERSION + "): 'margin' option is only supported on linear sliders.");
          }
      }

      function testLimit(parsed, entry) {
          if (!isNumeric(entry)) {
              throw new Error("noUiSlider (" + VERSION + "): 'limit' option must be numeric.");
          }

          parsed.limit = parsed.spectrum.getMargin(entry);

          if (!parsed.limit || parsed.handles < 2) {
              throw new Error(
                  "noUiSlider (" +
                      VERSION +
                      "): 'limit' option is only supported on linear sliders with 2 or more handles."
              );
          }
      }

      function testPadding(parsed, entry) {
          if (!isNumeric(entry) && !Array.isArray(entry)) {
              throw new Error(
                  "noUiSlider (" + VERSION + "): 'padding' option must be numeric or array of exactly 2 numbers."
              );
          }

          if (Array.isArray(entry) && !(entry.length === 2 || isNumeric(entry[0]) || isNumeric(entry[1]))) {
              throw new Error(
                  "noUiSlider (" + VERSION + "): 'padding' option must be numeric or array of exactly 2 numbers."
              );
          }

          if (entry === 0) {
              return;
          }

          if (!Array.isArray(entry)) {
              entry = [entry, entry];
          }

          // 'getMargin' returns false for invalid values.
          parsed.padding = [parsed.spectrum.getMargin(entry[0]), parsed.spectrum.getMargin(entry[1])];

          if (parsed.padding[0] === false || parsed.padding[1] === false) {
              throw new Error("noUiSlider (" + VERSION + "): 'padding' option is only supported on linear sliders.");
          }

          if (parsed.padding[0] < 0 || parsed.padding[1] < 0) {
              throw new Error("noUiSlider (" + VERSION + "): 'padding' option must be a positive number(s).");
          }

          if (parsed.padding[0] + parsed.padding[1] > 100) {
              throw new Error("noUiSlider (" + VERSION + "): 'padding' option must not exceed 100% of the range.");
          }
      }

      function testDirection(parsed, entry) {
          // Set direction as a numerical value for easy parsing.
          // Invert connection for RTL sliders, so that the proper
          // handles get the connect/background classes.
          switch (entry) {
              case "ltr":
                  parsed.dir = 0;
                  break;
              case "rtl":
                  parsed.dir = 1;
                  break;
              default:
                  throw new Error("noUiSlider (" + VERSION + "): 'direction' option was not recognized.");
          }
      }

      function testBehaviour(parsed, entry) {
          // Make sure the input is a string.
          if (typeof entry !== "string") {
              throw new Error("noUiSlider (" + VERSION + "): 'behaviour' must be a string containing options.");
          }

          // Check if the string contains any keywords.
          // None are required.
          var tap = entry.indexOf("tap") >= 0;
          var drag = entry.indexOf("drag") >= 0;
          var fixed = entry.indexOf("fixed") >= 0;
          var snap = entry.indexOf("snap") >= 0;
          var hover = entry.indexOf("hover") >= 0;
          var unconstrained = entry.indexOf("unconstrained") >= 0;

          if (fixed) {
              if (parsed.handles !== 2) {
                  throw new Error("noUiSlider (" + VERSION + "): 'fixed' behaviour must be used with 2 handles");
              }

              // Use margin to enforce fixed state
              testMargin(parsed, parsed.start[1] - parsed.start[0]);
          }

          if (unconstrained && (parsed.margin || parsed.limit)) {
              throw new Error(
                  "noUiSlider (" + VERSION + "): 'unconstrained' behaviour cannot be used with margin or limit"
              );
          }

          parsed.events = {
              tap: tap || snap,
              drag: drag,
              fixed: fixed,
              snap: snap,
              hover: hover,
              unconstrained: unconstrained
          };
      }

      function testTooltips(parsed, entry) {
          if (entry === false) {
              return;
          }

          if (entry === true) {
              parsed.tooltips = [];

              for (var i = 0; i < parsed.handles; i++) {
                  parsed.tooltips.push(true);
              }
          } else {
              parsed.tooltips = asArray(entry);

              if (parsed.tooltips.length !== parsed.handles) {
                  throw new Error("noUiSlider (" + VERSION + "): must pass a formatter for all handles.");
              }

              parsed.tooltips.forEach(function(formatter) {
                  if (
                      typeof formatter !== "boolean" &&
                      (typeof formatter !== "object" || typeof formatter.to !== "function")
                  ) {
                      throw new Error("noUiSlider (" + VERSION + "): 'tooltips' must be passed a formatter or 'false'.");
                  }
              });
          }
      }

      function testAriaFormat(parsed, entry) {
          parsed.ariaFormat = entry;
          validateFormat(entry);
      }

      function testFormat(parsed, entry) {
          parsed.format = entry;
          validateFormat(entry);
      }

      function testKeyboardSupport(parsed, entry) {
          parsed.keyboardSupport = entry;

          if (typeof entry !== "boolean") {
              throw new Error("noUiSlider (" + VERSION + "): 'keyboardSupport' option must be a boolean.");
          }
      }

      function testDocumentElement(parsed, entry) {
          // This is an advanced option. Passed values are used without validation.
          parsed.documentElement = entry;
      }

      function testCssPrefix(parsed, entry) {
          if (typeof entry !== "string" && entry !== false) {
              throw new Error("noUiSlider (" + VERSION + "): 'cssPrefix' must be a string or `false`.");
          }

          parsed.cssPrefix = entry;
      }

      function testCssClasses(parsed, entry) {
          if (typeof entry !== "object") {
              throw new Error("noUiSlider (" + VERSION + "): 'cssClasses' must be an object.");
          }

          if (typeof parsed.cssPrefix === "string") {
              parsed.cssClasses = {};

              for (var key in entry) {
                  if (!entry.hasOwnProperty(key)) {
                      continue;
                  }

                  parsed.cssClasses[key] = parsed.cssPrefix + entry[key];
              }
          } else {
              parsed.cssClasses = entry;
          }
      }

      // Test all developer settings and parse to assumption-safe values.
      function testOptions(options) {
          // To prove a fix for #537, freeze options here.
          // If the object is modified, an error will be thrown.
          // Object.freeze(options);

          var parsed = {
              margin: 0,
              limit: 0,
              padding: 0,
              animate: true,
              animationDuration: 300,
              ariaFormat: defaultFormatter,
              format: defaultFormatter
          };

          // Tests are executed in the order they are presented here.
          var tests = {
              step: { r: false, t: testStep },
              start: { r: true, t: testStart },
              connect: { r: true, t: testConnect },
              direction: { r: true, t: testDirection },
              snap: { r: false, t: testSnap },
              animate: { r: false, t: testAnimate },
              animationDuration: { r: false, t: testAnimationDuration },
              range: { r: true, t: testRange },
              orientation: { r: false, t: testOrientation },
              margin: { r: false, t: testMargin },
              limit: { r: false, t: testLimit },
              padding: { r: false, t: testPadding },
              behaviour: { r: true, t: testBehaviour },
              ariaFormat: { r: false, t: testAriaFormat },
              format: { r: false, t: testFormat },
              tooltips: { r: false, t: testTooltips },
              keyboardSupport: { r: true, t: testKeyboardSupport },
              documentElement: { r: false, t: testDocumentElement },
              cssPrefix: { r: true, t: testCssPrefix },
              cssClasses: { r: true, t: testCssClasses }
          };

          var defaults = {
              connect: false,
              direction: "ltr",
              behaviour: "tap",
              orientation: "horizontal",
              keyboardSupport: true,
              cssPrefix: "noUi-",
              cssClasses: {
                  target: "target",
                  base: "base",
                  origin: "origin",
                  handle: "handle",
                  handleLower: "handle-lower",
                  handleUpper: "handle-upper",
                  touchArea: "touch-area",
                  horizontal: "horizontal",
                  vertical: "vertical",
                  background: "background",
                  connect: "connect",
                  connects: "connects",
                  ltr: "ltr",
                  rtl: "rtl",
                  draggable: "draggable",
                  drag: "state-drag",
                  tap: "state-tap",
                  active: "active",
                  tooltip: "tooltip",
                  pips: "pips",
                  pipsHorizontal: "pips-horizontal",
                  pipsVertical: "pips-vertical",
                  marker: "marker",
                  markerHorizontal: "marker-horizontal",
                  markerVertical: "marker-vertical",
                  markerNormal: "marker-normal",
                  markerLarge: "marker-large",
                  markerSub: "marker-sub",
                  value: "value",
                  valueHorizontal: "value-horizontal",
                  valueVertical: "value-vertical",
                  valueNormal: "value-normal",
                  valueLarge: "value-large",
                  valueSub: "value-sub"
              }
          };

          // AriaFormat defaults to regular format, if any.
          if (options.format && !options.ariaFormat) {
              options.ariaFormat = options.format;
          }

          // Run all options through a testing mechanism to ensure correct
          // input. It should be noted that options might get modified to
          // be handled properly. E.g. wrapping integers in arrays.
          Object.keys(tests).forEach(function(name) {
              // If the option isn't set, but it is required, throw an error.
              if (!isSet(options[name]) && defaults[name] === undefined) {
                  if (tests[name].r) {
                      throw new Error("noUiSlider (" + VERSION + "): '" + name + "' is required.");
                  }

                  return true;
              }

              tests[name].t(parsed, !isSet(options[name]) ? defaults[name] : options[name]);
          });

          // Forward pips options
          parsed.pips = options.pips;

          // All recent browsers accept unprefixed transform.
          // We need -ms- for IE9 and -webkit- for older Android;
          // Assume use of -webkit- if unprefixed and -ms- are not supported.
          // https://caniuse.com/#feat=transforms2d
          var d = document.createElement("div");
          var msPrefix = d.style.msTransform !== undefined;
          var noPrefix = d.style.transform !== undefined;

          parsed.transformRule = noPrefix ? "transform" : msPrefix ? "msTransform" : "webkitTransform";

          // Pips don't move, so we can place them using left/top.
          var styles = [["left", "top"], ["right", "bottom"]];

          parsed.style = styles[parsed.dir][parsed.ort];

          return parsed;
      }

      //endregion

      function scope(target, options, originalOptions) {
          var actions = getActions();
          var supportsTouchActionNone = getSupportsTouchActionNone();
          var supportsPassive = supportsTouchActionNone && getSupportsPassive();

          // All variables local to 'scope' are prefixed with 'scope_'

          // Slider DOM Nodes
          var scope_Target = target;
          var scope_Base;
          var scope_Handles;
          var scope_Connects;
          var scope_Pips;
          var scope_Tooltips;

          // Slider state values
          var scope_Spectrum = options.spectrum;
          var scope_Values = [];
          var scope_Locations = [];
          var scope_HandleNumbers = [];
          var scope_ActiveHandlesCount = 0;
          var scope_Events = {};

          // Exposed API
          var scope_Self;

          // Document Nodes
          var scope_Document = target.ownerDocument;
          var scope_DocumentElement = options.documentElement || scope_Document.documentElement;
          var scope_Body = scope_Document.body;

          // Pips constants
          var PIPS_NONE = -1;
          var PIPS_NO_VALUE = 0;
          var PIPS_LARGE_VALUE = 1;
          var PIPS_SMALL_VALUE = 2;

          // For horizontal sliders in standard ltr documents,
          // make .noUi-origin overflow to the left so the document doesn't scroll.
          var scope_DirOffset = scope_Document.dir === "rtl" || options.ort === 1 ? 0 : 100;

          // Creates a node, adds it to target, returns the new node.
          function addNodeTo(addTarget, className) {
              var div = scope_Document.createElement("div");

              if (className) {
                  addClass(div, className);
              }

              addTarget.appendChild(div);

              return div;
          }

          // Append a origin to the base
          function addOrigin(base, handleNumber) {
              var origin = addNodeTo(base, options.cssClasses.origin);
              var handle = addNodeTo(origin, options.cssClasses.handle);

              addNodeTo(handle, options.cssClasses.touchArea);

              handle.setAttribute("data-handle", handleNumber);

              if (options.keyboardSupport) {
                  // https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex
                  // 0 = focusable and reachable
                  handle.setAttribute("tabindex", "0");
                  handle.addEventListener("keydown", function(event) {
                      return eventKeydown(event, handleNumber);
                  });
              }

              handle.setAttribute("role", "slider");
              handle.setAttribute("aria-orientation", options.ort ? "vertical" : "horizontal");

              if (handleNumber === 0) {
                  addClass(handle, options.cssClasses.handleLower);
              } else if (handleNumber === options.handles - 1) {
                  addClass(handle, options.cssClasses.handleUpper);
              }

              return origin;
          }

          // Insert nodes for connect elements
          function addConnect(base, add) {
              if (!add) {
                  return false;
              }

              return addNodeTo(base, options.cssClasses.connect);
          }

          // Add handles to the slider base.
          function addElements(connectOptions, base) {
              var connectBase = addNodeTo(base, options.cssClasses.connects);

              scope_Handles = [];
              scope_Connects = [];

              scope_Connects.push(addConnect(connectBase, connectOptions[0]));

              // [::::O====O====O====]
              // connectOptions = [0, 1, 1, 1]

              for (var i = 0; i < options.handles; i++) {
                  // Keep a list of all added handles.
                  scope_Handles.push(addOrigin(base, i));
                  scope_HandleNumbers[i] = i;
                  scope_Connects.push(addConnect(connectBase, connectOptions[i + 1]));
              }
          }

          // Initialize a single slider.
          function addSlider(addTarget) {
              // Apply classes and data to the target.
              addClass(addTarget, options.cssClasses.target);

              if (options.dir === 0) {
                  addClass(addTarget, options.cssClasses.ltr);
              } else {
                  addClass(addTarget, options.cssClasses.rtl);
              }

              if (options.ort === 0) {
                  addClass(addTarget, options.cssClasses.horizontal);
              } else {
                  addClass(addTarget, options.cssClasses.vertical);
              }

              return addNodeTo(addTarget, options.cssClasses.base);
          }

          function addTooltip(handle, handleNumber) {
              if (!options.tooltips[handleNumber]) {
                  return false;
              }

              return addNodeTo(handle.firstChild, options.cssClasses.tooltip);
          }

          function isSliderDisabled() {
              return scope_Target.hasAttribute("disabled");
          }

          // Disable the slider dragging if any handle is disabled
          function isHandleDisabled(handleNumber) {
              var handleOrigin = scope_Handles[handleNumber];
              return handleOrigin.hasAttribute("disabled");
          }

          function removeTooltips() {
              if (scope_Tooltips) {
                  removeEvent("update.tooltips");
                  scope_Tooltips.forEach(function(tooltip) {
                      if (tooltip) {
                          removeElement(tooltip);
                      }
                  });
                  scope_Tooltips = null;
              }
          }

          // The tooltips option is a shorthand for using the 'update' event.
          function tooltips() {
              removeTooltips();

              // Tooltips are added with options.tooltips in original order.
              scope_Tooltips = scope_Handles.map(addTooltip);

              bindEvent("update.tooltips", function(values, handleNumber, unencoded) {
                  if (!scope_Tooltips[handleNumber]) {
                      return;
                  }

                  var formattedValue = values[handleNumber];

                  if (options.tooltips[handleNumber] !== true) {
                      formattedValue = options.tooltips[handleNumber].to(unencoded[handleNumber]);
                  }

                  scope_Tooltips[handleNumber].innerHTML = formattedValue;
              });
          }

          function aria() {
              bindEvent("update", function(values, handleNumber, unencoded, tap, positions) {
                  // Update Aria Values for all handles, as a change in one changes min and max values for the next.
                  scope_HandleNumbers.forEach(function(index) {
                      var handle = scope_Handles[index];

                      var min = checkHandlePosition(scope_Locations, index, 0, true, true, true);
                      var max = checkHandlePosition(scope_Locations, index, 100, true, true, true);

                      var now = positions[index];

                      // Formatted value for display
                      var text = options.ariaFormat.to(unencoded[index]);

                      // Map to slider range values
                      min = scope_Spectrum.fromStepping(min).toFixed(1);
                      max = scope_Spectrum.fromStepping(max).toFixed(1);
                      now = scope_Spectrum.fromStepping(now).toFixed(1);

                      handle.children[0].setAttribute("aria-valuemin", min);
                      handle.children[0].setAttribute("aria-valuemax", max);
                      handle.children[0].setAttribute("aria-valuenow", now);
                      handle.children[0].setAttribute("aria-valuetext", text);
                  });
              });
          }

          function getGroup(mode, values, stepped) {
              // Use the range.
              if (mode === "range" || mode === "steps") {
                  return scope_Spectrum.xVal;
              }

              if (mode === "count") {
                  if (values < 2) {
                      throw new Error("noUiSlider (" + VERSION + "): 'values' (>= 2) required for mode 'count'.");
                  }

                  // Divide 0 - 100 in 'count' parts.
                  var interval = values - 1;
                  var spread = 100 / interval;

                  values = [];

                  // List these parts and have them handled as 'positions'.
                  while (interval--) {
                      values[interval] = interval * spread;
                  }

                  values.push(100);

                  mode = "positions";
              }

              if (mode === "positions") {
                  // Map all percentages to on-range values.
                  return values.map(function(value) {
                      return scope_Spectrum.fromStepping(stepped ? scope_Spectrum.getStep(value) : value);
                  });
              }

              if (mode === "values") {
                  // If the value must be stepped, it needs to be converted to a percentage first.
                  if (stepped) {
                      return values.map(function(value) {
                          // Convert to percentage, apply step, return to value.
                          return scope_Spectrum.fromStepping(scope_Spectrum.getStep(scope_Spectrum.toStepping(value)));
                      });
                  }

                  // Otherwise, we can simply use the values.
                  return values;
              }
          }

          function generateSpread(density, mode, group) {
              function safeIncrement(value, increment) {
                  // Avoid floating point variance by dropping the smallest decimal places.
                  return (value + increment).toFixed(7) / 1;
              }

              var indexes = {};
              var firstInRange = scope_Spectrum.xVal[0];
              var lastInRange = scope_Spectrum.xVal[scope_Spectrum.xVal.length - 1];
              var ignoreFirst = false;
              var ignoreLast = false;
              var prevPct = 0;

              // Create a copy of the group, sort it and filter away all duplicates.
              group = unique(
                  group.slice().sort(function(a, b) {
                      return a - b;
                  })
              );

              // Make sure the range starts with the first element.
              if (group[0] !== firstInRange) {
                  group.unshift(firstInRange);
                  ignoreFirst = true;
              }

              // Likewise for the last one.
              if (group[group.length - 1] !== lastInRange) {
                  group.push(lastInRange);
                  ignoreLast = true;
              }

              group.forEach(function(current, index) {
                  // Get the current step and the lower + upper positions.
                  var step;
                  var i;
                  var q;
                  var low = current;
                  var high = group[index + 1];
                  var newPct;
                  var pctDifference;
                  var pctPos;
                  var type;
                  var steps;
                  var realSteps;
                  var stepSize;
                  var isSteps = mode === "steps";

                  // When using 'steps' mode, use the provided steps.
                  // Otherwise, we'll step on to the next subrange.
                  if (isSteps) {
                      step = scope_Spectrum.xNumSteps[index];
                  }

                  // Default to a 'full' step.
                  if (!step) {
                      step = high - low;
                  }

                  // Low can be 0, so test for false. If high is undefined,
                  // we are at the last subrange. Index 0 is already handled.
                  if (low === false || high === undefined) {
                      return;
                  }

                  // Make sure step isn't 0, which would cause an infinite loop (#654)
                  step = Math.max(step, 0.0000001);

                  // Find all steps in the subrange.
                  for (i = low; i <= high; i = safeIncrement(i, step)) {
                      // Get the percentage value for the current step,
                      // calculate the size for the subrange.
                      newPct = scope_Spectrum.toStepping(i);
                      pctDifference = newPct - prevPct;

                      steps = pctDifference / density;
                      realSteps = Math.round(steps);

                      // This ratio represents the amount of percentage-space a point indicates.
                      // For a density 1 the points/percentage = 1. For density 2, that percentage needs to be re-divided.
                      // Round the percentage offset to an even number, then divide by two
                      // to spread the offset on both sides of the range.
                      stepSize = pctDifference / realSteps;

                      // Divide all points evenly, adding the correct number to this subrange.
                      // Run up to <= so that 100% gets a point, event if ignoreLast is set.
                      for (q = 1; q <= realSteps; q += 1) {
                          // The ratio between the rounded value and the actual size might be ~1% off.
                          // Correct the percentage offset by the number of points
                          // per subrange. density = 1 will result in 100 points on the
                          // full range, 2 for 50, 4 for 25, etc.
                          pctPos = prevPct + q * stepSize;
                          indexes[pctPos.toFixed(5)] = [scope_Spectrum.fromStepping(pctPos), 0];
                      }

                      // Determine the point type.
                      type = group.indexOf(i) > -1 ? PIPS_LARGE_VALUE : isSteps ? PIPS_SMALL_VALUE : PIPS_NO_VALUE;

                      // Enforce the 'ignoreFirst' option by overwriting the type for 0.
                      if (!index && ignoreFirst) {
                          type = 0;
                      }

                      if (!(i === high && ignoreLast)) {
                          // Mark the 'type' of this point. 0 = plain, 1 = real value, 2 = step value.
                          indexes[newPct.toFixed(5)] = [i, type];
                      }

                      // Update the percentage count.
                      prevPct = newPct;
                  }
              });

              return indexes;
          }

          function addMarking(spread, filterFunc, formatter) {
              var element = scope_Document.createElement("div");

              var valueSizeClasses = [];
              valueSizeClasses[PIPS_NO_VALUE] = options.cssClasses.valueNormal;
              valueSizeClasses[PIPS_LARGE_VALUE] = options.cssClasses.valueLarge;
              valueSizeClasses[PIPS_SMALL_VALUE] = options.cssClasses.valueSub;

              var markerSizeClasses = [];
              markerSizeClasses[PIPS_NO_VALUE] = options.cssClasses.markerNormal;
              markerSizeClasses[PIPS_LARGE_VALUE] = options.cssClasses.markerLarge;
              markerSizeClasses[PIPS_SMALL_VALUE] = options.cssClasses.markerSub;

              var valueOrientationClasses = [options.cssClasses.valueHorizontal, options.cssClasses.valueVertical];
              var markerOrientationClasses = [options.cssClasses.markerHorizontal, options.cssClasses.markerVertical];

              addClass(element, options.cssClasses.pips);
              addClass(element, options.ort === 0 ? options.cssClasses.pipsHorizontal : options.cssClasses.pipsVertical);

              function getClasses(type, source) {
                  var a = source === options.cssClasses.value;
                  var orientationClasses = a ? valueOrientationClasses : markerOrientationClasses;
                  var sizeClasses = a ? valueSizeClasses : markerSizeClasses;

                  return source + " " + orientationClasses[options.ort] + " " + sizeClasses[type];
              }

              function addSpread(offset, value, type) {
                  // Apply the filter function, if it is set.
                  type = filterFunc ? filterFunc(value, type) : type;

                  if (type === PIPS_NONE) {
                      return;
                  }

                  // Add a marker for every point
                  var node = addNodeTo(element, false);
                  node.className = getClasses(type, options.cssClasses.marker);
                  node.style[options.style] = offset + "%";

                  // Values are only appended for points marked '1' or '2'.
                  if (type > PIPS_NO_VALUE) {
                      node = addNodeTo(element, false);
                      node.className = getClasses(type, options.cssClasses.value);
                      node.setAttribute("data-value", value);
                      node.style[options.style] = offset + "%";
                      node.innerHTML = formatter.to(value);
                  }
              }

              // Append all points.
              Object.keys(spread).forEach(function(offset) {
                  addSpread(offset, spread[offset][0], spread[offset][1]);
              });

              return element;
          }

          function removePips() {
              if (scope_Pips) {
                  removeElement(scope_Pips);
                  scope_Pips = null;
              }
          }

          function pips(grid) {
              // Fix #669
              removePips();

              var mode = grid.mode;
              var density = grid.density || 1;
              var filter = grid.filter || false;
              var values = grid.values || false;
              var stepped = grid.stepped || false;
              var group = getGroup(mode, values, stepped);
              var spread = generateSpread(density, mode, group);
              var format = grid.format || {
                  to: Math.round
              };

              scope_Pips = scope_Target.appendChild(addMarking(spread, filter, format));

              return scope_Pips;
          }

          // Shorthand for base dimensions.
          function baseSize() {
              var rect = scope_Base.getBoundingClientRect();
              var alt = "offset" + ["Width", "Height"][options.ort];
              return options.ort === 0 ? rect.width || scope_Base[alt] : rect.height || scope_Base[alt];
          }

          // Handler for attaching events trough a proxy.
          function attachEvent(events, element, callback, data) {
              // This function can be used to 'filter' events to the slider.
              // element is a node, not a nodeList

              var method = function(e) {
                  e = fixEvent(e, data.pageOffset, data.target || element);

                  // fixEvent returns false if this event has a different target
                  // when handling (multi-) touch events;
                  if (!e) {
                      return false;
                  }

                  // doNotReject is passed by all end events to make sure released touches
                  // are not rejected, leaving the slider "stuck" to the cursor;
                  if (isSliderDisabled() && !data.doNotReject) {
                      return false;
                  }

                  // Stop if an active 'tap' transition is taking place.
                  if (hasClass(scope_Target, options.cssClasses.tap) && !data.doNotReject) {
                      return false;
                  }

                  // Ignore right or middle clicks on start #454
                  if (events === actions.start && e.buttons !== undefined && e.buttons > 1) {
                      return false;
                  }

                  // Ignore right or middle clicks on start #454
                  if (data.hover && e.buttons) {
                      return false;
                  }

                  // 'supportsPassive' is only true if a browser also supports touch-action: none in CSS.
                  // iOS safari does not, so it doesn't get to benefit from passive scrolling. iOS does support
                  // touch-action: manipulation, but that allows panning, which breaks
                  // sliders after zooming/on non-responsive pages.
                  // See: https://bugs.webkit.org/show_bug.cgi?id=133112
                  if (!supportsPassive) {
                      e.preventDefault();
                  }

                  e.calcPoint = e.points[options.ort];

                  // Call the event handler with the event [ and additional data ].
                  callback(e, data);
              };

              var methods = [];

              // Bind a closure on the target for every event type.
              events.split(" ").forEach(function(eventName) {
                  element.addEventListener(eventName, method, supportsPassive ? { passive: true } : false);
                  methods.push([eventName, method]);
              });

              return methods;
          }

          // Provide a clean event with standardized offset values.
          function fixEvent(e, pageOffset, eventTarget) {
              // Filter the event to register the type, which can be
              // touch, mouse or pointer. Offset changes need to be
              // made on an event specific basis.
              var touch = e.type.indexOf("touch") === 0;
              var mouse = e.type.indexOf("mouse") === 0;
              var pointer = e.type.indexOf("pointer") === 0;

              var x;
              var y;

              // IE10 implemented pointer events with a prefix;
              if (e.type.indexOf("MSPointer") === 0) {
                  pointer = true;
              }

              // The only thing one handle should be concerned about is the touches that originated on top of it.
              if (touch) {
                  // Returns true if a touch originated on the target.
                  var isTouchOnTarget = function(checkTouch) {
                      return checkTouch.target === eventTarget || eventTarget.contains(checkTouch.target);
                  };

                  // In the case of touchstart events, we need to make sure there is still no more than one
                  // touch on the target so we look amongst all touches.
                  if (e.type === "touchstart") {
                      var targetTouches = Array.prototype.filter.call(e.touches, isTouchOnTarget);

                      // Do not support more than one touch per handle.
                      if (targetTouches.length > 1) {
                          return false;
                      }

                      x = targetTouches[0].pageX;
                      y = targetTouches[0].pageY;
                  } else {
                      // In the other cases, find on changedTouches is enough.
                      var targetTouch = Array.prototype.find.call(e.changedTouches, isTouchOnTarget);

                      // Cancel if the target touch has not moved.
                      if (!targetTouch) {
                          return false;
                      }

                      x = targetTouch.pageX;
                      y = targetTouch.pageY;
                  }
              }

              pageOffset = pageOffset || getPageOffset(scope_Document);

              if (mouse || pointer) {
                  x = e.clientX + pageOffset.x;
                  y = e.clientY + pageOffset.y;
              }

              e.pageOffset = pageOffset;
              e.points = [x, y];
              e.cursor = mouse || pointer; // Fix #435

              return e;
          }

          // Translate a coordinate in the document to a percentage on the slider
          function calcPointToPercentage(calcPoint) {
              var location = calcPoint - offset(scope_Base, options.ort);
              var proposal = (location * 100) / baseSize();

              // Clamp proposal between 0% and 100%
              // Out-of-bound coordinates may occur when .noUi-base pseudo-elements
              // are used (e.g. contained handles feature)
              proposal = limit(proposal);

              return options.dir ? 100 - proposal : proposal;
          }

          // Find handle closest to a certain percentage on the slider
          function getClosestHandle(clickedPosition) {
              var smallestDifference = 100;
              var handleNumber = false;

              scope_Handles.forEach(function(handle, index) {
                  // Disabled handles are ignored
                  if (isHandleDisabled(index)) {
                      return;
                  }

                  var handlePosition = scope_Locations[index];
                  var differenceWithThisHandle = Math.abs(handlePosition - clickedPosition);

                  // Initial state
                  var clickAtEdge = differenceWithThisHandle === 100 && smallestDifference === 100;

                  // Difference with this handle is smaller than the previously checked handle
                  var isCloser = differenceWithThisHandle < smallestDifference;
                  var isCloserAfter = differenceWithThisHandle <= smallestDifference && clickedPosition > handlePosition;

                  if (isCloser || isCloserAfter || clickAtEdge) {
                      handleNumber = index;
                      smallestDifference = differenceWithThisHandle;
                  }
              });

              return handleNumber;
          }

          // Fire 'end' when a mouse or pen leaves the document.
          function documentLeave(event, data) {
              if (event.type === "mouseout" && event.target.nodeName === "HTML" && event.relatedTarget === null) {
                  eventEnd(event, data);
              }
          }

          // Handle movement on document for handle and range drag.
          function eventMove(event, data) {
              // Fix #498
              // Check value of .buttons in 'start' to work around a bug in IE10 mobile (data.buttonsProperty).
              // https://connect.microsoft.com/IE/feedback/details/927005/mobile-ie10-windows-phone-buttons-property-of-pointermove-event-always-zero
              // IE9 has .buttons and .which zero on mousemove.
              // Firefox breaks the spec MDN defines.
              if (navigator.appVersion.indexOf("MSIE 9") === -1 && event.buttons === 0 && data.buttonsProperty !== 0) {
                  return eventEnd(event, data);
              }

              // Check if we are moving up or down
              var movement = (options.dir ? -1 : 1) * (event.calcPoint - data.startCalcPoint);

              // Convert the movement into a percentage of the slider width/height
              var proposal = (movement * 100) / data.baseSize;

              moveHandles(movement > 0, proposal, data.locations, data.handleNumbers);
          }

          // Unbind move events on document, call callbacks.
          function eventEnd(event, data) {
              // The handle is no longer active, so remove the class.
              if (data.handle) {
                  removeClass(data.handle, options.cssClasses.active);
                  scope_ActiveHandlesCount -= 1;
              }

              // Unbind the move and end events, which are added on 'start'.
              data.listeners.forEach(function(c) {
                  scope_DocumentElement.removeEventListener(c[0], c[1]);
              });

              if (scope_ActiveHandlesCount === 0) {
                  // Remove dragging class.
                  removeClass(scope_Target, options.cssClasses.drag);
                  setZindex();

                  // Remove cursor styles and text-selection events bound to the body.
                  if (event.cursor) {
                      scope_Body.style.cursor = "";
                      scope_Body.removeEventListener("selectstart", preventDefault);
                  }
              }

              data.handleNumbers.forEach(function(handleNumber) {
                  fireEvent("change", handleNumber);
                  fireEvent("set", handleNumber);
                  fireEvent("end", handleNumber);
              });
          }

          // Bind move events on document.
          function eventStart(event, data) {
              // Ignore event if any handle is disabled
              if (data.handleNumbers.some(isHandleDisabled)) {
                  return false;
              }

              var handle;

              if (data.handleNumbers.length === 1) {
                  var handleOrigin = scope_Handles[data.handleNumbers[0]];

                  handle = handleOrigin.children[0];
                  scope_ActiveHandlesCount += 1;

                  // Mark the handle as 'active' so it can be styled.
                  addClass(handle, options.cssClasses.active);
              }

              // A drag should never propagate up to the 'tap' event.
              event.stopPropagation();

              // Record the event listeners.
              var listeners = [];

              // Attach the move and end events.
              var moveEvent = attachEvent(actions.move, scope_DocumentElement, eventMove, {
                  // The event target has changed so we need to propagate the original one so that we keep
                  // relying on it to extract target touches.
                  target: event.target,
                  handle: handle,
                  listeners: listeners,
                  startCalcPoint: event.calcPoint,
                  baseSize: baseSize(),
                  pageOffset: event.pageOffset,
                  handleNumbers: data.handleNumbers,
                  buttonsProperty: event.buttons,
                  locations: scope_Locations.slice()
              });

              var endEvent = attachEvent(actions.end, scope_DocumentElement, eventEnd, {
                  target: event.target,
                  handle: handle,
                  listeners: listeners,
                  doNotReject: true,
                  handleNumbers: data.handleNumbers
              });

              var outEvent = attachEvent("mouseout", scope_DocumentElement, documentLeave, {
                  target: event.target,
                  handle: handle,
                  listeners: listeners,
                  doNotReject: true,
                  handleNumbers: data.handleNumbers
              });

              // We want to make sure we pushed the listeners in the listener list rather than creating
              // a new one as it has already been passed to the event handlers.
              listeners.push.apply(listeners, moveEvent.concat(endEvent, outEvent));

              // Text selection isn't an issue on touch devices,
              // so adding cursor styles can be skipped.
              if (event.cursor) {
                  // Prevent the 'I' cursor and extend the range-drag cursor.
                  scope_Body.style.cursor = getComputedStyle(event.target).cursor;

                  // Mark the target with a dragging state.
                  if (scope_Handles.length > 1) {
                      addClass(scope_Target, options.cssClasses.drag);
                  }

                  // Prevent text selection when dragging the handles.
                  // In noUiSlider <= 9.2.0, this was handled by calling preventDefault on mouse/touch start/move,
                  // which is scroll blocking. The selectstart event is supported by FireFox starting from version 52,
                  // meaning the only holdout is iOS Safari. This doesn't matter: text selection isn't triggered there.
                  // The 'cursor' flag is false.
                  // See: http://caniuse.com/#search=selectstart
                  scope_Body.addEventListener("selectstart", preventDefault, false);
              }

              data.handleNumbers.forEach(function(handleNumber) {
                  fireEvent("start", handleNumber);
              });
          }

          // Move closest handle to tapped location.
          function eventTap(event) {
              // The tap event shouldn't propagate up
              event.stopPropagation();

              var proposal = calcPointToPercentage(event.calcPoint);
              var handleNumber = getClosestHandle(proposal);

              // Tackle the case that all handles are 'disabled'.
              if (handleNumber === false) {
                  return false;
              }

              // Flag the slider as it is now in a transitional state.
              // Transition takes a configurable amount of ms (default 300). Re-enable the slider after that.
              if (!options.events.snap) {
                  addClassFor(scope_Target, options.cssClasses.tap, options.animationDuration);
              }

              setHandle(handleNumber, proposal, true, true);

              setZindex();

              fireEvent("slide", handleNumber, true);
              fireEvent("update", handleNumber, true);
              fireEvent("change", handleNumber, true);
              fireEvent("set", handleNumber, true);

              if (options.events.snap) {
                  eventStart(event, { handleNumbers: [handleNumber] });
              }
          }

          // Fires a 'hover' event for a hovered mouse/pen position.
          function eventHover(event) {
              var proposal = calcPointToPercentage(event.calcPoint);

              var to = scope_Spectrum.getStep(proposal);
              var value = scope_Spectrum.fromStepping(to);

              Object.keys(scope_Events).forEach(function(targetEvent) {
                  if ("hover" === targetEvent.split(".")[0]) {
                      scope_Events[targetEvent].forEach(function(callback) {
                          callback.call(scope_Self, value);
                      });
                  }
              });
          }

          // Handles keydown on focused handles
          // Don't move the document when pressing arrow keys on focused handles
          function eventKeydown(event, handleNumber) {
              if (isSliderDisabled() || isHandleDisabled(handleNumber)) {
                  return false;
              }

              var horizontalKeys = ["Left", "Right"];
              var verticalKeys = ["Down", "Up"];

              if (options.dir && !options.ort) {
                  // On an right-to-left slider, the left and right keys act inverted
                  horizontalKeys.reverse();
              } else if (options.ort && !options.dir) {
                  // On a top-to-bottom slider, the up and down keys act inverted
                  verticalKeys.reverse();
              }

              // Strip "Arrow" for IE compatibility. https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key
              var key = event.key.replace("Arrow", "");
              var isDown = key === verticalKeys[0] || key === horizontalKeys[0];
              var isUp = key === verticalKeys[1] || key === horizontalKeys[1];

              if (!isDown && !isUp) {
                  return true;
              }

              event.preventDefault();

              var direction = isDown ? 0 : 1;
              var steps = getNextStepsForHandle(handleNumber);
              var step = steps[direction];

              // At the edge of a slider, do nothing
              if (step === null) {
                  return false;
              }

              // No step set, use the default of 10% of the sub-range
              if (step === false) {
                  step = scope_Spectrum.getDefaultStep(scope_Locations[handleNumber], isDown, 10);
              }

              // Step over zero-length ranges (#948);
              step = Math.max(step, 0.0000001);

              // Decrement for down steps
              step = (isDown ? -1 : 1) * step;

              setHandle(handleNumber, scope_Spectrum.toStepping(scope_Values[handleNumber] + step), true, true);

              fireEvent("slide", handleNumber);
              fireEvent("update", handleNumber);
              fireEvent("change", handleNumber);
              fireEvent("set", handleNumber);

              return false;
          }

          // Attach events to several slider parts.
          function bindSliderEvents(behaviour) {
              // Attach the standard drag event to the handles.
              if (!behaviour.fixed) {
                  scope_Handles.forEach(function(handle, index) {
                      // These events are only bound to the visual handle
                      // element, not the 'real' origin element.
                      attachEvent(actions.start, handle.children[0], eventStart, {
                          handleNumbers: [index]
                      });
                  });
              }

              // Attach the tap event to the slider base.
              if (behaviour.tap) {
                  attachEvent(actions.start, scope_Base, eventTap, {});
              }

              // Fire hover events
              if (behaviour.hover) {
                  attachEvent(actions.move, scope_Base, eventHover, {
                      hover: true
                  });
              }

              // Make the range draggable.
              if (behaviour.drag) {
                  scope_Connects.forEach(function(connect, index) {
                      if (connect === false || index === 0 || index === scope_Connects.length - 1) {
                          return;
                      }

                      var handleBefore = scope_Handles[index - 1];
                      var handleAfter = scope_Handles[index];
                      var eventHolders = [connect];

                      addClass(connect, options.cssClasses.draggable);

                      // When the range is fixed, the entire range can
                      // be dragged by the handles. The handle in the first
                      // origin will propagate the start event upward,
                      // but it needs to be bound manually on the other.
                      if (behaviour.fixed) {
                          eventHolders.push(handleBefore.children[0]);
                          eventHolders.push(handleAfter.children[0]);
                      }

                      eventHolders.forEach(function(eventHolder) {
                          attachEvent(actions.start, eventHolder, eventStart, {
                              handles: [handleBefore, handleAfter],
                              handleNumbers: [index - 1, index]
                          });
                      });
                  });
              }
          }

          // Attach an event to this slider, possibly including a namespace
          function bindEvent(namespacedEvent, callback) {
              scope_Events[namespacedEvent] = scope_Events[namespacedEvent] || [];
              scope_Events[namespacedEvent].push(callback);

              // If the event bound is 'update,' fire it immediately for all handles.
              if (namespacedEvent.split(".")[0] === "update") {
                  scope_Handles.forEach(function(a, index) {
                      fireEvent("update", index);
                  });
              }
          }

          // Undo attachment of event
          function removeEvent(namespacedEvent) {
              var event = namespacedEvent && namespacedEvent.split(".")[0];
              var namespace = event && namespacedEvent.substring(event.length);

              Object.keys(scope_Events).forEach(function(bind) {
                  var tEvent = bind.split(".")[0];
                  var tNamespace = bind.substring(tEvent.length);

                  if ((!event || event === tEvent) && (!namespace || namespace === tNamespace)) {
                      delete scope_Events[bind];
                  }
              });
          }

          // External event handling
          function fireEvent(eventName, handleNumber, tap) {
              Object.keys(scope_Events).forEach(function(targetEvent) {
                  var eventType = targetEvent.split(".")[0];

                  if (eventName === eventType) {
                      scope_Events[targetEvent].forEach(function(callback) {
                          callback.call(
                              // Use the slider public API as the scope ('this')
                              scope_Self,
                              // Return values as array, so arg_1[arg_2] is always valid.
                              scope_Values.map(options.format.to),
                              // Handle index, 0 or 1
                              handleNumber,
                              // Un-formatted slider values
                              scope_Values.slice(),
                              // Event is fired by tap, true or false
                              tap || false,
                              // Left offset of the handle, in relation to the slider
                              scope_Locations.slice()
                          );
                      });
                  }
              });
          }

          // Split out the handle positioning logic so the Move event can use it, too
          function checkHandlePosition(reference, handleNumber, to, lookBackward, lookForward, getValue) {
              // For sliders with multiple handles, limit movement to the other handle.
              // Apply the margin option by adding it to the handle positions.
              if (scope_Handles.length > 1 && !options.events.unconstrained) {
                  if (lookBackward && handleNumber > 0) {
                      to = Math.max(to, reference[handleNumber - 1] + options.margin);
                  }

                  if (lookForward && handleNumber < scope_Handles.length - 1) {
                      to = Math.min(to, reference[handleNumber + 1] - options.margin);
                  }
              }

              // The limit option has the opposite effect, limiting handles to a
              // maximum distance from another. Limit must be > 0, as otherwise
              // handles would be unmovable.
              if (scope_Handles.length > 1 && options.limit) {
                  if (lookBackward && handleNumber > 0) {
                      to = Math.min(to, reference[handleNumber - 1] + options.limit);
                  }

                  if (lookForward && handleNumber < scope_Handles.length - 1) {
                      to = Math.max(to, reference[handleNumber + 1] - options.limit);
                  }
              }

              // The padding option keeps the handles a certain distance from the
              // edges of the slider. Padding must be > 0.
              if (options.padding) {
                  if (handleNumber === 0) {
                      to = Math.max(to, options.padding[0]);
                  }

                  if (handleNumber === scope_Handles.length - 1) {
                      to = Math.min(to, 100 - options.padding[1]);
                  }
              }

              to = scope_Spectrum.getStep(to);

              // Limit percentage to the 0 - 100 range
              to = limit(to);

              // Return false if handle can't move
              if (to === reference[handleNumber] && !getValue) {
                  return false;
              }

              return to;
          }

          // Uses slider orientation to create CSS rules. a = base value;
          function inRuleOrder(v, a) {
              var o = options.ort;
              return (o ? a : v) + ", " + (o ? v : a);
          }

          // Moves handle(s) by a percentage
          // (bool, % to move, [% where handle started, ...], [index in scope_Handles, ...])
          function moveHandles(upward, proposal, locations, handleNumbers) {
              var proposals = locations.slice();

              var b = [!upward, upward];
              var f = [upward, !upward];

              // Copy handleNumbers so we don't change the dataset
              handleNumbers = handleNumbers.slice();

              // Check to see which handle is 'leading'.
              // If that one can't move the second can't either.
              if (upward) {
                  handleNumbers.reverse();
              }

              // Step 1: get the maximum percentage that any of the handles can move
              if (handleNumbers.length > 1) {
                  handleNumbers.forEach(function(handleNumber, o) {
                      var to = checkHandlePosition(
                          proposals,
                          handleNumber,
                          proposals[handleNumber] + proposal,
                          b[o],
                          f[o],
                          false
                      );

                      // Stop if one of the handles can't move.
                      if (to === false) {
                          proposal = 0;
                      } else {
                          proposal = to - proposals[handleNumber];
                          proposals[handleNumber] = to;
                      }
                  });
              }

              // If using one handle, check backward AND forward
              else {
                  b = f = [true];
              }

              var state = false;

              // Step 2: Try to set the handles with the found percentage
              handleNumbers.forEach(function(handleNumber, o) {
                  state = setHandle(handleNumber, locations[handleNumber] + proposal, b[o], f[o]) || state;
              });

              // Step 3: If a handle moved, fire events
              if (state) {
                  handleNumbers.forEach(function(handleNumber) {
                      fireEvent("update", handleNumber);
                      fireEvent("slide", handleNumber);
                  });
              }
          }

          // Takes a base value and an offset. This offset is used for the connect bar size.
          // In the initial design for this feature, the origin element was 1% wide.
          // Unfortunately, a rounding bug in Chrome makes it impossible to implement this feature
          // in this manner: https://bugs.chromium.org/p/chromium/issues/detail?id=798223
          function transformDirection(a, b) {
              return options.dir ? 100 - a - b : a;
          }

          // Updates scope_Locations and scope_Values, updates visual state
          function updateHandlePosition(handleNumber, to) {
              // Update locations.
              scope_Locations[handleNumber] = to;

              // Convert the value to the slider stepping/range.
              scope_Values[handleNumber] = scope_Spectrum.fromStepping(to);

              var translation = 10 * (transformDirection(to, 0) - scope_DirOffset);
              var translateRule = "translate(" + inRuleOrder(translation + "%", "0") + ")";

              scope_Handles[handleNumber].style[options.transformRule] = translateRule;

              updateConnect(handleNumber);
              updateConnect(handleNumber + 1);
          }

          // Handles before the slider middle are stacked later = higher,
          // Handles after the middle later is lower
          // [[7] [8] .......... | .......... [5] [4]
          function setZindex() {
              scope_HandleNumbers.forEach(function(handleNumber) {
                  var dir = scope_Locations[handleNumber] > 50 ? -1 : 1;
                  var zIndex = 3 + (scope_Handles.length + dir * handleNumber);
                  scope_Handles[handleNumber].style.zIndex = zIndex;
              });
          }

          // Test suggested values and apply margin, step.
          function setHandle(handleNumber, to, lookBackward, lookForward) {
              to = checkHandlePosition(scope_Locations, handleNumber, to, lookBackward, lookForward, false);

              if (to === false) {
                  return false;
              }

              updateHandlePosition(handleNumber, to);

              return true;
          }

          // Updates style attribute for connect nodes
          function updateConnect(index) {
              // Skip connects set to false
              if (!scope_Connects[index]) {
                  return;
              }

              var l = 0;
              var h = 100;

              if (index !== 0) {
                  l = scope_Locations[index - 1];
              }

              if (index !== scope_Connects.length - 1) {
                  h = scope_Locations[index];
              }

              // We use two rules:
              // 'translate' to change the left/top offset;
              // 'scale' to change the width of the element;
              // As the element has a width of 100%, a translation of 100% is equal to 100% of the parent (.noUi-base)
              var connectWidth = h - l;
              var translateRule = "translate(" + inRuleOrder(transformDirection(l, connectWidth) + "%", "0") + ")";
              var scaleRule = "scale(" + inRuleOrder(connectWidth / 100, "1") + ")";

              scope_Connects[index].style[options.transformRule] = translateRule + " " + scaleRule;
          }

          // Parses value passed to .set method. Returns current value if not parse-able.
          function resolveToValue(to, handleNumber) {
              // Setting with null indicates an 'ignore'.
              // Inputting 'false' is invalid.
              if (to === null || to === false || to === undefined) {
                  return scope_Locations[handleNumber];
              }

              // If a formatted number was passed, attempt to decode it.
              if (typeof to === "number") {
                  to = String(to);
              }

              to = options.format.from(to);
              to = scope_Spectrum.toStepping(to);

              // If parsing the number failed, use the current value.
              if (to === false || isNaN(to)) {
                  return scope_Locations[handleNumber];
              }

              return to;
          }

          // Set the slider value.
          function valueSet(input, fireSetEvent) {
              var values = asArray(input);
              var isInit = scope_Locations[0] === undefined;

              // Event fires by default
              fireSetEvent = fireSetEvent === undefined ? true : !!fireSetEvent;

              // Animation is optional.
              // Make sure the initial values were set before using animated placement.
              if (options.animate && !isInit) {
                  addClassFor(scope_Target, options.cssClasses.tap, options.animationDuration);
              }

              // First pass, without lookAhead but with lookBackward. Values are set from left to right.
              scope_HandleNumbers.forEach(function(handleNumber) {
                  setHandle(handleNumber, resolveToValue(values[handleNumber], handleNumber), true, false);
              });

              // Second pass. Now that all base values are set, apply constraints
              scope_HandleNumbers.forEach(function(handleNumber) {
                  setHandle(handleNumber, scope_Locations[handleNumber], true, true);
              });

              setZindex();

              scope_HandleNumbers.forEach(function(handleNumber) {
                  fireEvent("update", handleNumber);

                  // Fire the event only for handles that received a new value, as per #579
                  if (values[handleNumber] !== null && fireSetEvent) {
                      fireEvent("set", handleNumber);
                  }
              });
          }

          // Reset slider to initial values
          function valueReset(fireSetEvent) {
              valueSet(options.start, fireSetEvent);
          }

          // Set value for a single handle
          function valueSetHandle(handleNumber, value, fireSetEvent) {
              // Ensure numeric input
              handleNumber = Number(handleNumber);

              if (!(handleNumber >= 0 && handleNumber < scope_HandleNumbers.length)) {
                  throw new Error("noUiSlider (" + VERSION + "): invalid handle number, got: " + handleNumber);
              }

              // Look both backward and forward, since we don't want this handle to "push" other handles (#960);
              setHandle(handleNumber, resolveToValue(value, handleNumber), true, true);

              fireEvent("update", handleNumber);

              if (fireSetEvent) {
                  fireEvent("set", handleNumber);
              }
          }

          // Get the slider value.
          function valueGet() {
              var values = scope_Values.map(options.format.to);

              // If only one handle is used, return a single value.
              if (values.length === 1) {
                  return values[0];
              }

              return values;
          }

          // Removes classes from the root and empties it.
          function destroy() {
              for (var key in options.cssClasses) {
                  if (!options.cssClasses.hasOwnProperty(key)) {
                      continue;
                  }
                  removeClass(scope_Target, options.cssClasses[key]);
              }

              while (scope_Target.firstChild) {
                  scope_Target.removeChild(scope_Target.firstChild);
              }

              delete scope_Target.noUiSlider;
          }

          function getNextStepsForHandle(handleNumber) {
              var location = scope_Locations[handleNumber];
              var nearbySteps = scope_Spectrum.getNearbySteps(location);
              var value = scope_Values[handleNumber];
              var increment = nearbySteps.thisStep.step;
              var decrement = null;

              // If snapped, directly use defined step value
              if (options.snap) {
                  return [
                      value - nearbySteps.stepBefore.startValue || null,
                      nearbySteps.stepAfter.startValue - value || null
                  ];
              }

              // If the next value in this step moves into the next step,
              // the increment is the start of the next step - the current value
              if (increment !== false) {
                  if (value + increment > nearbySteps.stepAfter.startValue) {
                      increment = nearbySteps.stepAfter.startValue - value;
                  }
              }

              // If the value is beyond the starting point
              if (value > nearbySteps.thisStep.startValue) {
                  decrement = nearbySteps.thisStep.step;
              } else if (nearbySteps.stepBefore.step === false) {
                  decrement = false;
              }

              // If a handle is at the start of a step, it always steps back into the previous step first
              else {
                  decrement = value - nearbySteps.stepBefore.highestStep;
              }

              // Now, if at the slider edges, there is no in/decrement
              if (location === 100) {
                  increment = null;
              } else if (location === 0) {
                  decrement = null;
              }

              // As per #391, the comparison for the decrement step can have some rounding issues.
              var stepDecimals = scope_Spectrum.countStepDecimals();

              // Round per #391
              if (increment !== null && increment !== false) {
                  increment = Number(increment.toFixed(stepDecimals));
              }

              if (decrement !== null && decrement !== false) {
                  decrement = Number(decrement.toFixed(stepDecimals));
              }

              return [decrement, increment];
          }

          // Get the current step size for the slider.
          function getNextSteps() {
              return scope_HandleNumbers.map(getNextStepsForHandle);
          }

          // Updateable: margin, limit, padding, step, range, animate, snap
          function updateOptions(optionsToUpdate, fireSetEvent) {
              // Spectrum is created using the range, snap, direction and step options.
              // 'snap' and 'step' can be updated.
              // If 'snap' and 'step' are not passed, they should remain unchanged.
              var v = valueGet();

              var updateAble = [
                  "margin",
                  "limit",
                  "padding",
                  "range",
                  "animate",
                  "snap",
                  "step",
                  "format",
                  "pips",
                  "tooltips"
              ];

              // Only change options that we're actually passed to update.
              updateAble.forEach(function(name) {
                  // Check for undefined. null removes the value.
                  if (optionsToUpdate[name] !== undefined) {
                      originalOptions[name] = optionsToUpdate[name];
                  }
              });

              var newOptions = testOptions(originalOptions);

              // Load new options into the slider state
              updateAble.forEach(function(name) {
                  if (optionsToUpdate[name] !== undefined) {
                      options[name] = newOptions[name];
                  }
              });

              scope_Spectrum = newOptions.spectrum;

              // Limit, margin and padding depend on the spectrum but are stored outside of it. (#677)
              options.margin = newOptions.margin;
              options.limit = newOptions.limit;
              options.padding = newOptions.padding;

              // Update pips, removes existing.
              if (options.pips) {
                  pips(options.pips);
              } else {
                  removePips();
              }

              // Update tooltips, removes existing.
              if (options.tooltips) {
                  tooltips();
              } else {
                  removeTooltips();
              }

              // Invalidate the current positioning so valueSet forces an update.
              scope_Locations = [];
              valueSet(optionsToUpdate.start || v, fireSetEvent);
          }

          // Initialization steps
          function setupSlider() {
              // Create the base element, initialize HTML and set classes.
              // Add handles and connect elements.
              scope_Base = addSlider(scope_Target);

              addElements(options.connect, scope_Base);

              // Attach user events.
              bindSliderEvents(options.events);

              // Use the public value method to set the start values.
              valueSet(options.start);

              if (options.pips) {
                  pips(options.pips);
              }

              if (options.tooltips) {
                  tooltips();
              }

              aria();
          }

          setupSlider();

          // noinspection JSUnusedGlobalSymbols
          scope_Self = {
              destroy: destroy,
              steps: getNextSteps,
              on: bindEvent,
              off: removeEvent,
              get: valueGet,
              set: valueSet,
              setHandle: valueSetHandle,
              reset: valueReset,
              // Exposed for unit testing, don't use this in your application.
              __moveHandles: function(a, b, c) {
                  moveHandles(a, b, scope_Locations, c);
              },
              options: originalOptions, // Issue #600, #678
              updateOptions: updateOptions,
              target: scope_Target, // Issue #597
              removePips: removePips,
              removeTooltips: removeTooltips,
              pips: pips // Issue #594
          };

          return scope_Self;
      }

      // Run the standard initializer
      function initialize(target, originalOptions) {
          if (!target || !target.nodeName) {
              throw new Error("noUiSlider (" + VERSION + "): create requires a single element, got: " + target);
          }

          // Throw an error if the slider was already initialized.
          if (target.noUiSlider) {
              throw new Error("noUiSlider (" + VERSION + "): Slider was already initialized.");
          }

          // Test the options and create the slider environment;
          var options = testOptions(originalOptions);
          var api = scope(target, options, originalOptions);

          target.noUiSlider = api;

          return api;
      }

      // Use an object instead of a function for future expandability;
      return {
          // Exposed for unit testing, don't use this in your application.
          __spectrum: Spectrum,
          version: VERSION,
          create: initialize
      };
  });
  });

  // Offsets
  var BIF_INDEX_OFFSET = 64;
  var FRAMEWISE_SEPARATION_OFFSET = 16;
  var NUMBER_OF_BIF_IMAGES_OFFSET = 12;
  var VERSION_OFFSET = 8; // Metadata

  var BIF_INDEX_ENTRY_LENGTH = 8; // Magic Number
  // SEE: https://sdkdocs.roku.com/display/sdkdoc/Trick+Mode+Support#TrickModeSupport-MagicNumber

  var MAGIC_NUMBER = new Uint8Array(['0x89', '0x42', '0x49', '0x46', '0x0d', '0x0a', '0x1a', '0x0a']);
  /**
   * Validate the file identifier against the magic number.
   *
   * @returns {boolean} isValid
   */

  function validate(magicNumber) {
    var isValid = true;
    MAGIC_NUMBER.forEach(function (byte, i) {
      if (byte !== magicNumber[i]) {
        isValid = false;
        return;
      }
    });
    return isValid;
  }
  /**
   * Parsing and read BIF file format.
   *
   * @param {ArrayBuffer} arrayBuffer
   */


  var BIFParser =
  /*#__PURE__*/
  function () {
    function BIFParser(arrayBuffer) {
      // Magic Number
      // SEE: https://sdkdocs.roku.com/display/sdkdoc/Trick+Mode+Support#TrickModeSupport-MagicNumber
      var magicNumber = new Uint8Array(arrayBuffer).slice(0, 8);

      if (!validate(magicNumber)) {
        throw new Error('Invalid BIF file.');
      }

      this.arrayBuffer = arrayBuffer;
      this.data = new DataView(arrayBuffer); // eslint-disable-line new-cap
      // Framewise Separation
      // SEE: https://sdkdocs.roku.com/display/sdkdoc/Trick+Mode+Support#TrickModeSupport-FramewiseSeparation

      this.framewiseSeparation = this.data.getUint32(FRAMEWISE_SEPARATION_OFFSET, true) || 1000; // Number of BIF images
      // SEE: https://sdkdocs.roku.com/display/sdkdoc/Trick+Mode+Support#TrickModeSupport-NumberofBIFimages

      this.numberOfBIFImages = this.data.getUint32(NUMBER_OF_BIF_IMAGES_OFFSET, true); // Version
      // SEE: https://sdkdocs.roku.com/display/sdkdoc/Trick+Mode+Support#TrickModeSupport-Version

      this.version = this.data.getUint32(VERSION_OFFSET, true);
      this.bifIndex = this.generateBIFIndex(true);
    }
    /**
     * Create the BIF index
     * SEE: https://sdkdocs.roku.com/display/sdkdoc/Trick+Mode+Support#TrickModeSupport-BIFindex
     *
     * @returns {Array} bifIndex
     */


    var _proto = BIFParser.prototype;

    _proto.generateBIFIndex = function generateBIFIndex() {
      var bifIndex = [];

      for ( // BIF index starts at byte 64 (BIF_INDEX_OFFSET)
      var i = 0, bifIndexEntryOffset = BIF_INDEX_OFFSET; i < this.numberOfBIFImages; i += 1, bifIndexEntryOffset += BIF_INDEX_ENTRY_LENGTH) {
        var bifIndexEntryTimestampOffset = bifIndexEntryOffset;
        var bifIndexEntryAbsoluteOffset = bifIndexEntryOffset + 4;
        var nextBifIndexEntryAbsoluteOffset = bifIndexEntryAbsoluteOffset + BIF_INDEX_ENTRY_LENGTH; // Documented example, items within `[]`are used to generate the frame.
        // 64, 65, 66, 67 | 68, 69, 70, 71
        // [Frame 0 timestamp] | [absolute offset of frame]
        // 72, 73, 74, 75 | 76, 77, 78, 79
        // Frame 1 timestamp | [absolute offset of frame]

        var offset = this.data.getUint32(bifIndexEntryAbsoluteOffset, true);
        var nextOffset = this.data.getUint32(nextBifIndexEntryAbsoluteOffset, true);
        var timestamp = this.data.getUint32(bifIndexEntryTimestampOffset, true);
        bifIndex.push({
          offset: offset,
          timestamp: timestamp,
          length: nextOffset - offset
        });
      }

      return bifIndex;
    }
    /**
     * Return image data for a specific frame of a movie.
     *
     * @param {number} second
     * @returns {string} imageData
     */
    ;

    _proto.getImageDataAtSecond = function getImageDataAtSecond(second) {
      var image = 'data:image/jpeg;base64,'; // since frames are defined at an interval of `this.framewiseSeparation`,
      // we need to convert the time into an appropriate frame number.

      var frameNumber = Math.floor(second / (this.framewiseSeparation / 1000));
      var frame = this.bifIndex[frameNumber];

      if (!frame) {
        return image;
      }

      var base64 = btoa(new Uint8Array(this.arrayBuffer.slice(frame.offset, frame.offset + frame.length)).reduce(function (data, byte) {
        return data + String.fromCharCode(byte);
      }, ''));
      return "" + image + base64;
    };

    return BIFParser;
  }();

  /**
   * @typedef {Object} Point
   * @property {number} x
   * @property {number} y
   */

  /**
   * @typedef {Object} Offset
   * @property {number} left
   * @property {number} top
   */

  /**
   * SEE: https://github.com/videojs/video.js/blob/4f6cb03adde9ddf800e2ecf6fa87b07d436b74e8/src/js/utils/dom.js#L438
   *
   * @param {HTMLElement} element
   * @returns {Offset}
   */
  function getElementPosition(element) {
    var elementPosition = {
      left: 0,
      top: 0
    };

    if (element.getBoundingClientRect && element.parentNode) {
      elementPosition = element.getBoundingClientRect();
    }

    var _document = document,
        body = _document.body,
        documentElement = _document.documentElement;
    var clientLeft = documentElement.clientLeft || body.clientLeft || 0;
    var scrollLeft = window.pageXOffset || body.scrollLeft;
    var clientTop = documentElement.clientTop || body.clientTop || 0;
    var scrollTop = window.pageYOffset || body.scrollTop; // Android sometimes returns slightly off decimal values, so need to round

    return {
      left: Math.round(elementPosition.left + (scrollLeft - clientLeft)),
      top: Math.round(elementPosition.top + (scrollTop - clientTop))
    };
  }
  /**
   * SEE: https://github.com/videojs/video.js/blob/4f6cb03adde9ddf800e2ecf6fa87b07d436b74e8/src/js/utils/dom.js#L480
   *
   * @param {Event} event
   * @param {HTMLElement} element
   * @returns {Point}
   */

  function getPointerPosition(event, element) {
    var elementPosition = getElementPosition(element);
    var elementWidth = element.offsetWidth;
    var elementHeight = element.offsetHeight;
    var pageX = event.pageX,
        pageY = event.pageY;

    if (event.changedTouches) {
      var _event$changedTouches = event.changedTouches[0];
      pageX = _event$changedTouches.pageX;
      pageY = _event$changedTouches.pageY;
    }

    return {
      x: Math.max(0, Math.min(1, (event.pageX - elementPosition.left) / elementWidth)),
      y: Math.max(0, Math.min(1, (elementPosition.top - event.pageY + elementHeight) / elementHeight))
    };
  }

  var defaults = {
    createBIFImage: Function.prototype,
    createBIFTime: Function.prototype,
    template: Function.prototype
  };
  var VjsMouseTimeDisplay = videojs.getComponent('MouseTimeDisplay');
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

  var BIFMouseTimeDisplay =
  /*#__PURE__*/
  function (_VjsMouseTimeDisplay) {
    _inheritsLoose(BIFMouseTimeDisplay, _VjsMouseTimeDisplay);

    /**
     * Create BIF element.
     *
     * @param {HTMLElement} root
     * @returns {HTMLElement} BIFElement
     */
    BIFMouseTimeDisplay.createBIFElement = function createBIFElement(root, cls) {
      var BIFElement = document.createElement('div');
      BIFElement.className = cls;
      root.appendChild(BIFElement);
      return BIFElement;
    }
    /**
     * Create BIF image element.
     *
     * @returns {HTMLElement} BIFImage
     */
    ;

    BIFMouseTimeDisplay.createBIFImage = function createBIFImage(cls) {
      var BIFImage = document.createElement('img');
      BIFImage.className = 'bif-image';
      return BIFImage;
    }
    /**
     * Create BIF time element.
     *
     * @returns {HTMLElement} BIFTime
     */
    ;

    BIFMouseTimeDisplay.createBIFTime = function createBIFTime() {
      var BIFTime = document.createElement('span');
      BIFTime.className = 'bif-time';
      return BIFTime;
    };

    function BIFMouseTimeDisplay(player, options) {
      var _this;

      if (options === void 0) {
        options = {};
      }

      _this = _VjsMouseTimeDisplay.call(this, player, options) || this;
      _this.BIFElement = BIFMouseTimeDisplay.createBIFElement(player.el(), 'bif-thumbnail');

      _this.render(options);

      _this.BIFElementSlider = BIFMouseTimeDisplay.createBIFElement(player.el(), 'bif-slider');

      _this.renderSlider(options);

      return _this;
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


    var _proto = BIFMouseTimeDisplay.prototype;

    _proto.configure = function configure(options) {
      this.options_ = videojs.mergeOptions(defaults, this.options_, options);
      var data = options.data;

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
    ;

    _proto.getCurrentImageAtTime = function getCurrentImageAtTime(time) {
      var image;

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
    ;

    _proto.getCurrentTimeAtEvent = function getCurrentTimeAtEvent(event) {
      var seekBar = this.player_.controlBar.progressControl.seekBar;
      var position = getPointerPosition(event, seekBar.el());
      return position.x * this.player_.duration();
    }
    /**
     * Gets the current time in seconds based on the mouse position over the `SeekBar`.
     *
     * @param {Event} event
     * @returns {number} time
     */
    ;

    _proto.getCurrentOMTimeAtEvent = function getCurrentOMTimeAtEvent(time) {
      return this.player_.duration() / 100 * time;
    }
    /**
     * Event that fires every time the mouse is moved, throttled, over the `ProgressControl`.
     *
     * @param {Event} event
     */
    ;

    _proto.handleSliderMove = function handleSliderMove(data) {
      if (!data) {
        return;
      } // gets the time in seconds 


      var time = this.getCurrentOMTimeAtEvent(data.percentage); // gets the image

      var image = this.getCurrentImageAtTime(time);

      if (videojs(this.player().id()).hasClass('video-is-dragging')) {
        this.BIFElementSlider.style.display = 'block';
      }

      this.BIFElementSlider.style.left = data.left + 'px';

      if (image) {
        this.BIFImageSlider.src = image;
      }
    };

    _proto.handleSliderOut = function handleSliderOut() {
      this.BIFElementSlider.style.display = 'none';
    };

    _proto.handleProgressBarMove = function handleProgressBarMove(event, parent) {
      if (!event) {
        return;
      } // gets the time in seconds


      var time = this.getCurrentTimeAtEvent(event); // gets the image

      var image = this.getCurrentImageAtTime(time);
      this.BIFElement.style.display = 'block';
      this.BIFElement.style.left = event.offsetX + parent + 'px';

      if (image) {
        this.BIFImage.src = image;
      }

      this.BIFTime.innerHTML = videojs.formatTime(Math.floor(time));
    };

    _proto.handleProgressBarOut = function handleProgressBarOut() {
      this.BIFElement.style.display = 'none';
    };

    _proto.setSliderTime = function setSliderTime(time) {
      this.BIFTimeSlider.innerText = time;
    }
    /**
     * Determines the existence of the `BIFParser` which manages the index and all
     * associated images.
     *
     * @returns {boolean}
     */
    ;

    _proto.hasImages = function hasImages() {
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
    ;

    _proto.render = function render(options) {
      this.configure(options); // create BIF image element

      var BIFImage = this.options_.createBIFImage.apply(this);

      if (BIFImage instanceof HTMLElement) {
        this.BIFImage = BIFImage;
      } else {
        this.BIFImage = BIFMouseTimeDisplay.createBIFImage();
      } // create BIF time element


      var BIFTime = this.options_.createBIFTime.apply(this);

      if (BIFTime instanceof HTMLElement) {
        this.BIFTime = BIFTime;
      } else {
        this.BIFTime = BIFMouseTimeDisplay.createBIFTime();
      } // create BIF template element


      var template = this.options_.template.apply(this);

      if (!(template instanceof HTMLElement)) {
        template = this.template();
      } // replace template contents every render


      this.BIFElement.innerHTML = '';
      this.BIFElement.appendChild(template);
    }
    /**
     * The primary template for the component. Typically houses the `BIFImage` and
     * `BIFTime` elements to be styled or altered.
     *
     * @returns {HTMLElement} template
     */
    ;

    _proto.template = function template() {
      var template = document.createElement('div');
      template.className = 'bif'; // append image element only if the images are ready

      if (this.hasImages()) {
        template.appendChild(this.BIFImage);
      }

      template.appendChild(this.BIFTime);
      return template;
    };

    _proto.renderSlider = function renderSlider(options) {
      this.configure(options); // create BIF image element

      var BIFImageSlider = this.options_.createBIFImage.apply(this);

      if (BIFImageSlider instanceof HTMLElement) {
        this.BIFImageSlider = BIFImageSlider;
      } else {
        this.BIFImageSlider = BIFMouseTimeDisplay.createBIFImage();
      } // create BIF time element


      var BIFTimeSlider = this.options_.createBIFTime.apply(this);

      if (BIFTimeSlider instanceof HTMLElement) {
        this.BIFTimeSlider = BIFTimeSlider;
      } else {
        this.BIFTimeSlider = BIFMouseTimeDisplay.createBIFTime();
      } // create BIF template element


      var template = this.options_.template.apply(this);

      if (!(template instanceof HTMLElement)) {
        template = this.templateSlider();
      } // replace template contents every render


      this.BIFElementSlider.innerHTML = '';
      this.BIFElementSlider.appendChild(template);
    }
    /**
     * The primary template for the component. Typically houses the `BIFImage` and
     * `BIFTime` elements to be styled or altered.
     *
     * @returns {HTMLElement} template
     */
    ;

    _proto.templateSlider = function templateSlider() {
      var template = document.createElement('div');
      template.className = 'bif'; // append image element only if the images are ready

      if (this.hasImages()) {
        template.appendChild(this.BIFImageSlider);
      }

      template.appendChild(this.BIFTimeSlider);
      return template;
    };

    return BIFMouseTimeDisplay;
  }(VjsMouseTimeDisplay);

  videojs.registerComponent('BIFMouseTimeDisplay', BIFMouseTimeDisplay);
  var VjsSeekBar = videojs.getComponent('SeekBar');
  var vjsSeekBarChildren = VjsSeekBar.prototype.options_.children;
  var mouseTimeDisplayIndex = vjsSeekBarChildren.indexOf('mouseTimeDisplay');
  vjsSeekBarChildren.splice(mouseTimeDisplayIndex, 1, 'BIFMouseTimeDisplay');
  var Plugin = videojs.getPlugin('plugin');
  var MenuButton = videojs.getComponent('MenuButton');
  var Menu = videojs.getComponent('Menu');
  var Component$1 = videojs.getComponent('Component'); // Default options for the plugin.

  var defaults$1 = {
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

  var Frames =
  /*#__PURE__*/
  function (_Plugin) {
    _inheritsLoose(Frames, _Plugin);

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
    function Frames(player, options) {
      var _this;

      _this = _Plugin.call(this, player, options) || this;
      _this.options = videojs.mergeOptions(defaults$1, options);

      _this.player.ready(function () {
        _this.player.addClass('vjs-frames');

        var that = _assertThisInitialized(_this); // ACTION FRAMERATE IF SET


        if (_this.options.frameRate) {
          _this.initTimecode();
        } // ACTION CLIPPING IF SET


        if (_this.options.clippingEnabled) {
          _this.initClipping();
        } // ACTION BIF IF SET


        if (_this.options.bif) {
          _this.initBif();
        } // ACTION META IF SET


        if (_this.options.meta) {
          _this.initMetaTimeline();
        } // ACTION NETWORk IF SET


        if (_this.options.network) {
          _this.initMetaNetwork();
        }
      });

      return _this;
    }

    var _proto = Frames.prototype;

    _proto.initTimecode = function initTimecode() {
      console.log('framerate'); // Hide the remaining time replaced by timecode

      this.player.getChild('controlBar').getChild('remainingTimeDisplay').hide(); // Create timecode menu should only be set if a framerate is set

      this.createTimecodeMenu(); // Show the time formatted

      this.createTimeDisplay();
      this.on('switchTimecode', this.switchTimecode);
      this.on('updateDisplay', this.updateDisplay);
      this.on(this.player, ['seeking'], this.updateDisplay);
      this.on('seekTo', this.seekTo); // Only start the timer if framerate isset

      this.listen('time');
    };

    _proto.initClipping = function initClipping() {
      var that = this;
      this.one(this.player, ['timeupdate'], function () {
        that.createClippingMenu();
      });
    };

    _proto.initBif = function initBif() {
      var that = this;
      var BIFMouseTimeDisplay = this.player.controlBar.progressControl.seekBar.BIFMouseTimeDisplay;
      this.player.addClass('video-has-bif');
      var request = new XMLHttpRequest();
      request.open('GET', this.options.bif, true);
      request.responseType = 'arraybuffer';

      request.onload = function (event) {
        if (event.target.status !== 200) {
          return;
        }

        BIFMouseTimeDisplay.render({
          data: event.target.response
        });
        BIFMouseTimeDisplay.renderSlider({
          data: event.target.response
        });
      };

      request.send(null);
      this.player.controlBar.progressControl.on('mousemove', function (event) {
        if (that.options.clippingDisplayed === false) {
          BIFMouseTimeDisplay.handleProgressBarMove(event, this.el().offsetLeft);
        }
      });
      this.player.controlBar.progressControl.on('mouseout', function (event) {
        if (that.options.clippingDisplayed === false) {
          BIFMouseTimeDisplay.handleProgressBarOut();
        }
      }); // Add listners for bif clipping

      this.on('updateClipping', this.updateClipping);
      this.on('partialRestore', this.partialRestore);
      this.on(this.player, ['timeupdate'], this.updateProgressCircle);
    };

    _proto.initMetaTimeline = function initMetaTimeline() {
      this.on(this.player, ['loadedmetadata'], this.createMetaDisplay);
    };

    _proto.initMetaNetwork = function initMetaNetwork() {
      this.on(this.player, ['loadedmetadata'], this.createMetaNetwork);
    };

    _proto.createMetaDisplay = function createMetaDisplay() {
      var _this2 = this;

      var that = this;
      var total = this.player.duration() * 1000;
      var gDate = '1970-01-01 00:00:00 GMT'; // Needs to be the begining of the date object

      var request = new XMLHttpRequest();
      request.open('GET', this.options.meta, true);

      request.onload = function (event) {
        var _options;

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
            data: meta[i],
            group: "Celebrity",
            className: "celebs"
          };

          setItems.push(d);
        }

        var last = new Date(gDate);
        last.setMilliseconds(total); // DOM element where the Timeline will be attached

        var container = document.getElementById('visualization');
        var groups = new vis.DataSet([{
          "content": "Celebrity",
          "id": "Celebrity",
          "value": 1,
          className: 'celebs'
        }]); // Create a DataSet (allows two way data-binding)

        var items = new vis.DataSet(setItems); //134000 full time in milliseconds
        // Configuration for the Timeline

        var options = (_options = {
          groupOrder: function groupOrder(a, b) {
            return a.value - b.value;
          },
          groupOrderSwap: function groupOrderSwap(a, b, groups) {
            var v = a.value;
            a.value = b.value;
            b.value = v;
          },

          /*groupTemplate: function(group){
            var container = document.createElement('div');
            var label = document.createElement('span');
            label.innerHTML = group.content + ' ';
            container.insertAdjacentElement('afterBegin',label);
            var hide = document.createElement('button');
            hide.innerHTML = 'hide';
            hide.style.fontSize = 'small';
            hide.addEventListener('click',function(){
              groups.update({id: group.id, visible: false});
            });
            container.insertAdjacentElement('beforeEnd',hide);
            return container;
          },*/
          orientation: 'both',
          editable: true,
          groupEditable: true,
          start: new Date(gDate),
          end: last,
          min: new Date(gDate),
          max: last
        }, _options["editable"] = false, _options.showMajorLabels = false, _options.format = {
          minorLabels: function minorLabels(date, scale, step) {
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
          majorLabels: function majorLabels(date, scale, step) {
            return "";
          }
        }, _options); // Create a Timeline

        var timeline = new vis.Timeline(container);
        timeline.setOptions(options);
        timeline.setGroups(groups);
        timeline.setItems(items);
        var marker = new Date(gDate);
        timeline.addCustomTime(marker, 1);

        _this2.on(_this2.player, ['timeupdate'], function (event) {
          var time = this.player.currentTime();
          var marker2 = new Date(gDate);
          marker2.setSeconds(time);
          timeline.setCustomTime(marker2, 1);
        });

        timeline.on('select', function (properties) {
          var data = items.get(properties.items)[0];

          if (data.data) {
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
    };

    _proto.groupBy = function groupBy(objectArray, property) {
      return objectArray.reduce(function (acc, obj) {
        var key = obj[property].Name;

        if (!acc[key]) {
          acc[key] = [];
        }

        acc[key].push(obj);
        return acc;
      }, {});
    };

    _proto.createMetaNetwork = function createMetaNetwork() {
      var _this3 = this;
      var network = null;
      var request = new XMLHttpRequest();
      request.open('GET', this.options.network, true);

      request.onload = function (event) {
        if (event.target.status !== 200) {
          return;
        }

        var meta = JSON.parse(event.target.response);

        var grouped = _this3.groupBy(meta, 'Label'); //console.log('grouped',grouped);


        var setItems = [];
        Object.keys(grouped).forEach(function (key, index) {
          //console.log(index);
          //console.log(key, grouped[key]);
          setItems.push({
            id: index,
            value: grouped[key].length,
            label: key,
            data: grouped[key]
          });
        }); // Instantiate our network object.

        var container = document.getElementById('mynetwork');
        var nodes = new vis.DataSet(setItems);
        var data = {
          nodes: nodes //edges: edges

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
              face: 'arial'
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
        network.on('click', function (properties) {
          var ids = properties.nodes;
          var clickedNodes = nodes.get(ids); //console.log('I\'m clicked',clickedNodes );

          var children = clickedNodes[0];

          if (children.data) {
            var newItems = [];

            for (var i = 0; i < children.data.length; i++) {
              newItems.push({
                id: i,
                value: 1,
                label: 't' + children.data[i].Timestamp,
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
    };

    _proto.createTimeDisplay = function createTimeDisplay() {
      var that = this;
      var TimeDisplay = videojs.extend(MenuButton, {
        constructor: function constructor() {
          MenuButton.apply(this, arguments);
          this.addClass('vjs-timecode-menu');
        },
        handleClick: function handleClick() {
          that.trigger('switchTimecode', {
            format: 'frames'
          });
        }
      });
      videojs.registerComponent('timeDisplay', TimeDisplay);
      this.player.getChild('controlBar').addChild('timeDisplay', {});
      this.player.getChild('controlBar').el().insertBefore(this.player.getChild('controlBar').getChild('timeDisplay').el(), this.player.getChild('controlBar').getChild('progressControl').el());
    };

    _proto.createTimecodeMenu = function createTimecodeMenu() {
      var that = this;
      var TimecodeButton = videojs.extend(MenuButton, {
        constructor: function constructor() {
          MenuButton.apply(this, arguments);
          this.addClass('vjs-button');
          this.controlText("Timecode");
          this.children_[0].addClass('vjs-fa-icon');
          this.children_[0].addClass('far');
          this.children_[0].addClass('fa-clock'); // Get the menu ul 

          var menuUL = this.el().children[1].children[0];
          var header = document.createElement("li");
          header.className = 'vjs-om-menu-header';
          header.innerHTML = 'Settings';
          menuUL.appendChild(header);
          var options = [{
            title: 'Timecode',
            id: 'SMPTE'
          }, {
            title: 'Frames',
            id: 'frames'
          }, {
            title: 'Seconds',
            id: 'seconds'
          }, {
            title: 'Milliseconds',
            id: 'milliseconds'
          }, {
            title: 'Time',
            id: 'time'
          }];
          var i;

          for (i = 0; i < options.length; i++) {
            var child = document.createElement("li");
            child.className = 'vjs-menu-item';
            child.id = options[i].id;
            child.innerHTML = options[i].title + ' <span class="vjs-control-text"></span>';
            child.addEventListener('click', function () {
              that.trigger('switchTimecode', {
                format: this.id
              });
              that.trigger('updateDisplay');
            });
            menuUL.appendChild(child);
          }

          this.el().children[1].appendChild(menuUL);
        },
        handleClick: function handleClick() {}
      });
      videojs.registerComponent('timecodeButton', TimecodeButton);
      this.player.getChild('controlBar').addChild('timecodeButton', {});
      this.player.getChild('controlBar').el().insertBefore(this.player.getChild('controlBar').getChild('timecodeButton').el(), this.player.getChild('controlBar').getChild('progressControl').el());
    };

    _proto.createClippingMenu = function createClippingMenu() {
      var that = this;
      console.log('createClippingMenu');
      this.player.getChild('controlBar').getChild('progressControl').addChild('ClippingBar', {
        text: ''
      });
      this.player.getChild('controlBar').getChild('progressControl').getChild('ClippingBar').hide();
      var ClipButton = videojs.extend(MenuButton, {
        constructor: function constructor() {
          MenuButton.apply(this, arguments);
          this.addClass('vjs-button');
          this.controlText("Clipping");
          this.children_[0].addClass('vjs-fa-icon');
          this.children_[0].addClass('fas');
          this.children_[0].addClass('fa-cut'); // Get the menu ul 

          var menuUL = this.el().children[1].children[0];
          var header = document.createElement("li");
          header.className = 'vjs-om-menu-header';
          header.innerHTML = 'Clipping';
          menuUL.appendChild(header);
          var options = [{
            title: 'Enable Clipping',
            id: 'enable'
          }, {
            title: 'Partial Restore',
            id: 'restore'
          }];
          var i;

          for (i = 0; i < options.length; i++) {
            var child = document.createElement("li");
            child.className = 'vjs-menu-item';
            child.id = options[i].id;
            child.innerHTML = options[i].title + ' <span class="vjs-control-text"></span>';
            child.addEventListener('click', function () {
              that.trigger('updateClipping', {
                item: this.id
              });
            });
            menuUL.appendChild(child);
          }

          this.el().children[1].appendChild(menuUL);
        },
        handleClick: function handleClick() {}
      });
      videojs.registerComponent('clipButton', ClipButton);
      this.player.getChild('controlBar').addChild('clipButton', {});
      this.player.getChild('controlBar').el().insertBefore(this.player.getChild('controlBar').getChild('clipButton').el(), this.player.getChild('controlBar').getChild('progressControl').el());
    };

    _proto.initClippingUi = function initClippingUi() {
      // Only init once
      if (this.options.clippingUi === true) {
        return;
      }

      this.options.clippingUi = true;
      var that = this;
      var slider = document.getElementById(this.player.id() + '_range');
      nouislider.create(slider, {
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
      var BIFMouseTimeDisplay = this.player.controlBar.progressControl.seekBar.BIFMouseTimeDisplay;
      slider.noUiSlider.on('start', function (ind, ui, event) {
        that.player.addClass('video-is-dragging');
      });
      slider.noUiSlider.on('update', function (ind, ui, event) {
        var percentage = Math.floor(event[ui] / parseInt(that.totalFrames()) * 100);
        that.player.pause();
        var lower = slider.getElementsByClassName('noUi-handle-lower')[0].getBoundingClientRect().x - that.player.el().getBoundingClientRect().x;
        var upper = slider.getElementsByClassName('noUi-handle-upper')[0].getBoundingClientRect().x - that.player.el().getBoundingClientRect().x;
        BIFMouseTimeDisplay.handleSliderMove({
          left: ui === 0 ? Math.floor(lower + 10) : Math.floor(upper + 10),
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
      slider.noUiSlider.on('end', function (ind, ui, event) {
        BIFMouseTimeDisplay.handleSliderOut();
      });
    };

    _proto.updateProgressCircle = function updateProgressCircle() {
      var slider = document.getElementById(this.player.id() + '_range');
      var base = slider.getElementsByClassName('noUi-progress')[0];

      if (base) {
        base.style.left = this.player.currentTime() / this.player.duration() * 100 + '%';
      }
    };

    _proto.updateClipping = function updateClipping(event, json) {
      var slider = document.getElementById(this.player.id());
      var shortcutOverlay = slider.getElementsByClassName('shortcutOverlay')[0];

      switch (json.item) {
        case 'enable':
          if (this.options.clippingDisplayed) {
            // Clipping is disable
            document.getElementById(json.item).innerText = 'Enable Clipping';
            this.player.getChild('controlBar').getChild('progressControl').getChild('seekBar').show();
            this.player.getChild('controlBar').getChild('progressControl').getChild('ClippingBar').hide();

            if (shortcutOverlay) {
              shortcutOverlay.style.display = 'none';
            }

            this.options.clippingDisplayed = false;
          } else {
            // Hide the focus bif functionality
            var elements = document.getElementsByClassName('bif-thumbnail');

            for (var i = 0; i < elements.length; i++) {
              elements[i].style.display = 'none';
            } // Clipping is enabled


            document.getElementById(json.item).innerText = 'Disable Clipping';
            this.player.getChild('controlBar').getChild('progressControl').getChild('seekBar').hide();
            this.player.getChild('controlBar').getChild('progressControl').getChild('ClippingBar').show();

            if (shortcutOverlay) {
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
    };

    _proto.partialRestore = function partialRestore(callback) {
      callback(this.options);
    };

    _proto.listen = function listen(format, tick) {
      var that = this;
      this.interval = setInterval(function () {
        if (that.player.paused() || that.player.ended()) {
          return;
        }

        that.trigger('updateDisplay');
      }, tick ? tick : 1000 / this.options.frameRate);
    };

    _proto.updateDisplay = function updateDisplay() {
      // Create a loop if clipping enabled
      if (this.options.clippingEnabled && this.options.clippingDisplayed) {
        if (!this.player.paused()) {
          var slider = document.getElementById(this.player.id() + '_range');
          var restore = slider.noUiSlider.get();

          if (this.toFrames() >= restore[1]) {
            this.seekTo({
              frame: restore[0]
            });
          }
        }
      }

      var BIFMouseTimeDisplay = this.player.controlBar.progressControl.seekBar.BIFMouseTimeDisplay;

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
    };

    _proto.stopListen = function stopListen() {
      clearInterval(this.interval);
    };

    _proto.getFrames = function getFrames() {
      return Math.floor(this.player.currentTime().toFixed(5) * this.options.frameRate);
    };

    _proto.totalFrames = function totalFrames() {
      if (this.player.duration()) {
        if (this.options.frameRate) {
          return Math.floor(this.player.duration().toFixed(5) * this.options.frameRate);
        } else {
          return Math.floor(this.player.duration());
        }
      } else {
        return 100;
      }
    };

    _proto.switchTimecode = function switchTimecode(event, json) {
      this.options.format = json.format;
    }
    /**
     * Returns the current time code in the video in HH:MM:SS format
     * - used internally for conversion to SMPTE format.
     * 
     * @param  {Number} frames - The current time in the video
     * @return {String} Returns the time code in the video
     */
    ;

    _proto.toTime = function toTime(frames) {
      var time = typeof frames !== 'number' ? this.player.currentTime() : frames,
          frameRate = this.options.frameRate;
      var dt = new Date(),
          format = 'hh:mm:ss' + (typeof frames === 'number' ? ':ff' : '');
      dt.setHours(0);
      dt.setMinutes(0);
      dt.setSeconds(0);
      dt.setMilliseconds(time * 1000);

      function wrap(n) {
        return n < 10 ? '0' + n : n;
      }

      return format.replace(/hh|mm|ss|ff/g, function (format) {
        switch (format) {
          case "hh":
            return wrap(dt.getHours() < 13 ? dt.getHours() : dt.getHours() - 12);

          case "mm":
            return wrap(dt.getMinutes());

          case "ss":
            return wrap(dt.getSeconds());

          case "ff":
            return wrap(Math.floor(time % 1 * frameRate));
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
    ;

    _proto.toSMPTE = function toSMPTE(frame) {
      if (!frame) {
        return this.toTime(this.player.currentTime());
      }

      var frameNumber = Number(frame);
      var fps = this.options.frameRate;

      function wrap(n) {
        return n < 10 ? '0' + n : n;
      }

      var _hour = fps * 60 * 60,
          _minute = fps * 60;

      var _hours = (frameNumber / _hour).toFixed(0);

      var _minutes = Number((frameNumber / _minute).toString().split('.')[0]) % 60;

      var _seconds = Number((frameNumber / fps).toString().split('.')[0]) % 60;

      var SMPTE = wrap(_hours) + ':' + wrap(_minutes) + ':' + wrap(_seconds) + ':' + wrap(frameNumber % fps);
      return SMPTE;
    }
    /**
     * Converts a SMPTE Time code to Seconds
     * 
     * @param  {String} SMPTE - a SMPTE time code in HH:MM:SS:FF format
     * @return {Number} Returns the Second count of a SMPTE Time code
     */
    ;

    _proto.toSeconds = function toSeconds(SMPTE) {
      if (!SMPTE) {
        return Math.floor(this.player.currentTime());
      }

      var time = SMPTE.split(':');
      return Number(time[0]) * 60 * 60 + Number(time[1]) * 60 + Number(time[2]);
    }
    /**
     * Converts a SMPTE Time code, or standard time code to Milliseconds
     * 
     * @param  {String} SMPTE OPTIONAL: a SMPTE time code in HH:MM:SS:FF format,
     * or standard time code in HH:MM:SS format.
     * @return {Number} Returns the Millisecond count of a SMPTE Time code
     */
    ;

    _proto.toMilliseconds = function toMilliseconds(SMPTE) {
      var frames = !SMPTE ? Number(this.toSMPTE().split(':')[3]) : Number(SMPTE.split(':')[3]);
      var milliseconds = 1000 / this.options.frameRate * (isNaN(frames) ? 0 : frames);
      return Math.floor(this.toSeconds(SMPTE) * 1000 + milliseconds);
    }
    /**
     * Converts a SMPTE Time code to it's equivalent frame number
     * 
     * @param  {String} SMPTE - OPTIONAL: a SMPTE time code in HH:MM:SS:FF format
     * @return {Number} Returns the long running video frame number
     */
    ;

    _proto.toFrames = function toFrames(SMPTE) {
      var time = !SMPTE ? this.toSMPTE().split(':') : SMPTE.split(':');
      var frameRate = this.options.frameRate;
      var hh = Number(time[0]) * 60 * 60 * frameRate;
      var mm = Number(time[1]) * 60 * frameRate;
      var ss = Number(time[2]) * frameRate;
      var ff = Number(time[3]);
      return Math.floor(hh + mm + ss + ff);
    }
    /**
     * Private - seek method used internally for the seeking functionality.
     * 
     * @param  {String} direction - Accepted Values are: forward, backward
     * @param  {Number} frames - Number of frames to seek by.
     */
    ;

    _proto.seek = function seek(direction, frames) {
      if (!this.player.paused()) {
        this.player.pause();
      }

      var frame = Number(this.getFrames());
      /** To seek forward in the video, we must add 0.00001 to the video runtime for proper interactivity */

      var currentTime = (direction === 'backward' ? frame - frames : frame + frames) / this.options.frameRate + 0.00001;
      this.player.currentTime(currentTime);
    }
    /**
     * Seeks forward [X] amount of frames in the video.
     * 
     * @param  {Number} frames - Number of frames to seek by.
     * @param  {Function} callback - Callback function to execute once seeking is complete.
     */
    ;

    _proto.seekForward = function seekForward(frames, callback) {
      if (!frames) {
        frames = 1;
      }

      this.seek('forward', Number(frames));
      this.trigger('updateDisplay');
      return callback ? callback() : true;
    }
    /**
     * Seeks backward [X] amount of frames in the video.
     * 
     * @param  {Number} frames - Number of frames to seek by.
     * @param  {Function} callback - Callback function to execute once seeking is complete.
     */
    ;

    _proto.seekBackward = function seekBackward(frames, callback) {
      if (!frames) {
        frames = 1;
      }

      this.seek('backward', Number(frames));
      this.trigger('updateDisplay');
      return callback ? callback() : true;
    }
    /**
     * For seeking to a certain SMPTE time code, standard time code, frame, second, or millisecond in the video.
     * - Was previously deemed not feasible. Veni, vidi, vici.
     *  
     * @param  {Object} option - Configuration Object for seeking allowed keys are SMPTE, time, frame, seconds, and milliseconds
     * example: { SMPTE: '00:01:12:22' }, { time: '00:01:12' },  { frame: 1750 }, { seconds: 72 }, { milliseconds: 72916 }
     */
    ;

    _proto.seekTo = function seekTo(config, ui) {
      var obj = config || {},
          seekTime,
          SMPTE;
      /** Only allow one option to be passed */

      var option = Object.keys(obj)[0];

      if (option == 'SMPTE' || option == 'time') {
        SMPTE = obj[option];
        seekTime = this.toMilliseconds(SMPTE) / 1000 + 0.001;
        this.player.currentTime(seekTime);
        return;
      }

      console.log('obj', obj);

      switch (option) {
        case 'frame':
          SMPTE = this.toSMPTE(obj[option]);
          seekTime = this.toMilliseconds(SMPTE) / 1000 + 0.001;
          break;

        case 'seconds':
          seekTime = Number(obj[option]);
          break;

        case 'milliseconds':
          seekTime = Number(obj[option]) / 1000 + 0.001;
          break;
      }

      if (!isNaN(seekTime)) {
        this.player.currentTime(seekTime);

        if (obj.hasOwnProperty('ui')) {
          if (obj.ui === 0) {
            this.options.inSMPTE = this.toSMPTE();
          } else {
            this.options.outSMPTE = this.toSMPTE();
          }
        }
      }
    };

    return Frames;
  }(Plugin); // Define default values for the plugin's `state` object here.


  Frames.defaultState = {}; // Include the version number.

  Frames.VERSION = version; // Register the plugin with video.js.

  videojs.registerPlugin('frames', Frames);

  return Frames;

}));
