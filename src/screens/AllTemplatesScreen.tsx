/**
 * All templates gallery — searchable, filterable grid with category tabs.
 * Each template card shows download/edit/share/whatsapp actions.
 */
import React, { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StatusBar,
  Animated,
  Alert,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRoute } from '@react-navigation/native'
import type { RouteProp } from '@react-navigation/native'
import { useAppNavigation, type RootStackParamList } from '../navigation/types'
import { ArrowLeft, SearchIcon } from '../components/Icons'
import TemplateCard from '../components/TemplateCard'
import Svg, { Path, Circle, Defs, RadialGradient, Stop, Rect, Ellipse, LinearGradient } from 'react-native-svg'

// ─── Category data ────────────────────────────────────────────────────────────

type Category = 'All' | 'Festival' | 'Morning' | 'Quotes' | 'Business' | 'Premium'

const CATEGORIES: Category[] = ['All', 'Festival', 'Morning', 'Quotes', 'Business', 'Premium']

// ─── Template card visuals (SVG-drawn backgrounds, no external images) ─────────

function CosmicGlowCard() {
  return (
    <Svg width="100%" height="100%" viewBox="0 0 180 220">
      <Defs>
        <RadialGradient id="cg1" cx="40%" cy="50%" r="60%">
          <Stop offset="0%" stopColor="#A855F7" stopOpacity="0.9" />
          <Stop offset="100%" stopColor="#1E0038" stopOpacity="1" />
        </RadialGradient>
        <RadialGradient id="cg2" cx="70%" cy="40%" r="50%">
          <Stop offset="0%" stopColor="#06B6D4" stopOpacity="0.8" />
          <Stop offset="100%" stopColor="#0A0A14" stopOpacity="0" />
        </RadialGradient>
      </Defs>
      <Rect width="180" height="220" fill="#0D0520" />
      <Ellipse cx="72" cy="110" rx="90" ry="90" fill="url(#cg1)" />
      <Ellipse cx="126" cy="80" rx="70" ry="70" fill="url(#cg2)" />
      {/* Stars */}
      {[
        [20,30],[140,50],[60,160],[160,190],[90,20],[30,200],[155,130],
      ].map(([x, y], i) => (
        <Circle key={i} cx={x} cy={y} r={1.5} fill="#FFFFFF" opacity={0.8} />
      ))}
      {/* Nebula streaks */}
      <Path d="M20 100 Q90 60 160 120" stroke="#C084FC" strokeWidth="1.5" fill="none" opacity="0.5" />
      <Path d="M10 150 Q80 90 170 160" stroke="#67E8F9" strokeWidth="1" fill="none" opacity="0.4" />
    </Svg>
  )
}

function MinimalistMorningCard() {
  return (
    <Svg width="100%" height="100%" viewBox="0 0 180 220">
      <Defs>
        <RadialGradient id="mm1" cx="50%" cy="60%" r="60%">
          <Stop offset="0%" stopColor="#C084FC" stopOpacity="0.4" />
          <Stop offset="100%" stopColor="#7B3FAD" stopOpacity="1" />
        </RadialGradient>
      </Defs>
      <Rect width="180" height="220" fill="url(#mm1)" />
      {/* Large sphere */}
      <Circle cx="90" cy="130" r="52" fill="#C4B5D8" opacity="0.9" />
      <Circle cx="90" cy="130" r="38" fill="#D8C9E8" opacity="0.9" />
      {/* Small sphere cluster */}
      <Circle cx="50" cy="170" r="22" fill="#B89FCF" opacity="0.85" />
      <Circle cx="38" cy="155" r="14" fill="#9F82BE" opacity="0.8" />
      <Circle cx="140" cy="168" r="18" fill="#C4B5D8" opacity="0.75" />
      {/* Cylinder top */}
      <Ellipse cx="90" cy="58" rx="18" ry="28" fill="#BBA8D4" opacity="0.9" />
      <Ellipse cx="90" cy="58" rx="14" ry="22" fill="#D1C2E0" opacity="0.85" />
    </Svg>
  )
}

function GoldenAnniversaryCard() {
  return (
    <Svg width="100%" height="100%" viewBox="0 0 180 220">
      <Defs>
        <RadialGradient id="ga1" cx="50%" cy="70%" r="70%">
          <Stop offset="0%" stopColor="#D97706" stopOpacity="0.9" />
          <Stop offset="100%" stopColor="#0A0A14" stopOpacity="1" />
        </RadialGradient>
        <LinearGradient id="ga2" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#F59E0B" stopOpacity="0.6" />
          <Stop offset="100%" stopColor="#92400E" stopOpacity="0.2" />
        </LinearGradient>
      </Defs>
      <Rect width="180" height="220" fill="#0A0705" />
      {/* Particle light streak */}
      <Path d="M0 180 Q90 80 180 200" stroke="#F59E0B" strokeWidth="60" fill="none" opacity="0.08" />
      <Path d="M10 200 Q90 100 170 210" stroke="#FCD34D" strokeWidth="2" fill="none" opacity="0.5" />
      <Path d="M5 195 Q90 90 175 205" stroke="#FDE68A" strokeWidth="1" fill="none" opacity="0.4" />
      {/* Golden orb */}
      <Circle cx="90" cy="160" r="70" fill="url(#ga1)" opacity="0.7" />
      <Circle cx="90" cy="160" r="30" fill="#F59E0B" opacity="0.25" />
      {/* Sparkle dots */}
      {[[30,40],[150,60],[20,140],[165,100],[90,25]].map(([x,y],i)=>(
        <Circle key={i} cx={x} cy={y} r={1.5} fill="#FDE68A" opacity={0.9} />
      ))}
    </Svg>
  )
}

function NatureSerenityCard() {
  return (
    <Svg width="100%" height="100%" viewBox="0 0 180 220">
      <Defs>
        <LinearGradient id="ns1" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#7C3AED" stopOpacity="1" />
          <Stop offset="40%" stopColor="#DB2777" stopOpacity="0.9" />
          <Stop offset="100%" stopColor="#1E3A5F" stopOpacity="1" />
        </LinearGradient>
        <LinearGradient id="ns2" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#1E3A5F" stopOpacity="1" />
          <Stop offset="100%" stopColor="#0D1B2A" stopOpacity="1" />
        </LinearGradient>
      </Defs>
      <Rect width="180" height="220" fill="url(#ns1)" />
      {/* Mountain silhouette */}
      <Path d="M0 150 L50 80 L90 120 L130 60 L180 140 L180 220 L0 220 Z" fill="url(#ns2)" />
      <Path d="M0 180 L40 140 L70 160 L110 120 L150 155 L180 135 L180 220 L0 220 Z" fill="#0D1520" />
      {/* Lake reflection — lighter strip */}
      <Rect x="0" y="155" width="180" height="65" fill="#0D2040" opacity="0.85" />
      {/* Reflection shimmer lines */}
      {[165,175,185].map((y,i)=>(
        <Path key={i} d={`M20 ${y} Q90 ${y-4} 160 ${y}`} stroke="#7C3AED" strokeWidth="0.8" fill="none" opacity="0.4" />
      ))}
    </Svg>
  )
}

function AuroraDawnCard() {
  return (
    <Svg width="100%" height="100%" viewBox="0 0 180 220">
      <Defs>
        <LinearGradient id="ad1" x1="0%" y1="100%" x2="100%" y2="0%">
          <Stop offset="0%" stopColor="#6D28D9" stopOpacity="1" />
          <Stop offset="50%" stopColor="#DB2777" stopOpacity="0.9" />
          <Stop offset="100%" stopColor="#F59E0B" stopOpacity="0.8" />
        </LinearGradient>
      </Defs>
      <Rect width="180" height="220" fill="url(#ad1)" />
      <Path d="M0 100 Q60 60 120 110 Q160 140 180 80" stroke="#FDE68A" strokeWidth="1" fill="none" opacity="0.5" />
      <Path d="M0 130 Q80 90 180 120" stroke="#F9A8D4" strokeWidth="0.8" fill="none" opacity="0.4" />
    </Svg>
  )
}

function UrbanNightCard() {
  return (
    <Svg width="100%" height="100%" viewBox="0 0 180 220">
      <Defs>
        <LinearGradient id="un1" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#0F172A" stopOpacity="1" />
          <Stop offset="100%" stopColor="#1E1B4B" stopOpacity="1" />
        </LinearGradient>
      </Defs>
      <Rect width="180" height="220" fill="url(#un1)" />
      {/* Building silhouettes */}
      <Rect x="5" y="80" width="30" height="140" fill="#1E293B" />
      <Rect x="10" y="60" width="20" height="160" fill="#1E293B" />
      <Rect x="40" y="100" width="25" height="120" fill="#1E293B" />
      <Rect x="70" y="70" width="35" height="150" fill="#0F172A" />
      <Rect x="110" y="90" width="28" height="130" fill="#1E293B" />
      <Rect x="145" y="55" width="35" height="165" fill="#0F172A" />
      {/* Window lights */}
      {[[15,90],[15,110],[15,130],[50,110],[50,130],[80,80],[80,100],[80,120],[115,100],[115,120],[150,65],[150,85]].map(([x,y],i)=>(
        <Rect key={i} x={x} y={y} width={6} height={4} fill="#F59E0B" opacity={0.7} rx={1} />
      ))}
      {/* Neon glow line */}
      <Path d="M0 200 Q90 185 180 200" stroke="#8B5CF6" strokeWidth="1.5" fill="none" opacity="0.6" />
    </Svg>
  )
}

function SakuraSpringCard() {
  return (
    <Svg width="100%" height="100%" viewBox="0 0 180 220">
      <Defs>
        <LinearGradient id="ss1" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#FDF2F8" stopOpacity="1" />
          <Stop offset="100%" stopColor="#FBCFE8" stopOpacity="1" />
        </LinearGradient>
      </Defs>
      <Rect width="180" height="220" fill="url(#ss1)" />
      {/* Branch */}
      <Path d="M20 220 Q60 180 90 120 Q110 80 130 40" stroke="#7B3535" strokeWidth="3" fill="none" />
      <Path d="M90 120 Q120 100 150 90" stroke="#7B3535" strokeWidth="2" fill="none" />
      <Path d="M70 150 Q50 130 30 120" stroke="#7B3535" strokeWidth="1.5" fill="none" />
      {/* Blossom petals */}
      {[
        [130,42,10],[118,55,9],[140,60,8],[125,35,7],[108,45,9],
        [150,88,8],[145,75,10],[160,100,7],
        [30,122,8],[20,112,9],[38,110,7],
      ].map(([x,y,r],i)=>(
        <Circle key={i} cx={x} cy={y} r={r} fill="#F9A8D4" opacity={0.85} />
      ))}
      {/* Center dots */}
      {[[130,42],[118,55],[150,88]].map(([x,y],i)=>(
        <Circle key={i} cx={x} cy={y} r={3} fill="#F472B6" opacity={0.9} />
      ))}
    </Svg>
  )
}

function CyberWaveCard() {
  return (
    <Svg width="100%" height="100%" viewBox="0 0 180 220">
      <Defs>
        <LinearGradient id="cw1" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#0F172A" stopOpacity="1" />
          <Stop offset="100%" stopColor="#065F46" stopOpacity="1" />
        </LinearGradient>
      </Defs>
      <Rect width="180" height="220" fill="url(#cw1)" />
      {/* Grid lines */}
      {[30,60,90,120,150,180].map((x,i)=>(
        <Path key={`v${i}`} d={`M${x} 0 L${x-40} 220`} stroke="#10B981" strokeWidth="0.5" opacity="0.2" />
      ))}
      {[40,80,120,160,200].map((y,i)=>(
        <Path key={`h${i}`} d={`M0 ${y} L180 ${y-20}`} stroke="#10B981" strokeWidth="0.5" opacity="0.2" />
      ))}
      {/* Glowing wave */}
      <Path d="M0 140 Q45 100 90 140 Q135 180 180 140" stroke="#10B981" strokeWidth="2.5" fill="none" opacity="0.9" />
      <Path d="M0 150 Q45 110 90 150 Q135 190 180 150" stroke="#34D399" strokeWidth="1" fill="none" opacity="0.5" />
      {/* Data points */}
      {[[0,140],[45,108],[90,140],[135,172],[180,140]].map(([x,y],i)=>(
        <Circle key={i} cx={x} cy={y} r={4} fill="#10B981" opacity={0.9} />
      ))}
    </Svg>
  )
}

// ─── All templates data ───────────────────────────────────────────────────────

interface TemplateData {
  id: string
  title: string
  category: Category
  CardGraphic: React.FC
  height: number
}

const ALL_TEMPLATES: TemplateData[] = [
  { id: '1', title: 'Cosmic Glow Festival',   category: 'Festival',  CardGraphic: CosmicGlowCard,       height: 210 },
  { id: '2', title: 'Minimalist Morning',      category: 'Morning',   CardGraphic: MinimalistMorningCard, height: 210 },
  { id: '3', title: 'Golden Anniversary',      category: 'Premium',   CardGraphic: GoldenAnniversaryCard, height: 210 },
  { id: '4', title: 'Nature Serenity',         category: 'Quotes',    CardGraphic: NatureSerenityCard,    height: 210 },
  { id: '5', title: 'Aurora Dawn',             category: 'Morning',   CardGraphic: AuroraDawnCard,        height: 210 },
  { id: '6', title: 'Urban Night Vibes',       category: 'Business',  CardGraphic: UrbanNightCard,        height: 210 },
  { id: '7', title: 'Sakura Spring',           category: 'Festival',  CardGraphic: SakuraSpringCard,      height: 210 },
  { id: '8', title: 'Cyber Wave',              category: 'Business',  CardGraphic: CyberWaveCard,         height: 210 },
]



// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function AllTemplatesScreen() {
  const { t } = useTranslation()
  const navigation = useAppNavigation()
  const route = useRoute<RouteProp<RootStackParamList, 'AllTemplates'>>()

  const [activeCategory, setActiveCategory] = useState<Category>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([])

  const categoryLabels: Record<string, string> = {
    All: t('allTemplates.categoryAll'),
    Festival: t('allTemplates.categoryFestival'),
    Morning: t('allTemplates.categoryMorning'),
    Quotes: t('allTemplates.categoryQuotes'),
    Business: t('allTemplates.categoryBusiness'),
    Premium: t('allTemplates.categoryPremium'),
  }

  const toggleBookmark = (id: string) => {
    if (bookmarkedIds.includes(id)) {
      setBookmarkedIds(bookmarkedIds.filter(item => item !== id))
    } else {
      setBookmarkedIds([...bookmarkedIds, id])
    }
  }

  const handleAction = (action: string, title: string) => {
    Alert.alert(action, t('allTemplates.alertSuccess', { title, action: action.toLowerCase() }))
  }

  const headerFade = useRef(new Animated.Value(0)).current
  const headerSlide = useRef(new Animated.Value(-10)).current

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerFade, { toValue: 1, duration: 350, useNativeDriver: true }),
      Animated.timing(headerSlide, { toValue: 0, duration: 350, useNativeDriver: true }),
    ]).start()
  }, [])

  const filtered = ALL_TEMPLATES.filter(t => {
    const matchesCategory = activeCategory === 'All' || t.category === activeCategory
    const matchesSearch = searchQuery === '' ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // Split into two columns for the masonry-style layout
  const leftCol = filtered.filter((_, i) => i % 2 === 0)
  const rightCol = filtered.filter((_, i) => i % 2 !== 0)

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0A14" />

      {/* ── Header ── */}
      <Animated.View
        style={[
          styles.header,
          { opacity: headerFade, transform: [{ translateY: headerSlide }] },
        ]}
      >
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <ArrowLeft size={22} color="#FFFFFF" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>{t('allTemplates.headerTitle')}</Text>

        {/* Spacer to keep title centered */}
        <View style={styles.headerSpacer} />
      </Animated.View>

      <View style={styles.divider} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Search ── */}
        <View style={styles.searchBar}>
          <SearchIcon size={17} color="#484B68" />
          <TextInput
            style={styles.searchInput}
            placeholder={t('allTemplates.searchPlaceholder')}
            placeholderTextColor="#484B68"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* ── Category Pills ── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.pillsScroll}
          contentContainerStyle={styles.pillsContent}
        >
          {CATEGORIES.map(cat => {
            const isActive = activeCategory === cat
            return (
              <TouchableOpacity
                key={cat}
                style={[styles.pill, isActive && styles.pillActive]}
                onPress={() => setActiveCategory(cat)}
                activeOpacity={0.75}
              >
                <Text style={[styles.pillText, isActive && styles.pillTextActive]}>{categoryLabels[cat] || cat}</Text>
              </TouchableOpacity>
            )
          })}
        </ScrollView>

        {/* ── Count label ── */}
        <Text style={styles.countLabel}>{t('allTemplates.countLabel', { count: filtered.length })}</Text>

        {/* ── 2-column grid ── */}
        {filtered.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>{t('allTemplates.noResults')}</Text>
            <Text style={styles.emptySubText}>{t('allTemplates.noResultsSub')}</Text>
          </View>
        ) : (
          <View style={styles.columnsRow}>
            {/* Left column */}
            <View style={styles.column}>
              {leftCol.map((item, i) => (
                <TemplateCard
                  key={item.id}
                  item={item}
                  index={i * 2}
                  isBookmarked={bookmarkedIds.includes(item.id)}
                  onPress={() => navigation.navigate('PosterDetail', { poster: { title: item.title, category: item.category } })}
                  onBookmark={() => toggleBookmark(item.id)}
                  onDownload={() => handleAction('Download', item.title)}
                  onEdit={() => navigation.navigate('PosterEditor')}
                  onShare={() => handleAction('Share', item.title)}
                  onWhatsApp={() => handleAction('WhatsApp Share', item.title)}
                  actionLabels={{ download: t('allTemplates.download'), edit: t('allTemplates.edit'), share: t('allTemplates.share'), whatsapp: t('allTemplates.whatsapp') }}
                  height={item.height}
                  background={<item.CardGraphic />}
                />
              ))}
            </View>
            {/* Right column */}
            <View style={styles.column}>
              {rightCol.map((item, i) => (
                <TemplateCard
                  key={item.id}
                  item={item}
                  index={i * 2 + 1}
                  isBookmarked={bookmarkedIds.includes(item.id)}
                  onPress={() => navigation.navigate('PosterDetail', { poster: { title: item.title, category: item.category } })}
                  onBookmark={() => toggleBookmark(item.id)}
                  onDownload={() => handleAction('Download', item.title)}
                  onEdit={() => navigation.navigate('PosterEditor')}
                  onShare={() => handleAction('Share', item.title)}
                  onWhatsApp={() => handleAction('WhatsApp Share', item.title)}
                  actionLabels={{ download: t('allTemplates.download'), edit: t('allTemplates.edit'), share: t('allTemplates.share'), whatsapp: t('allTemplates.whatsapp') }}
                  height={item.height}
                  background={<item.CardGraphic />}
                />
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A14',
  },
  header: {
    height: 62,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#131424',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1E1F35',
  },
  headerTitle: {
    color: '#A78BFA',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 0.3,
  },
  headerSpacer: {
    width: 38,
  },
  divider: {
    height: 1,
    backgroundColor: '#1E1F35',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111220',
    borderRadius: 18,
    height: 52,
    paddingHorizontal: 16,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#1E1F35',
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14.5,
    marginLeft: 10,
    height: '100%',
  },
  pillsScroll: {
    marginBottom: 4,
  },
  pillsContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 8,
    gap: 8,
  },
  pill: {
    paddingVertical: 9,
    paddingHorizontal: 18,
    borderRadius: 22,
    backgroundColor: '#131424',
    borderWidth: 1.5,
    borderColor: '#1E1F35',
  },
  pillActive: {
    backgroundColor: '#7C3AED',
    borderColor: '#7C3AED',
  },
  pillText: {
    color: '#64748B',
    fontSize: 13.5,
    fontWeight: '700',
  },
  pillTextActive: {
    color: '#FFFFFF',
  },
  countLabel: {
    color: '#484B68',
    fontSize: 11.5,
    fontWeight: '600',
    marginTop: 14,
    marginBottom: 14,
    marginLeft: 2,
    letterSpacing: 0.3,
  },
  columnsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  column: {
    flex: 1,
  },

  emptyState: {
    alignItems: 'center',
    marginTop: 60,
    gap: 8,
  },
  emptyText: {
    color: '#64748B',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptySubText: {
    color: '#374151',
    fontSize: 13,
  },
})
