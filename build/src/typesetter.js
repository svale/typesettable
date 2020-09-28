"use strict";
/**
 * Copyright 2017-present Palantir Technologies, Inc. All rights reserved.
 * Licensed under the MIT License (the "License"); you may obtain a copy of the
 * license at https://github.com/palantir/typesettable/blob/develop/LICENSE
 */
Object.defineProperty(exports, "__esModule", { value: true });
const contexts_1 = require("./contexts");
const measurers_1 = require("./measurers");
const wrappers_1 = require("./wrappers");
const writers_1 = require("./writers");
/**
 * This is a convenience interface for typesetting strings using the default
 * measurer/wrapper/writer setup.
 */
class Typesetter {
    constructor(context) {
        this.context = context;
        this.measurer = new measurers_1.CacheMeasurer(this.context);
        this.wrapper = new wrappers_1.Wrapper();
        this.writer = new writers_1.Writer(this.measurer, this.context, this.wrapper);
    }
    static svg(element, className, addTitleElement) {
        return new Typesetter(new contexts_1.SvgContext(element, className, addTitleElement));
    }
    static canvas(ctx, lineHeight, style) {
        return new Typesetter(new contexts_1.CanvasContext(ctx, lineHeight, style));
    }
    static html(element, className, addTitle) {
        return new Typesetter(new contexts_1.HtmlContext(element, className, addTitle));
    }
    /**
     * Wraps the given string into the width/height and writes it into the
     * canvas or SVG (depending on context).
     *
     * Delegates to `Writer.write` using the internal `ITypesetterContext`.
     */
    write(text, width, height, options, into) {
        this.writer.write(text, width, height, options, into);
    }
    /**
     * Clears the `Measurer`'s CacheMeasurer.
     *
     * Call this if your font style changee in SVG.
     */
    clearMeasurerCache() {
        this.measurer.reset();
    }
}
exports.Typesetter = Typesetter;
//# sourceMappingURL=typesetter.js.map