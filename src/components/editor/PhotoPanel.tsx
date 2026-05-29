/**
 * Photo panel — upload photo area, mask shape selection, filters toggle.
 */
import React, { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Image, Switch } from 'react-native'
import { useTranslation } from 'react-i18next'

const avatarUri = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBrRnQ1aUn3utlSBT-UHx-2Gz32VCN1vl8Lncl2wBeom6jAm68R-AnyTJulwkfR2Oy04v9D0g04TS6MWVHp6TC49OdJCScLf6tjOpvndY3yiImw_aWQvMRLHUtr8ctY70kwQtdsFtjX2HnSyvjuLPi0YyVzu0HauEAFS8ijKv9OBHI1x8_lGXY3q7MqdZoP4-Bg7bqf3DScf0CWtX_uKhEZun1tLUENyTGW3Ck7vLQPaSQ8GuChZJraSMuXURZyGjJUSA_-qPXkEoc'

type MaskShape = 'circle' | 'square' | 'hexagon' | 'diamond'

export default function PhotoPanel() {
  const { t } = useTranslation()
  const [borderEnabled, setBorderEnabled] = useState(true)
  const [selectedMask, setSelectedMask] = useState<MaskShape>('circle')

  const masks: { key: MaskShape; label?: string }[] = [
    { key: 'circle' },
    { key: 'square' },
    { key: 'hexagon' },
    { key: 'diamond' },
  ]

  return (
    <View style={styles.container}>
      {/* Photo Header */}
      <View style={styles.photoHeader}>
        <View style={styles.avatarWrap}>
          <Image source={{ uri: avatarUri }} style={styles.avatar} />
        </View>
        <View style={styles.photoInfo}>
          <Text style={styles.photoTitle}>{t('photoPanel.yourPhoto')}</Text>
          <Text style={styles.photoName}>{t('photoPanel.imgName')}</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7}>
          <View style={styles.cameraIconWrap}>
            <Text style={styles.cameraIcon}>📷</Text>
          </View>
          <Text style={styles.actionBtnText}>{t('photoPanel.takePhoto')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7}>
          <View style={styles.cameraIconWrap}>
            <Text style={styles.cameraIcon}>🖼️</Text>
          </View>
          <Text style={styles.actionBtnText}>{t('photoPanel.gallery')}</Text>
        </TouchableOpacity>
      </View>

      {/* Photo Mask */}
      <View style={styles.maskSection}>
        <Text style={styles.sectionLabel}>{t('photoPanel.photoMask')}</Text>
        <View style={styles.maskRow}>
          {masks.map(({ key }) => {
            const isSelected = selectedMask === key
            return (
              <TouchableOpacity
                key={key}
                style={[styles.maskItem, isSelected && styles.maskItemSelected]}
                onPress={() => setSelectedMask(key)}
              >
                <View style={[
                  styles.maskInner,
                  key === 'circle' && styles.maskCircle,
                  key === 'hexagon' && styles.maskHexagon,
                  key === 'diamond' && styles.maskDiamond,
                  isSelected && styles.maskInnerSelected,
                ]} />
              </TouchableOpacity>
            )
          })}
        </View>
      </View>

      {/* Border Toggle */}
      <View style={styles.borderRow}>
        <View style={styles.borderLeft}>
          <View style={styles.borderIconBox}>
            <View style={styles.borderIconInner} />
          </View>
          <Text style={styles.borderLabel}>{t('photoPanel.borderStyle')}</Text>
        </View>
        <Switch
          value={borderEnabled}
          onValueChange={setBorderEnabled}
          trackColor={{ false: '#334155', true: '#4B5563' }}
          thumbColor={borderEnabled ? '#94A3B8' : '#64748B'}
        />
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
  photoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#8b5cf6',
    padding: 4,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 28,
    backgroundColor: '#374151',
  },
  photoInfo: {
    marginLeft: 16,
  },
  photoTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  photoName: {
    color: '#64748B',
    fontSize: 14,
    marginTop: 2,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: '#1e2638',
    borderRadius: 16,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  cameraIconWrap: {},
  cameraIcon: {
    fontSize: 24,
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
  },
  maskSection: {
    marginBottom: 24,
  },
  sectionLabel: {
    color: '#64748B',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 16,
  },
  maskRow: {
    flexDirection: 'row',
    gap: 16,
  },
  maskItem: {
    width: 44,
    height: 44,
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  maskItemSelected: {
    backgroundColor: '#8b5cf6',
    borderColor: '#8b5cf6',
  },
  maskInner: {
    width: 16,
    height: 16,
    borderWidth: 2,
    borderColor: '#64748B',
    borderRadius: 2,
  },
  maskCircle: {
    borderRadius: 8,
  },
  maskHexagon: {
    width: 20,
    height: 20,
    backgroundColor: '#64748B',
    borderWidth: 0,
    transform: [{ rotate: '30deg' }],
  },
  maskDiamond: {
    transform: [{ rotate: '45deg' }],
  },
  maskInnerSelected: {
    borderColor: '#FFFFFF',
    backgroundColor: 'transparent',
  },
  borderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  borderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  borderIconBox: {
    width: 16,
    height: 16,
    backgroundColor: '#8b5cf6',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  borderIconInner: {
    width: 8,
    height: 8,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  borderLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
})
