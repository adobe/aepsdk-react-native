"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const react_native_1 = require("react-native");
const Button_1 = tslib_1.__importDefault(require("../Button/Button"));
const DismissButton_1 = tslib_1.__importDefault(require("../DismissButton/DismissButton"));
const ThemeProvider_1 = require("../../theme/ThemeProvider");
const useAspectRatio_1 = tslib_1.__importDefault(require("../../hooks/useAspectRatio"));
const SmallImageCard = (_a) => {
    var _b, _c, _d, _e, _f;
    var { content, height, imageUri, styleOverrides, style, onDismiss, onPress, ContainerProps, ImageProps, ContentContainerProps, TextProps, TitleProps, BodyProps, ButtonContainerProps, ButtonProps, DismissButtonProps, ImageContainerProps } = _a, props = tslib_1.__rest(_a, ["content", "height", "imageUri", "styleOverrides", "style", "onDismiss", "onPress", "ContainerProps", "ImageProps", "ContentContainerProps", "TextProps", "TitleProps", "BodyProps", "ButtonContainerProps", "ButtonProps", "DismissButtonProps", "ImageContainerProps"]);
    const theme = (0, ThemeProvider_1.useTheme)();
    const imageAspectRatio = (0, useAspectRatio_1.default)(imageUri);
    return (<react_native_1.Pressable onPress={onPress} style={(state) => [
            styles.card,
            styleOverrides === null || styleOverrides === void 0 ? void 0 : styleOverrides.card,
            typeof style === 'function' ? style(state) : style
        ]} {...props}>
      <react_native_1.View style={[styles.container, styleOverrides === null || styleOverrides === void 0 ? void 0 : styleOverrides.container]} {...ContainerProps}>
        {imageUri && (<react_native_1.View style={[styles.imageContainer, styleOverrides === null || styleOverrides === void 0 ? void 0 : styleOverrides.imageContainer]} {...ImageContainerProps}>
            <react_native_1.Image source={{ uri: imageUri }} style={[
                styles.image,
                { aspectRatio: imageAspectRatio },
                styleOverrides === null || styleOverrides === void 0 ? void 0 : styleOverrides.image
            ]} {...ImageProps}/>
          </react_native_1.View>)}

        <react_native_1.View style={[styles.contentContainer, styleOverrides === null || styleOverrides === void 0 ? void 0 : styleOverrides.contentContainer]} {...ContentContainerProps}>
          {((_b = content === null || content === void 0 ? void 0 : content.title) === null || _b === void 0 ? void 0 : _b.content) && (<react_native_1.Text style={[
                styles.title,
                { color: theme.colors.textPrimary },
                styleOverrides === null || styleOverrides === void 0 ? void 0 : styleOverrides.text,
                styleOverrides === null || styleOverrides === void 0 ? void 0 : styleOverrides.title
            ]} {...TextProps} {...TitleProps}>
              {content.title.content}
            </react_native_1.Text>)}
          {((_c = content === null || content === void 0 ? void 0 : content.body) === null || _c === void 0 ? void 0 : _c.content) && (<react_native_1.Text style={[
                styles.body,
                { color: theme.colors.textPrimary },
                styleOverrides === null || styleOverrides === void 0 ? void 0 : styleOverrides.text,
                styleOverrides === null || styleOverrides === void 0 ? void 0 : styleOverrides.body
            ]} {...TextProps} {...BodyProps}>
              {content.body.content}
            </react_native_1.Text>)}
          <react_native_1.View style={[styles.buttonContainer, styleOverrides === null || styleOverrides === void 0 ? void 0 : styleOverrides.buttonContainer]} {...ButtonContainerProps}>
            {((_d = content === null || content === void 0 ? void 0 : content.buttons) === null || _d === void 0 ? void 0 : _d.length) &&
            ((_e = content === null || content === void 0 ? void 0 : content.buttons) === null || _e === void 0 ? void 0 : _e.length) > 0 &&
            content.buttons.map((button) => (<Button_1.default key={button.id} actionUrl={button.actionUrl} title={button.text.content} onPress={onPress} style={styleOverrides === null || styleOverrides === void 0 ? void 0 : styleOverrides.button} textStyle={[styleOverrides === null || styleOverrides === void 0 ? void 0 : styleOverrides.text, styleOverrides === null || styleOverrides === void 0 ? void 0 : styleOverrides.buttonText]} {...ButtonProps}/>))}
          </react_native_1.View>
          {(content === null || content === void 0 ? void 0 : content.dismissBtn) && ((_f = content.dismissBtn) === null || _f === void 0 ? void 0 : _f.style) !== 'none' && (<DismissButton_1.default onPress={onDismiss} type={content.dismissBtn.style} {...DismissButtonProps}/>)}
        </react_native_1.View>
      </react_native_1.View>
    </react_native_1.Pressable>);
};
exports.default = SmallImageCard;
const styles = react_native_1.StyleSheet.create({
    card: {
        borderRadius: 12,
        margin: 15,
        flex: 1,
        flexDirection: 'row',
        gap: 8,
        maxWidth: '100%',
        alignItems: 'center'
    },
    container: {
        flexDirection: 'row',
        minHeight: 120
    },
    imageContainer: {
        borderRadius: 12,
        width: 'auto',
        height: '100%'
    },
    image: {
        height: '100%',
        resizeMode: 'contain'
    },
    contentContainer: {
        flex: 1,
        paddingVertical: 16,
        paddingHorizontal: 16,
        justifyContent: 'flex-start'
    },
    textContent: {
        flex: 1,
        justifyContent: 'flex-start',
        marginBottom: 16
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        marginRight: 16
    },
    body: {
        fontSize: 14,
        lineHeight: 18
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        paddingTop: 8,
        gap: 8
    },
    button: {
        marginHorizontal: 8
    }
});
//# sourceMappingURL=SmallImageCard.js.map