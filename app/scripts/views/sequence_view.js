define(function(require) {
  var template        = require('hbars!templates/sequence_view'),
      Sequence        = require('models/sequence'),
      SequenceCanvas  = require('lib/sequence_canvas/sequence_canvas'),
      Gentle          = require('gentle'),
      SequenceSettingsView = require('views/sequence_settings_view'),
      SequenceView;

  Gentle = Gentle();
  
  SequenceView = Backbone.View.extend({
    manage: true,
    template: template,
    className: 'sequence-view',

    initialize: function() {
      var _this = this;
      this.model = Gentle.currentSequence;
      
      this.sequence_settings_view = new SequenceSettingsView();
      this.setView('.sequence-sidebar', this.sequence_settings_view);
      this.sequence_settings_view.on('resize', function() { 
        _this.$('.sequence-canvas-container, .scrolling-parent').css('left', _this.sequence_settings_view.$el.width());
        _this.trigger('resize');
      });

      this.on('afterRender', this.setupSequenceCanvas, this);
      
      this.handleResize = _.bind(this.handleResize, this);
      $(window).on('resize', this.handleResize);
      this.handleResize(false);

    },

    setupSequenceCanvas: function() {
      this.sequenceCanvas = new SequenceCanvas({
        view: this,
        $canvas: this.$('canvas').first()
      });
    },

    handleResize: function(trigger) {
      if(trigger !== false) this.trigger('resize');
      // this.$el.height($(window).height() - $('#navbar .navbar').outerHeight()); 
    },

    remove: function() {
      $(window).off('resize', this.handleResize);
      Backbone.View.prototype.remove.apply(this, arguments);
    }

  });

  return SequenceView;
});