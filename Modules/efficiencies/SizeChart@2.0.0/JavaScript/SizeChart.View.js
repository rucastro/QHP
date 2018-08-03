define('SizeChart.View', [
    'Backbone',
    'jQuery',
    'size_chart.tpl'
], function SizeChartView(
    Backbone,
    jQuery,
    sizeChartTpl
) {
    'use strict';

    return Backbone.View.extend({
        template: sizeChartTpl,
        modalClass: 'global-views-modal-large',
        events: {
            'click [data-action="show-unit"]': 'showUnits'
        },
        render: function render() {
            var defaultUnit;
            var colGroup;
            var colUnit;
            var buttons;
            var self = this;
            this._render();

            try {
                buttons = self.$el.find('#sizechart button[data-action="show-unit"]');
                // If there is a table in the markup with buttons to display different units
                // this script will show the default units and hide the rest

                if (buttons && buttons.length) {
                    // Highlight default button
                    jQuery(buttons[0]).addClass('size-chart-unit-button-active');

                    defaultUnit = self.$el.find('#sizechart button[data-action="show-unit"]')[0].id;
                    colGroup = self.$el.find('#sizechart col');

                    colGroup.each(function eachCol(index) {
                        colUnit = jQuery(this).data('unit');
                        if (colUnit !== defaultUnit && colUnit !== undefined) {
                            // index = index + 1;
                            self.$el.find('#sizechart table tr > *:nth-child(' + (index + 1) + ')').hide();
                        }
                    });
                }
            } catch (e) {
                // no unit toggle buttons
            }
        },
        // @method showUnits
        showUnits: function showUnits(e) {
            // displays selected unit in Size Chart table

            var unitButton;
            var selectedUnit;
            var colUnit;

            // Highlight selected button
            unitButton = jQuery('#in-modal-sizechart button');
            if (unitButton.hasClass('size-chart-unit-button-active') === true) {
                unitButton.addClass('size-chart-unit-button').removeClass('size-chart-unit-button-active');
            }
            jQuery(e.target).addClass('size-chart-unit-button-active').removeClass('size-chart-unit-button');

            selectedUnit = e.target.id.replace('in-modal-', '');
            // loop through all the col tags
            jQuery('#in-modal-sizechart col').each(function each(index) {
                // we don't want to start at 0 when using child selector below
                // look for the cols whose data-unit val matches the button id
                // those are the cols we want to show
                colUnit = jQuery(this).data('unit');
                if (colUnit === selectedUnit || colUnit === undefined) {
                    // child selector using the index value
                    jQuery('#in-modal-sizechart table tr > *:nth-child(' + (index + 1) + ')').show();
                } else {
                    jQuery('#in-modal-sizechart table tr > *:nth-child(' + (index + 1) + ')').hide();
                }
            });
        },

        getContext: function getContext() {
            return {
                html: this.model.get('html'),
                name: this.model.get('name')
            };
        }
    });
});
