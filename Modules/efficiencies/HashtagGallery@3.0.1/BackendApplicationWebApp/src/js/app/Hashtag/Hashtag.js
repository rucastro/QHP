(function Hashtag(Application, Backbone, jQuery) { // eslint-disable-line

    'use strict';

    var View = Backbone.View.extend({
        template: Application.templates['hashtag-list'],
        events: {
            'change input[data-filter="hashtag"]': 'filterHashtag',
            'keyup input[data-filter="hashtag"]': 'filterHashtag',
            'submit': 'submit',
            'click #input-hashtag-btn': 'submit'
        },
        initialize: function initialize() {
            this.listenTo(this.collection, 'sync', this.render);
        },
        render: function render() {
            this.$el.html(this.template(this.getContext()));
        },
        getContext: function gtetContext() {
            return {
                hashtags: this.collection.map(function map(model) {
                    return {
                        internalid: model.get('internalid'),
                        name: model.get('name')
                    };
                }),
                hashtagSearch: this.hashtagSearch
            };
        },
        submit: function submit(e) {
            e.preventDefault();
            this.filterHashtag({
                target: this.$('input[data-filter="hashtag"]')[0]
            }, true);
        },
        filterHashtag: function filterHashtag(e, exact) {
            var self = this;
            var $target = jQuery(e.target);
            var value = ($target.val() || '').trim();

            if (this.fetchPromise) {
                this.fetchPromise.abort();
            }

            this.hashtagSearch = value;

            if (value.length > 3 || value.length === 0) {
                this.fetchPromise = this.collection.fetch({
                    data: {
                        hashtag: value
                    }
                }).done(function done() {
                    self.$('input[data-filter="hashtag"]').focus().val(self.hashtagSearch);
                    if (exact) {
                        if (self.collection.findWhere({
                            name: value
                        })) {
                            Backbone.history.navigate('#/hashtag/' + value + '/');
                        }
                    }
                });
            }
        }
    });

    var Model = Backbone.Model.extend({

    });

    var Collection = Backbone.Collection.extend({
        model: Model,
        url: window.ENVIRONMENT.HASHTAG_SVC,
        parse: function parse(response) {
            return response.results;
        }
    });

    var mountToApp = function mountToApp() {
        var collection = new Collection();
        var view = new View({
            collection: collection,
            el: Application.leftContainer
        });
        collection.fetch();
        return view;
    };

    Application.Modules.Hashtag = {
        Model: Model,
        View: View,
        Collection: Collection,
        mountToApp: mountToApp
    };
})(window.Application, window.Backbone, window.jQuery);
