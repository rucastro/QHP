(function HashtagGallery(Application, Backbone, jQuery, Handlebars, _) { // eslint-disable-line

    'use strict';

    // <editor-fold desc="View">
    var View = Backbone.View.extend({
        template: Application.templates['hashtag-gallery'],
        events: {
            'click a[data-action="prev"]': 'prev',
            'click a[data-action="next"]': 'next',
            'click a[data-action="refresh"]': 'refresh',
            'click a[data-action="approve"]': 'add',
            'click a[data-action="reject"]': 'reject'
        },
        initialize: function initialize(options) {
            this.hashtag = options.hashtag;
            this.listenTo(this.collection, 'sync', this.render);
            this.collection.fetch({
                data: {
                    hashtag: this.hashtag,
                    page: options.page,
                    pagerId: options.pagerId,
                    status: options.status
                }
            });
        },
        add: function add(e) {
            this.action(e, '1');
        },
        reject: function reject(e) {
            this.action(e, '3');
        },
        action: function action(e, status) {
            var $target = jQuery(e.target);
            var externalid = $target.data('externalid');
            var internalid = $target.data('internalid');
            var self = this;
            var model;

            if (internalid) {
                model = this.collection.get(internalid);
            } else {
                model = this.collection.findWhere({
                    externalid: externalid
                });
            }
            e.preventDefault();
            model.set('status', status);
            model.set('hashtag', this.hashtag);

            model.save().done(function done() {
                self.collection.set(model, {
                    remove: false
                });
                self.render();
            });
        },
        getContext: function getContext() {
            return {
                items: this.collection.map(function map(model) {
                    var copy = JSON.parse(JSON.stringify(model.attributes));
                    if (copy.caption.length > 255) {
                        copy.caption = copy.caption.substr(0, 100) + '...';
                    }
                    switch (copy.status) {
                    case '1':
                        copy.statusText = 'Approved';
                        copy.statusClass = 'bg-success';
                        copy.statusImg = window.ENVIRONMENT.ASSETS_PATH + 'img/hashtag_image_approved_small.png';
                        copy.isApproved = true;
                        break;

                    case '3':
                        copy.statusText = 'Rejected';
                        copy.statusClass = 'bg-danger';
                        copy.isRejected = true;
                        copy.statusImg = window.ENVIRONMENT.ASSETS_PATH + 'img/hashtag_image_rejected_small.png';
                        break;
                    default:
                        copy.statusText = 'Pending';
                        copy.statusClass = 'bg-warning';
                        copy.isPending = true;
                        copy.statusImg = window.ENVIRONMENT.ASSETS_PATH + 'img/hashtag_image_error_small.png';
                        break;
                    }

                    return copy;
                }),
                count: this.collection.count,
                hashtag: this.hashtag,
                hasNext: _.keys(this.collection.linkParams.next).length > 0,
                hasPrevious: _.keys(this.collection.linkParams.prev).length > 0 &&
                    this.collection.linkParams.prev.page !== -1,
                hasRefresh: this.collection.linkParams && this.collection.linkParams.prev.page === -1,
                assetsPath: window.ENVIRONMENT.ASSETS_PATH
            };
        },
        prev: function prev(e) {
            var params = '#' +
                '/hashtag/' + this.hashtag +
                '/page/' + this.collection.linkParams.prev.page +
                '/pagerId/' + this.collection.linkParams.prev.pagerId + '/';

            e.preventDefault();

            Backbone.history.navigate(params, {
                trigger: true
            });
        },
        next: function next(e) {
            var params = '#' +
                '/hashtag/' + this.hashtag +
                '/page/' + this.collection.linkParams.next.page +
                '/pagerId/' + this.collection.linkParams.next.pagerId + '/';

            e.preventDefault();

            Backbone.history.navigate(params, {
                trigger: true
            });
        },
        refresh: function next(e) {
            var params = '#' +
                '/hashtag/' + this.hashtag + '/';

            e.preventDefault();

            Backbone.history.navigate(params, {
                trigger: true
            });
        }
    });
    // </editor-fold>
    var DefaultView = Backbone.View.extend({
        template: Application.templates.home,
        getContext: function getContext() {
            return {};
        }
    });
    // <editor-fold desc="Model">
    var Model = Backbone.Model.extend({
        urlRoot: window.ENVIRONMENT.HASHTAG_GALLERY_SVC
    });
    // </editor-fold>

    // <editor-fold desc="Collection">
    var Collection = Backbone.Collection.extend({
        model: Model,
        url: window.ENVIRONMENT.HASHTAG_GALLERY_SVC,
        parse: function parse(response) {
            this.linkParams = response.linkParams;
            this.hashtag = response.hashtag;
            this.count = response.count;
            return response.results;
        },
        prev: function prev(pOptions) {
            var options = _.clone(pOptions) || {};
            options.data = options.data || {};
            _.extend(options.data, this.linkParams.prev, {
                hashtag: this.hashtag
            });

            return this.fetch(options);
        },
        next: function next(pOptions) {
            var options = _.clone(pOptions) || {};
            options.data = options.data || {};
            _.extend(options.data, this.linkParams.next, {
                hashtag: this.hashtag
            });

            return this.fetch(options);
        }
    });
    // </editor-fold
    var Router = Backbone.Router.extend({
        routes: {

            'hashtag/:id/': 'handleHashtag',
            'hashtag/:id/page/:page/pagerId/:pagerId/': 'handleHashtag',
            'hashtag/:id/page/:page/pagerId/:pagerId/status/:status/': 'handleHashtag',
            '*path': 'home'
        },
        home: function home() {
            return new DefaultView({
                el: Application.mainContainer
            }).render();
        },
        handleHashtag: function handleHashtag(hashtag, page, pagerId, status) {
            var collection = new Collection();
            return new View({
                el: Application.mainContainer,
                hashtag: hashtag,
                collection: collection,
                page: page || 0,
                pagerId: pagerId,
                status: status || 'all'
            });
        }
    });

    Application.Modules.HashtagGallery = {
        Model: Model,
        View: View,
        Collection: Collection,
        Router: Router
    };
})(window.Application, window.Backbone, window.jQuery, window.Handlebars, window._);
