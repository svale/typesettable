"use strict";
/**
 * Copyright 2017-present Palantir Technologies, Inc. All rights reserved.
 * Licensed under the MIT License (the "License"); you may obtain a copy of the
 * license at https://github.com/palantir/typesettable/blob/develop/LICENSE
 */
Object.defineProperty(exports, "__esModule", { value: true });
const abstractMeasurer_1 = require("./abstractMeasurer");
class Measurer extends abstractMeasurer_1.AbstractMeasurer {
    constructor(ruler, useGuards = false) {
        super(ruler);
        this.useGuards = useGuards;
    }
    // Guards assures same line height and width of whitespaces on both ends.
    _addGuards(text) {
        return abstractMeasurer_1.AbstractMeasurer.HEIGHT_TEXT + text + abstractMeasurer_1.AbstractMeasurer.HEIGHT_TEXT;
    }
    _measureLine(line, forceGuards = false) {
        const useGuards = this.useGuards || forceGuards || /^[\t ]$/.test(line);
        const measuredLine = useGuards ? this._addGuards(line) : line;
        const measuredLineDimensions = super.measure(measuredLine);
        measuredLineDimensions.width -= useGuards ? (2 * this.getGuardWidth()) : 0;
        return measuredLineDimensions;
    }
    measure(text = abstractMeasurer_1.AbstractMeasurer.HEIGHT_TEXT) {
        if (text.trim() === "") {
            return { width: 0, height: 0 };
        }
        const linesDimensions = text.trim().split("\n").map((line) => this._measureLine(line));
        return {
            height: linesDimensions.reduce((acc, dim) => acc + dim.height, 0),
            width: linesDimensions.reduce((acc, dim) => Math.max(acc, dim.width), 0),
        };
    }
    getGuardWidth() {
        if (this.guardWidth == null) {
            this.guardWidth = super.measure().width;
        }
        return this.guardWidth;
    }
}
exports.Measurer = Measurer;
//# sourceMappingURL=measurer.js.map