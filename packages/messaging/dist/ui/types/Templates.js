"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentTemplate = void 0;
const ContentCard_1 = require("../../models/ContentCard");
class ContentTemplate extends ContentCard_1.ContentCard {
    constructor(data, type) {
        super(data);
        this.type = type;
    }
}
exports.ContentTemplate = ContentTemplate;
//# sourceMappingURL=Templates.js.map