/**
 * Templates tab — shows all templates (segmented into "All Templates" / "My Posters").
 * Each template card can be bookmarked, downloaded, shared, etc.
 * NOTE: This file is large (~1061 lines) and should be split into subcomponents.
 */
import React, { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { SvgIcon } from '../components/SvgIcon';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  StatusBar,
  Alert,
  Dimensions,
  ImageBackground,
  Animated,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { HamburgerIcon, CrownIcon, SearchIcon, FolderIcon, SunIcon, PartyIcon, BusinessIcon, DownloadIcon, SparklesIcon, ClockIcon } from '../components/Icons'
import BookmarkButton from '../components/BookmarkButton'
import ActionButtonBar from '../components/ActionButtonBar'
import SearchDropdown from '../components/SearchDropdown'

// Shape of each template shown in the "All Templates" list
type TemplateCard = {
  id: string
  title: string
  category: string
  bgImage?: any
  bgColor?: string
  isPro?: boolean       // Shows crown badge if true
  isBookmarked?: boolean
  // Visual variant flags — each renders different fake graphics inside the card
  isAbstract?: boolean
  isZen?: boolean
  isTech?: boolean
  isRoyal?: boolean
}

// Shape of each poster shown in the "My Posters" list (user's created posters)
type MyPosterCard = {
  id: string
  dateText: string       // e.g. "Mar 28"
  isBookmarked?: boolean
  // Visual variant flags
  isEqualizer?: boolean
  isWavy?: boolean
  isWatch?: boolean
  isTechFest?: boolean
}

export default function TemplatesScreen() {
  const { t } = useTranslation()
  // Uses any because this screen needs openDrawer() from DrawerNavigationProp
  const navigation = useNavigation<any>()

  // 'all' = show "All Templates" view, 'my' = show "My Posters" view
  const [activeSegment, setActiveSegment] = useState<'all' | 'my'>('all')
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'morning' | 'festival' | 'business'>('morning')
  const [searchQuery, setSearchQuery] = useState('')

  // ── Search Dropdown State ──
  const searchRef = useRef<View>(null)
  const [dropdownVisible, setDropdownVisible] = useState(false)
  const [dropdownTop, setDropdownTop] = useState(0)
  const dropdownOpacity = useRef(new Animated.Value(0)).current
  const dropdownTranslateY = useRef(new Animated.Value(-10)).current
  // Tracks which template/poster IDs are bookmarked (highlighted heart icon)
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(['1', '3', 'my_1', 'my_2', 'my_3', 'my_4'])

  // Adds or removes a template ID from the bookmarked set
  const toggleBookmark = (id: string) => {
    if (bookmarkedIds.includes(id)) {
      setBookmarkedIds(bookmarkedIds.filter(item => item !== id))
    } else {
      setBookmarkedIds([...bookmarkedIds, id])
    }
  }

  const templates: TemplateCard[] = [
    {
      id: '1',
      title: 'Modern Abstract',
      category: 'Business',
      isPro: true,
      isAbstract: true,
    },
    {
      id: '2',
      title: 'Zen Morning',
      category: 'Personal',
      isPro: false,
      isZen: true,
    },
    {
      id: '3',
      title: 'Tech Meetup',
      category: 'Event',
      isPro: true,
      isTech: true,
    },
    {
      id: '4',
      title: 'Royal Festive',
      category: 'Festivals',
      isPro: false,
      isRoyal: true,
    },
  ]

  const thisWeekPosters: MyPosterCard[] = [
    {
      id: 'my_1',
      dateText: 'Mar 28',
      isEqualizer: true,
    },
    {
      id: 'my_2',
      dateText: 'Mar 26',
      isWavy: true,
    },
  ]

  const lastMonthPosters: MyPosterCard[] = [
    {
      id: 'my_3',
      dateText: 'Feb 14',
      isWatch: true,
    },
    {
      id: 'my_4',
      dateText: 'Feb 08',
      isTechFest: true,
    },
  ]

  // ── Search Dropdown Handlers ──
  const showDropdown = () => {
    searchRef.current?.measureInWindow((_x, y, _w, h) => {
      setDropdownTop(y + h + 4)
    })
    setDropdownVisible(true)
    Animated.parallel([
      Animated.timing(dropdownOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.timing(dropdownTranslateY, { toValue: 0, duration: 250, useNativeDriver: true }),
    ]).start()
  }

  const hideDropdown = () => {
    Animated.parallel([
      Animated.timing(dropdownOpacity, { toValue: 0, duration: 150, useNativeDriver: true }),
      Animated.timing(dropdownTranslateY, { toValue: -10, duration: 150, useNativeDriver: true }),
    ]).start(() => setDropdownVisible(false))
  }

  const onSearchItem = (text: string) => {
    setSearchQuery(text)
    hideDropdown()
  }

  const handleAction = (action: string, title: string) => {
    Alert.alert(action, t('templatesScreen.actionSuccess', { title, action: action.toLowerCase() }))
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor="#0D0E1C" />

      {/* ── Header: Hamburger (drawer) + Title (changes with segment) + Crown (pro) ── */}
      <View style={styles.headerBar}>
        <View style={styles.headerLeft}>
          <TouchableOpacity 
            style={styles.hamburgerBtn}
            activeOpacity={0.7}
            onPress={() => navigation.openDrawer()}
          >
            <HamburgerIcon size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {activeSegment === 'all' ? t('templatesScreen.headerAll') : t('templatesScreen.headerMy')}
          </Text>
        </View>

        <TouchableOpacity 
          style={styles.crownBtn} 
          activeOpacity={0.7} 
          onPress={() => Alert.alert(t('templatesScreen.proTitle'), t('templatesScreen.proAlert'))}
        >
          <CrownIcon size={22} color="#F59E0B" />
        </TouchableOpacity>
      </View>
      <View style={styles.headerLine} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* ── Segment Toggle: "All Templates" vs "My Posters" ── */}
        <View style={styles.segmentContainer}>
          <TouchableOpacity
            style={[styles.segmentBtn, activeSegment === 'all' && styles.activeSegmentBtn]}
            activeOpacity={0.9}
            onPress={() => setActiveSegment('all')}
          >
            <Text style={[styles.segmentText, activeSegment === 'all' && styles.activeSegmentText]}>
              {t('templatesScreen.allTemplates')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.segmentBtn, activeSegment === 'my' && styles.activeSegmentBtn]}
            activeOpacity={0.9}
            onPress={() => setActiveSegment('my')}
          >
            <Text style={[styles.segmentText, activeSegment === 'my' && styles.activeSegmentText]}>
              {t('templatesScreen.myPosters')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* ── CONDITIONALLY RENDER LAYOUT BASED ON SEGMENT CHOICE ── */}
        {activeSegment === 'all' ? (
          /* ==================== ALL TEMPLATES VIEW ==================== */
          <View>
            {/* Search Bar */}
            <View ref={searchRef} style={styles.searchWrapper}>
              <SearchIcon size={16} color="#8E8FCA" />
              <TextInput 
                style={styles.searchInput}
                placeholder={t('templatesScreen.searchPlaceholder')}
                placeholderTextColor="#484B68"
                value={searchQuery}
                onChangeText={(text) => {
                  setSearchQuery(text)
                  if (text.trim()) {
                    showDropdown()
                  } else {
                    hideDropdown()
                  }
                }}
              />
            </View>

            {/* Categories Horizontal Scroll */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll} contentContainerStyle={styles.categoriesContent}>
              <TouchableOpacity 
                activeOpacity={0.85}
                onPress={() => setSelectedCategory('all')}
                style={[styles.categoryPill, selectedCategory === 'all' && styles.selectedCategoryPill]}
              >
                <FolderIcon size={16} color={selectedCategory === 'all' ? '#A855F7' : '#64748B'} />
                <Text style={[styles.categoryText, selectedCategory === 'all' && styles.selectedCategoryText]}>{t('templatesScreen.categoryAll')}</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                activeOpacity={0.85}
                onPress={() => setSelectedCategory('morning')}
                style={[styles.categoryPill, selectedCategory === 'morning' && styles.selectedCategoryPill]}
              >
                <SunIcon size={16} color={selectedCategory === 'morning' ? '#A855F7' : '#64748B'} />
                <Text style={[styles.categoryText, selectedCategory === 'morning' && styles.selectedCategoryText]}>{t('templatesScreen.categoryMorning')}</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                activeOpacity={0.85}
                onPress={() => setSelectedCategory('festival')}
                style={[styles.categoryPill, selectedCategory === 'festival' && styles.selectedCategoryPill]}
              >
                <PartyIcon size={16} color={selectedCategory === 'festival' ? '#A855F7' : '#64748B'} />
                <Text style={[styles.categoryText, selectedCategory === 'festival' && styles.selectedCategoryText]}>{t('templatesScreen.categoryFestival')}</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                activeOpacity={0.85}
                onPress={() => setSelectedCategory('business')}
                style={[styles.categoryPill, selectedCategory === 'business' && styles.selectedCategoryPill]}
              >
                <BusinessIcon size={16} color={selectedCategory === 'business' ? '#A855F7' : '#64748B'} />
                <Text style={[styles.categoryText, selectedCategory === 'business' && styles.selectedCategoryText]}>{t('templatesScreen.categoryBusiness')}</Text>
              </TouchableOpacity>
            </ScrollView>

            {/* Editor's Pick Featured Card */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => navigation.navigate('PosterDetail', { poster: { title: 'Elevate Your Brand' } })}
            >
            <View style={styles.featuredCardContainer}>
              <ImageBackground
                source={require('../../assets/images/bokeh_preview.png')}
                style={styles.featuredCardBg}
                imageStyle={{ borderRadius: 28 }}
              >
                <View style={styles.featuredOverlay}>
                  <View style={styles.editorsPickBadge}>
                    <Text style={styles.editorsPickText}>{t('templatesScreen.editorsPick')}</Text>
                  </View>

                  <View style={styles.featuredBottomRow}>
                    <View style={styles.featuredTextCol}>
                      <Text style={styles.featuredTitle}>{t('templatesScreen.elevateBrand')}</Text>
                      <Text style={styles.featuredSubtitle}>{t('templatesScreen.premiumSuite')}</Text>
                    </View>

                    <TouchableOpacity 
                      style={styles.useTemplateBtn}
                      activeOpacity={0.85}
                      onPress={() => navigation.navigate('PosterEditor', { template: 'elevate_your_brand' })}
                    >
                      <Text style={styles.useTemplateText}>{t('templatesScreen.useTemplate')}</Text><SvgIcon name="arrowRight" size={16} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>
                </View>
              </ImageBackground>
            </View>
            </TouchableOpacity>

            {/* ── Trending Now Section Header ── */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{t('templatesScreen.trendingNow')}</Text>
              <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('AllTemplates')}>
                <Text style={styles.viewAllText}>{t('templatesScreen.viewAll')}</Text>
              </TouchableOpacity>
            </View>

            {/* Grid of Templates (2x2 Grid) */}
            <View style={styles.templatesGrid}>
              {templates.map((item) => {
                const isBookmarked = bookmarkedIds.includes(item.id)
                return (
                  <View key={item.id} style={styles.templateItem}>
                    <TouchableOpacity activeOpacity={0.85} onPress={() => navigation.navigate('PosterDetail', { poster: { title: item.title } })}>
                      <View style={styles.templateImageContainer}>
                      {item.isAbstract && (
                        <View style={[styles.cardGraphicsBg, { backgroundColor: '#131131' }]}>
                          <View style={[styles.abstractNeonCircle, { backgroundColor: '#3B82F6', top: 30, left: 10 }]} />
                          <View style={[styles.abstractNeonCircle, { backgroundColor: '#A855F7', top: 50, right: 10, width: 90, height: 90 }]} />
                          <View style={[styles.abstractNeonCircle, { backgroundColor: '#EC4899', bottom: 20, left: 30, width: 70, height: 70 }]} />
                        </View>
                      )}

                      {item.isZen && (
                        <ImageBackground
                          source={require('../../assets/images/business_preview_bg.png')}
                          style={styles.fullBgImage}
                        >
                          <View style={styles.zenContentOverlay}>
                            <Text style={styles.zenTextQuote}>{t('templatesScreen.good')}</Text>
                            <Text style={styles.zenTextQuote}>{t('templatesScreen.morning')}</Text>
                          </View>
                        </ImageBackground>
                      )}

                      {item.isTech && (
                        <View style={[styles.cardGraphicsBg, { backgroundColor: '#090514' }]}>
                          <View style={[styles.abstractNeonWave, { borderColor: '#8B5CF6', transform: [{ rotate: '15deg' }] }]} />
                          <View style={[styles.abstractNeonWave, { borderColor: '#EC4899', top: 80, transform: [{ rotate: '-15deg' }] }]} />
                          <View style={styles.techTextOverlay}>
                            <Text style={styles.techText}>{t('templatesScreen.tech')}</Text>
                            <Text style={styles.techSubText}>{t('templatesScreen.meetup')}</Text>
                          </View>
                        </View>
                      )}

                      {item.isRoyal && (
                        <View style={[styles.cardGraphicsBg, { backgroundColor: '#B45309' }]}>
                          <View style={styles.royalPatternCircle}>
                            <View style={[styles.royalPatternCircle, { width: 90, height: 90, borderColor: 'rgba(255,255,255,0.4)', justifyContent: 'center', alignItems: 'center' }]}>
                              <CrownIcon size={32} color="#FDE047" />
                            </View>
                          </View>
                        </View>
                      )}

                      {item.isPro && (
                        <View style={styles.gridProBadge}>
                          <CrownIcon size={12} color="#F59E0B" />
                        </View>
                      )}

                      <BookmarkButton
                        active={isBookmarked}
                        onPress={() => toggleBookmark(item.id)}
                        style={{ position: 'absolute', top: 14, right: 14 }}
                      />

                      <View style={styles.innerCardTextWrapper}>
                        <Text style={styles.cardTitle}>{item.title}</Text>
                        <Text style={styles.cardCategory}>{item.category}</Text>
                      </View>

                      <ActionButtonBar
                        onDownload={() => handleAction('Download', item.title)}
                        onEdit={() => navigation.navigate('PosterEditor')}
                        onShare={() => handleAction('Share', item.title)}
                        onWhatsApp={() => handleAction('WhatsApp Share', item.title)}
                        labels={{ download: t('templatesScreen.download'), edit: t('templatesScreen.edit'), share: t('templatesScreen.share'), whatsapp: t('templatesScreen.whatsapp') }}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
                )
              })}
            </View>

            {/* ── Upgrade Premium Card ── */}
            <View style={styles.upgradeBanner}>
              <View style={styles.upgradeHeaderRow}>
                <View style={styles.upgradeSparkleWrapper}>
                  <SparklesIcon size={24} color="#FFFFFF" />
                </View>
                <View style={styles.upgradeTextCol}>
                  <Text style={styles.upgradeTitle}>{t('templatesScreen.unlockPremium')}</Text>
                  <Text style={styles.upgradeSubtitle}>{t('templatesScreen.unlockDesc')}</Text>
                </View>
                <TouchableOpacity
                  style={styles.upgradeBtn}
                  activeOpacity={0.85}
                  onPress={() => Alert.alert(t('templatesScreen.premiumUpgrade'), t('templatesScreen.premiumUpgradeDesc'))}
                >
                  <Text style={styles.upgradeBtnText}>{t('templatesScreen.upgrade')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ) : (
          /* ==================== MY POSTERS VIEW ==================== */
          <View>
            {/* ── Sorting Row ── */}
            <View style={styles.sortRow}>
              <TouchableOpacity activeOpacity={0.7} onPress={() => Alert.alert(t('templatesScreen.sortTitle'), t('templatesScreen.sortMsg'))} style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={styles.sortText}>{t('templatesScreen.sortRecent')}</Text>
                <DownloadIcon size={12} color="#8E8FCA" style={{marginLeft: 4, transform: [{rotate: '180deg'}]}} />
              </TouchableOpacity>
            </View>

            {/* ── Section 1: This Week ── */}
            <View style={styles.groupHeaderRow}>
              <Text style={styles.groupHeaderText}>{t('templatesScreen.thisWeek', { count: thisWeekPosters.length })}</Text>
              <View style={styles.groupHeaderLine} />
            </View>

            <View style={styles.templatesGrid}>
              {thisWeekPosters.map((item) => {
                const isBookmarked = bookmarkedIds.includes(item.id)
                return (
                  <View key={item.id} style={styles.templateItem}>
                    <TouchableOpacity activeOpacity={0.85} onPress={() => navigation.navigate('PosterDetail', { poster: { title: item.dateText } })}>
                      <View style={styles.templateImageContainer}>
                      {/* Date Badge Overlay */}
                      <View style={styles.dateBadge}>
                        <Text style={styles.dateBadgeText}>{item.dateText}</Text>
                      </View>

                      <BookmarkButton
                        active={isBookmarked}
                        onPress={() => toggleBookmark(item.id)}
                        style={{ position: 'absolute', top: 14, right: 14 }}
                      />

                      {/* Mock Renderings of the Cards */}
                      {item.isEqualizer && (
                        <View style={[styles.cardGraphicsBg, { backgroundColor: '#11052C' }]}>
                          {/* Simulated Equalizer Bars & Neon Lines */}
                          <View style={[styles.abstractNeonWave, { borderColor: '#10B981', top: 50, left: 10, width: 130, transform: [{ rotate: '45deg' }] }]} />
                          <View style={styles.equalizerContainer}>
                            <View style={[styles.equalizerBar, { height: 75 }]} />
                            <View style={[styles.equalizerBar, { height: 95 }]} />
                            <View style={[styles.equalizerBar, { height: 60 }]} />
                            <View style={[styles.equalizerBar, { height: 80 }]} />
                          </View>
                        </View>
                      )}

                      {item.isWavy && (
                        <View style={[styles.cardGraphicsBg, { backgroundColor: '#0C0628' }]}>
                          {/* Simulated Wavy Abstract Shapes */}
                          <View style={[styles.abstractNeonCircle, { backgroundColor: '#7C3AED', width: 140, height: 140, top: 40, right: -20, opacity: 0.3 }]} />
                          <View style={[styles.abstractNeonCircle, { backgroundColor: '#1E1B4B', width: 180, height: 180, bottom: -40, left: -20, opacity: 0.5 }]} />
                        </View>
                      )}

                      <ActionButtonBar
                        onDownload={() => handleAction('Download', `My Poster (${item.dateText})`)}
                        onEdit={() => navigation.navigate('PosterEditor')}
                        onShare={() => handleAction('Share', `My Poster (${item.dateText})`)}
                        onWhatsApp={() => handleAction('WhatsApp Share', `My Poster (${item.dateText})`)}
                        labels={{ download: t('templatesScreen.download'), edit: t('templatesScreen.edit'), share: t('templatesScreen.share'), whatsapp: t('templatesScreen.whatsapp') }}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
                )
              })}
            </View>

            {/* ── Section 2: Last Month ── */}
            <View style={styles.groupHeaderRow}>
              <Text style={styles.groupHeaderText}>{t('templatesScreen.lastMonth', { count: lastMonthPosters.length })}</Text>
              <View style={styles.groupHeaderLine} />
            </View>

            <View style={styles.templatesGrid}>
              {lastMonthPosters.map((item) => {
                const isBookmarked = bookmarkedIds.includes(item.id)
                return (
                  <View key={item.id} style={styles.templateItem}>
                    <TouchableOpacity activeOpacity={0.85} onPress={() => navigation.navigate('PosterDetail', { poster: { title: item.dateText } })}>
                      <View style={styles.templateImageContainer}>
                      {/* Date Badge Overlay */}
                      <View style={styles.dateBadge}>
                        <Text style={styles.dateBadgeText}>{item.dateText}</Text>
                      </View>

                      <BookmarkButton
                        active={isBookmarked}
                        onPress={() => toggleBookmark(item.id)}
                        style={{ position: 'absolute', top: 14, right: 14 }}
                      />

                      {/* Mock Renderings of the Cards */}
                      {item.isWatch && (
                        <View style={[styles.cardGraphicsBg, { backgroundColor: '#090911' }]}>
                          {/* Wristwatch on Purple Silk mockup */}
                          <View style={styles.silkWavePattern} />
                          <View style={styles.watchCircleOuter}>
                            <View style={styles.watchCircleInner}>
                              <ClockIcon size={40} color="#FFFFFF" />
                              <View style={styles.watchHandHr} />
                              <View style={styles.watchHandMin} />
                            </View>
                          </View>
                        </View>
                      )}

                      {item.isTechFest && (
                        <View style={[styles.cardGraphicsBg, { backgroundColor: '#040714' }]}>
                          {/* Tech Festival Circular lines mandala */}
                          <View style={styles.concentricCircles}>
                            <View style={[styles.concentricCircles, { width: 110, height: 110 }]}>
                              <View style={[styles.concentricCircles, { width: 80, height: 80 }]}>
                                <Text style={styles.techFestLabel}>{t('templatesScreen.tech')}</Text>
                                <Text style={styles.techFestLabelSub}>{t('templatesScreen.techFestival')}</Text>
                              </View>
                            </View>
                          </View>
                        </View>
                      )}

                      <ActionButtonBar
                        onDownload={() => handleAction('Download', `My Poster (${item.dateText})`)}
                        onEdit={() => navigation.navigate('PosterEditor')}
                        onShare={() => handleAction('Share', `My Poster (${item.dateText})`)}
                        onWhatsApp={() => handleAction('WhatsApp Share', `My Poster (${item.dateText})`)}
                        labels={{ download: t('templatesScreen.download'), edit: t('templatesScreen.edit'), share: t('templatesScreen.share'), whatsapp: t('templatesScreen.whatsapp') }}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
                )
              })}
            </View>
          </View>
        )}

      </ScrollView>

      {/* Search Dropdown Overlay */}
      {dropdownVisible && activeSegment === 'all' && (
        <TouchableOpacity
          style={[styles.dropdownBackdrop, { top: dropdownTop }]}
          activeOpacity={1}
          onPress={hideDropdown}
        >
          <View style={styles.dropdownPositioner}>
            <TouchableOpacity activeOpacity={1} onPress={() => {}}>
              <SearchDropdown
                translateY={dropdownTranslateY}
                opacity={dropdownOpacity}
                visible={dropdownVisible}
                onSearchItem={onSearchItem}
                onClose={hideDropdown}
              />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A14',
  },
  headerBar: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hamburgerBtn: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  hamburgerIcon: {
    color: '#FFFFFF',
    fontSize: 24,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  crownBtn: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  crownIcon: {
    fontSize: 22,
  },
  headerLine: {
    height: 1,
    backgroundColor: '#1E1F35',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100,
  },
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: '#131424',
    borderRadius: 24,
    padding: 4,
    borderWidth: 1.5,
    borderColor: '#1E1F35',
    marginBottom: 20,
    width: '100%',
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  activeSegmentBtn: {
    backgroundColor: '#7C3AED',
  },
  segmentText: {
    color: '#64748B',
    fontSize: 14.5,
    fontWeight: 'bold',
  },
  activeSegmentText: {
    color: '#FFFFFF',
  },
  searchWrapper: {
    width: '100%',
    height: 54,
    backgroundColor: '#131424',
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: '#1E1F35',
  },
  searchIcon: {
    fontSize: 16,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    color: '#FFFFFF',
    fontSize: 14.5,
    marginLeft: 10,
  },
  categoriesScroll: {
    width: '100%',
    marginBottom: 22,
  },
  categoriesContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 16,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#131424',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginRight: 10,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  selectedCategoryPill: {
    backgroundColor: 'rgba(124, 58, 237, 0.1)',
    borderColor: '#7C3AED',
  },
  categoryEmoji: {
    fontSize: 15,
  },
  categoryText: {
    color: '#64748B',
    fontSize: 13.5,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  selectedCategoryText: {
    color: '#A855F7',
  },
  featuredCardContainer: {
    width: '100%',
    height: 190,
    borderRadius: 28,
    overflow: 'hidden',
    marginBottom: 24,
  },
  featuredCardBg: {
    width: '100%',
    height: '100%',
  },
  featuredOverlay: {
    flex: 1,
    backgroundColor: 'rgba(10, 8, 24, 0.45)',
    padding: 20,
    justifyContent: 'space-between',
  },
  editorsPickBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#C084FC',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  editorsPickText: {
    color: '#3B0764',
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  featuredBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  featuredTextCol: {
    flex: 1,
  },
  featuredTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
    lineHeight: 26,
  },
  featuredSubtitle: {
    color: '#C084FC',
    fontSize: 11.5,
    marginTop: 4,
    fontWeight: '600',
  },
  useTemplateBtn: {
    backgroundColor: '#A78BFA',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  useTemplateText: {
    color: '#1E1B4B',
    fontSize: 11.5,
    fontWeight: 'bold',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: 'bold',
  },
  viewAllText: {
    color: '#A78BFA',
    fontSize: 13,
    fontWeight: 'bold',
  },
  templatesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  templateItem: {
    width: '48%',
    marginBottom: 16,
  },
  templateImageContainer: {
    width: '100%',
    height: 220,
    borderRadius: 24,
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#1E1F35',
  },
  cardGraphicsBg: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  abstractNeonCircle: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    opacity: 0.35,
  },
  fullBgImage: {
    width: '100%',
    height: '100%',
  },
  zenContentOverlay: {
    padding: 16,
    paddingTop: 45,
  },
  zenTextQuote: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    fontStyle: 'italic',
    lineHeight: 24,
    textShadowColor: 'rgba(0, 0, 0, 0.45)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  abstractNeonWave: {
    position: 'absolute',
    top: 40,
    left: -20,
    width: 160,
    height: 60,
    borderWidth: 10,
    borderRadius: 40,
    opacity: 0.25,
  },
  techTextOverlay: {
    position: 'absolute',
    top: 60,
    left: 16,
  },
  techText: {
    color: '#A855F7',
    fontSize: 18,
    fontWeight: 'bold',
  },
  techSubText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  royalPatternCircle: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    top: 20,
    left: -10,
  },
  royalSymbol: {
    fontSize: 28,
    opacity: 0.7,
  },
  gridProBadge: {
    position: 'absolute',
    top: 14,
    left: 14,
    backgroundColor: '#F59E0B',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridBadgeText: {
    color: '#000000',
    fontSize: 11,
    fontWeight: 'bold',
  },

  innerCardTextWrapper: {
    position: 'absolute',
    bottom: 58,
    left: 14,
    right: 14,
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  cardCategory: {
    color: '#8E8FCA',
    fontSize: 10.5,
    fontWeight: 'bold',
    marginTop: 2,
  },

  upgradeBanner: {
    width: '100%',
    backgroundColor: '#131424',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#1E1F35',
    padding: 16,
    marginTop: 10,
    marginBottom: 20,
  },
  upgradeHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  upgradeSparkleWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  upgradeSparkles: {
    fontSize: 20,
  },
  upgradeTextCol: {
    flex: 1,
    marginLeft: 12,
  },
  upgradeTitle: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontWeight: 'bold',
  },
  upgradeSubtitle: {
    color: '#8E8FCA',
    fontSize: 11,
    marginTop: 2,
    fontWeight: '500',
  },
  upgradeBtn: {
    backgroundColor: '#F59E0B',
    borderRadius: 20,
    paddingVertical: 9,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  upgradeBtnText: {
    color: '#000000',
    fontSize: 11,
    fontWeight: 'bold',
  },
  /* ==================== NEW MY POSTERS LAYOUT STYLES ==================== */
  sortRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 16,
  },
  sortText: {
    color: '#F59E0B',
    fontSize: 14.5,
    fontWeight: 'bold',
  },
  groupHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 6,
  },
  groupHeaderText: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  groupHeaderLine: {
    flex: 1,
    height: 1.5,
    backgroundColor: '#1E1F35',
    marginLeft: 12,
  },
  dateBadge: {
    position: 'absolute',
    top: 14,
    left: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
    zIndex: 10,
  },
  dateBadgeText: {
    color: '#FFFFFF',
    fontSize: 10.5,
    fontWeight: 'bold',
  },
  equalizerContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    width: '70%',
    height: 100,
  },
  equalizerBar: {
    width: 10,
    backgroundColor: '#10B981',
    borderRadius: 5,
    opacity: 0.85,
  },
  silkWavePattern: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    borderWidth: 20,
    borderColor: 'rgba(124, 58, 237, 0.15)',
    top: -20,
    left: -40,
  },
  watchCircleOuter: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#CCCCCC',
    backgroundColor: '#1E1E1E',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
  },
  watchCircleInner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  watchText: {
    fontSize: 24,
    opacity: 0.9,
  },
  watchHandHr: {
    position: 'absolute',
    width: 3,
    height: 25,
    backgroundColor: '#FFFFFF',
    top: 15,
    transform: [{ rotate: '45deg' }],
  },
  watchHandMin: {
    position: 'absolute',
    width: 2,
    height: 35,
    backgroundColor: '#EF4444',
    top: 5,
    transform: [{ rotate: '120deg' }],
  },
  concentricCircles: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 1.5,
    borderColor: 'rgba(6, 182, 212, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  techFestLabel: {
    color: '#06B6D4',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  techFestLabelSub: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1.5,
    marginTop: 2,
    textAlign: 'center',
  },
  dropdownBackdrop: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
  },
  dropdownPositioner: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
})


