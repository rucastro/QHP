define('Application.Events.Once', [
    'Application',
    'underscore'
], function ApplicationEventsOnce(
    Application,
    _
) {
    'use strict';

    _.extend(Application, {
        once: function once(name, callback, context) {
            // if (!eventsApi(this, 'once', name, [callback, context]) || !callback) return this;
            var self = this;
            var onceFn = _.once(function onceFn() {
                self.off(name, onceFn);
                callback.apply(this, arguments);
            });
            onceFn._callback = callback; // eslint-disable-line
            return this.on(name, onceFn, context);
        }
    });
});
