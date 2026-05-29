/**
 * Stickers/emoji panel — search and select from recent and popular emojis.
 */
import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import { useTranslation } from 'react-i18next'

const recentEmojis = ['🌸', '🎉', '⭐', '🔥', '💫', '✨']
const popularEmojis = [
  ['🌸', '🎊', '⭐', '🔥'],
  ['💫', '✨', '🎈', '🌺'],
]

export default function StickersPanel() {
  const { t } = useTranslation()
  const [activeCategory, setActiveCategory] = useState('All')

  const categories = [t('stickersPanel.categoryAll'), t('stickersPanel.categoryEmoji'), t('stickersPanel.categoryFrames'), t('stickersPanel.categoryFlowers'), t('stickersPanel.categoryStars')]

  return (
    <View style={styles.container}>
      {/* Search */}
      <View style={styles.searchWrap}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder={t('stickersPanel.searchPlaceholder')}
          placeholderTextColor="#64748B"
        />
      </View>

      {/* Category Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catRow}>
        {categories.map((cat) => {
          const isActive = cat === activeCategory
          return (
            <TouchableOpacity
              key={cat}
              style={[styles.catPill, isActive && styles.catPillActive]}
              onPress={() => setActiveCategory(cat)}
            >
              <Text style={[styles.catText, isActive && styles.catTextActive]}>{cat}</Text>
            </TouchableOpacity>
          )
        })}
      </ScrollView>

      {/* Recent */}
      <Text style={styles.sectionLabel}>{t('stickersPanel.recent')}</Text>
      <View style={styles.recentRow}>
        {recentEmojis.map((emoji, i) => (
          <Text key={i} style={styles.emoji}>{emoji}</Text>
        ))}
      </View>

      {/* Popular */}
      <Text style={styles.sectionLabel}>{t('stickersPanel.popular')}</Text>
      <View style={styles.popularGrid}>
        {popularEmojis.map((row, ri) => (
          <View key={ri} style={styles.popularRow}>
            {row.map((emoji, ci) => {
              const locked = (ri === 0 && ci === 2) || (ri === 1 && ci === 1)
              return (
                <View key={ci} style={styles.stickerCard}>
                  {locked ? (
                    <View>
                      <Text style={[styles.emoji, { opacity: 0.6 }]}>{emoji}</Text>
                      <View style={styles.lockOverlay}>
                        <Text style={styles.lockIcon}>🔒</Text>
                      </View>
                    </View>
                  ) : (
                    <Text style={styles.emoji}>{emoji}</Text>
                  )}
                </View>
              )
            })}
          </View>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    width: '100%',
    borderRadius: 24,
    padding: 16,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#131b2e',
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 16,
    color: '#CBD5E1',
    fontSize: 14,
  },
  catRow: {
    gap: 12,
    paddingBottom: 24,
  },
  catPill: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#334155',
  },
  catPillActive: {
    backgroundColor: 'rgba(139,92,246,0.2)',
    borderColor: '#8b5cf6',
  },
  catText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#94A3B8',
  },
  catTextActive: {
    color: '#8b5cf6',
  },
  sectionLabel: {
    color: '#64748B',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 16,
  },
  recentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 16,
    marginBottom: 32,
  },
  emoji: {
    fontSize: 28,
  },
  popularGrid: {
    gap: 16,
  },
  popularRow: {
    flexDirection: 'row',
    gap: 16,
  },
  stickerCard: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: '#1c2539',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockOverlay: {
    position: 'absolute',
    bottom: '25%',
    right: '25%',
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 4,
    padding: 2,
  },
  lockIcon: {
    fontSize: 8,
  },
})
