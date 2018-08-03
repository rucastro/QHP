define('ArrayBigIntersect', [

], function ArrayBigIntersect(

) {
    'use strict';

    /**
     * Compute the intersection of big arrays.
     *
     * @author  Mehdi Kabab <http://pioupioum.fr/>
     * @license http://www.opensource.org/licenses/mit-license.php MIT License.
     * @see     http://pioupioum.fr/developpement/javascript-array-intersection.html
     * @see     http://pioupioum.fr/sandbox/javascript-array-intersect-benchmark/
     * @version 1.0.1
     *
     * @param  {Array} arr1 First array.
     * @param  {Array} arr2 Second array.
     * @param  {Array} [arr3[, arr4[, ...]]] Optional arrays.
     * @return {Array} A new array containing elements common to the arrays passed
     *                 in arguments, with no duplicates.
     */

    /* eslint-disable */

    return function array_big_intersect () {
        var args = Array.prototype.slice.call(arguments),
            aLower = [],
            aStack = [],
            count,
            i,
            nArgs,
            nLower,
            oRest = {},
            oTmp = {},
            value,
            compareArrayLength = function (a, b) {
                return (a.length - b.length);
            },
            indexes = function (array, oStack) {
                var i = 0,
                    value,
                    nArr = array.length,
                    oTmp = {};

                for (; nArr > i; ++i) {
                    value = array[i];
                    if (!oTmp[value]) {
                        oStack[value] = 1 + (oStack[value] || 0); // counter
                        oTmp[value] = true;
                    }
                }

                return oStack;
            };

        args.sort(compareArrayLength);
        aLower = args.shift();
        nLower = aLower.length;

        if (0 === nLower) {
            return aStack;
        }

        nArgs = args.length;
        i = nArgs;
        while (i--) {
            oRest = indexes(args.shift(), oRest);
        }

        for (i = 0; nLower > i; ++i) {
            value = aLower[i];
            count = oRest[value];
            if (!oTmp[value]) {
                if (nArgs === count) {
                    aStack.push(value);
                    oTmp[value] = true;
                }
            }
        }

        return aStack;
    }
    /* eslint-enable */
});
