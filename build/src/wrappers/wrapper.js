"use strict";
/**
 * Copyright 2017-present Palantir Technologies, Inc. All rights reserved.
 * Licensed under the MIT License (the "License"); you may obtain a copy of the
 * license at https://github.com/palantir/typesettable/blob/develop/LICENSE
 */
Object.defineProperty(exports, "__esModule", { value: true });
const Utils = require("../utils");
class Wrapper {
    constructor() {
        this.maxLines(Infinity);
        this.textTrimming("ellipsis");
        this.allowBreakingWords(false);
        this._tokenizer = new Utils.Tokenizer();
        this._breakingCharacter = "-";
    }
    maxLines(noLines) {
        if (noLines == null) {
            return this._maxLines;
        }
        else {
            this._maxLines = noLines;
            return this;
        }
    }
    textTrimming(option) {
        if (option == null) {
            return this._textTrimming;
        }
        else {
            if (option !== "ellipsis" && option !== "none") {
                throw new Error(option + " - unsupported text trimming option.");
            }
            this._textTrimming = option;
            return this;
        }
    }
    allowBreakingWords(allow) {
        if (allow == null) {
            return this._allowBreakingWords;
        }
        else {
            this._allowBreakingWords = allow;
            return this;
        }
    }
    wrap(text, measurer, width, height = Infinity) {
        const initialWrappingResult = {
            noBrokeWords: 0,
            noLines: 0,
            originalText: text,
            truncatedText: "",
            wrappedText: "",
        };
        const state = {
            availableLines: Math.min(Math.floor(height / measurer.measure().height), this._maxLines),
            availableWidth: width,
            canFitText: true,
            currentLine: "",
            wrapping: initialWrappingResult,
        };
        const lines = text.split("\n");
        return lines.reduce((s, line, i) => {
            return this.breakLineToFitWidth(s, line, i !== lines.length - 1, measurer);
        }, state).wrapping;
    }
    breakLineToFitWidth(state, line, hasNextLine, measurer) {
        if (!state.canFitText && state.wrapping.truncatedText !== "") {
            state.wrapping.truncatedText += "\n";
        }
        const tokens = this._tokenizer.tokenize(line);
        state = tokens.reduce((s, token) => {
            return this.wrapNextToken(token, s, measurer);
        }, state);
        const wrappedText = Utils.StringMethods.trimEnd(state.currentLine);
        state.wrapping.noLines += +(wrappedText !== "");
        if (state.wrapping.noLines === state.availableLines && this._textTrimming !== "none" && hasNextLine) {
            // Note: no need to add more ellipses, they were added in `wrapNextToken`
            state.canFitText = false;
        }
        else {
            state.wrapping.wrappedText += wrappedText;
        }
        state.currentLine = "\n";
        return state;
    }
    canFitToken(token, width, measurer) {
        const possibleBreaks = token.split("").map((c, i) => (i !== token.length - 1) ? c + this._breakingCharacter : c);
        return (measurer.measure(token).width <= width) || possibleBreaks.every((c) => measurer.measure(c).width <= width);
    }
    addEllipsis(line, width, measurer) {
        if (this._textTrimming === "none") {
            return {
                remainingToken: "",
                wrappedToken: line,
            };
        }
        let truncatedLine = line.substring(0).trim();
        let lineWidth = measurer.measure(truncatedLine).width;
        const ellipsesWidth = measurer.measure("...").width;
        const prefix = (line.length > 0 && line[0] === "\n") ? "\n" : "";
        if (width <= ellipsesWidth) {
            const periodWidth = ellipsesWidth / 3;
            const numPeriodsThatFit = Math.floor(width / periodWidth);
            return {
                remainingToken: line,
                wrappedToken: prefix + "...".substr(0, numPeriodsThatFit),
            };
        }
        while (lineWidth + ellipsesWidth > width) {
            truncatedLine = Utils.StringMethods.trimEnd(truncatedLine.substr(0, truncatedLine.length - 1));
            lineWidth = measurer.measure(truncatedLine).width;
        }
        return {
            remainingToken: Utils.StringMethods.trimEnd(line.substring(truncatedLine.length), "-").trim(),
            wrappedToken: prefix + truncatedLine + "...",
        };
    }
    wrapNextToken(token, state, measurer) {
        if (!state.canFitText ||
            state.availableLines === state.wrapping.noLines ||
            !this.canFitToken(token, state.availableWidth, measurer)) {
            return this.finishWrapping(token, state, measurer);
        }
        let remainingToken = token;
        while (remainingToken) {
            const result = this.breakTokenToFitInWidth(remainingToken, state.currentLine, state.availableWidth, measurer);
            state.currentLine = result.line;
            remainingToken = result.remainingToken;
            if (remainingToken != null) {
                state.wrapping.noBrokeWords += +result.breakWord;
                ++state.wrapping.noLines;
                if (state.availableLines === state.wrapping.noLines) {
                    const ellipsisResult = this.addEllipsis(state.currentLine, state.availableWidth, measurer);
                    state.wrapping.wrappedText += ellipsisResult.wrappedToken;
                    state.wrapping.truncatedText += ellipsisResult.remainingToken + remainingToken;
                    state.currentLine = "\n";
                    return state;
                }
                else {
                    state.wrapping.wrappedText += Utils.StringMethods.trimEnd(state.currentLine);
                    state.currentLine = "\n";
                }
            }
        }
        return state;
    }
    finishWrapping(token, state, measurer) {
        // Token is really long, but we have a space to put part of the word.
        if (state.canFitText &&
            state.availableLines !== state.wrapping.noLines &&
            this._textTrimming !== "none") {
            const res = this.addEllipsis(state.currentLine + token, state.availableWidth, measurer);
            state.wrapping.wrappedText += res.wrappedToken;
            state.wrapping.truncatedText += res.remainingToken;
            state.wrapping.noBrokeWords += +(res.remainingToken.length < token.length);
            state.wrapping.noLines += +(res.wrappedToken.length > 0);
            state.currentLine = "";
        }
        else {
            state.wrapping.truncatedText += token;
        }
        state.canFitText = false;
        return state;
    }
    /**
     * Breaks single token to fit current line.
     * If token contains only whitespaces then they will not be populated to next line.
     */
    breakTokenToFitInWidth(token, line, availableWidth, measurer, breakingCharacter = this._breakingCharacter) {
        if (measurer.measure(line + token).width <= availableWidth) {
            return {
                breakWord: false,
                line: line + token,
                remainingToken: null,
            };
        }
        if (token.trim() === "") {
            return {
                breakWord: false,
                line,
                remainingToken: "",
            };
        }
        // if we don't allow breaking words AND the token isn't the only thing on the current line.
        if (!this._allowBreakingWords && line.trim() !== "") {
            return {
                breakWord: false,
                line,
                remainingToken: token,
            };
        }
        let fitTokenLength = 0;
        while (fitTokenLength < token.length) {
            if (measurer.measure(line + token.substring(0, fitTokenLength + 1) + breakingCharacter).width <= availableWidth) {
                ++fitTokenLength;
            }
            else {
                break;
            }
        }
        let suffix = "";
        if (fitTokenLength > 0) {
            suffix = breakingCharacter;
        }
        return {
            breakWord: fitTokenLength > 0,
            line: line + token.substring(0, fitTokenLength) + suffix,
            remainingToken: token.substring(fitTokenLength),
        };
    }
}
exports.Wrapper = Wrapper;
//# sourceMappingURL=wrapper.js.map