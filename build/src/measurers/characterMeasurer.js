"use strict";
/**
 * Copyright 2017-present Palantir Technologies, Inc. All rights reserved.
 * Licensed under the MIT License (the "License"); you may obtain a copy of the
 * license at https://github.com/palantir/typesettable/blob/develop/LICENSE
 */
/* istanbul ignore next */
Object.defineProperty(exports, "__esModule", { value: true });
const measurer_1 = require("./measurer");
class CharacterMeasurer extends measurer_1.Measurer {
    _measureCharacter(c) {
        return super._measureLine(c);
    }
    _measureLine(line) {
        const charactersDimensions = line.split("").map((c) => this._measureCharacter(c));
        return {
            height: charactersDimensions.reduce((acc, dim) => Math.max(acc, dim.height), 0),
            width: charactersDimensions.reduce((acc, dim) => acc + dim.width, 0),
        };
    }
}
exports.CharacterMeasurer = CharacterMeasurer;
//# sourceMappingURL=characterMeasurer.js.map