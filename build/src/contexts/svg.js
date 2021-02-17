"use strict";
/**
 * Copyright 2017-present Palantir Technologies, Inc. All rights reserved.
 * Licensed under the MIT License (the "License"); you may obtain a copy of the
 * license at https://github.com/palantir/typesettable/blob/develop/LICENSE
 */
Object.defineProperty(exports, "__esModule", { value: true });
const writers_1 = require("../writers");
const html_1 = require("./html");
class SvgUtils {
    /**
     * Appends an SVG element with the specified tag name to the provided element.
     * The variadic classnames are added to the new element.
     *
     * Returns the new element.
     */
    static append(element, tagName, ...classNames) {
        const child = SvgUtils.create(tagName, ...classNames);
        element.appendChild(child);
        return child;
    }
    /**
     * Creates and returns a new SVGElement with the attached classnames.
     */
    static create(tagName, ...classNames) {
        const element = document.createElementNS(SvgUtils.SVG_NS, tagName);
        html_1.HtmlUtils.addClasses(element, ...classNames);
        return element;
    }
    /**
     * Returns the width/height of svg element's bounding box
     */
    static getDimensions(element) {
        // using feature detection, safely return the bounding box dimensions of the
        // provided svg element
        if (element.getBBox) {
            try {
                const { width, height } = element.getBBox();
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
SvgUtils.SVG_NS = "http://www.w3.org/2000/svg";
exports.SvgUtils = SvgUtils;
/**
 * A typesetter context for SVG.
 *
 * @param element - The CSS font styles applied to `element` will determine the
 * size of text measurements. Also the default text block container.
 * @param className - added to new text blocks
 * @param addTitleElement - enable title tags to be added to new text blocks.
 */
class SvgContext {
    constructor(element, className, addTitleElement = false) {
        this.element = element;
        this.className = className;
        this.addTitleElement = addTitleElement;
        this.createRuler = () => {
            const { parentElement, containerElement, textElement } = this.getTextElements(this.element);
            return (text) => {
                parentElement.appendChild(containerElement);
                textElement.textContent = text;
                const dimensions = SvgUtils.getDimensions(textElement);
                parentElement.removeChild(containerElement); // element.remove() doesn't work in IE11
                return dimensions;
            };
        };
        this.createPen = (text, transform, element) => {
            if (element == null) {
                element = this.element;
            }
            // remove existing text-container before appending new (@svale). @todo: should be config option ?
            const oldTextContainers = element.querySelectorAll(".text-container");
            oldTextContainers.forEach((c) => {
                element.removeChild(c);
            });
            const textContainer = SvgUtils.append(element, "g", "text-container", this.className);
            // attach optional title
            if (this.addTitleElement) {
                SvgUtils.append(textContainer, "title").textContent = text;
                textContainer.setAttribute("title", text);
            }
            // create and transform text block group
            const textBlockGroup = SvgUtils.append(textContainer, "g", "text-area");
            textBlockGroup.setAttribute("transform", `translate(${transform.translate[0]},${transform.translate[1]})` +
                `rotate(${transform.rotate})`);
            // console.log('textBlockGroup', textBlockGroup);
            // console.log('123');
            return this.createSvgLinePen(textBlockGroup);
        };
    }
    setAddTitleElement(addTitleElement) {
        this.addTitleElement = addTitleElement;
    }
    createSvgLinePen(textBlockGroup) {
        return {
            // Change by @svale: Add lineNumber
            write: (line, width, xAlign, xOffset, yOffset, lineNumber) => {
                // Change by @svale: Differentiate the vertical offset between first line and the others
                // First line (0) sets block position. It's changed  from .25 -> 0.47. to account for ascendents. 
                // the following lines tweak line height (0.6)
                // @todo: shoud be config option
                const yPos = +lineNumber > 0 ? "-0.6em" : "-0.47em";
                xOffset += width * writers_1.Writer.XOffsetFactor[xAlign];
                const element = SvgUtils.append(textBlockGroup, "text", "text-line");
                element.textContent = line;
                element.setAttribute("text-anchor", SvgContext.AnchorMap[xAlign]);
                element.setAttribute("transform", `translate(${xOffset},${yOffset})`);
                // element.setAttribute("data-li", lineNumber); // for debugging
                element.setAttribute("y", yPos);
            },
        };
    }
    getTextElements(element) {
        // if element is already a text element, return it
        if (element.tagName === "text") {
            let parentElement = element.parentElement;
            if (parentElement == null) {
                parentElement = element.parentNode;
            }
            // must be removed from parent since we re-add it on every measurement
            parentElement.removeChild(element);
            return {
                containerElement: element,
                parentElement,
                textElement: element,
            };
        }
        // if element has a text element descendent, select it and return it
        const selected = element.querySelector("text");
        if (selected != null) {
            let parentElement = selected.parentElement;
            if (parentElement == null) {
                parentElement = selected.parentNode;
            }
            // must be removed from parent since we re-add it on every measurement
            parentElement.removeChild(selected);
            return {
                containerElement: selected,
                parentElement,
                textElement: selected,
            };
        }
        // otherwise create a new text element
        const created = SvgUtils.create("text", this.className);
        return {
            containerElement: created,
            parentElement: element,
            textElement: created,
        };
    }
}
SvgContext.AnchorMap = {
    center: "middle",
    left: "start",
    right: "end",
};
exports.SvgContext = SvgContext;
//# sourceMappingURL=svg.js.map