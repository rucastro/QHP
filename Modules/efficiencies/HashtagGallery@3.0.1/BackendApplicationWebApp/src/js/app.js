(function selfInit(window, Backbone, Handlebars, jQuery, _) {  // eslint-disable-line

    'use strict';

    var localRoot = 'http://localhost:3001/';
    var Application = _.extend(window.Application || {}, { Modules: {} });

    window.Application = Application;

    window.ENVIRONMENT = _.defaults(window.ENVIRONMENT, {
        'HASHTAG_GALLERY_SVC': localRoot + 'scriptlet.nl?script=29&deploy=1&compid=4219436&h=b9ea2c0f2dc2ca2441cd&',
        'HASHTAG_SVC': localRoot + 'scriptlet.nl?script=31&deploy=1&compid=4219436&h=1acb7b2ff924fba797dd'
    });

    Application.currentView = null;
    Backbone.View.prototype.render = function render() {
        if (Application.currentView && Application.currentView !== this) {
            Application.currentView.destroy();
        }
        Application.currentView = this;
        this.$el.html(this.template(this.getContext()));
    };
    Backbone.View.prototype.getContext = function render() {
        return {};
    };

    Backbone.View.prototype.destroy = function destroy() {
        // http://backbonejs.org/#View-undelegateEvents
        this.undelegateEvents();

        // http://backbonejs.org/#Events-off
        if (this.model) {
            this.model.off(null, null, this);
        }

        if (this.collection) {
            this.collection.off(null, null, this);
        }

        // http://backbonejs.org/#View-remove
        this.$el.empty();
    };

    _.extend(Backbone.Model.prototype, {
        idAttribute: 'internalid',
        url: function url() {
            var base = _.result(this, 'urlRoot') || _.result(this.collection, 'url');
            var sep;

            if (this.isNew()) {
                return base;
            }
            sep = base.indexOf('?') === -1 ? '?' : '&';
            return base + sep + 'internalid=' + encodeURIComponent(this.id);
        }
    });

    jQuery(window.document).ajaxError(function ajaxError(e, jqXhr) {
        var intStatus = parseInt(jqXhr.status, 10);
        var text;

        var parsedError;
        var errorText;

        if (errorText === 'abort' || intStatus === 0) {
            return;
        }
        if (intStatus === 206) {
            try {
                // Temporal way of avoiding netsuite's 206 Status with exceptions
                text = jqXhr.responseText.match(
                    "<td class=text><img src='/images/5square.gif' width=5 height=5>(.*?)</td>"
                )[1];

                parsedError = JSON.parse(text);
                errorText = parsedError.message;
            } catch (ex) {
                errorText = 'Unexpected error';
            }

            jQuery('#error-message-placeholder').html('<div class="alert alert-danger">' + errorText + '</div>');
        }
    });

    Backbone.history.on('all', function onAll() {
        jQuery('#error-message-placeholder').html('');
    });
})(window, window.Backbone, window.Handlebars, window.jQuery, window._);
