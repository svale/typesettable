"use strict";
/**
 * Copyright 2017-present Palantir Technologies, Inc. All rights reserved.
 * Licensed under the MIT License (the "License"); you may obtain a copy of the
 * license at https://github.com/palantir/typesettable/blob/develop/LICENSE
 */
Object.defineProperty(exports, "__esModule", { value: true });
class HtmlUtils {
    /**
     * Appends an HTML element with the specified tag name to the provided element.
     * The variadic classnames are added to the new element.
     *
     * Returns the new element.
     */
    static append(element, tagName, ...classNames) {
        const child = HtmlUtils.create(tagName, ...classNames);
        element.appendChild(child);
        return child;
    }
    /**
     * Creates and returns a new HTMLElement with the attached classnames.
     */
    static create(tagName, ...classNames) {
        const element = document.createElement(tagName);
        HtmlUtils.addClasses(element, ...classNames);
        return element;
    }
    /**
     * Adds the variadic classnames to the Element
     */
    static addClasses(element, ...classNames) {
        classNames = classNames.filter((c) => c != null);
        if (element.classList != null) {
            classNames.forEach((className) => {
                element.classList.add(className);
            });
        }
        else {
            // IE 11 does not support classList
            element.setAttribute("class", classNames.join(" "));
        }
    }
    /**
     * Returns the width/height of HTMLElement's bounding box
     */
    static getDimensions(element) {
        // using feature detection, safely return the bounding box dimensions of the
        // provided html element
        if (element.getBoundingClientRect) {
            try {
                const { width, height } = element.getBoundingClientRect();
                // copy to prevent NoModificationAllowedError
                return { width, height };
            }
            catch (err) {
                // swallow any errors that occur (Firefox Linux)
            }
        }
        // if can't get valid bbox, return 0,0
        return { height: 0, width: 0 };
    }
}
exports.HtmlUtils = HtmlUtils;
/**
 * A typesetter context for HTML.
 */
class HtmlContext {
    /**
     * @param element - The CSS font styles applied to `element` will determine the
     * size of text measurements. Also the default text block container.
     * @param className - added to new text blocks
     * @param addTitle - enable title attribute to be added to new text blocks.
     */
    constructor(element, className, addTitle = false) {
        this.element = element;
        this.className = className;
        this.addTitle = addTitle;
        this.createRuler = () => {
            return (text) => {
                const textElement = HtmlUtils.append(this.element, "span", "text-tmp", this.className);
                textElement.textContent = text;
                const dimensions = HtmlUtils.getDimensions(textElement);
                this.element.removeChild(textElement); // element.remove() doesn't work in IE11
                return dimensions;
            };
        };
        this.createPen = (text, transform, element) => {
            if (element == null) {
                element = this.element;
            }
            const textBlock = HtmlUtils.append(element, "div", "text-block", this.className);
            textBlock.style.position = "relative";
            textBlock.style.transform =
                `translate(0, -1em) ` + // adjust 1 line height up to account for differences in yOffsets
                    `translate(${transform.translate[0]}px, ${transform.translate[1]}px) ` +
                    `rotate(${transform.rotate}deg)`;
            // This awkward transform origin matches the SVG origin
            textBlock.style.transformOrigin = "0 1.2em";
            // attach optional title
            if (this.addTitle) {
                textBlock.setAttribute("title", text);
            }
            return this.createHtmlLinePen(textBlock);
        };
    }
    setAddTitle(addTitle) {
        this.addTitle = addTitle;
    }
    createHtmlLinePen(textBlock) {
        return {
            write: (line, width, xAlign, xOffset, yOffset) => {
                const textLine = HtmlUtils.append(textBlock, "div", "text-line");
                textLine.textContent = line;
                textLine.style.width = `${width}px`;
                textLine.style.textAlign = xAlign;
                textLine.style.position = "absolute";
                textLine.style.whiteSpace = "nowrap";
                textLine.style.top = `${yOffset}px`;
                textLine.style.left = `${xOffset}px`;
            },
        };
    }
}
exports.HtmlContext = HtmlContext;
//# sourceMappingURL=html.js.map