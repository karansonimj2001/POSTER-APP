/**
 * AI-generated poster result card with action buttons (bookmark, download, edit, etc.).
 * Used in PosterDetailScreen and HomeScreen AI assistant.
 */
import React from 'react'
import { View, Text, TouchableOpacity, Animated, StyleSheet, Dimensions, Image } from 'react-native'
import { useAppNavigation } from '../navigation/types'
import { SvgIcon } from './SvgIcon'
import { BookmarkIcon, SparklesIcon, DownloadIcon, PencilIcon, LinkIcon, ChatIcon } from './Icons'
import { useTranslation } from 'react-i18next'

const { width: screenWidth } = Dimensions.get('window')
const CARD_WIDTH = screenWidth * 0.88
const CARD_MAX_H = 560

interface AIResultCardProps {
  scale: Animated.Value
  opacity: Animated.Value
  backdropOpacity: Animated.Value
  queryText: string
  onClose: () => void
}

function ActionButton({ icon, label, isGreen, onPress }: { icon: React.ReactNode; label: string; isGreen?: boolean; onPress?: () => void }) {
  return (
    <TouchableOpacity style={actionStyles.col} activeOpacity={0.7} onPress={onPress}>
      <View style={[actionStyles.iconBox, isGreen && actionStyles.greenBox]}>
        {icon}
      </View>
      <Text style={[actionStyles.label, isGreen && actionStyles.greenLabel]}>{label}</Text>
    </TouchableOpacity>
  )
}

const actionStyles = StyleSheet.create({
  col: { alignItems: 'center', gap: 6 },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#7C3AED',
    justifyContent: 'center',
    alignItems: 'center',
  },
  greenBox: {
    backgroundColor: '#25D366',
    borderRadius: 24,
    width: 48,
    height: 48,
  },
  label: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#A78BFA',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  greenLabel: { color: '#25D366' },
})

export default function AIResultCard({ scale, opacity, backdropOpacity, queryText, onClose }: AIResultCardProps) {
  const { t } = useTranslation()
  const navigation = useAppNavigation()
  return (
    <>
      <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
        <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={onClose} />
      </Animated.View>

      <Animated.View style={[styles.card, { opacity, transform: [{ scale }] }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.iconBtn}>
            <SvgIcon name="cross" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('aiResultCard.title')}</Text>
          <View style={styles.iconBtn}>
            <BookmarkIcon size={18} color="#A78BFA" />
          </View>
        </View>

        {/* Poster Image - Tappable to view detail */}
        <TouchableOpacity activeOpacity={0.85} onPress={() => navigation.navigate('PosterDetail', { poster: { title: 'AI Generated' } })}>
          <View style={styles.posterWrap}>
          <View style={styles.posterPlaceholder}>
            <SparklesIcon size={40} color="rgba(167,139,250,0.3)" />
            <Text style={styles.posterPlaceholderText}>{t('aiResultCard.queryDisplay', { query: queryText })}</Text>
          </View>
          <View style={styles.badge4k}>
            <Text style={styles.badgeText}>{t('aiResultCard.renderBadge')}</Text>
          </View>
        </View>
        </TouchableOpacity>

        {/* Pro Tip */}
        <View style={styles.proTip}>
          <SparklesIcon size={12} color="#F59E0B" />
          <Text style={styles.proTipText}>
            {t('aiResultCard.proTip')}
          </Text>
        </View>

        {/* Action Footer */}
        <View style={styles.actionFooter}>
          <ActionButton icon={<DownloadIcon size={22} color="#FFFFFF" />} label={t('aiResultCard.download')} />
          <ActionButton icon={<PencilIcon size={22} color="#FFFFFF" />} label={t('aiResultCard.edit')} onPress={() => navigation.navigate('PosterEditor')} />
          <ActionButton icon={<LinkIcon size={22} color="#FFFFFF" />} label={t('aiResultCard.share')} />
          <ActionButton icon={<ChatIcon size={22} color="#FFFFFF" />} label={t('aiResultCard.whatsapp')} isGreen />
        </View>
      </Animated.View>
    </>
  )
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 60,
  },
  card: {
    position: 'absolute',
    left: (screenWidth - CARD_WIDTH) / 2,
    bottom: 120,
    width: CARD_WIDTH,
    maxHeight: CARD_MAX_H,
    backgroundColor: '#161B2E',
    borderRadius: 40,
    overflow: 'hidden',
    zIndex: 70,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 25 },
    shadowOpacity: 0.5,
    shadowRadius: 50,
    elevation: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  iconBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#C4B5FD',
    fontSize: 17,
    fontWeight: 'bold',
    letterSpacing: 0.3,
  },
  posterWrap: {
    marginHorizontal: 16,
    height: 240,
    borderRadius: 32,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#0D0F1A',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  posterPlaceholder: {
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 20,
  },
  posterPlaceholderText: {
    color: 'rgba(167,139,250,0.5)',
    fontSize: 13,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  badge4k: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 1.2,
  },
  proTip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginHorizontal: 20,
    marginTop: 14,
    marginBottom: 10,
  },
  proTipText: {
    color: '#F59E0B',
    fontSize: 10,
    fontWeight: '500',
  },
  proTipHighlight: {
    opacity: 0.7,
  },
  actionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
})
