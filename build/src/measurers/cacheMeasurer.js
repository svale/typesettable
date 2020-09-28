"use strict";
/**
 * Copyright 2017-present Palantir Technologies, Inc. All rights reserved.
 * Licensed under the MIT License (the "License"); you may obtain a copy of the
 * license at https://github.com/palantir/typesettable/blob/develop/LICENSE
 */
/* istanbul ignore next */
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const abstractMeasurer_1 = require("./abstractMeasurer");
const cacheCharacterMeasurer_1 = require("./cacheCharacterMeasurer");
class CacheMeasurer extends cacheCharacterMeasurer_1.CacheCharacterMeasurer {
    constructor(ruler) {
        super(ruler);
        this.dimCache = new utils_1.Cache((s) => {
            return this._measureNotFromCache(s);
        });
    }
    _measureNotFromCache(s) {
        return super.measure(s);
    }
    measure(s = abstractMeasurer_1.AbstractMeasurer.HEIGHT_TEXT) {
        return this.dimCache.get(s);
    }
    reset() {
        this.dimCache.clear();
        super.reset();
    }
}
exports.CacheMeasurer = CacheMeasurer;
//# sourceMappingURL=cacheMeasurer.js.map