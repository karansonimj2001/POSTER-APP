/**
 * Text settings panel — font selection (with filter pills), text alignment,
 * color presets, and font size slider.
 */
import React, { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import { useTranslation } from 'react-i18next'
import SliderControl from '../SliderControl'

export default function TextPanel() {
  const { t } = useTranslation()
  const [activeSubTab, setActiveSubTab] = useState<'font' | 'text'>('font')
  const [activePill, setActivePill] = useState('All')
  const [fontSize, setFontSize] = useState(24)
  const [activeFont, setActiveFont] = useState('Roboto Light')

  const filterPills = [t('textPanel.filterAll'), t('textPanel.filterSans'), t('textPanel.filterSerif'), t('textPanel.filterHandwriting'), t('textPanel.filterHindi')]

  const fontList = [
    { name: 'Roboto Light', desc: t('textPanel.fontRobotoDesc'), locked: true },
    { name: 'Playfair Script', desc: t('textPanel.fontPlayfairDesc'), locked: false },
    { name: 'Dancing Script', desc: t('textPanel.fontDancingDesc'), locked: false },
    { name: 'Hindi Regular', desc: t('textPanel.fontHindiDesc'), locked: false },
  ]

  return (
    <View style={styles.container}>
      {/* Sub Segmented Control: Font Style / Text */}
      <View style={styles.subSegmented}>
        <TouchableOpacity
          style={[styles.subSegBtn, activeSubTab === 'font' && styles.subSegBtnActive]}
          onPress={() => setActiveSubTab('font')}
        >
          <Text style={[styles.subSegText, activeSubTab === 'font' && styles.subSegTextActive]}>{t('textPanel.fontStyle')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.subSegBtn, activeSubTab === 'text' && styles.subSegBtnActive]}
          onPress={() => setActiveSubTab('text')}
        >
          <Text style={[styles.subSegText, activeSubTab === 'text' && styles.subSegTextActive]}>{t('textPanel.text')}</Text>
        </TouchableOpacity>
      </View>

      {/* Font Size Control */}
      <View style={styles.sizeCard}>
        <View style={styles.sizeHeader}>
          <View style={styles.sizeLeft}>
            <Text style={styles.sizeLabel}>{t('textPanel.size', { size: fontSize })}</Text>
            <View style={styles.goldBadge}>
              <Text style={styles.goldText}>{t('textPanel.goldScale')}</Text>
            </View>
          </View>
          <Text style={styles.sizeIcon}>Aa</Text>
        </View>
        {/* Draggable Slider */}
        <SliderControl value={fontSize} onValueChange={setFontSize} min={12} max={72} />
        {/* Step markers */}
        <View style={styles.sliderTouchRow}>
          {Array.from({ length: 11 }).map((_, i) => {
            const val = 12 + i * 6
            const isActive = fontSize === val
            return (
              <TouchableOpacity
                key={i}
                style={[styles.sliderStep, isActive && styles.sliderStepActive]}
                onPress={() => setFontSize(val)}
              />
            )
          })}
        </View>
      </View>

      {/* Filter Pills */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillRow}>
        {filterPills.map((pill) => {
          const isActive = pill === activePill
          return (
            <TouchableOpacity
              key={pill}
              style={[styles.pill, isActive && styles.pillActive]}
              onPress={() => setActivePill(pill)}
            >
              <Text style={[styles.pillText, isActive && styles.pillTextActive]}>{pill}</Text>
            </TouchableOpacity>
          )
        })}
      </ScrollView>

      {/* Active Font Card */}
      <View style={styles.activeFontCard}>
        <View style={styles.fontCardHeader}>
          <View>
            <Text style={styles.fontName}>{t('textPanel.activeFontName', { name: activeFont })}</Text>
            <Text style={styles.fontAppliedLabel}>{t('textPanel.applied')}</Text>
          </View>
          <View style={styles.appliedBadge}>
            <Text style={styles.checkIcon}>✓</Text>
            <Text style={styles.appliedText}>{t('textPanel.applied')}</Text>
          </View>
        </View>
        <Text style={styles.fontPreview}>{t('textPanel.foxSample')}</Text>
      </View>

      {/* Font List */}
      <View style={styles.fontList}>
        {fontList.map((font, i) => (
          <TouchableOpacity key={i} style={styles.fontItem} activeOpacity={0.7} onPress={() => setActiveFont(font.name)}>
            <View>
              <Text style={styles.fontItemName}>{font.name}</Text>
              <Text style={styles.fontItemDesc}>{font.desc}</Text>
            </View>
            <Text style={styles.fontItemAction}>{font.locked ? '🔒' : '›'}</Text>
          </TouchableOpacity>
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
  subSegmented: {
    flexDirection: 'row',
    backgroundColor: '#171f33',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  subSegBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  subSegBtnActive: {
    backgroundColor: '#a078ff',
  },
  subSegText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#CBC3D7',
  },
  subSegTextActive: {
    color: '#340080',
  },
  sizeCard: {
    backgroundColor: '#171f33',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(73,68,84,0.3)',
    marginBottom: 20,
    position: 'relative',
  },
  sizeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sizeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sizeLabel: {
    color: '#DAE2FD',
    fontSize: 18,
    fontWeight: '600',
  },
  goldBadge: {
    backgroundColor: '#af8d11',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  goldText: {
    color: '#342800',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  sizeIcon: {
    color: '#CBC3D7',
    fontSize: 22,
  },
  sliderTouchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  sliderStep: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#363D4E',
    marginTop: 3,
    marginHorizontal: 3,
  },
  sliderStepActive: {
    backgroundColor: '#d0bcff',
  },
  pillRow: {
    gap: 8,
    paddingBottom: 20,
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#494454',
  },
  pillActive: {
    backgroundColor: '#a078ff',
    borderColor: '#a078ff',
  },
  pillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#CBC3D7',
  },
  pillTextActive: {
    color: '#340080',
  },
  activeFontCard: {
    backgroundColor: '#2d3449',
    borderRadius: 12,
    padding: 20,
    borderWidth: 2,
    borderColor: '#a078ff',
    marginBottom: 16,
  },
  fontCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  fontName: {
    color: '#d0bcff',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  fontAppliedLabel: {
    color: 'rgba(203,195,215,0.7)',
    fontSize: 10,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  appliedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#e9c349',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  checkIcon: {
    color: '#3c2f00',
    fontSize: 14,
    fontWeight: '700',
  },
  appliedText: {
    color: '#3c2f00',
    fontSize: 10,
    fontWeight: '700',
  },
  fontPreview: {
    color: '#DAE2FD',
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  fontList: {
    gap: 12,
  },
  fontItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#171f33',
    borderRadius: 12,
    padding: 16,
  },
  fontItemName: {
    color: '#DAE2FD',
    fontSize: 16,
    fontWeight: '500',
  },
  fontItemDesc: {
    color: '#CBC3D7',
    fontSize: 11,
    marginTop: 2,
  },
  fontItemAction: {
    fontSize: 20,
    color: '#CBC3D7',
  },
})
