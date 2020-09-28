"use strict";
/**
 * Copyright 2017-present Palantir Technologies, Inc. All rights reserved.
 * Licensed under the MIT License (the "License"); you may obtain a copy of the
 * license at https://github.com/palantir/typesettable/blob/develop/LICENSE
 */
Object.defineProperty(exports, "__esModule", { value: true });
class Methods {
    /**
     * Check if two arrays are equal by strict equality.
     */
    static arrayEq(a, b) {
        // Technically, null and undefined are arrays too
        if (a == null || b == null) {
            return a === b;
        }
        if (a.length !== b.length) {
            return false;
        }
        for (let i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) {
                return false;
            }
        }
        return true;
    }
    /**
     * @param {any} a Object to check against b for equality.
     * @param {any} b Object to check against a for equality.
     *
     * @returns {boolean} whether or not two objects share the same keys, and
     *          values associated with those keys. Values will be compared
     *          with ===.
     */
    static objEq(a, b) {
        if (a == null || b == null) {
            return a === b;
        }
        const keysA = Object.keys(a).sort();
        const keysB = Object.keys(b).sort();
        const valuesA = keysA.map((k) => a[k]);
        const valuesB = keysB.map((k) => b[k]);
        return Methods.arrayEq(keysA, keysB) && Methods.arrayEq(valuesA, valuesB);
    }
    static strictEq(a, b) {
        return a === b;
    }
    /**
     * Shim for _.defaults
     */
    static defaults(target, ...objects) {
        if (target == null) {
            throw new TypeError("Cannot convert undefined or null to object");
        }
        const result = Object(target);
        objects.forEach((obj) => {
            if (obj != null) {
                for (const key in obj) {
                    if (Object.prototype.hasOwnProperty.call(obj, key)) {
                        result[key] = obj[key];
                    }
                }
            }
        });
        return result;
    }
}
exports.Methods = Methods;
//# sourceMappingURL=methods.js.map