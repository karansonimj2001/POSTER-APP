import React, { useState, useRef, useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, Dimensions, TextInput, Image, StatusBar, Alert } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'

let screenWidth = Dimensions.get('window').width
let screenHeight = Dimensions.get('window').height

// Bookmark Icon component
const BookmarkIcon = ({ active }: { active?: boolean }) => (
  <View style={styles.bookmarkOuter}>
    <View style={[styles.bookmarkBody, active && styles.bookmarkActive]} />
    <View style={styles.bookmarkCutout} />
  </View>
)

export default function MainApp() {
  const navigation = useNavigation<any>()
  const route = useRoute<any>()

  const params = route.params || {}
  const name = params.name || 'Aradhya'

  const [activeTab, setActiveTab] = useState<'home' | 'templates' | 'profile'>('home')
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'morning' | 'festival' | 'business'>('morning')

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

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0D0E1C" />

      {/* Top Header Bar */}
      <View style={styles.headerBar}>
        <View style={styles.headerLeft}>
          <View style={styles.avatarBorder}>
            <Image source={require('../../assets/images/user_avatar.png')} style={styles.headerAvatar} />
          </View>
          <Text style={styles.headerGreeting}>Good morning, {name} ✨</Text>
        </View>

        {/* Bell Icon with Red Dot */}
        <TouchableOpacity style={styles.bellBtn} activeOpacity={0.7} onPress={() => Alert.alert("Notifications", "You have no new notifications.")}>
          <Text style={styles.bellIcon}>🔔</Text>
          <View style={styles.redDot} />
        </TouchableOpacity>
      </View>
      <View style={styles.headerLine} />

      {/* Main Scrollable Content */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          
          {/* Streak Banner */}
          <View style={styles.streakBanner}>
            <View style={styles.streakTopRow}>
              <Text style={styles.streakTitle}>🔥 7 DAY STREAK</Text>
              <Text style={styles.streakSubtitle}>7/30 days</Text>
            </View>
            {/* Progress bar */}
            <View style={styles.streakTrack}>
              <View style={styles.streakProgress} />
            </View>
          </View>

          {/* Search Box */}
          <View style={styles.searchWrapper}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput 
              style={styles.searchInput}
              placeholder="Search posters..."
              placeholderTextColor="#484B68"
            />
          </View>
          <Text style={styles.posterAvailability}>✨ ✦ 1,200+ posters available</Text>

          {/* Categories Horizontal Scroll */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll} contentContainerStyle={styles.categoriesContent}>
            
            {/* Category: All */}
            <TouchableOpacity 
              activeOpacity={0.85}
              onPress={() => setSelectedCategory('all')}
              style={[styles.categoryPill, selectedCategory === 'all' && styles.selectedCategoryPill]}
            >
              <Text style={styles.categoryEmoji}>📁</Text>
              <Text style={[styles.categoryText, selectedCategory === 'all' && styles.selectedCategoryText]}>All</Text>
            </TouchableOpacity>

            {/* Category: Morning */}
            <TouchableOpacity 
              activeOpacity={0.85}
              onPress={() => setSelectedCategory('morning')}
              style={[styles.categoryPill, selectedCategory === 'morning' && styles.selectedCategoryPill]}
            >
              <Text style={styles.categoryEmoji}>🌅</Text>
              <Text style={[styles.categoryText, selectedCategory === 'morning' && styles.selectedCategoryText]}>Morning</Text>
            </TouchableOpacity>

            {/* Category: Festival */}
            <TouchableOpacity 
              activeOpacity={0.85}
              onPress={() => setSelectedCategory('festival')}
              style={[styles.categoryPill, selectedCategory === 'festival' && styles.selectedCategoryPill]}
            >
              <Text style={styles.categoryEmoji}>🎉</Text>
              <Text style={[styles.categoryText, selectedCategory === 'festival' && styles.selectedCategoryText]}>Festival</Text>
            </TouchableOpacity>

            {/* Category: Business */}
            <TouchableOpacity 
              activeOpacity={0.85}
              onPress={() => setSelectedCategory('business')}
              style={[styles.categoryPill, selectedCategory === 'business' && styles.selectedCategoryPill]}
            >
              <Text style={styles.categoryEmoji}>💼</Text>
              <Text style={[styles.categoryText, selectedCategory === 'business' && styles.selectedCategoryText]}>Business</Text>
            </TouchableOpacity>

          </ScrollView>

          {/* Today's Highlights Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Highlights</Text>
            <TouchableOpacity activeOpacity={0.7} onPress={() => Alert.alert("Highlights", "See all trending templates!")}>
              <Text style={styles.viewAllText}>View all</Text>
            </TouchableOpacity>
          </View>

          {/* Highlights Horizontal Scroll */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.highlightsScroll} contentContainerStyle={styles.highlightsContent}>
            
            {/* Card 1: Diwali */}
            <View style={[styles.highlightCard, styles.diwaliBg]}>
              <View style={styles.cardHeader}>
                <View style={styles.trendingBadge}>
                  <Text style={styles.trendingText}>TRENDING</Text>
                </View>
                <TouchableOpacity style={styles.bookmarkBtn}>
                  <BookmarkIcon />
                </TouchableOpacity>
              </View>

              <Text style={styles.highlightTitle}>Diwali Festival</Text>
              
              <TouchableOpacity style={styles.createPostBtn} activeOpacity={0.8}>
                <Text style={styles.createPostText}>Create Post  →</Text>
              </TouchableOpacity>
            </View>

            {/* Card 2: Good Morning */}
            <View style={[styles.highlightCard, styles.gmBg]}>
              <View style={styles.cardHeader}>
                <View style={styles.newBadge}>
                  <Text style={styles.newBadgeText}>DAILY WISHES</Text>
                </View>
                <TouchableOpacity style={styles.bookmarkBtn}>
                  <BookmarkIcon />
                </TouchableOpacity>
              </View>

              <Text style={styles.highlightTitle}>Good Morning</Text>
              
              <TouchableOpacity style={styles.createPostBtn} activeOpacity={0.8}>
                <Text style={styles.createPostText}>Create Post  →</Text>
              </TouchableOpacity>
            </View>

          </ScrollView>

          {/* Social Proof Stats Banner */}
          <View style={styles.socialProofBanner}>
            <View style={styles.socialAvatarsWrapper}>
              <View style={styles.socialAvatarContainer}>
                <Image source={require('../../assets/images/user_avatar.png')} style={styles.socialAvatar} />
              </View>
              <View style={[styles.socialAvatarContainer, { marginLeft: -12 }]}>
                <Image source={require('../../assets/images/business_preview_bg.png')} style={styles.socialAvatar} />
              </View>
            </View>
            <Text style={styles.socialProofText}>Raju aur 2,847 logon ne share kiya</Text>
          </View>

          {/* Popular Templates Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Templates</Text>
            <TouchableOpacity activeOpacity={0.7} onPress={() => Alert.alert("Popular", "See all popular templates!")}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          {/* Popular Templates Grid/List */}
          <View style={styles.templatesGrid}>
            
            {/* Card 1: Spiritual Quote */}
            <View style={styles.templateItem}>
              <View style={styles.templateImageContainer}>
                {/* Simulated Hindi Spiritual Template Image */}
                <Image source={require('../../assets/images/business_preview_bg.png')} style={styles.templateImg} />
                
                {/* Trending Badge Overlay */}
                <View style={styles.gridTrendingBadge}>
                  <Text style={styles.gridBadgeText}>🔥 TRENDING</Text>
                </View>

                {/* Bookmark Overlay */}
                <TouchableOpacity style={styles.gridBookmarkBtn}>
                  <BookmarkIcon active />
                </TouchableOpacity>

                {/* Simulated Content Text inside Card */}
                <View style={styles.innerQuoteContainer}>
                  <Text style={styles.quoteTitle}>भर्तृहीनाना</Text>
                  <Text style={styles.quoteSubtitle}>साङ्गा</Text>
                  <Text style={styles.quoteDescription}>अलानीन्दे...</Text>
                </View>

                {/* Overlay actions bar */}
                <View style={styles.overlayActionsBar}>
                  <TouchableOpacity style={styles.actionBtn}>
                    <Text style={styles.actionIcon}>⬇️</Text>
                    <Text style={styles.actionLabel}>DOWNLOAD</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionBtn}>
                    <Text style={styles.actionIcon}>✏️</Text>
                    <Text style={styles.actionLabel}>SAVE</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionBtn}>
                    <Text style={styles.actionIcon}>🔗</Text>
                    <Text style={styles.actionLabel}>SHARE</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionBtn}>
                    <Text style={styles.actionIcon}>💬</Text>
                    <Text style={styles.actionLabelWhatsapp}>WHATSAPP</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Title & Stats */}
              <Text style={styles.templateTitle}>Spiritual Wisdom #04</Text>
              <Text style={styles.templateStats}>Used 12.4k times</Text>
            </View>

            {/* Card 2: Modern Business Minimal */}
            <View style={styles.templateItem}>
              <View style={styles.templateImageContainer}>
                {/* Simulated Dark Sale Template Image */}
                <View style={styles.businessTemplateBg} />
                
                {/* New Badge Overlay */}
                <View style={styles.gridNewBadge}>
                  <Text style={styles.gridBadgeText}>✨ NEW</Text>
                </View>

                {/* Bookmark Overlay */}
                <TouchableOpacity style={styles.gridBookmarkBtn}>
                  <BookmarkIcon />
                </TouchableOpacity>

                {/* Simulated Content Text inside Card */}
                <View style={styles.innerSaleContainer}>
                  <Text style={styles.saleTitle}>SALE</Text>
                </View>

                {/* Overlay actions bar */}
                <View style={styles.overlayActionsBar}>
                  <TouchableOpacity style={styles.actionBtn}>
                    <Text style={styles.actionIcon}>⬇️</Text>
                    <Text style={styles.actionLabel}>DOWNLOAD</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionBtn}>
                    <Text style={styles.actionIcon}>✏️</Text>
                    <Text style={styles.actionLabel}>SAVE</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionBtn}>
                    <Text style={styles.actionIcon}>🔗</Text>
                    <Text style={styles.actionLabel}>SHARE</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionBtn}>
                    <Text style={styles.actionIcon}>💬</Text>
                    <Text style={styles.actionLabelWhatsapp}>WHATSAPP</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Title & Stats */}
              <Text style={styles.templateTitle}>Modern Business Minimal</Text>
              <Text style={styles.templateStats}>Used 8.1k times</Text>
            </View>

          </View>

          {/* Curator Pro Membership Banner */}
          <TouchableOpacity style={styles.proBanner} activeOpacity={0.9} onPress={() => Alert.alert("Curator Pro", "Unlock all premium features!")}>
            <View style={styles.proLeftContainer}>
              <Text style={styles.proTitle}>Curator Pro Membership</Text>
              <Text style={styles.proSubtitle}>Unlock 500+ premium templates & exclusive icons</Text>
            </View>
            <View style={styles.proMedalBadge}>
              <Text style={styles.proMedalText}>🏅</Text>
            </View>
          </TouchableOpacity>

        </Animated.View>
      </ScrollView>

      {/* Floating Action Button (FAB) */}
      <TouchableOpacity style={styles.fabBtn} activeOpacity={0.8} onPress={() => Alert.alert("Create", "Create a new custom poster!")}>
        <Text style={styles.fabIcon}>✨</Text>
      </TouchableOpacity>

      {/* Bottom Tab Bar Navigation */}
      <View style={styles.tabBar}>
        
        {/* Tab: Home */}
        <TouchableOpacity 
          style={styles.tabItem} 
          activeOpacity={0.7}
          onPress={() => setActiveTab('home')}
        >
          <View style={[styles.tabIconWrapper, activeTab === 'home' && styles.activeTabWrapper]}>
            <Text style={[styles.tabEmoji, activeTab === 'home' && styles.activeTabEmoji]}>🏠</Text>
          </View>
          <Text style={[styles.tabLabel, activeTab === 'home' && styles.activeTabLabel]}>Home</Text>
        </TouchableOpacity>

        {/* Tab: Templates */}
        <TouchableOpacity 
          style={styles.tabItem} 
          activeOpacity={0.7}
          onPress={() => setActiveTab('templates')}
        >
          <View style={[styles.tabIconWrapper, activeTab === 'templates' && styles.activeTabWrapper]}>
            <Text style={[styles.tabEmoji, activeTab === 'templates' && styles.activeTabEmoji]}>📊</Text>
          </View>
          <Text style={[styles.tabLabel, activeTab === 'templates' && styles.activeTabLabel]}>Templates</Text>
        </TouchableOpacity>

        {/* Tab: Profile */}
        <TouchableOpacity 
          style={styles.tabItem} 
          activeOpacity={0.7}
          onPress={() => setActiveTab('profile')}
        >
          <View style={[styles.tabIconWrapper, activeTab === 'profile' && styles.activeTabWrapper]}>
            <Text style={[styles.tabEmoji, activeTab === 'profile' && styles.activeTabEmoji]}>👤</Text>
          </View>
          <Text style={[styles.tabLabel, activeTab === 'profile' && styles.activeTabLabel]}>Profile</Text>
        </TouchableOpacity>

      </View>

    </View>
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
    paddingBottom: 140, // clear FAB and Tab Bar
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
    width: '23.3%', // Represents 7/30 days
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
    marginLeft: 4,
    marginBottom: 20,
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
    backgroundColor: '#D97706', // Simulated Diwali Orange background
  },
  gmBg: {
    backgroundColor: '#0D9488', // Simulated sunset/morning teal/blue background
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
  bookmarkBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookmarkOuter: {
    width: 12,
    height: 16,
    position: 'relative',
  },
  bookmarkBody: {
    width: 12,
    height: 13,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 1.5,
    borderTopRightRadius: 1.5,
  },
  bookmarkActive: {
    backgroundColor: '#F59E0B',
  },
  bookmarkCutout: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderBottomWidth: 5,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#20213E', // Match background color behind it or cut it out
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
  gridBookmarkBtn: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
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
  overlayActionsBar: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 48,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  actionBtn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIcon: {
    fontSize: 12,
  },
  actionLabel: {
    color: '#8E8FCA',
    fontSize: 8,
    fontWeight: 'bold',
    marginTop: 2,
  },
  actionLabelWhatsapp: {
    color: '#22C55E',
    fontSize: 8,
    fontWeight: 'bold',
    marginTop: 2,
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
    backgroundColor: '#281A10', // Dark bronze/gold background
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
    bottom: 96,
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
  },
  fabIcon: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  tabBar: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 74,
    backgroundColor: '#0F0F1A',
    borderTopWidth: 1,
    borderTopColor: '#1E1F35',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 14,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIconWrapper: {
    paddingVertical: 4,
    paddingHorizontal: 20,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeTabWrapper: {
    backgroundColor: '#1F1E38',
  },
  tabEmoji: {
    fontSize: 20,
    opacity: 0.4,
  },
  activeTabEmoji: {
    opacity: 1,
  },
  tabLabel: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: 'bold',
    marginTop: 3,
  },
  activeTabLabel: {
    color: '#FFFFFF',
  },
})
