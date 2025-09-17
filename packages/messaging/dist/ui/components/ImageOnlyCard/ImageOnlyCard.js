"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/*
    Copyright 2025 Adobe. All rights reserved.
    This file is licensed to you under the Apache License, Version 2.0 (the
    "License"); you may not use this file except in compliance with the License.
    You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law
    or agreed to in writing, software distributed under the License is
    distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS OF
    ANY KIND, either express or implied. See the License for the specific
    language governing permissions and limitations under the License.
*/
const react_1 = tslib_1.__importDefault(require("react"));
const react_native_1 = require("react-native");
const DismissButton_1 = tslib_1.__importDefault(require("../DismissButton/DismissButton"));
const useAspectRatio_1 = tslib_1.__importDefault(require("../../hooks/useAspectRatio"));
/**
 * Renders an image only card component.
 *
 * @param props - an object of type [ImageOnlyContentProps], which contains the properties for the image only card component.
 * @returns The rendered image only card component.
 */
const ImageOnlyCard = ({ content, imageUri, onDismiss, onPress, styleOverrides, ContainerProps, ImageContainerProps, ImageProps, DismissButtonProps }) => {
    var _a;
    const imageAspectRatio = (0, useAspectRatio_1.default)(imageUri);
    return (<react_native_1.Pressable onPress={onPress} style={[styles.card, styleOverrides === null || styleOverrides === void 0 ? void 0 : styleOverrides.card]} {...ContainerProps}>
      <react_native_1.View style={[styles.imageContainer, styleOverrides === null || styleOverrides === void 0 ? void 0 : styleOverrides.imageContainer]} {...ImageContainerProps}>
        <react_native_1.Image resizeMode="contain" source={{ uri: imageUri }} style={[
            styles.image,
            { aspectRatio: imageAspectRatio },
            styleOverrides === null || styleOverrides === void 0 ? void 0 : styleOverrides.image
        ]} {...ImageProps}/>
        {((_a = content.dismissBtn) === null || _a === void 0 ? void 0 : _a.style) && content.dismissBtn.style !== 'none' && (<DismissButton_1.default onPress={onDismiss} type={content.dismissBtn.style} style={styleOverrides === null || styleOverrides === void 0 ? void 0 : styleOverrides.dismissButton} {...DismissButtonProps}/>)}
      </react_native_1.View>
    </react_native_1.Pressable>);
};
exports.default = ImageOnlyCard;
const styles = react_native_1.StyleSheet.create({
    card: {
        margin: 15,
        flex: 1
    },
    imageContainer: {
        backgroundColor: '#f0f0f0'
    },
    image: {
        width: '100%',
        flex: 1
    }
});
//# sourceMappingURL=ImageOnlyCard.js.map