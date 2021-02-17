"use strict";
/**
 * Copyright 2017-present Palantir Technologies, Inc. All rights reserved.
 * Licensed under the MIT License (the "License"); you may obtain a copy of the
 * license at https://github.com/palantir/typesettable/blob/develop/LICENSE
 */
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const DEFAULT_WRITE_OPTIONS = {
    textRotation: 0,
    textShear: 0,
    xAlign: "left",
    yAlign: "top",
};
class Writer {
    constructor(_measurer, _penFactory, _wrapper) {
        this._measurer = _measurer;
        this._penFactory = _penFactory;
        this._wrapper = _wrapper;
    }
    measurer(newMeasurer) {
        this._measurer = newMeasurer;
        return this;
    }
    wrapper(newWrapper) {
        this._wrapper = newWrapper;
        return this;
    }
    penFactory(newPenFactory) {
        this._penFactory = newPenFactory;
        return this;
    }
    /**
     * Writes the text into the container. If no container is specified, the pen's
     * default container will be used.
     */
    write(text, width, height, options = {}, container) {
        // apply default options
        options = utils_1.Methods.defaults({}, DEFAULT_WRITE_OPTIONS, options);
        // validate input
        if (Writer.SupportedRotation.indexOf(options.textRotation) === -1) {
            throw new Error("unsupported rotation - " + options.textRotation +
                ". Supported rotations are " + Writer.SupportedRotation.join(", "));
        }
        if (options.textShear != null && options.textShear < -80 || options.textShear > 80) {
            throw new Error("unsupported shear angle - " + options.textShear + ". Must be between -80 and 80");
        }
        const orientHorizontally = Math.abs(Math.abs(options.textRotation) - 90) > 45;
        const primaryDimension = orientHorizontally ? width : height;
        const secondaryDimension = orientHorizontally ? height : width;
        // compute shear parameters
        const shearDegrees = options.textShear;
        const shearRadians = shearDegrees * Math.PI / 180;
        const lineHeight = this._measurer.measure().height;
        const shearShift = lineHeight * Math.tan(shearRadians);
        // When we apply text shear, the primary axis grows and the secondary axis
        // shrinks, due to trigonometry. The text shear feature uses the normal
        // wrapping logic with a subsituted bounding box of the corrected size
        // (computed below). When rendering the wrapped lines, we rotate the text
        // container by the text rotation angle AND the shear angle then carefully
        // offset each one so that they are still aligned to the primary alignment
        // option.
        const shearCorrectedPrimaryDimension = primaryDimension / Math.cos(shearRadians) - Math.abs(shearShift);
        const shearCorrectedSecondaryDimension = secondaryDimension * Math.cos(shearRadians);
        // normalize and wrap text
        const normalizedText = utils_1.StringMethods.combineWhitespace(text);
        const wrappedText = this._wrapper ?
            this._wrapper.wrap(normalizedText, this._measurer, shearCorrectedPrimaryDimension, shearCorrectedSecondaryDimension).wrappedText : normalizedText;
        const lines = wrappedText.split("\n");
        // console.log('lines', lines);
        // correct the intial x/y offset of the text container accounting shear and alignment
        const shearCorrectedXOffset = Writer.XOffsetFactor[options.xAlign] *
            shearCorrectedPrimaryDimension * Math.sin(shearRadians);
        const shearCorrectedYOffset = Writer.YOffsetFactor[options.yAlign] *
            (shearCorrectedSecondaryDimension - lines.length * lineHeight);
        const shearCorrection = shearCorrectedXOffset - shearCorrectedYOffset;
        // compute transform
        let translate = [0, 0];
        const rotate = options.textRotation + shearDegrees;
        switch (options.textRotation) {
            case 90:
                translate = [width + shearCorrection, 0];
                break;
            case -90:
                translate = [-shearCorrection, height];
                break;
            case 180:
                translate = [width, height + shearCorrection];
                break;
            default:
                translate = [0, -shearCorrection];
                break;
        }
        // create a new pen and write the lines
        const linePen = this._penFactory.createPen(text, { translate, rotate }, container);
        this.writeLines(lines, linePen, shearCorrectedPrimaryDimension, lineHeight, shearShift, options.xAlign);
        if (linePen.destroy != null) {
            linePen.destroy();
        }
    }
    writeLines(lines, linePen, width, lineHeight, shearShift, xAlign) {
        lines.forEach((line, i) => {
            // console.log(lineHeight)
            const xShearOffset = (shearShift > 0) ? (i + 1) * shearShift : (i) * shearShift;
            linePen.write(line, width, xAlign, xShearOffset, (i + 1) * lineHeight, i);
        });
    }
}
Writer.XOffsetFactor = {
    center: 0.5,
    left: 0,
    right: 1,
};
Writer.YOffsetFactor = {
    bottom: 1,
    center: 0.5,
    top: 0,
};
Writer.SupportedRotation = [-90, 0, 180, 90];
exports.Writer = Writer;
//# sourceMappingURL=writer.js.map