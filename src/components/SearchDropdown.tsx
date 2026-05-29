/**
 * Search dropdown with trending searches, history, and AI spark suggestions.
 * Used on HomeScreen.
 */
import React from 'react'
import {
  View, Text, ScrollView, TouchableOpacity, Animated, StyleSheet, Dimensions, Image,
} from 'react-native'
import { HistoryIcon, FireIcon, SparklesIcon } from './Icons'
import { useTranslation } from 'react-i18next'

const { width: screenWidth } = Dimensions.get('window')
const DROPDOWN_WIDTH = Math.min(screenWidth - 32, 418)

interface SearchDropdownProps {
  translateY: Animated.Value
  opacity: Animated.Value
  visible: boolean
  onSearchItem: (query: string) => void
  onClose: () => void
}

export default function SearchDropdown({ translateY, opacity, visible, onSearchItem, onClose }: SearchDropdownProps) {
  const { t } = useTranslation()

  const recentSearches = [
    t('searchDropdown.search1'),
    t('searchDropdown.search2'),
    t('searchDropdown.search3'),
  ]

  const trendingTags = [t('searchDropdown.trend1'), t('searchDropdown.trend2'), t('searchDropdown.trend3')]

  const categories = [
    { label: t('searchDropdown.categoryFashion'), color: '#7C3AED' },
    { label: t('searchDropdown.categoryEvents'), color: '#0D9488' },
  ]

  if (!visible) return null

  return (
    <Animated.View
      style={[
        styles.container,
        { transform: [{ translateY }], opacity },
      ]}
    >
      {/* Recent Searches */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('searchDropdown.recentSearches')}</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.clearAll}>{t('searchDropdown.clearAll')}</Text>
          </TouchableOpacity>
        </View>
        {recentSearches.map((item, idx) => (
          <TouchableOpacity
            key={idx}
            style={styles.recentItem}
            activeOpacity={0.7}
            onPress={() => onSearchItem(item)}
          >
            <HistoryIcon size={20} color="#8B5CF6" />
            <Text style={styles.recentText}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.divider} />

      {/* Trending Now */}
      <View style={styles.section}>
        <View style={styles.trendingHeader}>
          <Text style={styles.trendingTitle}>{t('searchDropdown.trendingNow')}</Text>
          <FireIcon size={16} color="#F97316" />
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tagsContent}
        >
          {trendingTags.map((tag, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.tag}
              activeOpacity={0.7}
              onPress={() => onSearchItem(tag)}
            >
              <Text style={styles.tagText}>{tag}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.divider} />

      {/* Categories */}
      <View style={styles.section}>
        <View style={styles.categoriesGrid}>
          {categories.map((cat, idx) => (
            <TouchableOpacity
              key={idx}
              style={[styles.categoryCard, { backgroundColor: cat.color }]}
              activeOpacity={0.8}
              onPress={() => onSearchItem(cat.label)}
            >
              <View style={styles.categoryOverlay}>
                <SparklesIcon size={18} color="rgba(255,255,255,0.3)" />
                <Text style={styles.categoryLabel}>{cat.label}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: DROPDOWN_WIDTH,
    backgroundColor: '#0B1326',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 30,
    elevation: 16,
    overflow: 'hidden',
    marginTop: 8,
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1.2,
    color: '#8B5CF6',
    textTransform: 'uppercase',
  },
  clearAll: {
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1.2,
    color: '#8B5CF6',
    textTransform: 'uppercase',
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 8,
  },
  recentText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  trendingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
  },
  trendingTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 1.2,
    color: '#F97316',
    textTransform: 'uppercase',
  },
  tagsContent: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 4,
  },
  tag: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#131B2E',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  tagText: {
    color: '#A78BFA',
    fontSize: 14,
    fontWeight: '600',
  },
  categoriesGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  categoryCard: {
    flex: 1,
    height: 94,
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  categoryOverlay: {
    padding: 12,
    gap: 4,
  },
  categoryLabel: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 0.8,
  },
})
