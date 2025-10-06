"use strict";

import React, { useEffect, useRef } from "react";
import { View, StyleSheet, useColorScheme, TouchableOpacity, Animated } from "react-native";
const PaginationDot = ({
  page,
  isActive,
  finalInactiveColor,
  finalActiveColor,
  dotSize,
  onPageChange
}) => {
  const scaleAnim = useRef(new Animated.Value(isActive ? 1.2 : 1)).current;
  const opacityAnim = useRef(new Animated.Value(isActive ? 1 : 0.6)).current;
  useEffect(() => {
    Animated.parallel([Animated.spring(scaleAnim, {
      toValue: isActive ? 1.2 : 1,
      useNativeDriver: true,
      tension: 100,
      friction: 8
    }), Animated.timing(opacityAnim, {
      toValue: isActive ? 1 : 0.6,
      duration: 200,
      useNativeDriver: true
    })]).start();
  }, [isActive, scaleAnim, opacityAnim]);
  return /*#__PURE__*/React.createElement(TouchableOpacity, {
    onPress: () => onPageChange(page),
    style: styles.dotContainer,
    activeOpacity: 0.7
  }, /*#__PURE__*/React.createElement(Animated.View, {
    style: [styles.dot, {
      width: dotSize,
      height: dotSize,
      backgroundColor: isActive ? finalActiveColor : finalInactiveColor,
      opacity: opacityAnim,
      transform: [{
        scale: scaleAnim
      }]
    }]
  }));
};
export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  maxVisibleDots = 5,
  activeColor,
  inactiveColor,
  dotSize = 8,
  spacing = 8
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const slideAnim = useRef(new Animated.Value(0)).current;
  const prevVisiblePagesRef = useRef([]);

  // Default colors based on theme
  const defaultActiveColor = isDark ? "#fff" : "#0a7ea4";
  const defaultInactiveColor = isDark ? "#9BA1A6" : "#687076";
  const finalActiveColor = activeColor || defaultActiveColor;
  const finalInactiveColor = inactiveColor || defaultInactiveColor;

  // Calculate which dots to show
  const getVisiblePages = () => {
    if (totalPages <= maxVisibleDots) {
      return Array.from({
        length: totalPages
      }, (_, i) => i);
    }
    const halfVisible = Math.floor(maxVisibleDots / 2);
    let startPage = Math.max(0, currentPage - halfVisible);
    let endPage = Math.min(totalPages - 1, startPage + maxVisibleDots - 1);

    // Adjust start if we're near the end
    if (endPage === totalPages - 1) {
      startPage = Math.max(0, endPage - maxVisibleDots + 1);
    }
    return Array.from({
      length: endPage - startPage + 1
    }, (_, i) => startPage + i);
  };
  const visiblePages = getVisiblePages();

  // Animate sliding when visible pages change
  useEffect(() => {
    const prevVisiblePages = prevVisiblePagesRef.current;
    if (prevVisiblePages.length > 0 && totalPages > maxVisibleDots) {
      const prevStartPage = prevVisiblePages[0];
      const currentStartPage = visiblePages[0];
      if (prevStartPage !== currentStartPage) {
        const direction = currentStartPage > prevStartPage ? 1 : -1;
        const dotWidth = dotSize + spacing;

        // Start from offset position
        slideAnim.setValue(direction * dotWidth);

        // Animate back to center
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true
        }).start();
      }
    }
    prevVisiblePagesRef.current = visiblePages;
  }, [visiblePages, slideAnim, dotSize, spacing, maxVisibleDots, totalPages]);
  if (totalPages <= 1) {
    return null;
  }
  return /*#__PURE__*/React.createElement(View, {
    style: styles.container
  }, /*#__PURE__*/React.createElement(Animated.View, {
    style: [styles.dotsContainer, {
      gap: spacing,
      transform: [{
        translateX: slideAnim
      }]
    }]
  }, visiblePages.map(page => /*#__PURE__*/React.createElement(PaginationDot, {
    key: page,
    page: page,
    isActive: page === currentPage,
    finalInactiveColor: finalInactiveColor,
    finalActiveColor: finalActiveColor,
    dotSize: dotSize,
    onPageChange: onPageChange
  }))));
};
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    backgroundColor: 'blue',
    flex: 1
  },
  dotsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  dotContainer: {
    alignItems: "center",
    justifyContent: "center"
  },
  dot: {
    borderRadius: 50
  }
});
export default Pagination;
//# sourceMappingURL=Pagination.js.map