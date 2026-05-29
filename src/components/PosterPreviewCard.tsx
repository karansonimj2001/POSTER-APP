/**
 * White poster preview card with avatar, name, role, and footer stats.
 * Used in EditorScreen and PosterDetailScreen with 'editor' / 'detail' variants.
 */
import React from 'react'
import { View, Text, Image, StyleSheet } from 'react-native'

interface PosterPreviewCardProps {
  name?: string
  role?: string
  estYear?: string
  studioSeries?: string
  safeWorkLabel?: string
  variant?: 'detail' | 'editor'
  avatarSource?: any
}

export default function PosterPreviewCard({
  name = 'User',
  role = 'ROLE',
  estYear = 'EST. 2024',
  studioSeries = 'STUDIO SERIES',
  safeWorkLabel = 'SAFE WORK',
  variant = 'detail',
  avatarSource,
}: PosterPreviewCardProps) {
  const isDetail = variant === 'detail'

  return (
    <View style={[styles.card, isDetail ? styles.cardDetail : styles.cardEditor]}>
      <View style={isDetail ? styles.avatarSectionDetail : styles.avatarSectionEditor}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatarBorder}>
            <Image
              source={avatarSource || require('../../assets/images/user_avatar.png')}
              style={styles.avatarImage}
            />
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{safeWorkLabel}</Text>
          </View>
        </View>
      </View>

      <View style={styles.nameSection}>
        <Text style={[styles.name, isDetail ? styles.nameDetail : styles.nameEditor]}>{name}</Text>
        <Text style={[styles.role, isDetail ? styles.roleDetail : styles.roleEditor]}>{role}</Text>
      </View>

      <View style={styles.footerRow}>
        <Text style={styles.footerText}>{estYear}</Text>
        <View style={[styles.footerDot, { backgroundColor: isDetail ? '#FBBF24' : '#F59E0B' }]} />
        <Text style={styles.footerText}>{studioSeries}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 15,
  },
  cardDetail: {
    backgroundColor: '#FFFFFF',
    borderRadius: 40,
    paddingVertical: 40,
    paddingHorizontal: 24,
    marginBottom: 40,
  },
  cardEditor: {
    maxWidth: 350,
    aspectRatio: 4 / 5,
    backgroundColor: '#F8FAFF',
    borderRadius: 32,
    padding: 32,
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  avatarSectionDetail: {
    marginBottom: 16,
  },
  avatarSectionEditor: {
    marginTop: 24,
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    width: 140,
    height: 140,
  },
  avatarBorder: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  badge: {
    position: 'absolute',
    bottom: -4,
    left: '50%',
    transform: [{ translateX: -50 }],
    backgroundColor: '#4b4237',
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  nameSection: {
    alignItems: 'center',
    marginTop: 10,
  },
  name: {
    fontWeight: '900',
    letterSpacing: -0.5,
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  nameDetail: {
    color: '#0A0B14',
    fontSize: 26,
    marginBottom: 4,
  },
  nameEditor: {
    color: '#0F172A',
    fontSize: 24,
  },
  role: {
    fontWeight: '700',
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  roleDetail: {
    color: '#8B5CF6',
    fontSize: 12,
    marginBottom: 16,
  },
  roleEditor: {
    color: '#7C4DFF',
    fontSize: 12,
  },
  footerRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 4,
  },
  footerText: {
    color: '#9CA3AF',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  footerDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
})
