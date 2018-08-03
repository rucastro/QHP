define('CustomAddress.Address.Edit.View', [
    'Backbone',
    'Address.Edit.View',
    'CustomAddress.GeoLocation.Model',
    'Profile.Model',
    'SC.Configuration',

    'jQuery',
    'underscore'
], function CustomAddressEditView (
    Backbone,
    AddressEditView,
    GeoLocationModel,
    ProfileModel,
    Configuration,

    jQuery,
    _
) {
    'use strict';

    _.extend(
        AddressEditView.prototype, {
            events: _.extend({}, AddressEditView.prototype.events, {
                'submit form': 'getGeoLocationDetails'
            }),

            getGeoLocationDetails: function(e, model, props) {
                var response = this.saveForm(e, model, props);

                var chain = jQuery.when(), self = this, addressInternalId;

                chain = response.done(function() {
                        console.log('response', response);
                        if (response && response.responseJSON) {
                            var addressId = response.responseJSON.internalid;
                            if (addressId) {
                                addressInternalId = addressId;
                            }
                        }
                    });

                chain.then(function() {
                    console.log('Fire Suitelet');

                    var address1 = self.model.get('addr1');
                    var city = self.model.get('city');
                    var country = self.model.get('country');

                    //console.log('address', addr1 + ' ' + city + ' ' + country);
                    var address = address1 + ' ' + city + ' ' + country;
                    //var address = '2955 Campus Drive, Suite 250 San Mateo CA';

                    address = address.replace(/ /g,"+");

                    self.getPoints(address, addressInternalId, self.customerId);
                });
            },

            saveForm: function (e, model, props) {
                e.preventDefault();

                //Add validate method into the view.model
                Backbone.Validation.bind(this);

                model = model || this.model;

                this.$savingForm = jQuery(e.target).closest('form');
                this.isSavingForm = true;

                if (this.$savingForm.length) {
                    // and hides reset buttons
                    this.$savingForm.find('input[type="reset"], button[type="reset"]').hide();
                }

                this.hideError();

                var self = this
                    // Returns the promise of the save action of the model
                    ,	result = model.save(props || this.$savingForm.serializeObject(), {

                        wait: true

                        ,	forceUpdate: false

                        // Hides error messages, re enables buttons and triggers the save event
                        // if we are in a modal this also closes it
                        ,	success: function (model, response)
                        {
                            if (self.inModal && self.$containerModal)
                            {
                                self.$containerModal.modal('hide');
                            }

                            if (self.$savingForm.length)
                            {
                                self.hideError(self.$savingForm);
                                buttonSubmitDone(self.$savingForm);

                                model.trigger('save', model, response);
                            }
                            model.trigger('saveCompleted');
                        }

                        // Re enables all button and shows an error message
                        ,	error: function (model, response)
                        {
                            buttonSubmitDone(self.$savingForm);

                            if (response.responseText)
                            {
                                model.trigger('error', jQuery.parseJSON(response.responseText));
                            }
                        }
                    });

                if (result === false) {
                    this.$savingForm.find('input[type="reset"], button[type="reset"]').show();
                    this.$savingForm.find('*[type=submit], *[type=reset]').attr('disabled', false);
                }

                return result;
            },

            getPoints: function getPoints(address, addressId, customerId) {
                var geoLocation = new GeoLocationModel(), self = this;
                geoLocation.fetch({
                    data:{
                        requestType: 'getPoints',
                        address: address,
                        addressId:addressId,
                        customerId:customerId
                    }
                }).done(function() {
                    console.log('response', geoLocation);

                    self.latitude = geoLocation.get('latitude');
                    self.longitude = geoLocation.get('longitude');

                    if (self.latitude && self.longitude) {
                        self.model.set('latitude', self.latitude);
                        self.model.set('longitude', self.longitude);
                    }

                });
            },


        });

    AddressEditView.prototype.initialize = _.wrap(AddressEditView.prototype.initialize, function initialize(fn) {
        fn.apply(this, _.toArray(arguments).slice(1));

        var profileModel = ProfileModel.getInstance();
        this.customerId = profileModel.get('internalid');

        console.log('customerId', this.customerId);

    });
});