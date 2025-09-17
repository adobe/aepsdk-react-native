"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
function useAspectRatio(uri) {
    const [imageAspectRatio, setImageAspectRatio] = (0, react_1.useState)(1);
    (0, react_1.useEffect)(() => {
        if (!uri) {
            return;
        }
        react_native_1.Image.getSize(uri, (width, height) => {
            setImageAspectRatio(width / height);
        }, (error) => {
            console.log('Error getting image size:', error);
            setImageAspectRatio(1);
        });
    }, [uri]);
    return imageAspectRatio;
}
exports.default = useAspectRatio;
//# sourceMappingURL=useAspectRatio.js.map