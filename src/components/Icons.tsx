/**
 * Library of SVG icon components used throughout the app.
 * Each icon is a named function component with size/color/strokeWidth props.
 */
import React from 'react';
import Svg, { Path, Circle, Rect, Polyline, Line, Polygon, SvgProps } from 'react-native-svg';

export interface IconProps extends SvgProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

// 🏠 Home Icon
export const HomeIcon = ({ size = 24, color = '#FFFFFF', strokeWidth = 2, ...props }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <Path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <Polyline points="9 22 9 12 15 12 15 22" />
  </Svg>
);

// 📊 Templates / Chart Icon
export const TemplatesIcon = ({ size = 24, color = '#FFFFFF', strokeWidth = 2, ...props }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <Line x1="18" y1="20" x2="18" y2="10" />
    <Line x1="12" y1="20" x2="12" y2="4" />
    <Line x1="6" y1="20" x2="6" y2="14" />
  </Svg>
);

// 👤 Profile / User Icon
export const ProfileIcon = ({ size = 24, color = '#FFFFFF', strokeWidth = 2, ...props }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <Circle cx="12" cy="7" r="4" />
  </Svg>
);

// 💼 Business / Briefcase Icon
export const BusinessIcon = ({ size = 24, color = '#FFFFFF', strokeWidth = 2, ...props }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <Rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <Path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </Svg>
);

// 🌐 Globe / Language Icon
export const GlobeIcon = ({ size = 24, color = '#FFFFFF', strokeWidth = 2, ...props }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <Circle cx="12" cy="12" r="10" />
    <Line x1="2" y1="12" x2="22" y2="12" />
    <Path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </Svg>
);

// 🎯 Target / Goal Icon
export const TargetIcon = ({ size = 24, color = '#FFFFFF', strokeWidth = 2, ...props }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <Circle cx="12" cy="12" r="10" />
    <Circle cx="12" cy="12" r="6" />
    <Circle cx="12" cy="12" r="2" />
  </Svg>
);

// ✏️ Pencil / Edit Icon
export const PencilIcon = ({ size = 24, color = '#FFFFFF', strokeWidth = 2, ...props }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <Path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <Path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4z" />
  </Svg>
);

// 🎨 Palette / Interests Icon
export const PaletteIcon = ({ size = 24, color = '#FFFFFF', strokeWidth = 2, ...props }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <Path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 14.7255 3.09032 17.1962 4.85857 19C5.03724 19.1787 5.17647 19.3986 5.25301 19.6465C5.35243 19.9685 5.30906 20.3204 5.13222 20.612C4.54228 21.5849 5.24151 22 6 22H12Z" />
    <Circle cx="7.5" cy="10.5" r="1.5" fill={color} />
    <Circle cx="11.5" cy="7.5" r="1.5" fill={color} />
    <Circle cx="16.5" cy="9.5" r="1.5" fill={color} />
    <Circle cx="15.5" cy="14.5" r="1.5" fill={color} />
  </Svg>
);

// 📍 MapPin / Location Icon
export const MapPinIcon = ({ size = 24, color = '#FFFFFF', strokeWidth = 2, ...props }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <Circle cx="12" cy="10" r="3" />
  </Svg>
);

// 🚪 LogOut / SignOut Icon
export const LogOutIcon = ({ size = 24, color = '#FFFFFF', strokeWidth = 2, ...props }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <Path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <Polyline points="16 17 21 12 16 7" />
    <Line x1="21" y1="12" x2="9" y2="12" />
  </Svg>
);

// 🔥 Streak / Fire Icon
export const FireIcon = ({ size = 24, color = '#F59E0B', strokeWidth = 2, ...props }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <Path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
  </Svg>
);

// 👑 Crown / Premium Icon
export const CrownIcon = ({ size = 24, color = '#F59E0B', strokeWidth = 2, ...props }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <Path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z" />
    <Rect x="5" y="18" width="14" height="2" rx="1" />
  </Svg>
);

// 🔍 Search Icon
export const SearchIcon = ({ size = 24, color = '#FFFFFF', strokeWidth = 2, ...props }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <Circle cx="11" cy="11" r="8" />
    <Line x1="21" y1="21" x2="16.65" y2="16.65" />
  </Svg>
);

// 📁 Folder / Categories Icon
export const FolderIcon = ({ size = 24, color = '#FFFFFF', strokeWidth = 2, ...props }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <Path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </Svg>
);

// 🌅 Morning / Sun Icon
export const SunIcon = ({ size = 24, color = '#FFFFFF', strokeWidth = 2, ...props }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <Circle cx="12" cy="12" r="5" />
    <Line x1="12" y1="1" x2="12" y2="3" />
    <Line x1="12" y1="21" x2="12" y2="23" />
    <Line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <Line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <Line x1="1" y1="12" x2="3" y2="12" />
    <Line x1="21" y1="12" x2="23" y2="12" />
    <Line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <Line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </Svg>
);

// 🎉 Party / Festival Icon (Giftbox shape)
export const PartyIcon = ({ size = 24, color = '#FFFFFF', strokeWidth = 2, ...props }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <Polyline points="20 12 20 22 4 22 4 12" />
    <Rect x="2" y="7" width="20" height="5" />
    <Line x1="12" y1="22" x2="12" y2="7" />
    <Path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
    <Path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
  </Svg>
);

// ⬇️ Download Icon
export const DownloadIcon = ({ size = 24, color = '#FFFFFF', strokeWidth = 2, ...props }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <Path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <Polyline points="7 10 12 15 17 10" />
    <Line x1="12" y1="15" x2="12" y2="3" />
  </Svg>
);

// 🔗 Link / Share Icon
export const LinkIcon = ({ size = 24, color = '#FFFFFF', strokeWidth = 2, ...props }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <Path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <Path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </Svg>
);

// 💬 Chat / Messaging Icon
export const ChatIcon = ({ size = 24, color = '#FFFFFF', strokeWidth = 2, ...props }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <Path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </Svg>
);

// ⌚ Watch / Clock Icon
export const ClockIcon = ({ size = 24, color = '#FFFFFF', strokeWidth = 2, ...props }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <Circle cx="12" cy="12" r="10" />
    <Polyline points="12 6 12 12 16 14" />
  </Svg>
);

// 📷 Camera Icon
export const CameraIcon = ({ size = 24, color = '#FFFFFF', strokeWidth = 2, ...props }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <Path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <Circle cx="12" cy="13" r="4" />
  </Svg>
);

// 🔔 Notification Bell Icon
export const BellIcon = ({ size = 24, color = '#FFFFFF', strokeWidth = 2, ...props }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <Path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </Svg>
);

// ✓ Validation Checkmark Icon
export const CheckIcon = ({ size = 24, color = '#FFFFFF', strokeWidth = 2, ...props }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <Polyline points="20 6 9 17 4 12" />
  </Svg>
);

// → Continue Arrow Icon
export const ArrowRight = ({ size = 24, color = '#FFFFFF', strokeWidth = 2, ...props }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <Line x1="5" y1="12" x2="19" y2="12" />
    <Polyline points="12 5 19 12 12 19" />
  </Svg>
);

// ← Back Arrow Icon
export const ArrowLeft = ({ size = 24, color = '#FFFFFF', strokeWidth = 2, ...props }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <Line x1="19" y1="12" x2="5" y2="12" />
    <Polyline points="12 19 5 12 12 5" />
  </Svg>
);

// ☰ Hamburger Drawer Menu Icon
export const HamburgerIcon = ({ size = 24, color = '#FFFFFF', strokeWidth = 2, ...props }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <Line x1="3" y1="12" x2="21" y2="12" />
    <Line x1="3" y1="6" x2="21" y2="6" />
    <Line x1="3" y1="18" x2="21" y2="18" />
  </Svg>
);

// 🏪 Store / Shop Icon
export const StoreIcon = ({ size = 24, color = '#FFFFFF', strokeWidth = 2, ...props }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <Rect x="4" y="10" width="16" height="11" rx="2" ry="2" />
    <Path d="M3 10L12 3l9 7" />
    <Line x1="12" y1="21" x2="12" y2="15" />
  </Svg>
);

// ✨ Sparkles Icon
export const SparklesIcon = ({ size = 24, color = '#FFFFFF', strokeWidth = 2, ...props }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <Path d="M9.937 15.5l1.063 5.5 1.063-5.5 5.437-1.063-5.437-1.063-1.063-5.5-1.063 5.5-5.437 1.063z" />
    <Path d="M20 5l.5 2.5 2.5.5-2.5.5-.5 2.5-.5-2.5-2.5-.5 2.5-.5z" />
  </Svg>
);

// 📞 Phone Field Icon
export const PhoneIcon = ({ size = 24, color = '#FFFFFF', strokeWidth = 2, ...props }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <Path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </Svg>
);

// ✉️ Email Field Icon
export const EmailIcon = ({ size = 24, color = '#FFFFFF', strokeWidth = 2, ...props }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <Path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <Polyline points="22,6 12,13 2,6" />
  </Svg>
);

// 🏷️ Tag/Category Field Icon
export const TagIcon = ({ size = 24, color = '#FFFFFF', strokeWidth = 2, ...props }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <Path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
    <Line x1="7" y1="7" x2="7.01" y2="7" />
  </Svg>
);

// ℹ️ Info Icon
export const InfoIcon = ({ size = 24, color = '#FFFFFF', strokeWidth = 2, ...props }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <Circle cx="12" cy="12" r="10" />
    <Line x1="12" y1="16" x2="12" y2="12" />
    <Line x1="12" y1="8" x2="12.01" y2="8" />
  </Svg>
);

// ⭐ Star Icon
export const StarIcon = ({ size = 24, color = '#F59E0B', strokeWidth = 2, ...props }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <Polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </Svg>
);

// 📤 Share Out Icon
export const ShareOutIcon = ({ size = 24, color = '#FFFFFF', strokeWidth = 2, ...props }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <Path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
    <Polyline points="16 6 12 2 8 6" />
    <Line x1="12" y1="2" x2="12" y2="15" />
  </Svg>
);

// 🌙 Moon Icon
export const MoonIcon = ({ size = 24, color = '#FFFFFF', strokeWidth = 2, ...props }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <Path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </Svg>
);

// ✝️ Cross Icon
export const CrossIcon = ({ size = 24, color = '#FFFFFF', strokeWidth = 2, ...props }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <Line x1="12" y1="2" x2="12" y2="22" />
    <Line x1="7" y1="8" x2="17" y2="8" />
  </Svg>
);

// 🔖 Bookmark Icon
export const BookmarkIcon = ({ size = 24, color = '#FFFFFF', strokeWidth = 2, ...props }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <Path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </Svg>
);

// 👤 User Icon
export const UserIcon = ({ size = 24, color = '#FFFFFF', strokeWidth = 2, ...props }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <Circle cx="12" cy="7" r="4" />
  </Svg>
);

// 🔄 History Icon
export const HistoryIcon = ({ size = 24, color = '#FFFFFF', strokeWidth = 2, ...props }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <Path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <Polyline points="3 3 3 8 8 8" />
    <Polyline points="12 7 12 12 15 15" />
  </Svg>
);

// ⬆️ Arrow Up Icon
export const ArrowUpIcon = ({ size = 24, color = '#FFFFFF', strokeWidth = 2.5, ...props }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <Path d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
  </Svg>
);

// ▶️ Chevron Right Icon
export const ChevronRightIcon = ({ size = 24, color = '#666', strokeWidth = 2, ...props }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <Path d="M9 6l6 6-6 6" />
  </Svg>
);

// ↩️ Undo Icon
export const UndoIcon = ({ size = 20, color = '#9CA3AF', strokeWidth = 2, ...props }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <Path d="M3 10h10a8 8 0 0 1 8 8v2" />
    <Path d="M3 10l6 6m-6-6l6-6" />
  </Svg>
);

// ↪️ Redo Icon
export const RedoIcon = ({ size = 20, color = '#9CA3AF', strokeWidth = 2, ...props }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <Path d="M21 10H11a8 8 0 0 0-8 8v2" />
    <Path d="M21 10l-6 6m6-6l-6-6" />
  </Svg>
);

// ▼️ Chevron Down Icon
export const ChevronDownIcon = ({ size = 24, color = '#666', strokeWidth = 2, ...props }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <Path d="M6 9l6 6 6-6" />
  </Svg>
);

// ⚡ Lightning / Generate Icon
export const LightningIcon = ({ size = 18, color = '#FFFFFF', strokeWidth = 2, ...props }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <Path d="M13 10V3L4 14H11V21L20 10H13Z" />
  </Svg>
);

// 🪄 Wand / Magic Icon
export const WandIcon = ({ size = 18, color = '#5C6373', strokeWidth = 2, ...props }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <Path d="M12 3L14.5 9L21 11.5L14.5 14L12 20L9.5 14L3 11.5L9.5 9L12 3Z" />
    <Path d="M5 20L7 18" />
    <Path d="M18 5L20 7" />
  </Svg>
);

// T Text Icon
export const TextIcon = ({ size = 24, color = '#6B7280', ...props }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
    <Path d="M4 7V5H16V7H11V19H9V7H4ZM12 11H20V13H17V19H15V13H12V11Z" />
  </Svg>
);

// 📄 Sticker / Note Icon
export const StickerIcon = ({ size = 24, color = '#6B7280', strokeWidth = 2, ...props }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <Path d="M15.5 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-8.5L15.5 3Z" />
    <Path d="M15 3v6h6" />
    <Line x1="7" y1="13" x2="12" y2="13" />
    <Line x1="7" y1="17" x2="17" y2="17" />
  </Svg>
);

// 🎨 Layers / Background Icon
export const LayersIcon = ({ size = 24, color = '#6B7280', strokeWidth = 2, ...props }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <Rect x="2" y="10" width="12" height="12" rx="2" ry="2" />
    <Path d="M10 2h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-2" />
  </Svg>
);

// 🎛️ Filter / Adjust Icon
export const FilterIcon = ({ size = 24, color = '#6B7280', strokeWidth = 2, ...props }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <Path d="M15 4V2" />
    <Path d="M15 16v-2" />
    <Path d="M8 9h2" />
    <Path d="M20 9h2" />
    <Path d="M17.8 11.8 19 13" />
    <Path d="M15 9h0" />
    <Path d="M17.8 6.2 19 5" />
    <Path d="m3 21 9-9" />
    <Path d="M12.2 6.2 11 5" />
  </Svg>
);
