"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useContentCardUI = void 0;
const tslib_1 = require("tslib");
const react_1 = require("react");
const Messaging_1 = tslib_1.__importDefault(require("../../Messaging"));
/**
 * Hook to fetch the content card UI for a given surface.
 * @param surface - The surface to fetch the content card UI for.
 * @returns An object containing the content card UI, error, loading state, and a refetch function.
 */
const useContentCardUI = (surface) => {
    const [content, setContent] = (0, react_1.useState)([]);
    const [error, setError] = (0, react_1.useState)(null);
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const fetchContent = (0, react_1.useCallback)(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            setIsLoading(true);
            yield Messaging_1.default.updatePropositionsForSurfaces([surface]);
            const content = yield Messaging_1.default.getContentCardUI(surface);
            setContent(content);
            setIsLoading(false);
        }
        catch (error) {
            console.error(error);
            setContent([]);
            setError(error);
        }
        finally {
            setIsLoading(false);
        }
    }), [surface]);
    (0, react_1.useEffect)(() => {
        fetchContent();
    }, [surface, fetchContent]);
    return { content, error, isLoading, refetch: fetchContent };
};
exports.useContentCardUI = useContentCardUI;
//# sourceMappingURL=useContentCardUI.js.map