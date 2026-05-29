/**
 * Reusable template card with bookmark, action bar, optional animated entrance.
 * Used in AllTemplatesScreen and TemplatesScreen.
 */
import React, { useRef, useEffect } from 'react'
import { View, Text, TouchableOpacity, Animated, Dimensions, StyleSheet } from 'react-native'
import BookmarkButton from './BookmarkButton'
import ActionButtonBar from './ActionButtonBar'

const { width: SCREEN_W } = Dimensions.get('window')
const CARD_W = (SCREEN_W - 16 * 2 - 12) / 2

export interface TemplateCardData {
  id: string
  title: string
  category: string
}

interface TemplateCardProps {
  item: TemplateCardData
  index?: number
  isBookmarked?: boolean
  onPress?: () => void
  onBookmark?: () => void
  onDownload?: () => void
  onEdit?: () => void
  onShare?: () => void
  onWhatsApp?: () => void
  actionLabels?: {
    download?: string
    edit?: string
    share?: string
    whatsapp?: string
  }
  height?: number
  bookmarkVariant?: 'default' | 'white' | 'highlight'
  background?: React.ReactNode
  badge?: React.ReactNode
  overlayContent?: React.ReactNode
  bottomContent?: React.ReactNode
  showActionBar?: boolean
  animated?: boolean
}

export default function TemplateCard({
  item,
  index = 0,
  isBookmarked,
  onPress,
  onBookmark,
  onDownload,
  onEdit,
  onShare,
  onWhatsApp,
  actionLabels,
  height,
  bookmarkVariant,
  background,
  badge,
  overlayContent,
  bottomContent,
  showActionBar = true,
  animated = true,
}: TemplateCardProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(20)).current

  useEffect(() => {
    if (animated) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          delay: index * 60,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          delay: index * 60,
          useNativeDriver: true,
        }),
      ]).start()
    } else {
      fadeAnim.setValue(1)
      slideAnim.setValue(0)
    }
  }, [])

  const cardContent = (
    <TouchableOpacity activeOpacity={0.85} style={styles.touchable} onPress={onPress}>
      <View style={[styles.imageBox, height ? { height } : undefined]}>
        {background}

        {badge}

        <View style={styles.bookmarkWrapper}>
          <BookmarkButton
            active={isBookmarked}
            onPress={onBookmark}
            variant={bookmarkVariant}
          />
        </View>

        {overlayContent ?? (
          <View style={styles.textOverlay}>
            <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
            <Text style={styles.category}>{item.category.toUpperCase()}</Text>
          </View>
        )}

        {showActionBar && (
          <ActionButtonBar
            onDownload={onDownload}
            onEdit={onEdit}
            onShare={onShare}
            onWhatsApp={onWhatsApp}
            labels={actionLabels}
          />
        )}
      </View>
    </TouchableOpacity>
  )

  if (animated) {
    return (
      <Animated.View style={[styles.outer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        {cardContent}
        {bottomContent}
      </Animated.View>
    )
  }

  return (
    <View style={styles.outer}>
      {cardContent}
      {bottomContent}
    </View>
  )
}

const styles = StyleSheet.create({
  outer: {
    marginBottom: 14,
  },
  touchable: {
    flex: 1,
  },
  imageBox: {
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#111220',
    position: 'relative',
  },
  bookmarkWrapper: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
  },
  textOverlay: {
    position: 'absolute',
    bottom: 56,
    left: 14,
    right: 14,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  category: {
    color: '#8E8FCA',
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginTop: 2,
  },
})
