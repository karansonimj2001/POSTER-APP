/**
 * Notifications screen — shows a list of notification items with read/unread state,
 * a custom animated header with "All read" action.
 */
import React, { useRef, useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  StatusBar,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native'

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAppNavigation } from '../navigation/types'
import { useTranslation } from 'react-i18next'
import { ArrowLeft } from '../components/Icons'
import Svg, { Path, Circle, Polyline } from 'react-native-svg'

// ─── Local Icon Components ────────────────────────────────────────────────────

function PartyBallIcon() {
  return (
    <View style={notifIconStyles.wrapper}>
      <Text style={{ fontSize: 22 }}>🎉</Text>
    </View>
  )
}

function StreakFlameIcon() {
  return (
    <View style={notifIconStyles.wrapper}>
      <Text style={{ fontSize: 22 }}>🔥</Text>
    </View>
  )
}

function ShareIcon() {
  return (
    <View style={[notifIconStyles.wrapper, notifIconStyles.shareBg]}>
      <Text style={{ fontSize: 22 }}>📤</Text>
    </View>
  )
}

function ShieldIcon() {
  return (
    <View style={notifIconStyles.wrapper}>
      <Text style={{ fontSize: 22 }}>🛡️</Text>
    </View>
  )
}

function DoubleCheckIcon({ color }: { color: string }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Polyline points="9 11 12 14 22 4" />
      <Polyline points="2 12 5 15 9 11" />
    </Svg>
  )
}

interface NotificationItem {
  id: string
  icon: React.ReactNode
  title: string
  body: string
  time: string
  isUnread: boolean
}

// ─── NotificationCard Component ───────────────────────────────────────────────

interface NotificationCardProps {
  item: NotificationItem
  index: number
  isUnread: boolean
}

function NotificationCard({ item, index, isUnread: initialUnread }: NotificationCardProps) {
  const { t } = useTranslation()
  const [isUnread, setIsUnread] = useState(initialUnread)
  const [expanded, setExpanded] = useState(false)
  const scaleAnim = useRef(new Animated.Value(0.96)).current
  const fadeAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    setIsUnread(initialUnread)
  }, [initialUnread])

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 350,
        delay: index * 80,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        delay: index * 80,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
    ]).start()
  }, [])

  const handlePress = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    setExpanded(prev => !prev)
    if (isUnread) setIsUnread(false)
  }

  return (
    <Animated.View
      style={[
        { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
      ]}
    >
      <TouchableOpacity
        style={[styles.notifCard, isUnread && styles.unreadCard]}
        activeOpacity={0.78}
        onPress={handlePress}
      >
        {/* Icon */}
        <View style={styles.notifIconArea}>{item.icon}</View>

        {/* Text */}
        <View style={styles.notifContent}>
          <Text style={[styles.notifTitle, isUnread && styles.unreadTitle]} numberOfLines={expanded ? undefined : 1}>
            {item.title}
          </Text>
          <Text style={styles.notifBody} numberOfLines={expanded ? undefined : 2}>{item.body}</Text>
          <Text style={styles.notifTime}>{item.time}</Text>
        </View>

        {/* Expand indicator chevron */}
        <Text style={styles.expandChevron}>{expanded ? '▲' : '▼'}</Text>

        {/* Unread dot */}
        {isUnread && <View style={styles.unreadDot} />}
      </TouchableOpacity>
    </Animated.View>
  )
}

// ─── SectionHeader Component ──────────────────────────────────────────────────

function SectionLabel({ label }: { label: string }) {
  return (
    <View style={styles.sectionLabelRow}>
      <Text style={styles.sectionLabel}>{label}</Text>
    </View>
  )
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function NotificationScreen() {
  const { t } = useTranslation()
  const navigation = useAppNavigation()

  const todayNotifications: NotificationItem[] = [
    {
      id: '1',
      icon: <PartyBallIcon />,
      title: t('notification.item1Title'),
      body: t('notification.item1Body'),
      time: t('notification.item1Time'),
      isUnread: true,
    },
    {
      id: '2',
      icon: <StreakFlameIcon />,
      title: t('notification.item2Title'),
      body: t('notification.item2Body'),
      time: t('notification.item2Time'),
      isUnread: true,
    },
  ]

  const yesterdayNotifications: NotificationItem[] = [
    {
      id: '3',
      icon: <ShareIcon />,
      title: t('notification.item3Title'),
      body: t('notification.item3Body'),
      time: t('notification.item3Time'),
      isUnread: false,
    },
    {
      id: '4',
      icon: <ShieldIcon />,
      title: t('notification.item4Title'),
      body: t('notification.item4Body'),
      time: t('notification.item4Time'),
      isUnread: false,
    },
  ]

  const [todayItems, setTodayItems] = useState(todayNotifications)
  const [yesterdayItems, setYesterdayItems] = useState(yesterdayNotifications)

  const headerFade = useRef(new Animated.Value(0)).current
  const headerSlide = useRef(new Animated.Value(-12)).current

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerFade, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(headerSlide, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start()
  }, [])

  const markAllRead = () => {
    setTodayItems(prev => prev.map(n => ({ ...n, isUnread: false })))
    setYesterdayItems(prev => prev.map(n => ({ ...n, isUnread: false })))
  }

  const allRead = todayItems.every(n => !n.isUnread) && yesterdayItems.every(n => !n.isUnread)

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
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <ArrowLeft size={22} color="#FFFFFF" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>{t('notification.headerTitle')}</Text>

        <TouchableOpacity
          style={styles.markAllBtn}
          onPress={markAllRead}
          activeOpacity={0.7}
          disabled={allRead}
        >
          <Text style={[styles.markAllText, allRead && styles.markAllTextDone]}>
            {allRead ? t('notification.allRead') : t('notification.markAllRead')}
          </Text>
        </TouchableOpacity>
      </Animated.View>

      <View style={styles.divider} />

      {/* ── List ── */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Today */}
        <SectionLabel label={t('notification.today')} />
        {todayItems.map((item, idx) => (
          <NotificationCard key={item.id} item={item} index={idx} isUnread={item.isUnread} />
        ))}

        {/* Yesterday */}
        <SectionLabel label={t('notification.yesterday')} />
        {yesterdayItems.map((item, idx) => (
          <NotificationCard
            key={item.id}
            item={item}
            index={todayItems.length + idx}
            isUnread={item.isUnread}
          />
        ))}

        {/* End of feed */}
        <View style={styles.endFeed}>
          <DoubleCheckIcon color="#3A3B5C" />
          <Text style={styles.endFeedText}>{t('notification.endFeed')}</Text>
        </View>
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
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
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.2,
  },
  markAllBtn: {
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  markAllText: {
    color: '#8B5CF6',
    fontSize: 13,
    fontWeight: '700',
  },
  markAllTextDone: {
    color: '#484B68',
  },
  divider: {
    height: 1,
    backgroundColor: '#1E1F35',
  },
  scrollContent: {
    paddingHorizontal: 14,
    paddingBottom: 40,
    paddingTop: 8,
  },
  sectionLabelRow: {
    marginTop: 20,
    marginBottom: 10,
    marginLeft: 4,
  },
  sectionLabel: {
    color: '#484B68',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 1.4,
  },
  notifCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#111220',
    borderRadius: 18,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#1A1B2E',
    position: 'relative',
    overflow: 'hidden',
  },
  unreadCard: {
    backgroundColor: '#161730',
    borderColor: 'rgba(139, 92, 246, 0.25)',
  },
  notifIconArea: {
    marginRight: 14,
    marginTop: 2,
  },
  notifContent: {
    flex: 1,
    paddingRight: 12,
  },
  notifTitle: {
    color: '#C4C5E0',
    fontSize: 14.5,
    fontWeight: '600',
    marginBottom: 4,
  },
  unreadTitle: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  notifBody: {
    color: '#8E8FCA',
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 6,
  },
  notifTime: {
    color: '#484B68',
    fontSize: 11.5,
    fontWeight: '500',
  },
  unreadDot: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: '#8B5CF6',
  },
  expandChevron: {
    position: 'absolute',
    bottom: 10,
    right: 16,
    color: '#484B68',
    fontSize: 8,
  },
  endFeed: {
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 20,
    gap: 10,
  },
  endFeedText: {
    color: '#3A3B5C',
    fontSize: 13,
    fontWeight: '500',
  },
})

const notifIconStyles = StyleSheet.create({
  wrapper: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#1A1B30',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1E1F35',
  },
  flameBg: {
    backgroundColor: 'rgba(251, 146, 60, 0.1)',
    borderColor: 'rgba(251, 146, 60, 0.2)',
  },
  shareBg: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
})
