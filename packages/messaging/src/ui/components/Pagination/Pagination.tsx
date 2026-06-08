/*
    Copyright 2026 Adobe. All rights reserved.
    This file is licensed to you under the Apache License, Version 2.0 (the
    "License"); you may not use this file except in compliance with the License.
    You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law
    or agreed to in writing, software distributed under the License is
    distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS OF
    ANY KIND, either express or implied. See the License for the specific
    language governing permissions and limitations under the License.
*/

import React, { useEffect, useRef } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  View
} from "react-native";
import { useTheme } from "../../theme";

const PaginationDot = ({
  page,
  isActive,
  finalInactiveColor,
  finalActiveColor,
  dotSize,
  onPageChange,
}: {
  page: number;
  isActive: boolean;
  finalInactiveColor?: string;
  finalActiveColor?: string;
  dotSize: number;
  onPageChange: (page: number) => void;
}) => {
  const scaleAnim = useRef(new Animated.Value(isActive ? 1.2 : 1)).current;
  const opacityAnim = useRef(new Animated.Value(isActive ? 1 : 0.6)).current;

  useEffect(() => {
    const animation = Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: isActive ? 1.2 : 1,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
      Animated.timing(opacityAnim, {
        toValue: isActive ? 1 : 0.6,
        duration: 200,
        useNativeDriver: true,
      }),
    ]);
    animation.start();
    return () => {
      // stop both if unmounted
      scaleAnim.stopAnimation();
      opacityAnim.stopAnimation();
    };
  }, [isActive, scaleAnim, opacityAnim]);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: isActive }}
      accessibilityLabel={`Page ${page + 1}`}
      onPress={() => onPageChange(page)}
      style={({ pressed }) => [
        styles.dotContainer,
        { opacity: pressed ? 0.7 : 1 },
      ]}
    >
      <Animated.View
        style={[
          styles.dot,
          {
            width: dotSize,
            height: dotSize,
            backgroundColor: isActive ? finalActiveColor : finalInactiveColor,
            opacity: opacityAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      />
    </Pressable>
  );
};

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  maxVisibleDots?: number;
  activeColor?: string;
  inactiveColor?: string;
  dotSize?: number;
  spacing?: number;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  maxVisibleDots = 5,
  activeColor,
  inactiveColor,
  dotSize = 8,
  spacing = 8,
}) => {
  const { colors } = useTheme();
  
  const slideAnim = useRef(new Animated.Value(0)).current;
  const prevVisiblePagesRef = useRef<number[]>([]);

  const finalActiveColor = activeColor || colors.activeColor;
  const finalInactiveColor = inactiveColor || colors.inactiveColor;

  // Calculate which dots to show
  const getVisiblePages = () => {
    if (totalPages <= maxVisibleDots) {
      return Array.from({ length: totalPages }, (_, i) => i);
    }

    const halfVisible = Math.floor(maxVisibleDots / 2);
    let startPage = Math.max(0, currentPage - halfVisible);
    let endPage = Math.min(totalPages - 1, startPage + maxVisibleDots - 1);

    // Adjust start if we're near the end
    if (endPage === totalPages - 1) {
      startPage = Math.max(0, endPage - maxVisibleDots + 1);
    }

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );
  };

  const visiblePages = getVisiblePages();

  // Animate sliding when visible pages change
  useEffect(() => {
    const prevVisiblePages = prevVisiblePagesRef.current;
    let started = false;
  
    if (prevVisiblePages.length > 0 && totalPages > maxVisibleDots) {
      const prevStartPage = prevVisiblePages[0];
      const currentStartPage = visiblePages[0];
  
      if (prevStartPage !== currentStartPage) {
        const direction = currentStartPage > prevStartPage ? 1 : -1;
        const dotWidth = dotSize + spacing;
        slideAnim.setValue(direction * dotWidth);
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
        started = true;
      }
    }
  
    prevVisiblePagesRef.current = visiblePages;
  
    return () => {
      if (started) slideAnim.stopAnimation();
    };
  }, [visiblePages, slideAnim, dotSize, spacing, maxVisibleDots, totalPages]);

  if (totalPages <= 1) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.dotsContainer, 
          { 
            gap: spacing,
            transform: [{ translateX: slideAnim }]
          }
        ]}
      >
        {visiblePages.map((page) => (
          <PaginationDot
            key={page}
            page={page}
            isActive={page === currentPage}
            finalInactiveColor={finalInactiveColor}
            finalActiveColor={finalActiveColor}
            dotSize={dotSize}
            onPageChange={onPageChange}
          />
        ))}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    flex: 1,
  },
  dotsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  dotContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  dot: {
    borderRadius: 50,
  },
});

export default Pagination;
