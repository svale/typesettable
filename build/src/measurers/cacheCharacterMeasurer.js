"use strict";
/**
 * Copyright 2017-present Palantir Technologies, Inc. All rights reserved.
 * Licensed under the MIT License (the "License"); you may obtain a copy of the
 * license at https://github.com/palantir/typesettable/blob/develop/LICENSE
 */
/* istanbul ignore next */
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const characterMeasurer_1 = require("./characterMeasurer");
class CacheCharacterMeasurer extends characterMeasurer_1.CharacterMeasurer {
    constructor(ruler, useGuards) {
        super(ruler, useGuards);
        this.cache = new utils_1.Cache((c) => {
            return this._measureCharacterNotFromCache(c);
        });
    }
    _measureCharacterNotFromCache(c) {
        return super._measureCharacter(c);
    }
    _measureCharacter(c) {
        return this.cache.get(c);
    }
    reset() {
        this.cache.clear();
    }
}
exports.CacheCharacterMeasurer = CacheCharacterMeasurer;
//# sourceMappingURL=cacheCharacterMeasurer.js.map