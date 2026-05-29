/**
 * Download history — lists all previously downloaded posters with search,
 * clear-all, and re-download actions.
 */
import React, { useState } from 'react'
import { View, Text, TouchableOpacity, StatusBar, StyleSheet, ScrollView, TextInput, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Svg, { Path, Circle } from 'react-native-svg'
import { useAppNavigation } from '../navigation/types'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, SearchIcon } from '../components/Icons'

function BackArrow({ size = 24, color = '#FFFFFF' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <Path d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </Svg>
  )
}

function StarSvg({ size = 16, color = '#e3b341' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </Svg>
  )
}

function ChevronDownSvg({ size = 16, color = '#e3b341' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <Path d="M6 9l6 6 6-6" />
    </Svg>
  )
}

function RedownloadSvg({ size = 16, color = '#FFFFFF' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <Path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1" />
      <Path d="M8 12l4 4m0 0l4-4m-4 4V4" />
    </Svg>
  )
}

function WhatsAppSvg({ size = 16, color = '#34D399' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.445 0 .081 5.363.079 11.966c0 2.112.551 4.172 1.597 5.982L0 24l6.15-1.613a11.818 11.818 0 005.895 1.579h.005c6.604 0 11.967-5.364 11.97-11.97a11.84 11.84 0 00-3.41-8.459z" />
    </Svg>
  )
}

function ShareSvg({ size = 20, color = '#FFFFFF' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <Circle cx="18" cy="5" r="3" />
      <Circle cx="6" cy="12" r="3" />
      <Circle cx="18" cy="19" r="3" />
      <Path d="M8.59 13.51l6.83 3.98" />
      <Path d="M15.41 6.51l-6.82 3.98" />
    </Svg>
  )
}

interface DownloadItem {
  id: string
  title: string
  meta: string
  category: string
  size: string
  image: any
}

interface DownloadCardProps {
  item: DownloadItem
}

function DownloadCard({ item }: DownloadCardProps) {
  const { t } = useTranslation()
  return (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <Image source={item.image} style={styles.cardThumb} />
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardMeta}>{item.meta}</Text>
        </View>
      </View>
      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7}>
          <RedownloadSvg size={16} color="#FFFFFF" />
          <Text style={styles.actionBtnText}>{t('downloadHistory.reDownload')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, styles.whatsappBtn]} activeOpacity={0.7}>
          <WhatsAppSvg size={16} color="#34D399" />
          <Text style={[styles.actionBtnText, styles.whatsappBtnText]}>{t('downloadHistory.whatsapp')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.shareBtn} activeOpacity={0.7}>
          <ShareSvg size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const TODAY_ITEMS: DownloadItem[] = [
  { id: '1', title: 'Diwali Greeting', meta: 'Today, 10:45 AM · 2.4 MB · Festival', category: 'Festival', size: '2.4 MB', image: require('../../assets/images/business_preview_bg.png') },
  { id: '2', title: 'Weekly Standup', meta: 'Today, 08:12 AM · 1.1 MB · Business', category: 'Business', size: '1.1 MB', image: require('../../assets/images/bokeh_preview.png') },
]

const WEEK_ITEMS: DownloadItem[] = [
  { id: '3', title: 'Morning Brew Promo', meta: 'Tue, Oct 24 · 4.7 MB · Coffee', category: 'Coffee', size: '4.7 MB', image: require('../../assets/images/business_preview_bg.png') },
]

export default function DownloadHistoryScreen() {
  const { t } = useTranslation()
  const navigation = useAppNavigation()
  const [searchQuery, setSearchQuery] = useState('')

  const filteredToday = TODAY_ITEMS.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  )
  const filteredWeek = WEEK_ITEMS.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor="#0d1117" />

      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBackBtn} activeOpacity={0.7}>
          <BackArrow size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('downloadHistory.headerTitle')}</Text>
        <TouchableOpacity activeOpacity={0.7}>
          <Text style={styles.clearAllText}>{t('downloadHistory.clearAll')}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* ── Search ── */}
        <View style={styles.searchWrap}>
          <View style={styles.searchInputRow}>
            <SearchIcon size={18} color="#6B7280" />
            <TextInput
              style={styles.searchInput}
              placeholder={t('downloadHistory.searchPlaceholder')}
              placeholderTextColor="#6B7280"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* ── Sort ── */}
        <View style={styles.sortRow}>
          <TouchableOpacity style={styles.sortBtn} activeOpacity={0.7}>
            <Text style={styles.sortText}>{t('downloadHistory.sortRecent')}</Text>
            <ChevronDownSvg size={16} color="#e3b341" />
          </TouchableOpacity>
        </View>

        {/* ── Upgrade Banner ── */}
        <View style={styles.banner}>
          <View style={styles.bannerLeft}>
            <View style={styles.bannerIconWrap}>
              <StarSvg size={16} color="#e3b341" />
            </View>
            <Text style={styles.bannerText}>{t('downloadHistory.freeDownloads')}</Text>
          </View>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.bannerUpgrade}>{t('downloadHistory.upgrade')} <Text style={styles.bannerArrow}>→</Text></Text>
          </TouchableOpacity>
        </View>

        {/* ── Today ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('downloadHistory.today')}</Text>
          {filteredToday.map(item => (
            <DownloadCard key={item.id} item={item} />
          ))}
        </View>

        {/* ── This Week ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('downloadHistory.thisWeek')}</Text>
          {filteredWeek.map(item => (
            <DownloadCard key={item.id} item={item} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d1117',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },

  // ── Header ──
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(31,41,55,0.5)',
  },
  headerBackBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
    color: '#FFFFFF',
  },
  clearAllText: {
    color: '#EF4444',
    fontWeight: '500',
    fontSize: 14,
  },

  // ── Search ──
  searchWrap: {
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  searchInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(31,41,55,0.4)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    color: '#D1D5DB',
    fontSize: 14,
    padding: 0,
  },

  // ── Sort ──
  sortRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sortBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sortText: {
    color: '#e3b341',
    fontWeight: '500',
    fontSize: 14,
  },

  // ── Banner ──
  banner: {
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(227,179,65,0.3)',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(227,179,65,0.05)',
    marginBottom: 24,
  },
  bannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bannerIconWrap: {
    backgroundColor: '#e3b341',
    padding: 4,
    borderRadius: 999,
  },
  bannerText: {
    color: '#e3b341',
    fontWeight: '500',
    fontSize: 15,
  },
  bannerUpgrade: {
    color: '#e3b341',
    fontWeight: '700',
    fontSize: 14,
  },
  bannerArrow: {
    fontSize: 18,
  },

  // ── Section ──
  section: {
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  sectionTitle: {
    color: '#8b949e',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    paddingHorizontal: 8,
    marginBottom: 16,
  },

  // ── Card ──
  card: {
    backgroundColor: 'rgba(22,27,34,0.4)',
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(31,41,55,0.3)',
    marginBottom: 16,
  },
  cardTop: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  cardThumb: {
    width: 64,
    height: 64,
    borderRadius: 12,
  },
  cardInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  cardTitle: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 18,
  },
  cardMeta: {
    color: '#8b949e',
    fontSize: 11,
    marginTop: 4,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 8,
    height: 44,
  },
  actionBtn: {
    flex: 5,
    backgroundColor: 'rgba(31,41,55,0.6)',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  whatsappBtn: {
    backgroundColor: 'rgba(6,78,59,0.3)',
  },
  whatsappBtnText: {
    color: '#34D399',
  },
  shareBtn: {
    flex: 2,
    backgroundColor: 'rgba(31,41,55,0.6)',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
})