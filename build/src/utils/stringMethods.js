"use strict";
/**
 * Copyright 2017-present Palantir Technologies, Inc. All rights reserved.
 * Licensed under the MIT License (the "License"); you may obtain a copy of the
 * license at https://github.com/palantir/typesettable/blob/develop/LICENSE
 */
Object.defineProperty(exports, "__esModule", { value: true });
class StringMethods {
    /**
     * Treat all sequences of consecutive spaces as a single " ".
     */
    static combineWhitespace(str) {
        return str.replace(/[ \t]+/g, " ");
    }
    static isNotEmptyString(str) {
        return str && str.trim() !== "";
    }
    static trimStart(str, splitter) {
        if (!str) {
            return str;
        }
        const chars = str.split("");
        const reduceFunction = splitter ? (s) => s.split(splitter).some(StringMethods.isNotEmptyString)
            : StringMethods.isNotEmptyString;
        return chars.reduce((s, c) => reduceFunction(s + c) ? s + c : s, "");
    }
    static trimEnd(str, c) {
        if (!str) {
            return str;
        }
        let reversedChars = str.split("");
        reversedChars.reverse();
        reversedChars = StringMethods.trimStart(reversedChars.join(""), c).split("");
        reversedChars.reverse();
        return reversedChars.join("");
    }
}
exports.StringMethods = StringMethods;
//# sourceMappingURL=stringMethods.js.map