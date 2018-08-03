define('extendWithEvents', [
    'underscore',
    'Application'
], function ExtendWithEvents(
    _,
    Application
) {
    'use strict';

    function wrapFunctionWithEvents(methodName, model, fn) {
        return _.wrap(fn, function wrapper(func) {
            var result;
            // Gets the arguments passed to the function from the execution code (removes func from arguments)
            var args = _.toArray(arguments).slice(1);

            // Fires the 'before:ObjectName.MethodName' event most common 'before:Model.method'
            Application.trigger.apply(Application, ['before:' + model.name + '.' + methodName, this].concat(args));

            // Executes the real code of the method
            result = func.apply(this, args);

            // Fires the 'before:ObjectName.MethodName' event adding result as 1st parameter
            Application.trigger.apply(Application, ['after:' + model.name + '.' + methodName, this, result].concat(args));

            // Returns the result from the execution of the real code, modifications may happend in the after event
            return result;
        });
    }

    return function extendWithEvents(Model, mixin) {
        _.each(mixin, function wrapMixin(value, key) {
            if (typeof value === 'function' && key !== 'extend') {
                mixin[key] = wrapFunctionWithEvents(key, Model, value);
            }
        });

        _.extend(Model, mixin);
    };
});
