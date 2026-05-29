/**
 * Profile tab — shows user info (name, phone, stats), menu items (edit profile,
 * download history, language, contact us, help center, share, rate), and sign out.
 */
import React from 'react'
import { useTranslation } from 'react-i18next'
import { View, Text, TouchableOpacity, Image, StatusBar, StyleSheet, ScrollView, Dimensions } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Svg, { Path, Circle, Defs, LinearGradient, Stop, Rect } from 'react-native-svg'
import { CrownIcon, CameraIcon, HistoryIcon, GlobeIcon, InfoIcon, StarIcon, ShareOutIcon, EmailIcon, ArrowRight } from '../components/Icons'
import { CommonActions } from '@react-navigation/native'
import { useAppNavigation } from '../navigation/types'
import { useUser } from '../context/UserContext'
import AsyncStorage from '@react-native-async-storage/async-storage'

const SCREEN_W = Dimensions.get('window').width

function ClockIcon({ size = 24, color = '#8B5CF6' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M12 7v5l3 3" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  )
}

function ChevronRight({ size = 20, color = '#6B7280' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M9 5l7 7-7 7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  )
}

function StarBadge({ size = 24, color = '#F59E0B' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
    </Svg>
  )
}

function CameraOverlayIcon({ size = 16, color = '#000000' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <Path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2v11z" />
      <Circle cx="12" cy="13" r="4" />
    </Svg>
  )
}

function MailIcon({ size = 24, color = '#8B5CF6' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <Path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <Path d="M22 6l-10 7L2 6" />
    </Svg>
  )
}

function UserAvatar() {
  return (
    <Image
      source={require('../../assets/images/user_avatar.png')}
      style={styles.avatarImg}
    />
  )
}

interface MenuItemProps {
  icon: React.ReactNode
  label: string
  subtitle?: string
  isLast?: boolean
  onPress?: () => void
}

function MenuItem({ icon, label, subtitle, isLast, onPress }: MenuItemProps) {
  return (
    <TouchableOpacity
      style={[styles.menuItem, isLast && styles.menuItemLast]}
      activeOpacity={0.6}
      onPress={onPress}
    >
      <View style={styles.menuItemLeft}>
        <View style={styles.menuIconWrap}>
          {icon}
        </View>
        <Text style={styles.menuLabel}>
          {label}
          {subtitle ? <Text style={styles.menuSubtitle}> ({subtitle})</Text> : null}
        </Text>
      </View>
      <ChevronRight size={20} color="#6B7280" />
    </TouchableOpacity>
  )
}

export default function ProfileScreen() {
  const { t } = useTranslation()
  const navigation = useAppNavigation()
  const { user } = useUser()   // User data from UserContext (name, phone, isPro, etc.)
  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor="#0f111a" />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* ── Header ── */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t('profile.headerTitle')}</Text>
          <CrownIcon size={24} color="#FACC15" />
        </View>

        {/* ── Profile Card ── */}
        <View style={styles.profileCard}>
          <View style={styles.avatarSection}>
            <View style={styles.avatarOuter}>
              <UserAvatar />
              <View style={styles.cameraBadge}>
                <CameraOverlayIcon size={14} color="#000000" />
              </View>
            </View>
            <Text style={styles.userName}>{user.name || t('profile.defaultName')}</Text>
            <Text style={styles.userPhone}>+91 {user.phone || t('profile.defaultPhone')}</Text>
            <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('EditProfile')}>
              <Text style={styles.editProfileBtn}>{t('profile.editProfile')}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          {/* ── Stats ── */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>48</Text>
              <Text style={styles.statLabel}>{t('profile.posters')}</Text>
            </View>
            <View style={[styles.statItem, styles.statBorder]}>
              <Text style={styles.statValue}>125</Text>
              <Text style={styles.statLabel}>{t('profile.downloads')}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>7</Text>
              <Text style={styles.statLabel}>{t('profile.activeDays')}</Text>
            </View>
          </View>
        </View>

        {/* ── Subscription Status ── */}
        <View style={styles.subCard}>
          <View style={styles.subRow}>
            <View style={styles.subLeft}>
              <View style={styles.subIconWrap}>
                <StarBadge size={24} color="#F59E0B" />
              </View>
              <View>
                <Text style={styles.subTitle}>{t('profile.freePlan')}</Text>
                <Text style={styles.subDesc}>{t('profile.downloadUsed')}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.upgradeBtn} activeOpacity={0.8}>
              <Text style={styles.upgradeBtnText}>{t('profile.upgrade')}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.progressBg}>
            <View style={styles.progressFill} />
          </View>
        </View>

        {/* ── Menu: Account ── */}
        <View style={styles.menuSection}>
          <Text style={styles.menuSectionTitle}>{t('profile.accountSection')}</Text>
          <View style={styles.menuGroup}>
            <MenuItem
              icon={<HistoryIcon size={22} color="#8B5CF6" />}
              label={t('profile.downloadHistory')}
              subtitle={t('profile.filesCount')}
              onPress={() => navigation.navigate('DownloadHistory')}
            />
          </View>
        </View>

        {/* ── Menu: Preferences ── */}
        <View style={styles.menuSection}>
          <Text style={styles.menuSectionTitle}>{t('profile.preferences')}</Text>
          <View style={styles.menuGroup}>
            <MenuItem
              icon={<GlobeIcon size={22} color="#8B5CF6" />}
              label={t('profile.language')}
              subtitle={t('profile.languageValue')}
              onPress={() => navigation.navigate('EditProfile')}
            />
          </View>
        </View>

        {/* ── Menu: Support ── */}
        <View style={styles.menuSection}>
          <Text style={styles.menuSectionTitle}>{t('profile.support')}</Text>
          <View style={styles.menuGroup}>
            <MenuItem
              icon={<InfoIcon size={22} color="#8B5CF6" />}
              label={t('profile.helpFaq')}
              onPress={() => navigation.navigate('HelpCenter')}
            />
            <MenuItem
              icon={<StarIcon size={22} color="#8B5CF6" />}
              label={t('profile.rateApp')}
            />
            <MenuItem
              icon={<ShareOutIcon size={22} color="#8B5CF6" />}
              label={t('profile.shareApp')}
            />
            <MenuItem
              icon={<EmailIcon size={22} color="#8B5CF6" />}
              label={t('profile.contactUs')}
              isLast
              onPress={() => navigation.navigate('ContactUs')}
            />
          </View>
        </View>

        {/* ── Footer: Sign Out ── */}
        <View style={styles.footer}>
          <TouchableOpacity activeOpacity={0.7} onPress={async () => {
            // Clear persisted data and reset to Landing (can't go back)
            try {
              await AsyncStorage.removeItem('onboardingDone')
              await AsyncStorage.removeItem('user_data')
            } catch (e) {}
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: 'Landing' }],
              })
            )
          }}>
            <Text style={styles.logoutText}>{t('profile.logOut')}</Text>
          </TouchableOpacity>
          <Text style={styles.versionText}>{t('profile.version')}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f111a',
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1f2937',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.5,
    color: '#FFFFFF',
  },

  // ── Profile Card ──
  profileCard: {
    marginHorizontal: 16,
    marginTop: 24,
    backgroundColor: '#1e2230',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(139,92,246,0.3)',
  },
  avatarSection: {
    alignItems: 'center',
  },
  avatarOuter: {
    width: 96,
    height: 96,
    borderRadius: 48,
    padding: 4,
    backgroundColor: '#8B5CF6',
    marginBottom: 16,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    borderRadius: 44,
    borderWidth: 2,
    borderColor: '#1e2230',
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#F59E0B',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#1e2230',
  },
  userName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  userPhone: {
    fontSize: 14,
    color: '#8B5CF6',
    marginBottom: 12,
  },
  editProfileBtn: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B5CF6',
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#374151',
    marginVertical: 24,
  },

  // ── Stats ──
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statBorder: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#374151',
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FACC15',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#8B5CF6',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 2,
  },

  // ── Subscription ──
  subCard: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: '#1e2230',
    borderRadius: 16,
    padding: 16,
  },
  subRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  subLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginRight: 12,
  },
  subIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#1f2937',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#374151',
  },
  subTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F59E0B',
  },
  subDesc: {
    fontSize: 12,
    color: '#8B5CF6',
    lineHeight: 14,
  },
  upgradeBtn: {
    backgroundColor: '#F59E0B',
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  upgradeBtnText: {
    color: '#000000',
    fontWeight: '700',
    fontSize: 14,
  },
  progressBg: {
    width: '100%',
    height: 6,
    backgroundColor: '#374151',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    width: '60%',
    height: '100%',
    backgroundColor: '#F59E0B',
    borderRadius: 3,
  },

  // ── Menu ──
  menuSection: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  menuSectionTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  menuGroup: {
    backgroundColor: '#1e2230',
    borderRadius: 16,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1f2937',
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  menuIconWrap: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  menuSubtitle: {
    color: '#6B7280',
    fontSize: 14,
  },

  // ── Footer ──
  footer: {
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 16,
  },
  logoutText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#EF4444',
    marginBottom: 8,
  },
  versionText: {
    fontSize: 10,
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
})
