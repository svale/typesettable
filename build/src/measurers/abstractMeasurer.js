"use strict";
/**
 * Copyright 2017-present Palantir Technologies, Inc. All rights reserved.
 * Licensed under the MIT License (the "License"); you may obtain a copy of the
 * license at https://github.com/palantir/typesettable/blob/develop/LICENSE
 */
Object.defineProperty(exports, "__esModule", { value: true });
;
class AbstractMeasurer {
    constructor(ruler) {
        if (ruler.createRuler != null) {
            this.ruler = ruler.createRuler();
        }
        else {
            this.ruler = ruler;
        }
    }
    measure(text = AbstractMeasurer.HEIGHT_TEXT) {
        return this.ruler(text);
    }
}
/**
 * A string representing the full ascender/descender range of your text.
 *
 * Note that this is really only applicable to western alphabets. If you are
 * using a different locale language such as arabic or chinese, you may want
 * to override this.
 */
AbstractMeasurer.HEIGHT_TEXT = "bdpql";
exports.AbstractMeasurer = AbstractMeasurer;
//# sourceMappingURL=abstractMeasurer.js.map