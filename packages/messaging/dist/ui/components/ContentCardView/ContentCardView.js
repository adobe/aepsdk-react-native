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
exports.ContentCardView = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importStar(require("react"));
const react_native_1 = require("react-native");
const MessagingEdgeEventType_1 = tslib_1.__importDefault(require("../../../models/MessagingEdgeEventType"));
const DismissButton_1 = tslib_1.__importDefault(require("../DismissButton/DismissButton"));
const theme_1 = require("../../theme");
const useAspectRatio_1 = tslib_1.__importDefault(require("../../hooks/useAspectRatio"));
const Button_1 = tslib_1.__importDefault(require("../Button/Button"));
const ContentCardView = (_a) => {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
    var { template, listener, variant, styleOverrides: _styleOverrides, style, ContainerProps, ImageContainerProps, ImageProps, ContentContainerProps, TextProps, TitleProps, BodyProps, ButtonContainerProps, ButtonProps, DismissButtonProps } = _a, props = tslib_1.__rest(_a, ["template", "listener", "variant", "styleOverrides", "style", "ContainerProps", "ImageContainerProps", "ImageProps", "ContentContainerProps", "TextProps", "TitleProps", "BodyProps", "ButtonContainerProps", "ButtonProps", "DismissButtonProps"]);
    console.log('ContentCardView', template);
    const colorScheme = (0, react_native_1.useColorScheme)();
    const [isVisible, setIsVisible] = (0, react_1.useState)(true);
    const isDisplayedRef = (0, react_1.useRef)(false);
    const theme = (0, theme_1.useTheme)();
    const cardVariant = (0, react_1.useMemo)(() => { var _a; return (_a = variant !== null && variant !== void 0 ? variant : template.type) !== null && _a !== void 0 ? _a : 'SmallImage'; }, [variant, template.type]);
    const onDismiss = (0, react_1.useCallback)(() => {
        var _a;
        listener === null || listener === void 0 ? void 0 : listener('onDismiss', template);
        // Track dismiss event using propositionItem
        (_a = template.track) === null || _a === void 0 ? void 0 : _a.call(template, MessagingEdgeEventType_1.default.DISMISS);
        setIsVisible(false);
    }, [listener, template]);
    const onPress = (0, react_1.useCallback)(() => {
        var _a, _b, _c;
        listener === null || listener === void 0 ? void 0 : listener('onInteract', template);
        // Track interaction event using propositionItem
        (_a = template.track) === null || _a === void 0 ? void 0 : _a.call(template, 'content_clicked', MessagingEdgeEventType_1.default.INTERACT, null);
        if ((_c = (_b = template.data) === null || _b === void 0 ? void 0 : _b.content) === null || _c === void 0 ? void 0 : _c.actionUrl) {
            try {
                react_native_1.Linking.openURL(template.data.content.actionUrl);
            }
            catch (error) {
                console.warn(`Failed to open URL: ${template.data.content.actionUrl}`, error);
            }
        }
    }, [template]);
    // Call listener on mount to signal view display (only once to prevent duplicates)
    (0, react_1.useEffect)(() => {
        var _a;
        if (!isDisplayedRef.current) {
            listener === null || listener === void 0 ? void 0 : listener('onDisplay', template);
            // Track display event using propositionItem
            (_a = template.track) === null || _a === void 0 ? void 0 : _a.call(template, MessagingEdgeEventType_1.default.DISPLAY);
            isDisplayedRef.current = true;
        }
    }, [listener, template]);
    const imageUri = (0, react_1.useMemo)(() => {
        var _a, _b, _c, _d;
        if (colorScheme === 'dark' && ((_c = (_b = (_a = template.data) === null || _a === void 0 ? void 0 : _a.content) === null || _b === void 0 ? void 0 : _b.image) === null || _c === void 0 ? void 0 : _c.darkUrl)) {
            return template.data.content.image.darkUrl;
        }
        return (_d = template.data.content.image) === null || _d === void 0 ? void 0 : _d.url;
    }, [
        colorScheme,
        (_d = (_c = (_b = template.data) === null || _b === void 0 ? void 0 : _b.content) === null || _c === void 0 ? void 0 : _c.image) === null || _d === void 0 ? void 0 : _d.darkUrl,
        (_g = (_f = (_e = template.data) === null || _e === void 0 ? void 0 : _e.content) === null || _f === void 0 ? void 0 : _f.image) === null || _g === void 0 ? void 0 : _g.url
    ]);
    const imageAspectRatio = (0, useAspectRatio_1.default)(imageUri);
    // If not visible, return null to hide the entire view
    if (!isVisible) {
        return null;
    }
    if (!template.data)
        return null;
    const content = (_h = template === null || template === void 0 ? void 0 : template.data) === null || _h === void 0 ? void 0 : _h.content;
    if (!content)
        return null;
    const styleOverrides = (0, react_1.useMemo)(() => {
        switch (cardVariant) {
            case 'SmallImage':
                return _styleOverrides === null || _styleOverrides === void 0 ? void 0 : _styleOverrides.smallImageStyle;
            case 'LargeImage':
                return _styleOverrides === null || _styleOverrides === void 0 ? void 0 : _styleOverrides.largeImageStyle;
            case 'ImageOnly':
                return _styleOverrides === null || _styleOverrides === void 0 ? void 0 : _styleOverrides.imageOnlyStyle;
            default:
                return null;
        }
    }, [_styleOverrides, cardVariant]);
    return (<react_native_1.Pressable onPress={onPress} style={(state) => [
            styles.card,
            styleOverrides === null || styleOverrides === void 0 ? void 0 : styleOverrides.card,
            typeof style === 'function' ? style(state) : style
        ]} {...props}>
      <react_native_1.View style={[
            cardVariant === 'SmallImage'
                ? smallImageStyles.container
                : styles.container,
            styleOverrides === null || styleOverrides === void 0 ? void 0 : styleOverrides.container
        ]} {...ContainerProps}>
        {imageUri && (<react_native_1.View style={[
                cardVariant === 'SmallImage'
                    ? smallImageStyles.imageContainer
                    : styles.imageContainer,
                styleOverrides === null || styleOverrides === void 0 ? void 0 : styleOverrides.imageContainer
            ]} {...ImageContainerProps}>
            <react_native_1.Image source={{ uri: imageUri }} style={[
                cardVariant === 'SmallImage'
                    ? smallImageStyles.image
                    : styles.image,
                { aspectRatio: imageAspectRatio },
                styleOverrides === null || styleOverrides === void 0 ? void 0 : styleOverrides.image
            ]} resizeMode="contain" {...ImageProps}/>
          </react_native_1.View>)}
        {cardVariant !== 'ImageOnly' && (<react_native_1.View style={[styles.contentContainer, styleOverrides === null || styleOverrides === void 0 ? void 0 : styleOverrides.contentContainer]} {...ContentContainerProps}>
            {((_j = content === null || content === void 0 ? void 0 : content.title) === null || _j === void 0 ? void 0 : _j.content) && (<react_native_1.Text style={[
                    styles.title,
                    { color: theme.colors.textPrimary },
                    styleOverrides === null || styleOverrides === void 0 ? void 0 : styleOverrides.text,
                    styleOverrides === null || styleOverrides === void 0 ? void 0 : styleOverrides.title
                ]} {...TextProps} {...TitleProps}>
                {content.title.content}
              </react_native_1.Text>)}
            {((_k = content === null || content === void 0 ? void 0 : content.body) === null || _k === void 0 ? void 0 : _k.content) && (<react_native_1.Text style={[
                    styles.body,
                    { color: theme.colors.textPrimary },
                    styleOverrides === null || styleOverrides === void 0 ? void 0 : styleOverrides.text,
                    styleOverrides === null || styleOverrides === void 0 ? void 0 : styleOverrides.body
                ]} {...TextProps} {...BodyProps}>
                {content.body.content}
              </react_native_1.Text>)}
            <react_native_1.View style={[styles.buttonContainer, styleOverrides === null || styleOverrides === void 0 ? void 0 : styleOverrides.buttonContainer]} {...ButtonContainerProps}>
              {((_l = content === null || content === void 0 ? void 0 : content.buttons) === null || _l === void 0 ? void 0 : _l.length) &&
                ((_m = content === null || content === void 0 ? void 0 : content.buttons) === null || _m === void 0 ? void 0 : _m.length) > 0 &&
                content.buttons.map((button) => (<Button_1.default key={button.id} actionUrl={button.actionUrl} title={button.text.content} onPress={onPress} style={styleOverrides === null || styleOverrides === void 0 ? void 0 : styleOverrides.button} textStyle={[
                        styleOverrides === null || styleOverrides === void 0 ? void 0 : styleOverrides.text,
                        styleOverrides === null || styleOverrides === void 0 ? void 0 : styleOverrides.buttonText
                    ]} {...ButtonProps}/>))}
            </react_native_1.View>
          </react_native_1.View>)}
        {(content === null || content === void 0 ? void 0 : content.dismissBtn) && ((_o = content.dismissBtn) === null || _o === void 0 ? void 0 : _o.style) !== 'none' && (<DismissButton_1.default onPress={onDismiss} type={content.dismissBtn.style} {...DismissButtonProps}/>)}
      </react_native_1.View>
    </react_native_1.Pressable>);
};
exports.ContentCardView = ContentCardView;
const styles = react_native_1.StyleSheet.create({
    card: {
        margin: 15,
        flex: 1
    },
    container: {
        flexDirection: 'column'
    },
    imageContainer: {
        alignItems: 'center',
        borderRadius: 12,
        backgroundColor: '#f0f0f0'
    },
    image: {
        width: '100%',
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
        flexWrap: 'wrap',
        paddingTop: 8,
        gap: 8
    },
    button: {
        marginHorizontal: 8
    }
});
const smallImageStyles = react_native_1.StyleSheet.create({
    card: {
        borderRadius: 12,
        flexDirection: 'row',
        gap: 8,
        maxWidth: '100%',
        alignItems: 'center'
    },
    container: {
        flexDirection: 'row'
    },
    imageContainer: {
        borderRadius: 12,
        maxWidth: '35%',
        alignSelf: 'center'
    },
    image: {
        resizeMode: 'contain',
        width: '100%',
        maxWidth: '100%'
    }
});
// const largeImageStyles = StyleSheet.create({
//   card: {
//     ...styles.card,
//     borderRadius: 12,
//     gap: 8
//   },
//   container: {
//     flexDirection: 'row'
//   },
//   imageContainer: {
//     alignItems: 'center',
//     borderRadius: 12,
//     backgroundColor: '#f0f0f0'
//   },
//   image: {
//     width: '100%',
//     resizeMode: 'contain'
//   },
//   contentContainer: styles.contentContainer,
//   textContent: styles.textContent,
//   title: styles.title,
//   body: styles.body,
//   buttonContainer: styles.buttonContainer,
//   button: styles.button
// });
// const imageOnlyStyles = StyleSheet.create({
//   card: styles.card,
//   imageContainer: {
//     backgroundColor: '#f0f0f0'
//   },
//   image: {
//     width: '100%',
//     resizeMode: 'contain'
//   }
// });
//# sourceMappingURL=ContentCardView.js.map