/**
 * Small lock SVG icon. Export from SvgIcon map is used instead of this direct component.
 */
import React from 'react';
import Svg, { Rect, Path, SvgProps } from 'react-native-svg';

export const LockIcon = ({ size = 24, color = '#FFFFFF', strokeWidth = 2, ...props }: SvgProps & { size?: number; color?: string; strokeWidth?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <Rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <Path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </Svg>
);
