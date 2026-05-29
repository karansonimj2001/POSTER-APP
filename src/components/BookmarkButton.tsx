/**
 * Custom bookmark/flag icon toggle button. Used inside TemplateCard.
 */
import React from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native'

interface BookmarkButtonProps {
  active?: boolean
  onPress?: () => void
  size?: number
  variant?: 'default' | 'white' | 'highlight'
  style?: any
}

export default function BookmarkButton({ active, onPress, size = 28, variant = 'default', style }: BookmarkButtonProps) {
  const btnSize = variant === 'highlight' ? 32 : size
  const btnRadius = btnSize / 2

  return (
    <TouchableOpacity
      style={[
        styles.btn,
        {
          width: btnSize,
          height: btnSize,
          borderRadius: btnRadius,
          backgroundColor: variant === 'highlight' ? 'rgba(0,0,0,0.25)' : 'rgba(0,0,0,0.3)',
        },
        style,
      ]}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <View style={styles.bookmarkOuter}>
        <View style={[styles.bookmarkBody, variant === 'white' && styles.bookmarkBodyWhite, active && (variant === 'white' ? styles.bookmarkActiveYellow : styles.bookmarkActiveFilled)]} />
        <View style={[styles.bookmarkCutout, variant === 'white' && { borderBottomColor: '#20213E' }]} />
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  btn: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  bookmarkOuter: {
    width: 12,
    height: 16,
    position: 'relative',
  },
  bookmarkBody: {
    width: 12,
    height: 13,
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    borderTopLeftRadius: 1.5,
    borderTopRightRadius: 1.5,
  },
  bookmarkBodyWhite: {
    backgroundColor: '#FFFFFF',
    borderWidth: 0,
  },
  bookmarkActiveFilled: {
    backgroundColor: '#FFFFFF',
    borderWidth: 0,
  },
  bookmarkActiveYellow: {
    backgroundColor: '#F59E0B',
    borderWidth: 0,
  },
  bookmarkCutout: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderBottomWidth: 5,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'rgba(0,0,0,0.3)',
  },
})
