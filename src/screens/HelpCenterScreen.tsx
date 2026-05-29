/**
 * Help center FAQ — searchable accordion with categorized questions
 * (Account, Designing, Payments).
 */
import React, { useState, useRef, useMemo } from 'react'
import {
  View, Text, TextInput, ScrollView, TouchableOpacity, Animated, StyleSheet, StatusBar,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAppNavigation } from '../navigation/types'
import { useTranslation } from 'react-i18next'
import { SearchIcon, ChevronRightIcon, ChevronDownIcon } from '../components/Icons'
import { SvgIcon } from '../components/SvgIcon'

const faqSections = {
  account: {
    label: 'Account',
    data: [
      { q: 'How do I add my own photo to a poster?', a: "Tap the 'Uploads' tab in the editor, select 'Upload Files' to choose an image from your device, and then simply drag and drop the photo onto your canvas." },
      { q: 'Can I use posters for commercial purposes?', a: 'Yes, all posters created with Pro features or our library assets can be used for commercial purposes, including social media marketing and print advertising.' },
      { q: 'How do I cancel my Pro subscription?', a: "Go to Settings \u203a Subscription \u203a Manage Plan and select 'Cancel Subscription'. Your Pro benefits will remain active until the end of your current billing cycle." },
      { q: 'My WhatsApp sharing isn\'t working.', a: 'Ensure you have the latest version of WhatsApp installed. If the issue persists, try saving the poster to your gallery first and sharing it directly from there.' },
    ],
  },
  designing: {
    label: 'Designing',
    data: [
      { q: 'How do I change font styles?', a: 'Navigate to the Text panel in the editor, select your text element, and use the font dropdown to browse and apply any available font style from our library.' },
      { q: 'How to use AI generation?', a: 'Tap the AI button in the toolbar, type a prompt describing the image or design you want, and hit Generate. The result will appear directly on your canvas.' },
      { q: 'Adjusting canvas dimensions manually.', a: 'Go to File \u203a Canvas Size, enter your desired width and height in pixels or cm, and tap Apply. You can also resize by dragging the canvas edges in the editor.' },
    ],
  },
  payments: {
    label: 'Payments',
    data: [
      { q: 'What is the refund policy?', a: 'We offer a 7-day refund policy for all Pro subscriptions. To request a refund, go to Settings \u203a Billing and tap \'Request Refund\'. Refunds are processed within 5\u20137 business days.' },
      { q: 'How to update billing info?', a: 'Go to Settings \u203a Billing \u203a Payment Method and tap \'Edit\'. You can update your card number, expiry date, and billing address there anytime.' },
    ],
  },
}

type TabKey = keyof typeof faqSections

export default function HelpCenterScreen() {
  const { t } = useTranslation()
  const navigation = useAppNavigation()
  const [activeTab, setActiveTab] = useState<TabKey>('account')
  const [search, setSearch] = useState('')
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({})

  const tabScrollRef = useRef<ScrollView>(null)

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'account', label: t('helpCenter.tabAccount') },
    { key: 'designing', label: t('helpCenter.tabDesigning') },
    { key: 'payments', label: t('helpCenter.tabPayments') },
  ]

  const toggleItem = (sectionKey: TabKey, index: number) => {
    const id = `${sectionKey}-${index}`
    setOpenItems(prev => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const isOpen = (sectionKey: TabKey, index: number) => {
    return !!openItems[`${sectionKey}-${index}`]
  }

  const filteredSections = useMemo(() => {
    const q = search.toLowerCase().trim()
    if (!q) return faqSections

    const result: Partial<Record<TabKey, typeof faqSections.account>> = {}
    for (const key of Object.keys(faqSections) as TabKey[]) {
      const filtered = faqSections[key].data.filter(item =>
        item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q),
      )
      if (filtered.length > 0) {
        result[key] = { label: faqSections[key].label, data: filtered }
      }
    }
    return result as Record<TabKey, typeof faqSections.account>
  }, [search])

  const visibleTabs = useMemo(() => {
    if (!search.trim()) return tabs
    return tabs.filter(t => filteredSections[t.key])
  }, [search, filteredSections, tabs])

  const renderSection = (sectionKey: TabKey) => {
    const section = filteredSections[sectionKey]
    if (!section) return null

    const helpCenterOffsets: Record<TabKey, number> = { account: 0, designing: 4, payments: 7 }

    return (
      <View key={sectionKey} style={styles.sectionBlock}>
        <Text style={styles.sectionLabel}>{t('helpCenter.tab' + sectionKey.charAt(0).toUpperCase() + sectionKey.slice(1))}</Text>
        <View style={styles.faqList}>
          {section.data.map((item, idx) => {
            const open = isOpen(sectionKey, idx)
            const qNum = helpCenterOffsets[sectionKey] + idx + 1
            return (
              <TouchableOpacity
                key={idx}
                style={[styles.faqItem, open && styles.faqItemOpen]}
                activeOpacity={0.75}
                onPress={() => toggleItem(sectionKey, idx)}
              >
                <View style={styles.faqHeader}>
                  <Text style={[styles.faqQ, open && styles.faqQOpen]} numberOfLines={open ? undefined : 2}>
                    {t(`helpCenter.q${qNum}Question`)}
                  </Text>
                  {open ? (
                    <ChevronDownIcon size={18} color="#A78BFA" />
                  ) : (
                    <ChevronRightIcon size={18} color="#666" />
                  )}
                </View>
                {open && (
                  <Text style={styles.faqAnswer}>{t(`helpCenter.q${qNum}Answer`)}</Text>
                )}
              </TouchableOpacity>
            )
          })}
        </View>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor="#12111A" />

      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <SvgIcon name="arrowLeft" size={22} color="#A78BFA" />
        </TouchableOpacity>
        <Text style={styles.title}>{t('helpCenter.headerTitle')}</Text>
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <View style={styles.searchIconWrap}>
          <SearchIcon size={16} color="#666" />
        </View>
        <TextInput
          style={styles.searchInput}
          placeholder={t('helpCenter.searchPlaceholder')}
          placeholderTextColor="#666"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Filtered Tabs */}
      {visibleTabs.length > 1 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabsScroll}
          contentContainerStyle={styles.tabsContent}
        >
          {tabs.map(tab => {
            const isActive = activeTab === tab.key
            const hidden = search.trim() && !filteredSections[tab.key]
            if (hidden) return null
            return (
              <TouchableOpacity
                key={tab.key}
                style={[styles.tab, isActive && styles.tabActive]}
                activeOpacity={0.8}
                onPress={() => setActiveTab(tab.key)}
              >
                <Text style={[styles.tabText, isActive && styles.tabTextActive]}>{tab.label}</Text>
              </TouchableOpacity>
            )
          })}
        </ScrollView>
      )}

      {/* FAQ Sections */}
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderSection(activeTab)}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#12111A',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  backBtn: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
  },
  searchWrap: {
    marginHorizontal: 16,
    marginBottom: 16,
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1C2E',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 44,
  },
  searchIconWrap: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#CCC',
    fontSize: 14,
    height: '100%',
  },
  tabsScroll: {
    maxHeight: 44,
    marginBottom: 24,
  },
  tabsContent: {
    paddingHorizontal: 16,
    gap: 10,
    flexDirection: 'row',
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#5B3FA0',
    backgroundColor: 'transparent',
  },
  tabActive: {
    backgroundColor: '#7C3AED',
    borderColor: '#7C3AED',
  },
  tabText: {
    color: '#A78BFA',
    fontSize: 14,
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  sectionBlock: {
    marginBottom: 28,
  },
  sectionLabel: {
    color: '#888',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.3,
    textTransform: 'uppercase',
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  faqList: {
    paddingHorizontal: 16,
    gap: 8,
  },
  faqItem: {
    backgroundColor: '#1E1C2E',
    borderRadius: 12,
    overflow: 'hidden',
  },
  faqItemOpen: {
    backgroundColor: '#1E1C2E',
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    gap: 10,
  },
  faqQ: {
    color: '#E0E0E0',
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
    lineHeight: 20,
  },
  faqQOpen: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  faqAnswer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    color: '#A78BFA',
    fontSize: 13,
    lineHeight: 21,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
})
