import React, { useRef, useEffect } from 'react';
import { Animated, StyleProp, ViewStyle } from 'react-native';

interface AnimatedContainerProps {
  children: React.ReactNode;
  /** Duration in ms for fade & slide (default 600) */
  duration?: number;
  /** Initial vertical offset (default 30) */
  offsetY?: number;
  /** Additional style for the inner view */
  style?: StyleProp<ViewStyle>;
}

/**
 * Wraps its children in an Animated.View that fades in and slides up
 * when the component mounts. Mirrors the animation pattern used across
 * the onboarding screens.
 */
const AnimatedContainer: React.FC<AnimatedContainerProps> = ({
  children,
  duration = 600,
  offsetY = 30,
  style,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(offsetY)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim, duration]);

  return (
    <Animated.View
      style={[{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }, style]}
    >
      {children}
    </Animated.View>
  );
};

export default AnimatedContainer;
