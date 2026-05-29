/**
 * Map-based SVG icon component — selects from 8 named icons by string key.
 * Simpler than importing individual icon components.
 */
import React from 'react';
import { Svg, Path } from 'react-native-svg';

type Props = {
  name: 'arrowRight' | 'arrowLeft' | 'sparkle' | 'fire' | 'lock' | 'check' | 'cross' | 'indiaFlag';
  size?: number;
  color?: string;
};

export const SvgIcon: React.FC<Props> = ({ name, size = 24, color = '#FFFFFF' }) => {
  const viewBox = '0 0 24 24';
  const renderPath = () => {
    switch (name) {
      case 'arrowRight':
        return <Path d='M5 12h14M12 5l7 7-7 7' stroke={color} strokeWidth={2} strokeLinecap='round' strokeLinejoin='round' />;
      case 'arrowLeft':
        return <Path d='M19 12H5M12 19l-7-7 7-7' stroke={color} strokeWidth={2} strokeLinecap='round' strokeLinejoin='round' />;
      case 'sparkle':
        return <Path d='M12 2v20M2 12h20' stroke={color} strokeWidth={2} strokeLinecap='round' />;
      case 'fire':
        return <Path d='M12 2c-1 5 4 9 0 14-4 5-8 2-8-2s4-9 8-12z' fill={color} />;
      case 'lock':
        return <><Path d='M6 10V8a6 6 0 1112 0v2' stroke={color} strokeWidth={2} strokeLinecap='round' strokeLinejoin='round' /><Path d='M4 10h16v10H4z' stroke={color} strokeWidth={2} strokeLinecap='round' strokeLinejoin='round' /></>
      case 'check':
        return <Path d='M5 13l4 4L19 7' stroke={color} strokeWidth={2} strokeLinecap='round' strokeLinejoin='round' />;
      case 'cross':
        return <Path d='M6 6l12 12M18 6l-12 12' stroke={color} strokeWidth={2} strokeLinecap='round' strokeLinejoin='round' />;
      case 'indiaFlag':
        return (
          <Path d='M2 2h20v20H2z' fill={color} />
        );
      default:
        return null;
    }
  };

  return (
    <Svg width={size} height={size} viewBox={viewBox} fill='none'>
      {renderPath()}
    </Svg>
  );
};
