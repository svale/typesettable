"use strict";
/**
 * Copyright 2017-present Palantir Technologies, Inc. All rights reserved.
 * Licensed under the MIT License (the "License"); you may obtain a copy of the
 * license at https://github.com/palantir/typesettable/blob/develop/LICENSE
 */
Object.defineProperty(exports, "__esModule", { value: true });
const writers_1 = require("../writers");
const DEFAULT_FILL_COLOR = "#444";
/**
 * A typesetter context for HTML5 Canvas.
 *
 * Due to the Canvas API, you must explicitly define the line height, and any
 * styling for the font must also be explicitly defined in the optional
 * `ICanvasFontStyle` object.
 */
class CanvasContext {
    constructor(ctx, lineHeight = 10, style = {}) {
        this.ctx = ctx;
        this.lineHeight = lineHeight;
        this.style = style;
        this.createRuler = () => {
            return (text) => {
                this.ctx.font = this.style.font;
                const { width } = this.ctx.measureText(text);
                return { width, height: this.lineHeight };
            };
        };
        this.createPen = (_text, transform, ctx) => {
            if (ctx == null) {
                ctx = this.ctx;
            }
            ctx.save();
            ctx.translate(transform.translate[0], transform.translate[1]);
            ctx.rotate(transform.rotate * Math.PI / 180.0);
            return this.createCanvasPen(ctx);
        };
        if (this.style.fill === undefined) {
            this.style.fill = DEFAULT_FILL_COLOR;
        }
    }
    createCanvasPen(ctx) {
        return {
            destroy: () => {
                ctx.restore();
            },
            write: (line, width, xAlign, xOffset, yOffset) => {
                xOffset += width * writers_1.Writer.XOffsetFactor[xAlign];
                ctx.textAlign = xAlign;
                if (this.style.font != null) {
                    ctx.font = this.style.font;
                }
                if (this.style.fill != null) {
                    ctx.fillStyle = this.style.fill;
                    ctx.fillText(line, xOffset, yOffset);
                }
                if (this.style.stroke != null) {
                    ctx.strokeStyle = this.style.fill;
                    ctx.strokeText(line, xOffset, yOffset);
                }
            },
        };
    }
}
exports.CanvasContext = CanvasContext;
//# sourceMappingURL=canvas.js.map