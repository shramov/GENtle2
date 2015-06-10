/**
Handles displaying a sequence in a canvas.

Is instantiated inside a parent Backbone.View, and is automatically
rendered.

@class SequenceChromatographCanvas
@constructor
@uses SequenceChromatographCanvasContextMenu
@uses SequenceChromatographCanvasHandlers
@uses SequenceChromatographCanvasUtilities
@module SequenceChromatographCanvas
**/
// define(function(require) {
  'use strict';
  var Artist = require('../../common/lib/graphics/artist'),
    Hotkeys = require('../../common/lib/hotkeys'),
    CopyPasteHandler = require('../../common/lib/copy_paste_handler'),
    Lines = require('./lines'),
    Caret = require('../../common/lib/caret'),
    _Handlers = require('./_sequence_canvas_handlers'),
    _Utilities = require('./_sequence_canvas_utilities'),
    _ContextMenu = require('../lib/_sequence_canvas_context_menu'),
    Backbone = require('backbone'),
    Styles = require('../../styles.json'),
    Q = require('q'),
    {namedHandleError} = require('../../common/lib/handle_error'),
    LineStyles, SequenceChromatographCanvas;

  LineStyles = Styles.sequences.lines;


  SequenceChromatographCanvas = function(options) {
    var _this = this;
    options = options || {};
    this.visible = true;

    // Context binding (context is lost in Promises' `.then` and `.done`)
    _.bindAll(this, 'calculateLayoutSettings',
      'redrawSelection',
      'display',
      'refresh',
      'refreshFromResize',
      'redraw',
      'afterNextRedraw',
      'handleScrolling',
      'handleMousedown',
      'handleMousemove',
      'handleMouseup',
      'handleClick',
      'handleKeypress',
      'handleKeydown',
      'handleBlur'
    );

    /**
        Instance of BackboneView in which the canvas lives
        @property view
        @type Backbone.View
    **/
    this.view = options.view;

    /**
        Canvas element as a jQuery object
        @property $canvas
        @type jQuery object
        @default first CANVAS DOM element in `this.view.$el`
    **/
    this.$canvas = options.$canvas || this.view.$('canvas').first();

    /**
        Invisible DIV used to handle scrolling.
        As high as the total virtual height of the sequence as displayed.
        @property $scrollingChild
        @type jQuery object
        @default `.scrollingChild`
    **/
    this.$scrollingChild = options.$scrollingChild || this.view.$('.scrolling-child').first();
    /**
        Div in which `this.$scrollingChild` will scroll.
        Same height as `this.$canvas`
        @property $scrollingParent
        @type jQuery object
        @default jQuery `.scrollingParent`
    **/
    this.$scrollingParent = options.$scrollingParent || this.view.$('.scrolling-parent').first();

    /**
        Sequence to be displayed
        @property sequence
        @type Sequence (Backbone.Model)
        @default `this.view.model`
    **/
    this.sequence = options.sequence || this.view.model;
    var sequence = this.sequence;
    this.readOnly = !!this.sequence.get('readOnly');

    var dnaStickyEndHighlightColour = function(reverse, base, pos) {
      return sequence.isBeyondStickyEnd(pos, reverse) && '#ccc';
    };

    var dnaStickyEndTextColour = function(reverse, defaultColour, base, pos) {
      return sequence.isBeyondStickyEnd(pos, reverse) ? '#fff' : defaultColour;
    };

    /**
        @property layoutSettings
        @type Object
        @default false
    **/
    this.layoutSettings = {
      canvasDims: {
        width: 1138,
        height: 448
      },
      pageMargins: {
        left: 20,
        top: 20,
        right: 20,
        bottom: 20
      },
      scrollPercentage: 1.0,
      gutterWidth: 30,
      basesPerBlock: 10,
      basePairDims: {
        width: 10,
        height: 15
      },
      chromatographDims: {
        width: 30
      }
    };

    if(_.isObject(options.lines)) {
      _.each(options.lines, (value, key) => {
        options.lines[key] = new Lines[value[0]](this, value[1] || {});
      });
    }

    this.layoutSettings.lines = options.lines || {

      // Blank line
      topSeparator: new Lines.Blank(this, {
        height: 5,
        visible: function() {
          return _this.sequence.get('displaySettings.rows.separators');
        }
      }),

      // Restriction Enzyme Sites
      restrictionEnzymesLabels: new Lines.RestrictionEnzymeLabels(this, {
        unitHeight: 10,
        textFont: LineStyles.RES.text.font,
        textColour: LineStyles.RES.text.color,
        visible: _.memoize2(function() {
          return _this.sequence.get('displaySettings.rows.res.display');
        })
      }),

      // Position numbering
      position: new Lines.Position(this, {
        height: 15,
        baseLine: 15,
        textFont: LineStyles.position.text.font,
        textColour: LineStyles.position.text.color,
        transform: _.formatThousands,
        visible: _.memoize2(function() {
          return _this.sequence.get('displaySettings.rows.numbering');
        })
      }),

      chromatogram: new Lines.Chromatogram(this, {
        height: 100,
        visible: () => true
      }),

      // Aminoacids
      aa: new Lines.DNA(this, {
        height: 15,
        baseLine: 15,
        textFont: LineStyles.aa.text.font,
        transform: function(base) {
          return _this.sequence.getAA(_this.sequence.get('displaySettings.rows.aa'), base, parseInt(_this.sequence.get('displaySettings.rows.aaOffset')));
        },
        visible: _.memoize2(function() {
          return _this.sequence.get('displaySettings.rows.aa') != 'none';
        }),
        textColour: function(codon) {
          var colors = LineStyles.aa.text.color;
          return colors[codon.sequence] || colors._default;
        }
      }),

      // DNA Bases
      dna: new Lines.DNA_XY(this, {
        height: 15,
        baseLine: 15,
        textFont: LineStyles.dna.text.font,
        textColour: _.partial(dnaStickyEndTextColour, false, LineStyles.dna.text.color),
        highlightColour: _.partial(dnaStickyEndHighlightColour, false),
        selectionColour: LineStyles.dna.selection.fill,
        selectionTextColour: LineStyles.dna.selection.color,
        baseWidth: this.layoutSettings.chromatographDims.width
      }),

      // Complements
      complements: new Lines.DNA_XY(this, {
        height: 15,
        baseLine: 15,
        textFont: LineStyles.complements.text.font,
        textColour: _.partial(dnaStickyEndTextColour, true, LineStyles.complements.text.color),
        highlightColour: _.partial(dnaStickyEndHighlightColour, true),
        getSubSeq: _.partial(this.sequence.getTransformedSubSeq, 'complements', {}),
        baseWidth: this.layoutSettings.chromatographDims.width,
        visible: _.memoize2(function() {
          return _this.sequence.get('displaySettings.rows.complements');
        })
      }),

      // Annotations
      features: new Lines.Feature(this, {
        unitHeight: 15,
        baseLine: 10,
        textFont: LineStyles.features.font,
        topMargin: 3,
        textColour: function(type) {
          var colors = LineStyles.features.color;
          type = 'type-'+type.toLowerCase();
          return (colors[type] && colors[type].color) || colors._default.color;
        },
        textPadding: 2,
        margin: 2,
        lineSize: 2,
        colour: function(type) {
          var colors = LineStyles.features.color;
          type = 'type-'+type.toLowerCase();
          return (colors[type] && colors[type].fill) || colors._default.fill;
        },
        visible: _.memoize2(function() {
          return _this.sequence.getFeatures() && _this.sequence.get('displaySettings.rows.features');
        })
      }),

      // Blank line
      bottomSeparator: new Lines.Blank(this, {
        height: 10,
        visible: _.memoize2(function() {
          return _this.sequence.get('displaySettings.rows.separators');
        })
      }),

      // Restriction Enzyme Sites
      restrictionEnzymeSites: new Lines.RestrictionEnzymeSites(this, {
        floating: true,
        visible: _.memoize2(function() {
          return _this.sequence.get('displaySettings.rows.res.display');
        })
      })

    };

    this.layoutHelpers = {};
    this.artist = new Artist(this.$canvas);
    this.caret = new Caret({
      $container: this.$scrollingChild,
      className: 'sequence-canvas-caret',
      blinking: true
    });
    this.allowedInputChars = ['A', 'T', 'C', 'G'];
    this.displayDeferred = Q.defer();
    this.copyPasteHandler = new CopyPasteHandler();

    this.contextMenu = this.view.getView('#sequence-canvas-context-menu-outlet');

    this.invertHotkeys = _.invert(Hotkeys);
    this.commandKeys = {};
    _.each(['A', 'C', 'Z', 'V'], function(key) {
      _this.commandKeys[key] = key.charCodeAt(0);
    });

    // Events
    this.view.on('resize', this.refreshFromResize);
    this.sequence.on('change:sequence change:displaySettings.* change:features.* change:features', this.refresh);
    this.$scrollingParent.on('scroll', this.handleScrolling);
    this.$scrollingParent.on('mousedown', this.handleMousedown);
    this.$scrollingParent.on('keypress', this.handleKeypress);
    this.$scrollingParent.on('keydown', this.handleKeydown);
    this.$scrollingParent.on('blur', this.handleBlur);

    // Debounced form of redraw function so we can call it from anywhere without worrying about resource hogging.
    this.safeRedraw = _.afterLastCall(function(){
      _this.redraw();
    }, 10);

    // Kickstart rendering
    this.refresh();
//    console.log('test')
  };

  _.extend(SequenceChromatographCanvas.prototype, Backbone.Events);
  _.extend(SequenceChromatographCanvas.prototype, _Handlers.prototype);
  _.extend(SequenceChromatographCanvas.prototype, _Utilities.prototype);
  _.extend(SequenceChromatographCanvas.prototype, _ContextMenu.prototype);

  /**
      Updates Canvas Dimemnsions based on viewport.
      @method updateCanvasDims
      @returns {Promise} a Promise finished when this and `this.calculateLayoutSettings` are finished
  **/
  SequenceChromatographCanvas.prototype.updateCanvasDims = function() {
    var _this = this;

    return Q.promise(function(resolve, reject) {
      // Updates width of $canvas to take scrollbar of $scrollingParent into account
      _this.$canvas.width(_this.$scrollingChild.width());

      var width = _this.$canvas[0].scrollWidth,
        height = _this.$canvas[0].scrollHeight;

      _this.layoutSettings.canvasDims.width = width;
      _this.layoutSettings.canvasDims.height = height;

      _this.artist.setDimensions(width, height);

      resolve();
    });
  };


  /**
      Calculate "helper" layout settings based on already set layout settings
      @method calculateLayoutSettings
      @returns {Promise} a Promise fulfilled when finished
  **/
  SequenceChromatographCanvas.prototype.calculateLayoutSettings = function() {
    //line offsets
    var line_offset = _.values(this.layoutSettings.lines)[0].height,
      i,
      blocks_per_row,
      ls = this.layoutSettings,
      lh = this.layoutHelpers,
      _this = this;

    return Q.promise(function(resolve, reject) {


      var gutterWidth = ls.gutterWidth = _this.sequence.get('displaySettings.rows.hasGutters') ? 30 : 0;

      //basesPerRow
      blocks_per_row = Math.floor((ls.canvasDims.width + gutterWidth - (ls.pageMargins.left + ls.pageMargins.right)) / (ls.basesPerBlock * ls.basePairDims.width + gutterWidth));
      if (blocks_per_row !== 0) {
        lh.basesPerRow = ls.basesPerBlock * blocks_per_row;
      } else {
        lh.basesPerRow = Math.floor((ls.canvasDims.width + gutterWidth - (ls.pageMargins.left + ls.pageMargins.right)) / ls.basePairDims.width);
        //we want bases per row to be a multiple of 10 (DOESNT WORK)
        if (lh.basesPerRow > 5) {
          lh.basesPerRow = 5;
        } else if (lh.basesPerRow > 2) {
          lh.basesPerRow = 2;
        } else {
          lh.basesPerRow = 1;
        }
      }

      lh.lineOffsets = {};
      _.each(ls.lines, function(line, lineName) {
        line.clearCache();
        if ((line.visible === undefined || line.visible()) && !line.floating) {
          lh.lineOffsets[lineName] = line_offset;
          if (_.isFunction(line.calculateHeight)) line.calculateHeight();
          line_offset += line.height;
        }
      });

      //row height
      lh.rows = {
        height: line_offset
      };

      //total number of rows in sequence,
      lh.rows.total = Math.ceil(_this.sequence.getLength() / lh.basesPerRow);
      // number of visible rows in canvas
      lh.rows.visible = Math.ceil(ls.canvasDims.height / lh.rows.height);

      //page dims
      lh.pageDims = {
        width: ls.canvasDims.width,
        // Original
        // height: ls.pageMargins.top + ls.pageMargins.bottom + lh.rows.total * lh.rows.height
        //
        // Modified with margins
        // Need to switch from height to width for syntactical accuracy.
        // Impacts the minimap so change both at same time.
        // height: ls.pageMargins.top + ls.pageMargins.bottom + _this.sequence.get('chromatogramData')[0].length
        // height: _this.sequence.get('chromatogramData')[0].length
        height: ls.pageMargins.top + ls.pageMargins.bottom +
                _this.sequence.getLength() * _this.layoutSettings.chromatographDims.width
      };

      // canvas y scrolling offset
      lh.yOffset = lh.yOffset || _this.sequence.get('displaySettings.yOffset') || 0;


      // if (_this.layoutHelpers.BasePosition === undefined)
      //   _this.layoutHelpers.BasePosition = _this.getBaseFromXYPos(0, lh.yOffset + lh.rows.height);

      // if (_this.layoutHelpers.BaseRow === undefined)
      //   _this.layoutHelpers.BaseRow = lh.basesPerRow;

      // if (_this.layoutHelpers.BaseRow > lh.basesPerRow) {
      //   _this.layoutHelpers.yOffsetPrevious = lh.yOffset;
      //   lh.yOffset = _this.getYPosFromBase(_this.layoutHelpers.BasePosition);
      // } else {
      //   if (_this.layoutHelpers.yOffsetPrevious !== undefined)
      //     lh.yOffset = _this.layoutHelpers.yOffsetPrevious;
      // }

      if(lh.firstBase) {
        lh.yOffset = _this.getYPosFromBase(lh.firstBase);
        lh.firstBase = undefined;
      }

      _this.$scrollingParent.scrollTop(lh.yOffset);

      _this.clearCache();

      _this.trigger('change change:layoutHelpers', lh);

      // We resize `this.$scrollingChild` and fullfills the Promise
      _this.resizeScrollHelpers().then(resolve);
    });
  };

  /**
      If `this.visible`, displays the sequence in the initiated canvas.
      @method display
  **/
  SequenceChromatographCanvas.prototype.display = function() {
    if (this.visible) {
      var artist = this.artist,
        ls = this.layoutSettings,
        lh = this.layoutHelpers,
        yOffset = lh.yOffset,
        _this = this,
        canvasHeight = ls.canvasDims.height,
        canvasWidth = ls.canvasDims.width,
        drawStart, drawEnd, moveOffset;

      return Q.promise(function(resolve, reject) {

        // Check if we have a previousYOffset reference, in which case
        // we will only redraw the missing part
        moveOffset = lh.previousYOffset !== undefined ?
          -lh.previousYOffset + yOffset :
          0;

        if (moveOffset !== 0) {
          artist.scroll(-moveOffset, 0);

          drawStart = moveOffset > 0 ? canvasWidth - moveOffset : 0;
          drawEnd = moveOffset > 0 ? canvasWidth : -moveOffset;
          lh.previousYOffset = undefined;

        } else {

          artist.clear();
          drawStart = 0;
          drawEnd = canvasWidth;

        }

        _this.drawCol(drawStart, drawEnd - drawStart);

        _this.displayDeferred.resolve();
        _this.displayDeferred = Q.defer();
        resolve();

      }).catch(namedHandleError('sequence_canvas, display'));
    } else {
      return Q.reject();
    }
  };

  SequenceChromatographCanvas.prototype.drawHighlight = function(posY, baseRange) {
    var layoutHelpers = this.layoutHelpers;
    var startX = this.getXPosFromBase(baseRange[0]);
    var endX = this.getXPosFromBase(baseRange[1]);

    this.artist.rect(startX, posY, endX - startX, layoutHelpers.rows.height, {
      fillStyle: '#fcf8e3'
    });
  };

  SequenceChromatographCanvas.prototype.getBaseFromXYPos = function(posX, posY){

    posX -= this.layoutSettings.pageMargins.left;

    posX += this.layoutHelpers.yOffset;

    var peaks = this.sequence.get('chromatogramPeaks'),
        max = _.sortedIndex(peaks, posX),
        min = Math.max(max-1, 0),
        midpoint;

    if (max == peaks.length) return max - 1;

    midpoint = ((peaks[max] - peaks[min])/2) + peaks[min];

    return (posX < midpoint) ? min : max;
  };

  /**
  Draw row at position posY in the canvas
  @method drawRow
  @param {integer} posY
  **/
  SequenceChromatographCanvas.prototype.drawCol = function(posX, width) {
    var layoutSettings = this.layoutSettings,
      lines = layoutSettings.lines,
      layoutHelpers = this.layoutHelpers,
      // rowsHeight = layoutHelpers.rows.height,
      xOffset = layoutHelpers.yOffset,
      canvasHeight = layoutSettings.canvasDims.height,
      canvasWidth = layoutSettings.canvasDims.width,
      // bottomMargin = layoutSettings.pageMargins.bottom,
      // baseRange = this.getBaseRangeFromYPos(posY + yOffset),
      highlight = this.highlight;
      // initPosY = posY;

    // var xOffset = layoutHelpers.xOffset,
    var initPosY = 0, // this location should be matched so that it evenly spaces with the comparison view.
        posY = initPosY;

    var sequence = this.sequence;

    var normalizedWidth = layoutSettings.chromatographDims.width;

    var getChromaBaseRange = function(posX, width){

      var peaks = sequence.get('chromatogramPeaks');

      // find peak val where firstPeak >= posx
      // return value just before or at position
      // var getIdx = function(posX){
      //   // For reference, sortedIndex returns the index at which value (posX) would be
      //   // located if inserted into the array (peaks). I want the value just before that
      //   // index.
      //   var idx = _.sortedIndex(peaks, posX) - 1;
      //   idx = Math.max(idx, 0);
      //   return idx;
      // };

      var getIdx = function(posX){
        return Math.floor(posX/normalizedWidth);
      };

      var firstBase = getIdx(posX),
          lastBase  = getIdx(posX + width);

      firstBase = Math.max(firstBase, 0)
      lastBase = Math.min(lastBase, peaks.length - 1)

      if (firstBase >= lastBase){
        lastBase = Math.min(peaks.length-1, firstBase+1);
      }

      return [firstBase, lastBase];
    };

    /**
     * All line clears and rewrites are calculated where the section starts right
     * after the letter of baserange[0]-1 and right before the letter of baserange[1]+1
     *
     * Corner cases are in place for the first and last bases (aka baserange[0] == 0 and
     * baserange[1] == peaks.length-1)
     */
    // Adjust offset to factor for page margins.
    xOffset -= layoutSettings.pageMargins.top;

    // determine the subsequence that we will be rendering.
    var baseRange = getChromaBaseRange(posX + xOffset, width);
    var peaks = sequence.get('chromatogramPeaks');

    // Update posX and width to reflect alignment with previous base (overlap)
    // New posx is the position of the previous peak.
    // var oldPosX = posX;
    // var fromPeak = Math.max(baseRange[0]-1, 0),
    //     toPeak = Math.min(baseRange[1]+1, peaks.length-1);

    // posX = (baseRange[0] === 0 ? 0 : peaks[fromPeak]) - xOffset;
    // width += (oldPosX - posX);

    //
    // posX = baseRange[0] === 0 ? 0 : (fromPeak * normalizedWidth + normalizedWidth/2 - xOffset);
    // width += (oldPosX - posX);

    // One single clear is called for the entire line.
    // var clearStart = baseRange[0] === 0 ? 0 : posX + layoutSettings.basePairDims.width/2,
    //     clearWidth = (peaks[toPeak] - peaks[fromPeak]) - layoutSettings.basePairDims.width;

    //     if (baseRange[0] === 0){
    //       clearWidth = peaks[toPeak] - layoutSettings.basePairDims.width/2 + posX;
    //     } else if (baseRange[1] >= peaks.length-1) {
    //       clearWidth = (peaks[peaks.length-1] - xOffset);
    //     }

    var oldPosX = posX
    var posDiff = (posX + xOffset) % normalizedWidth;


    if (xOffset < 0){
      posX -= xOffset;
      width += xOffset;
    } else {
      posX -= posDiff;
      width += posDiff;
    }


    var clearStart = posX,
        clearWidth = width;


    console.log(posX, width, xOffset, "clearing", clearStart, clearWidth);

    // this.artist.clear(clearStart, 0, clearWidth, 0);


    // if (xOffset <= layoutSettings.pageMargins.top){

    //   // return;
    //   var difference = layoutSettings.pageMargins.top - xOffset;
    //   posX += difference;
    //   width -= difference;
    // }


    // if(highlight !== undefined && highlight[0] <= baseRange[1] && highlight[1] >= baseRange[0]) {
    //   this.drawHighlight(posY, [
    //     Math.max(baseRange[0], highlight[0]),
    //     Math.min(baseRange[1], highlight[1])
    //   ]);
    // }


    // if (baseRange[0] < this.sequence.getLength()) {
    //   _.each(lines, function(line, key) {
    //     if (line.visible === undefined || line.visible()) {
    //       if(line.floating) {
    //         line.draw(initPosY, baseRange);
    //       } else {
    //         line.draw(posY, baseRange);
    //         posY += line.height;
    //       }
    //     }
    //   });
    // }

    console.log("drawing", posX, baseRange)


    if (baseRange[0] < this.sequence.getLength()) {
      _.each(lines, function(line, key) {
        if (line.visible === undefined || line.visible()) {
          if(line.floating) {
            line.draw(posX, initPosY, baseRange);
          } else {
            line.draw(posX, posY, baseRange);
            posY += line.height;
          }
        }
      });
    }
  };


  /**
  Draw row at position posY in the canvas
  @method drawRow
  @param {integer} posY
  **/
  SequenceChromatographCanvas.prototype.drawRow = function(posY) {
    var layoutSettings = this.layoutSettings,
      lines = layoutSettings.lines,
      layoutHelpers = this.layoutHelpers,
      yOffset = layoutHelpers.yOffset,
      rowsHeight = layoutHelpers.rows.height,
      canvasHeight = layoutSettings.canvasDims.height,
      bottomMargin = layoutSettings.pageMargins.bottom,
      baseRange = this.getBaseRangeFromYPos(posY + yOffset),
      highlight = this.highlight,
      initPosY = posY;

      this.artist.clear(0, posY, 0, rowsHeight);

    if(highlight !== undefined && highlight[0] <= baseRange[1] && highlight[1] >= baseRange[0]) {
      this.drawHighlight(posY, [
        Math.max(baseRange[0], highlight[0]),
        Math.min(baseRange[1], highlight[1])
      ]);
    }

    if (baseRange[0] < this.sequence.getLength()) {
      _.each(lines, function(line, key) {
        if (line.visible === undefined || line.visible()) {
          if(line.floating) {
            line.draw(initPosY, baseRange);
          } else {
            line.draw(posY, baseRange);
            posY += line.height;
          }
        }
      });
    }
  };

  /**
  Resizes $scrollingChild after window/parent div has been resized
  @method resizeScrollHelpers
  @return {Promise}
  **/
  SequenceChromatographCanvas.prototype.resizeScrollHelpers = function() {
    var _this = this,
      layoutSettings = _this.layoutSettings,
      layoutHelpers = _this.layoutHelpers;
    return Q.promise(function(resolve, reject) {
      // Original
      // _this.$scrollingChild.height(layoutHelpers.pageDims.height);

      // Height setting for horizontal scrolling
      // _this.$scrollingChild.width(layoutHelpers.pageDims.width);

      // Height setting for vertical scrolling for horizontal feeds.
      // This calculation is necessary to factor for difference between width and height.
      _this.$scrollingChild.height(layoutHelpers.pageDims.height-(layoutSettings.canvasDims.width - layoutSettings.canvasDims.height));
      _this.scrollTo();
      resolve();
    });
  };

  /**
  Updates layout settings and redraws canvas
  @method refresh
  **/
  SequenceChromatographCanvas.prototype.refresh = function() {
    if (this.caretPosition !== undefined) {
      this.hideCaret();
      this.caretPosition = undefined;
    }
    this.updateCanvasDims()
      .then(this.calculateLayoutSettings)
      .then(this.redraw)
      .catch((e) => console.error(e));
  };

  /**
  Updates layout settings and redraws canvas when resizing.
  Keeps the first base the same
  @method refreshFromResize
  **/
  SequenceChromatographCanvas.prototype.refreshFromResize = function() {
    var layoutHelpers = this.layoutHelpers;

    layoutHelpers.firstBase = this.getBaseRangeFromYPos(
      this.layoutSettings.pageMargins.top +
      (layoutHelpers.yOffset || 0)
    )[0];
    this.refresh();
  };

  /**
  Redraws canvas on the next animation frame
  @method redraw
  **/
  SequenceChromatographCanvas.prototype.redraw = function() {
    return requestAnimationFrame(this.display);
  };

  SequenceChromatographCanvas.prototype.scrollTo = function(yOffset, triggerEvent) {
    var deferred = Q.defer(),
      layoutHelpers = this.layoutHelpers;

    layoutHelpers.previousYOffset = layoutHelpers.yOffset;

    if (yOffset !== undefined) {

      // this.layoutHelpers.BasePosition = this.getBaseFromXYPos(0, yOffset + this.layoutHelpers.rows.height);
      this.sequence.set('displaySettings.yOffset',
        layoutHelpers.yOffset = yOffset, {
          silent: true
        }
      );
      this.sequence.throttledSave();
    }

    this.$scrollingParent.scrollTop(layoutHelpers.yOffset);

    this.afterNextRedraw(deferred.resolve);

    this.redraw();

    if (triggerEvent !== false) {
      this.trigger('scroll');
    }

    deferred.promise.then(this.safeRedraw);

    return deferred.promise;
  };

  /**
  Make base visible (if it is below the visible part of the canvas,
  will just scroll down one row)
  @method scrollBaseToVisibility
  **/
  SequenceChromatographCanvas.prototype.scrollBaseToVisibility = function(base) {
    var distanceToVisibleCanvas = this.distanceToVisibleCanvas(base);

    if (distanceToVisibleCanvas !== 0) {
      return this.scrollTo(this.layoutHelpers.yOffset + distanceToVisibleCanvas);
    } else {
      return Q.resolve();
    }
  };

  SequenceChromatographCanvas.prototype.scrollToBase = function(base) {
    if (!this.isBaseVisible(base)) {
      var yPos = this.getYPosFromBase(base),
        maxY = this.$scrollingChild.height() - this.$scrollingParent.height();
      return this.scrollTo(Math.min(yPos, maxY));
    } else {
      return Q.resolve();
    }
  };

  SequenceChromatographCanvas.prototype.clearCache = function() {
    this.getXPosFromBase.cache = {};
    // this.getYPosFromBase.cache = {};
  };

  SequenceChromatographCanvas.prototype.afterNextRedraw = function() {
    var _this = this,
      args = _.toArray(arguments),
      func = args.shift();

    this.displayDeferred.promise.then(function() {
      func.apply(_this, args);
    });
  };

  SequenceChromatographCanvas.prototype.highlightBaseRange = function(fromBase, toBase) {
    if(fromBase === undefined) {
      this.highlight = undefined;
    } else {
      this.highlight = [fromBase, toBase];
    }

    this.refresh();
  };

  /**
  Displays the caret before a base
  @method displayCaret
  @param base [base]
  **/
  SequenceChromatographCanvas.prototype.displayCaret = function(base) {

    var layoutHelpers = this.layoutHelpers,
      lineOffsets = layoutHelpers.lineOffsets,
      yOffset = layoutHelpers.yOffset,
      selection = this.selection,
      posX, posY;

    var peaks = this.sequence.get('chromatogramPeaks');

    if (base === undefined && this.caretPosition !== undefined) {
      base = this.caretPosition;
    }

    if (base > this.sequence.getLength()) {
      base = this.sequence.getLength();
    }

    this.scrollBaseToVisibility(base).then(() => {

      if(_.isArray(selection) && selection[1] % layoutHelpers.basesPerRow === layoutHelpers.basesPerRow -1) {
        posX = this.getXPosFromBase(base - 1) + this.layoutSettings.basePairDims.width;
        posY = this.getYPosFromBase(base - 1) + lineOffsets.dna;
      } else {
        posX = this.getXPosFromBase(base);
        posY = this.getYPosFromBase(base) + lineOffsets.dna;
      }

      if (peaks){
        posY = lineOffsets.dna;
        posX = this.layoutSettings.pageMargins.left +
               peaks[base] - this.layoutHelpers.yOffset -
               this.layoutSettings.basePairDims.width/2;
      }


      this.caret.move(posX, posY, base);
      this.caretPosition = base;
      this.showContextMenuButton(posX, posY + 20);
      this.caret.setInfo(this.determineCaretInfo());

      if(this.selection) {
        this.caret.hideHighlight();
      } else {
        this.caret.showHighlight();
      }
    }).done();

  };

  SequenceChromatographCanvas.prototype.moveCaret = function(newPosition) {
    if (this.selection) {
      this.selection = undefined;
      this.redraw();
    }
    this.displayCaret(newPosition);
  };

  SequenceChromatographCanvas.prototype.hideCaret = function(hideContextMenu) {
    this.caret.remove();
    if (hideContextMenu === true) {
      this.hideContextMenuButton();
    }
  };

  SequenceChromatographCanvas.prototype.redrawSelection = function(selection) {
    var
      lines = this.layoutSettings.lines,
      yOffset = this.layoutHelpers.yOffset,
      rowsHeight = this.layoutHelpers.rows.height,
      posY;

    //Calculating posY for baseRange
    if (selection !== undefined) {

      if (this.layoutHelpers.selectionPreviousA == undefined) {
        this.layoutHelpers.selectionPreviousA = selection[0];
      }
      if (this.layoutHelpers.selectionPreviousB == undefined) {
        this.layoutHelpers.selectionPreviousB = selection[1];
      }

      if (this.layoutHelpers.selectionPreviousA !== selection[1] || this.layoutHelpers.selectionPreviousB !== selection[0]) {

        if (this.layoutHelpers.selectionPreviousA === selection[1] - 1 || this.layoutHelpers.selectionPreviousA === selection[1] + 1) {

          posY = this.getYPosFromBase(selection[1]);
          if (this.layoutHelpers.selectionPreviousA == this.layoutHelpers.selectionPreviousB) {
            this.layoutHelpers.selectionPreB = selection[0];
          }
          this.layoutHelpers.selectionPreviousA = selection[1];
        } else if (this.layoutHelpers.selectionPreviousB === selection[0] - 1 || this.layoutHelpers.selectionPreviousB === selection[0] + 1) {

          posY = this.getYPosFromBase(selection[0]);
          if (this.layoutHelpers.selectionPreviousA == this.layoutHelpers.selectionPreviousB) {
            this.layoutHelpers.selectionPreviousA = selection[1];
          }
          this.layoutHelpers.selectionPreviousB = selection[0];
        }
      }
    }

    if(posY !== undefined) {
      this.partialRedraw(posY);
    } else {
      this.redraw();
    }
  };

  /**
  Only redraws the current row
  @method partialRedraw
  **/
  SequenceChromatographCanvas.prototype.partialRedraw = function(posY) {
    var _this = this;
    requestAnimationFrame(function() {
      _this.drawRow(posY);
    });
  };

  /**
  @method select
  **/
  SequenceChromatographCanvas.prototype.select = function(start, end) {
    var positionCheck;
    this.hideCaret();
    if (start !== undefined) {
      if (start < end) {
        this.selection = [start, end];
        this.caretPosition = end + 1;
        // positionCheck = this.caretPosition;

        // if (positionCheck > this.layoutHelpers.caretPositionBefore) {
        //   this.caretPosition = this.layoutHelpers.caretPositionBefore;
        //   if (start != this.layoutHelpers.selectionPreviousB - 1 && start != this.layoutHelpers.selectionPreviousB + 1 && start != this.layoutHelpers.selectionPreviousB)
        //     this.layoutHelpers.selectionPreviousB = this.caretPosition;
        //   if (end != this.layoutHelpers.selectionPreviousA - 1 && end != this.layoutHelpers.selectionPreviousA + 1 && end != this.layoutHelpers.selectionPreviousA)
        //     this.layoutHelpers.selectionPreviousA = this.caretPosition;
        //   positionCheck = this.caretPosition;
        // } else {
        //   this.layoutHelpers.caretPositionBefore = this.caretPosition;
        // }
      } else {
        this.selection = [end, start];
        this.caretPosition = start + 1;
      }
    } else {
      this.selection = undefined;
      this.caretPosition = undefined;
    }
    this.redraw();
  };

  SequenceChromatographCanvas.prototype.expandSelectionToNewCaret = function(newCaret) {
    var selection = this.selection,
      previousCaret = this.caretPosition;
    this.layoutHelpers.caretPositionBefore = previousCaret;

    if (selection[0] == selection[1] && (
      (previousCaret > selection[0] && newCaret == selection[0]) ||
      (previousCaret == selection[0] && newCaret == selection[0] + 1)
    )) {
      this.select(undefined);
    } else {
      if (newCaret > selection[0]) {
        if (previousCaret <= selection[0]) {
          this.select(newCaret, selection[1]);
        } else {
          this.select(selection[0], newCaret - 1);
        }
      } else {
        if (previousCaret <= selection[1] && newCaret < selection[1]) {
          this.select(newCaret, selection[1]);
        } else {
          this.select(newCaret, selection[0] - 1);
        }
      }
    }
    this.displayCaret(newCaret);
  };

  SequenceChromatographCanvas.prototype.cleanPastedText = function(text) {
    var regexp = new RegExp('[^' + this.allowedInputChars.join('') + ']', 'g')
    return text.toUpperCase().replace(regexp, '');
  };

  SequenceChromatographCanvas.prototype.focus = function() {
    this.$scrollingParent.focus();
  };

  SequenceChromatographCanvas.prototype.determineCaretInfo = function() {
    var info = "";
    var toString = (num) => _.formatThousands(num).toString();

    if(this.selection) {
      var start = this.selection[0]+1;
      var end = this.selection[1]+1;
      var size = (end - start);

      if(size===0) {
        info = toString(start) + " (1 bp)";
      } else {
        info = toString(start) + " to " + toString(end) + " (" + toString(size+1) +  " bp)";
      }

    } else {
      info = toString(this.caretPosition + 1);
    }


    return info;
  };


export default SequenceChromatographCanvas;
  // return SequenceChromatographCanvas;
// });