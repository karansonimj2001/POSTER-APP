/**
 * Photo filter panel — scrollable filter thumbnails + intensity slider.
 */
import React, { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native'
import SliderControl from '../SliderControl'
import { useTranslation } from 'react-i18next'

const thumbSrc = 'https://lh3.googleusercontent.com/aida-public/AB6AXuABYL5KAL2Wq_8jOxbxT9qL-OZiXrpSwIhwUWo1ggynBZ725bVpGtI1QCfJyEMKtJfBPnKQHvCIC1x1xDvWQI7229WNJ9afmE1JA5WPprneNqF9P-9Qquv4nG61jrtqWV4c19boAorvodwYzP-mDsmMJvrJPxpFk-mlSGKjBkHOhBRWNj_svVYh_1BdWc_ReFUcJlQ25fY7pFAylbVghcWkHYJHNFmVePkHXuME0KcM7qsIZwVsdK7qvvJKvd-JY5co-bdAouJZVig'

export default function FilterPanel() {
  const { t } = useTranslation()
  const [activeFilterTab, setActiveFilterTab] = useState<'effect' | 'opacity'>('effect')
  const [opacityValue, setOpacityValue] = useState(100)

  return (
    <View style={styles.container}>
      {/* Segmented Control */}
      <View style={styles.segmented}>
        <TouchableOpacity
          style={[styles.segBtn, activeFilterTab === 'effect' && styles.segBtnActive]}
          onPress={() => setActiveFilterTab('effect')}
        >
          <Text style={[styles.segText, activeFilterTab === 'effect' && styles.segTextActive]}>{t('filterPanel.effect')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.segBtn, activeFilterTab === 'opacity' && styles.segBtnActive]}
          onPress={() => setActiveFilterTab('opacity')}
        >
          <Text style={[styles.segText, activeFilterTab === 'opacity' && styles.segTextActive]}>{t('filterPanel.opacity')}</Text>
        </TouchableOpacity>
      </View>

      {activeFilterTab === 'effect' ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.thumbRow}>
          {Array.from({ length: 6 }).map((_, i) => (
            <View key={i} style={styles.thumbItem}>
              <Image source={{ uri: thumbSrc }} style={styles.thumb} />
            </View>
          ))}
        </ScrollView>
      ) : (
        <View style={styles.sliderSection}>
          <SliderControl value={opacityValue} onValueChange={setOpacityValue} />
          <Text style={styles.valueLabel}>{t('filterPanel.opacityValue', { value: opacityValue })}</Text>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    width: '100%',
  },
  segmented: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    padding: 4,
    marginBottom: 16,
  },
  segBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  segBtnActive: {
    backgroundColor: '#8b5cf6',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  segText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#D1D5DB',
  },
  segTextActive: {
    color: '#FFFFFF',
  },
  thumbRow: {
    gap: 8,
    paddingHorizontal: 4,
  },
  thumbItem: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  thumb: {
    width: 48,
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  sliderSection: {
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  valueLabel: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
})
