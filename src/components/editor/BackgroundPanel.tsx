/**
 * Background settings — blur, opacity sliders and color picker options.
 */
import React, { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import SliderControl from '../SliderControl'
import { useTranslation } from 'react-i18next'

export default function BackgroundPanel() {
  const { t } = useTranslation()
  const [subTab, setSubTab] = useState<'blur' | 'opacity' | 'choose'>('opacity')
  const [blurValue, setBlurValue] = useState(10)
  const [opacityValue, setOpacityValue] = useState(15)

  return (
    <View style={styles.container}>
      <View style={styles.segmented}>
        <TouchableOpacity
          style={[styles.segBtn, subTab === 'blur' && styles.segBtnActive]}
          onPress={() => setSubTab('blur')}
        >
          <Text style={[styles.segText, subTab === 'blur' && styles.segTextActive]}>{t('backgroundPanel.blur')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.segBtn, subTab === 'opacity' && styles.segBtnActive]}
          onPress={() => setSubTab('opacity')}
        >
          <Text style={[styles.segText, subTab === 'opacity' && styles.segTextActive]}>{t('backgroundPanel.opacity')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.segBtn, subTab === 'choose' && styles.segBtnActive]}
          onPress={() => setSubTab('choose')}
        >
          <Text style={[styles.segText, subTab === 'choose' && styles.segTextActive]}>{t('backgroundPanel.choose')}</Text>
        </TouchableOpacity>
      </View>

      {subTab === 'blur' && (
        <View style={styles.sliderSection}>
          <SliderControl value={blurValue} onValueChange={setBlurValue} />
          <Text style={styles.valueLabel}>{t('backgroundPanel.blurValue', { value: blurValue })}</Text>
        </View>
      )}

      {subTab === 'opacity' && (
        <View style={styles.sliderSection}>
          <SliderControl value={opacityValue} onValueChange={setOpacityValue} />
          <Text style={styles.valueLabel}>{t('backgroundPanel.opacityValue', { value: opacityValue })}</Text>
        </View>
      )}

      {subTab === 'choose' && (
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.galleryBtn} activeOpacity={0.8}>
            <Text style={styles.actionBtnText}>{t('backgroundPanel.gallery')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cameraBtn} activeOpacity={0.8}>
            <Text style={styles.actionBtnText}>{t('backgroundPanel.camera')}</Text>
          </TouchableOpacity>
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
    paddingVertical: 10,
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
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    paddingTop: 8,
  },
  galleryBtn: {
    flex: 1,
    backgroundColor: '#8b5cf6',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraBtn: {
    flex: 1,
    backgroundColor: '#8b5cf6',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
})
