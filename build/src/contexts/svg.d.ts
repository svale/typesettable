/**
 * Copyright 2017-present Palantir Technologies, Inc. All rights reserved.
 * Licensed under the MIT License (the "License"); you may obtain a copy of the
 * license at https://github.com/palantir/typesettable/blob/develop/LICENSE
 */
import { IDimensions } from "../measurers";
import { ITransform, IXAlign } from "../writers";
import { ITypesetterContext } from "./index";
export declare type IAnchor = "start" | "middle" | "end";
export declare class SvgUtils {
    static SVG_NS: string;
    /**
     * Appends an SVG element with the specified tag name to the provided element.
     * The variadic classnames are added to the new element.
     *
     * Returns the new element.
     */
    static append(element: Element, tagName: string, ...classNames: string[]): SVGElement;
    /**
     * Creates and returns a new SVGElement with the attached classnames.
     */
    static create(tagName: string, ...classNames: string[]): SVGElement;
    /**
     * Returns the width/height of svg element's bounding box
     */
    static getDimensions(element: SVGGraphicsElement): IDimensions;
}
/**
 * A typesetter context for SVG.
 *
 * @param element - The CSS font styles applied to `element` will determine the
 * size of text measurements. Also the default text block container.
 * @param className - added to new text blocks
 * @param addTitleElement - enable title tags to be added to new text blocks.
 */
export declare class SvgContext implements ITypesetterContext<SVGElement> {
    private element;
    private className?;
    private addTitleElement;
    private static AnchorMap;
    constructor(element: SVGElement, className?: string, addTitleElement?: boolean);
    setAddTitleElement(addTitleElement: boolean): void;
    createRuler: () => (text: string) => IDimensions;
    createPen: (text: string, transform: ITransform, element?: Element) => {
        write: (line: string, width: number, xAlign: IXAlign, xOffset: number, yOffset: number) => void;
    };
    private createSvgLinePen;
    private getTextElements;
}
