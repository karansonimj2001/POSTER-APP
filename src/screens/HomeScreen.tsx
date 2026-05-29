/**
 * Main home screen — shows greeting, search dropdown, AI assistant, recent posters,
 * template categories, and trending templates. Accessed from the Home tab.
 */
import React, { useRef, useEffect, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
  TextInput,
  Image,
  StatusBar,
 } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { KeyboardController } from 'react-native-keyboard-controller'
import { useNavigation } from '@react-navigation/native'
import { BellIcon, SearchIcon, FolderIcon, SunIcon, PartyIcon, BusinessIcon, FireIcon, CrownIcon, SparklesIcon } from '../components/Icons'
import BookmarkButton from '../components/BookmarkButton'
import ActionButtonBar from '../components/ActionButtonBar'
import AIInputBar from '../components/AIInputBar'
import AIResultCard from '../components/AIResultCard'
import SearchDropdown from '../components/SearchDropdown'
import { useUser } from '../context/UserContext'

let screenWidth = Dimensions.get('window').width

export default function HomeScreen() {
  const { t } = useTranslation()
  // Uses any because this screen needs openDrawer() from DrawerNavigationProp
  const navigation = useNavigation<any>()
  const { user } = useUser()

  // Which category filter is selected (all / morning / festival / business)
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'morning' | 'festival' | 'business'>('morning')
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(['1', '3', 'my_1'])

  const toggleBookmark = (id: string) => {
    setBookmarkedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    )
  }

  // Fade + slide in animation for entire content on mount
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(30)).current

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start()
  }, [])

  // ── AI Assistant State Machine ──
  // 3 phases: idle (FAB visible) → input (text input slides up) → result (response card)
  const [phase, setPhase] = useState<'idle' | 'input' | 'result'>('idle')
  const [queryText, setQueryText] = useState('')  // The text the user typed

  // ── Search Dropdown State ──
  const searchRef = useRef<View>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [dropdownTop, setDropdownTop] = useState(0)
  const dropdownOpacity = useRef(new Animated.Value(0)).current
  const dropdownTranslateY = useRef(new Animated.Value(-10)).current
  const [dropdownVisible, setDropdownVisible] = useState(false)

  // ── Animation Values ──
  const fabScale = useRef(new Animated.Value(1)).current     // FAB shrinks when input opens
  const inputSlide = useRef(new Animated.Value(0)).current   // Input bar slides up from bottom
  const inputOpacity = useRef(new Animated.Value(0)).current // Input bar fades in
  const resultScale = useRef(new Animated.Value(0.8)).current // Result card grows from 0.8 → 1
  const resultOpacity = useRef(new Animated.Value(0)).current // Result card fades in
  const backdropOpacity = useRef(new Animated.Value(0)).current // Dark overlay behind result

  // Transition: idle → input (FAB disappears, input bar slides up)
  const animateToInput = useCallback(() => {
    setPhase('input')
    Animated.parallel([
      Animated.timing(fabScale, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.sequence([
        Animated.delay(80),
        Animated.parallel([
          Animated.timing(inputSlide, { toValue: 1, duration: 350, useNativeDriver: true }),
          Animated.timing(inputOpacity, { toValue: 1, duration: 250, useNativeDriver: true }),
        ]),
      ]),
    ]).start()
  }, [])

  // Transition: input → idle (input fades away, FAB grows back — called when tapping outside or scrolling)
  const animateInputToIdle = useCallback(() => {
    KeyboardController.dismiss()
    Animated.parallel([
      Animated.timing(inputSlide, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.timing(inputOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.sequence([
        Animated.delay(100),
        Animated.timing(fabScale, { toValue: 1, duration: 250, useNativeDriver: true }),
      ]),
    ]).start(() => setPhase('idle'))
  }, [])

  // Transition: input → result (input fades, result card + backdrop appear)
  const animateToResult = useCallback((text: string) => {
    KeyboardController.dismiss()
    setQueryText(text)
    setPhase('result')
    Animated.parallel([
      Animated.timing(inputOpacity, { toValue: 0, duration: 150, useNativeDriver: true }),
      Animated.sequence([
        Animated.delay(80),
        Animated.parallel([
          Animated.timing(backdropOpacity, { toValue: 1, duration: 250, useNativeDriver: true }),
          Animated.timing(resultOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.timing(resultScale, { toValue: 1, duration: 300, useNativeDriver: true }),
        ]),
      ]),
    ]).start()
  }, [])

  // Transition: result → idle (everything fades out, FAB grows back)
  const animateToIdle = useCallback(() => {
    KeyboardController.dismiss()
    Animated.parallel([
      Animated.timing(backdropOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.timing(resultOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.timing(resultScale, { toValue: 0.8, duration: 200, useNativeDriver: true }),
      Animated.timing(inputSlide, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.timing(inputOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.sequence([
        Animated.delay(150),
        Animated.timing(fabScale, { toValue: 1, duration: 250, useNativeDriver: true }),
      ]),
    ]).start(() => setPhase('idle'))
  }, [])

  // ── Search Dropdown Handlers ──
  // Measures search box position, positions dropdown below it, fades in
  const showDropdown = useCallback(() => {
    searchRef.current?.measureInWindow((_x, y, _w, h) => {
      setDropdownTop(y + h + 8)
    })
    setDropdownVisible(true)
    Animated.parallel([
      Animated.timing(dropdownOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.timing(dropdownTranslateY, { toValue: 0, duration: 250, useNativeDriver: true }),
    ]).start()
  }, [])

  // Hides dropdown with fade-out + slide-up
  const hideDropdown = useCallback(() => {
    Animated.parallel([
      Animated.timing(dropdownOpacity, { toValue: 0, duration: 150, useNativeDriver: true }),
      Animated.timing(dropdownTranslateY, { toValue: -10, duration: 150, useNativeDriver: true }),
    ]).start(() => setDropdownVisible(false))
  }, [])

  // User selects a search suggestion → fills input + closes dropdown
  const onSearchItem = useCallback((text: string) => {
    setSearchQuery(text)
    hideDropdown()
  }, [])

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor="#0D0E1C" />
      {/* ── Header: Avatar (opens drawer) + Greeting + Bell (notifications) ── */}
      <View style={styles.headerBar}>
        <View style={styles.headerLeft}>
          <TouchableOpacity 
            style={styles.avatarBorder}
            activeOpacity={0.7}
            onPress={() => navigation.openDrawer()}
          >
            <Image source={require('../../assets/images/user_avatar.png')} style={styles.headerAvatar} />
          </TouchableOpacity>
          <Text style={styles.headerGreeting}>{t('homeScreen.greeting', { name: user.name || 'User' })}</Text>
        </View>

        {/* Bell Icon with Red Dot (unread indicator) */}
        <TouchableOpacity style={styles.bellBtn} activeOpacity={0.7} onPress={() => navigation.navigate('Notifications')}>
          <BellIcon size={24} color="#FFFFFF" />
          <View style={styles.redDot} />
        </TouchableOpacity>
      </View>
      <View style={styles.headerLine} />

      {/* ── Main Scrollable Content ── */}
      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
        onScrollBeginDrag={phase === 'input' ? animateInputToIdle : undefined}
      >
        {/* Fade + slide in animation wrapper */}
        <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          
          {/* ── Streak Banner (daily engagement tracker) ── */}
          <View style={styles.streakBanner}>
            <View style={styles.streakTopRow}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <FireIcon size={16} color="#F59E0B" />
                <Text style={[styles.streakTitle, {marginLeft: 6}]}>{t('homeScreen.streakTitle')}</Text>
              </View>
              <Text style={styles.streakSubtitle}>{t('homeScreen.streakCount')}</Text>
            </View>
            {/* Streak progress bar (23.3% filled = ~7/30 days) */}
            <View style={styles.streakTrack}>
              <View style={styles.streakProgress} />
            </View>
          </View>

          {/* ── Search Box (triggers dropdown suggestions) ── */}
          <View ref={searchRef} style={styles.searchWrapper}>
            <SearchIcon size={18} color="#8E8FCA" />
            <TextInput 
              style={styles.searchInput}
              placeholder={t('homeScreen.searchPlaceholder')}
              placeholderTextColor="#484B68"
              value={searchQuery}
              onChangeText={(text) => {
                setSearchQuery(text)
                if (text.trim()) {
                  showDropdown()    // Show suggestions when user types
                } else {
                  hideDropdown()    // Hide when empty
                }
              }}
            />
          </View>

          <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 20, marginLeft: 4}}>
            <SparklesIcon size={14} color="#F59E0B" />
            <Text style={styles.posterAvailability}>{t('homeScreen.postersAvailable')}</Text>
          </View>

          {/* ── Category Filter Pills (horizontal scroll) ── */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll} contentContainerStyle={styles.categoriesContent}>
            
            {[{ key: 'all', icon: FolderIcon, label: t('homeScreen.categoryAll') },
              { key: 'morning', icon: SunIcon, label: t('homeScreen.categoryMorning') },
              { key: 'festival', icon: PartyIcon, label: t('homeScreen.categoryFestival') },
              { key: 'business', icon: BusinessIcon, label: t('homeScreen.categoryBusiness') }
            ].map((cat) => (
              <TouchableOpacity 
                key={cat.key}
                activeOpacity={0.85}
                onPress={() => setSelectedCategory(cat.key as any)}
                style={[styles.categoryPill, selectedCategory === cat.key && styles.selectedCategoryPill]}
              >
                <cat.icon size={16} color={selectedCategory === cat.key ? '#A855F7' : '#64748B'} />
                <Text style={[styles.categoryText, selectedCategory === cat.key && styles.selectedCategoryText]}>{cat.label}</Text>
              </TouchableOpacity>
            ))}

          </ScrollView>

          {/* ── Today's Highlights Section ── */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('homeScreen.highlightsTitle')}</Text>
            <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('AllTemplates')}>
              <Text style={styles.viewAllText}>{t('homeScreen.viewAll')}</Text>
            </TouchableOpacity>
          </View>

          {/* Highlights Horizontal Scroll (featured poster cards) */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.highlightsScroll} contentContainerStyle={styles.highlightsContent}>
            
            {/* Card 1: Diwali Festival */}
            <TouchableOpacity activeOpacity={0.85} onPress={() => navigation.navigate('PosterDetail', { poster: { type: 'highlight', title: 'Diwali Festival', color: '#F97316' } })}>
              <View style={[styles.highlightCard, styles.diwaliBg]}>
                <View style={styles.cardHeader}>
                  <View style={styles.trendingBadge}>
                    <Text style={styles.trendingText}>{t('homeScreen.trending')}</Text>
                  </View>
                  <BookmarkButton variant="highlight" active={bookmarkedIds.includes('home_diwali')} onPress={() => toggleBookmark('home_diwali')} />
                </View>

                <Text style={styles.highlightTitle}>{t('homeScreen.diwaliFestival')}</Text>
                
                <TouchableOpacity style={styles.createPostBtn} activeOpacity={0.8} onPress={() => navigation.navigate('PosterEditor')}>
                  <Text style={styles.createPostText}>{t('homeScreen.createPost')}</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>

            {/* Card 2: Good Morning */}
            <TouchableOpacity activeOpacity={0.85} onPress={() => navigation.navigate('PosterDetail', { poster: { type: 'highlight', title: 'Good Morning', color: '#14B8A6' } })}>
              <View style={[styles.highlightCard, styles.gmBg]}>
                <View style={styles.cardHeader}>
                  <View style={styles.newBadge}>
                    <Text style={styles.newBadgeText}>{t('homeScreen.daWishes')}</Text>
                  </View>
                  <BookmarkButton variant="highlight" active={bookmarkedIds.includes('home_gm')} onPress={() => toggleBookmark('home_gm')} />
                </View>

                <Text style={styles.highlightTitle}>{t('homeScreen.goodMorning')}</Text>
                
                <TouchableOpacity style={styles.createPostBtn} activeOpacity={0.8} onPress={() => navigation.navigate('PosterEditor')}>
                  <Text style={styles.createPostText}>{t('homeScreen.createPost')}</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>

          </ScrollView>

          {/* ── Social Proof Stats Banner ── */}
          <View style={styles.socialProofBanner}>
            <View style={styles.socialAvatarsWrapper}>
              <View style={styles.socialAvatarContainer}>
                <Image source={require('../../assets/images/user_avatar.png')} style={styles.socialAvatar} />
              </View>
              <View style={[styles.socialAvatarContainer, { marginLeft: -12 }]}>
                <Image source={require('../../assets/images/business_preview_bg.png')} style={styles.socialAvatar} />
              </View>
            </View>
            <Text style={styles.socialProofText}>{t('homeScreen.shareCount')}</Text>
          </View>

          {/* ── Popular Templates Section ── */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('homeScreen.popularTemplates')}</Text>
            <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('AllTemplates')}>
              <Text style={styles.viewAllText}>{t('homeScreen.viewAllCaps')}</Text>
            </TouchableOpacity>
          </View>

          {/* ── Popular Templates Grid (2-column grid) ── */}
          <View style={styles.templatesGrid}>
            
            {/* Card 1: Spiritual Quote */}
            <View style={styles.templateItem}>
              <TouchableOpacity activeOpacity={0.85} onPress={() => navigation.navigate('PosterDetail', { poster: { title: 'Spiritual Wisdom #04', image: require('../../assets/images/business_preview_bg.png') } })}>
                <View style={styles.templateImageContainer}>
                  {/* Placeholder image for the poster preview */}
                  <Image source={require('../../assets/images/business_preview_bg.png')} style={styles.templateImg} />
                  
                  {/* Trending badge overlay */}
                  <View style={styles.gridTrendingBadge}>
                    <Text style={styles.gridBadgeText}>{t('homeScreen.trendingBadge')}</Text>
                  </View>

                  {/* Bookmark icon (positioned top-right) */}
                  <BookmarkButton active={bookmarkedIds.includes('home_spiritual')} onPress={() => toggleBookmark('home_spiritual')} style={{ position: 'absolute', top: 14, right: 14 }} />

                  {/* Fake Hindi quote text inside the card preview */}
                  <View style={styles.innerQuoteContainer}>
                    <Text style={styles.quoteTitle}>भर्तृहीनाना</Text>
                    <Text style={styles.quoteSubtitle}>साङ्गा</Text>
                    <Text style={styles.quoteDescription}>अलानीन्दे...</Text>
                  </View>

                  {/* Download / Edit / Share / WhatsApp action buttons */}
                  <ActionButtonBar
                    labels={{ download: t('homeScreen.download'), edit: t('homeScreen.edit'), share: t('homeScreen.share'), whatsapp: t('homeScreen.whatsapp') }}
                  />
                </View>

                <Text style={styles.templateTitle}>{t('homeScreen.spiritualWisdom')}</Text>
                <Text style={styles.templateStats}>{t('homeScreen.usedCount')}</Text>
              </TouchableOpacity>
            </View>

            {/* Card 2: Modern Business Minimal */}
            <View style={styles.templateItem}>
              <TouchableOpacity activeOpacity={0.85} onPress={() => navigation.navigate('PosterDetail', { poster: { title: 'Modern Business Minimal' } })}>
                <View style={styles.templateImageContainer}>
                  {/* Dark placeholder background for business template */}
                  <View style={styles.businessTemplateBg} />
                  
                  {/* New badge overlay */}
                  <View style={styles.gridNewBadge}>
                    <Text style={styles.gridBadgeText}>{t('homeScreen.newBadge')}</Text>
                  </View>

                  <BookmarkButton active={bookmarkedIds.includes('home_business')} onPress={() => toggleBookmark('home_business')} style={{ position: 'absolute', top: 14, right: 14 }} />

                  {/* Fake sale text inside the card preview */}
                  <View style={styles.innerSaleContainer}>
                    <Text style={styles.saleTitle}>{t('homeScreen.saleBadge')}</Text>
                  </View>

                  <ActionButtonBar
                    labels={{ download: t('homeScreen.download'), edit: t('homeScreen.edit'), share: t('homeScreen.share'), whatsapp: t('homeScreen.whatsapp') }}
                  />
                </View>

                <Text style={styles.templateTitle}>{t('homeScreen.modernBizMinimal')}</Text>
                <Text style={styles.templateStats}>{t('homeScreen.usedCount2')}</Text>
              </TouchableOpacity>
            </View>

          </View>

          {/* ── Curator Pro Membership Banner ── */}
          <TouchableOpacity style={styles.proBanner} activeOpacity={0.9} onPress={() => {}}>
            <View style={styles.proLeftContainer}>
              <Text style={styles.proTitle}>{t('homeScreen.proMembership')}</Text>
              <Text style={styles.proSubtitle}>{t('homeScreen.proUnlock')}</Text>
            </View>
            <View style={styles.proMedalBadge}>
              <CrownIcon size={18} color="#F59E0B" />
            </View>
          </TouchableOpacity>

        </Animated.View>
      </ScrollView>

      {/* Search Dropdown Overlay */}
      {dropdownVisible && (
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

      {/* ── Backdrop: tap outside AI input to dismiss ── */}
      {phase === 'input' && (
        <TouchableOpacity
          activeOpacity={1}
          onPress={animateInputToIdle}
          style={styles.inputBackdrop}
        />
      )}

      {/* ── AI Assistant: Floating Action Button (FAB) ── */}
      {/* Visible in 'idle' phase; shrinks to 0 scale when 'input' opens */}
      <Animated.View style={[styles.fabBtn, { transform: [{ scale: fabScale }], opacity: fabScale }]}>
        <TouchableOpacity style={styles.fabTouchable} activeOpacity={0.8} onPress={animateToInput}>
          <SparklesIcon size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </Animated.View>

      {/* ── AI Assistant: Input Bar ── */}
      {/* Visible in 'input' and 'result' phases; slides up from below */}
      {/* Tap outside (backdrop) or scroll → dismiss back to idle with FAB */}
      {phase !== 'idle' && (
        <AIInputBar
          translateY={inputSlide.interpolate({
            inputRange: [0, 1],
            outputRange: [20, 0],     // Starts 20px below final position
          })}
          opacity={inputOpacity}
          onSubmit={animateToResult}     // User submitted text → show result card
        />
      )}

      {/* ── AI Assistant: Result Card ── */}
      {/* Visible only in 'result' phase; grows from 0.8 → 1 scale */}
      {phase === 'result' && (
        <AIResultCard
          scale={resultScale}
          opacity={resultOpacity}
          backdropOpacity={backdropOpacity}   // Dark overlay behind card
          queryText={queryText}               // The prompt the user entered
          onClose={animateToIdle}             // Close → back to 'idle'
        />
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
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarBorder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#8B5CF6',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerAvatar: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  headerGreeting: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  bellBtn: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  bellIcon: {
    fontSize: 20,
  },
  redDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  headerLine: {
    height: 1,
    backgroundColor: '#1E1F35',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  streakBanner: {
    width: '100%',
    backgroundColor: 'rgba(245, 158, 11, 0.06)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.15)',
    padding: 16,
    marginBottom: 20,
  },
  streakTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  streakTitle: {
    color: '#F59E0B',
    fontSize: 13,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  streakSubtitle: {
    color: '#8E8FCA',
    fontSize: 12.5,
    fontWeight: '500',
  },
  streakTrack: {
    width: '100%',
    height: 6,
    borderRadius: 3,
    backgroundColor: '#1C1C36',
    overflow: 'hidden',
  },
  streakProgress: {
    width: '23.3%',
    height: '100%',
    borderRadius: 3,
    backgroundColor: '#8B5CF6',
  },
  searchWrapper: {
    width: '100%',
    height: 54,
    backgroundColor: '#131424',
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
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
  posterAvailability: {
    color: '#F59E0B',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  categoriesScroll: {
    width: '100%',
    marginBottom: 20,
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
  categoryText: {
    color: '#64748B',
    fontSize: 13.5,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  selectedCategoryText: {
    color: '#A855F7',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: 'bold',
  },
  viewAllText: {
    color: '#8B5CF6',
    fontSize: 13,
    fontWeight: 'bold',
  },
  highlightsScroll: {
    width: screenWidth,
    marginLeft: -16,
    marginBottom: 14,
  },
  highlightsContent: {
    flexDirection: 'row',
    paddingLeft: 16,
    paddingRight: 32,
  },
  highlightCard: {
    width: screenWidth * 0.72,
    height: 180,
    borderRadius: 28,
    padding: 20,
    marginRight: 16,
    justifyContent: 'space-between',
    position: 'relative',
    overflow: 'hidden',
  },
  diwaliBg: {
    backgroundColor: '#D97706',
  },
  gmBg: {
    backgroundColor: '#0D9488',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  trendingBadge: {
    backgroundColor: '#F59E0B',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  trendingText: {
    color: '#000000',
    fontSize: 10,
    fontWeight: 'bold',
  },
  newBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  newBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },

  highlightTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  createPostBtn: {
    alignSelf: 'flex-start',
    backgroundColor: '#8B5CF6',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  createPostText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  socialProofBanner: {
    width: '100%',
    backgroundColor: '#131424',
    borderRadius: 18,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 28,
  },
  socialAvatarsWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  socialAvatarContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#131424',
    overflow: 'hidden',
  },
  socialAvatar: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  socialProofText: {
    color: '#8E8FCA',
    fontSize: 12.5,
    fontWeight: '500',
    marginLeft: 12,
  },
  templatesGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  templateItem: {
    width: '48%',
  },
  templateImageContainer: {
    width: '100%',
    height: 200,
    borderRadius: 24,
    backgroundColor: '#1E1F35',
    position: 'relative',
    overflow: 'hidden',
  },
  templateImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  businessTemplateBg: {
    width: '100%',
    height: '100%',
    backgroundColor: '#0D0E1C',
  },
  gridTrendingBadge: {
    position: 'absolute',
    top: 14,
    left: 14,
    backgroundColor: '#F59E0B',
    borderRadius: 8,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  gridNewBadge: {
    position: 'absolute',
    top: 14,
    left: 14,
    backgroundColor: '#7C3AED',
    borderRadius: 8,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  gridBadgeText: {
    color: '#FFFFFF',
    fontSize: 8.5,
    fontWeight: 'bold',
  },

  innerQuoteContainer: {
    position: 'absolute',
    top: 60,
    left: 20,
  },
  quoteTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  quoteSubtitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  quoteDescription: {
    color: '#FFFFFF',
    fontSize: 14,
    marginTop: 4,
  },
  innerSaleContainer: {
    position: 'absolute',
    top: 75,
    alignSelf: 'center',
  },
  saleTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 2,
  },

  templateTitle: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: 'bold',
    marginTop: 10,
    paddingHorizontal: 4,
  },
  templateStats: {
    color: '#8E8FCA',
    fontSize: 11,
    fontWeight: '500',
    marginTop: 3,
    paddingHorizontal: 4,
  },
  proBanner: {
    width: '100%',
    height: 84,
    borderRadius: 20,
    backgroundColor: '#281A10',
    borderWidth: 1,
    borderColor: '#D97706',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
  },
  proLeftContainer: {
    flex: 1,
    marginRight: 10,
  },
  proTitle: {
    color: '#F59E0B',
    fontSize: 15,
    fontWeight: 'bold',
  },
  proSubtitle: {
    color: '#D97706',
    fontSize: 11.5,
    fontWeight: '500',
    marginTop: 4,
  },
  proMedalBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(217, 119, 6, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  proMedalText: {
    fontSize: 22,
  },
  fabBtn: {
    position: 'absolute',
    bottom: 98,
    left: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#8B5CF6',
    shadowOpacity: 0.6,
    shadowRadius: 15,
    elevation: 8,
    zIndex: 40,
  },
  fabTouchable: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabIcon: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  inputBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 35,
    backgroundColor: 'transparent',
  },
  dropdownBackdrop: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 30,
  },
  dropdownPositioner: {
    alignItems: 'center',
  },
})

