import _ from 'underscore';
import template from '../templates/pcr_progress_view.hbs';
import {getPcrProductAndPrimers} from '../lib/pcr_primer_design';
import {handleError} from '../../../common/lib/handle_error';
import Gentle from 'gentle';
import RdpPcrSequence from 'gentle-rdp/rdp_pcr_sequence';
import {transformSequenceForRdp} from 'gentle-rdp/sequence_transform';


export default Backbone.View.extend({
  manage: true,
  template: template,

  events: {
    'click .retry-create-pcr-primer': 'retryCreatingPcrPrimer'
  },

  afterRender: function() {
    this.updateProgressBar(0);
  },

  updateProgressBar: function(progress) {
    this.$('.new-pcr-progress .initial-progress .progress-bar').css('width', progress*100+'%');
  },

  updateFallbackProgressBar:  function(progress) {
    this.$('.fallback-progress').show();
    this.$('.new-pcr-progress .fallback-progress .progress-bar').css('width', progress*100+'%');
  },

  makePrimers: function(dataAndOptions) {
    this.pcrPrimerDataAndOptions = dataAndOptions;

    var tempSequence = new this.model.constructor({
      name: dataAndOptions.name,
      sequence: dataAndOptions.sequence
    });
    delete dataAndOptions.sequence;

    transformSequenceForRdp(tempSequence);

    dataAndOptions.from = 0;
    // At this point, tempSequence should not have any sticky ends the STICK_END
    // format should not matter.
    dataAndOptions.to = tempSequence.getLength(tempSequence.STICKY_END_NONE) - 1;
    getPcrProductAndPrimers(tempSequence, dataAndOptions)
    .then((pcrProduct) => {
      // Copy over RDP specific attributes.
      var rdpPcrAttributes = _.extend({}, pcrProduct.toJSON(), _.pick(dataAndOptions,
          'partType', 'rdpEdits', 'sourceSequenceName'));

      // ensures Gentle routes view to the RDP PCR product result view
      rdpPcrAttributes.displaySettings = rdpPcrAttributes.displaySettings || {};
      rdpPcrAttributes.displaySettings.primaryView = 'rdp_pcr';

      rdpPcrAttributes.rdpEdits = rdpPcrAttributes.rdpEdits || [];
      rdpPcrAttributes._type = 'rdp_pcr_product';

      var rdpPcrProduct = new RdpPcrSequence(rdpPcrAttributes);

      this.updateProgressBar(1);
      Gentle.sequences.add(rdpPcrProduct);
      this.model.destroy();
      Gentle.router.sequence(rdpPcrProduct.get('id'));
    })
    .progress(({lastProgress, lastFallbackProgress}) => {
      this.updateProgressBar(this.calcTotal(lastProgress));
      if(lastFallbackProgress.total && lastFallbackProgress.current !== 0) {
        this.updateFallbackProgressBar(this.calcTotal(lastFallbackProgress));
      }
    })
    .catch((e) => {
      handleError('new PCR, view error:', e);
      this.$('.new-pcr-progress').slideUp();
      this.$('.new-pcr-progress-error').slideDown();
    })
    .done();
  },

  calcTotal: function({current, total}) {
    return total ? current / total : 0;
  },

  retryCreatingPcrPrimer: function() {
    this.parentView().makePrimers(this.pcrPrimerDataAndOptions);
  },

});
