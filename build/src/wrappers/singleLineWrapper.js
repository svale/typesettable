"use strict";
/**
 * Copyright 2017-present Palantir Technologies, Inc. All rights reserved.
 * Licensed under the MIT License (the "License"); you may obtain a copy of the
 * license at https://github.com/palantir/typesettable/blob/develop/LICENSE
 */
Object.defineProperty(exports, "__esModule", { value: true });
const wrapper_1 = require("./wrapper");
class SingleLineWrapper extends wrapper_1.Wrapper {
    wrap(text, measurer, width, height = Infinity) {
        const lines = text.split("\n");
        if (lines.length > 1) {
            throw new Error("SingleLineWrapper is designed to work only on single line");
        }
        const wrapFN = (w) => super.wrap(text, measurer, w, height);
        let result = wrapFN(width);
        if (result.noLines < 2) {
            return result;
        }
        let left = 0;
        let right = width;
        for (let i = 0; i < SingleLineWrapper.NO_WRAP_ITERATIONS && right > left; ++i) {
            const currentWidth = (right + left) / 2;
            const currentResult = wrapFN(currentWidth);
            if (this.areSameResults(result, currentResult)) {
                right = currentWidth;
                result = currentResult;
            }
            else {
                left = currentWidth;
            }
        }
        return result;
    }
    areSameResults(one, two) {
        return one.noLines === two.noLines && one.truncatedText === two.truncatedText;
    }
}
SingleLineWrapper.NO_WRAP_ITERATIONS = 5;
exports.SingleLineWrapper = SingleLineWrapper;
//# sourceMappingURL=singleLineWrapper.js.map