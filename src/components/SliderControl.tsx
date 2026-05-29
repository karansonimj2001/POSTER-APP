/**
 * Draggable slider control — used by BackgroundPanel, FilterPanel, and TextPanel.
 * Fully functional: tap or drag to change value.
 */
import React, { useRef, useCallback, useState } from 'react'
import { View, StyleSheet, LayoutChangeEvent } from 'react-native'

interface SliderControlProps {
  value: number
  onValueChange: (v: number) => void
  min?: number
  max?: number
}

export default function SliderControl({ value, onValueChange, min = 0, max = 100 }: SliderControlProps) {
  const trackRef = useRef<View>(null)
  const trackLeftRef = useRef(0)
  const trackWidthRef = useRef(0)
  const [dragging, setDragging] = useState(false)

  const onLayout = useCallback((e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width
    if (w > 0) trackWidthRef.current = w
    // Measure absolute position on screen for accurate touch calculation
    trackRef.current?.measureInWindow((x) => {
      trackLeftRef.current = x
    })
  }, [])

  const getValueFromPageX = useCallback((pageX: number) => {
    const w = trackWidthRef.current
    if (w <= 0) return value
    const locX = pageX - trackLeftRef.current
    const pct = Math.max(0, Math.min(100, (locX / w) * 100))
    return Math.round(min + (pct / 100) * (max - min))
  }, [min, max, value])

  const handleTouch = useCallback((pageX: number) => {
    onValueChange(getValueFromPageX(pageX))
  }, [onValueChange, getValueFromPageX])

  const pct = ((value - min) / (max - min)) * 100
  const thumbSize = 20

  return (
    <View style={styles.wrapper}
      onStartShouldSetResponder={() => true}
      onMoveShouldSetResponder={() => true}
      onResponderGrant={(e) => {
        setDragging(true)
        handleTouch(e.nativeEvent.pageX)
      }}
      onResponderMove={(e) => {
        handleTouch(e.nativeEvent.pageX)
      }}
      onResponderRelease={() => setDragging(false)}
      onResponderTerminate={() => setDragging(false)}
    >
      <View
        ref={trackRef}
        style={styles.track}
        onLayout={onLayout}
      >
        <View style={[styles.trackFill, { width: `${pct}%` as any }]} />
        <View
          style={[
            styles.thumb,
            { left: `${pct}%` as any, marginLeft: -thumbSize / 2 },
            dragging && styles.thumbDragging,
          ]}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    paddingVertical: 24,
    paddingHorizontal: 8,
  },
  track: {
    width: '100%',
    height: 4,
    backgroundColor: '#363D4E',
    borderRadius: 2,
    position: 'relative',
    justifyContent: 'center',
  },
  trackFill: {
    height: 4,
    backgroundColor: '#d0bcff',
    borderRadius: 2,
    position: 'absolute',
    left: 0,
    top: 0,
  },
  thumb: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 4,
    borderColor: '#7E42F5',
    shadowColor: '#7E42F5',
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
    top: -8,
  },
  thumbDragging: {
    shadowOpacity: 0.7,
    shadowRadius: 14,
    elevation: 10,
  },
})
