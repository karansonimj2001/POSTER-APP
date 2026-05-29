/**
 * Poster editor — renders PosterPreviewCard + EditorToolbar.
 * Switches between panels: AI, Text, Photo, Stickers, Background, Filters.
 */
import React, { useState } from 'react'
import {
  View, Text, StyleSheet, TouchableOpacity,
  StatusBar, ScrollView,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAppNavigation } from '../navigation/types'
import { ArrowLeft, UndoIcon, RedoIcon, DownloadIcon, ShareOutIcon, ChatIcon, SparklesIcon } from '../components/Icons'
import PosterPreviewCard from '../components/PosterPreviewCard'
import { SvgIcon } from '../components/SvgIcon'
import EditorToolbar, { EditorTab } from '../components/editor/EditorToolbar'
import AIGenPanel from '../components/editor/AIGenPanel'
import TextPanel from '../components/editor/TextPanel'
import PhotoPanel from '../components/editor/PhotoPanel'
import StickersPanel from '../components/editor/StickersPanel'
import FilterPanel from '../components/editor/FilterPanel'
import BackgroundPanel from '../components/editor/BackgroundPanel'
import { useTranslation } from 'react-i18next'

export default function EditorScreen() {
  const { t } = useTranslation()
  const navigation = useAppNavigation()
  // Which editor panel is currently visible (6 options: ai, text, photo, stickers, background, filters)
  const [activeTab, setActiveTab] = useState<EditorTab>('ai')

  // Renders the active feature panel below the toolbar
  const renderPanel = () => {
    switch (activeTab) {
      case 'ai': return <AIGenPanel />
      case 'text': return <TextPanel />
      case 'photo': return <PhotoPanel />
      case 'stickers': return <StickersPanel />
      case 'background': return <BackgroundPanel />
      case 'filters': return <FilterPanel />
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor="#12141d" />

      {/* ── Top Navigation Bar ── */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <ArrowLeft size={22} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerTitle}>{t('editor.headerTitle')}</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerAction} activeOpacity={0.6}>
            <UndoIcon size={20} color="#9CA3AF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerAction} activeOpacity={0.6}>
            <RedoIcon size={20} color="#9CA3AF" />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.6} onPress={() => navigation.goBack()}>
            <Text style={styles.saveText}>{t('editor.save')}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Main Content ── */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        <PosterPreviewCard
          name={t('editor.name')}
          role={t('editor.role')}
          estYear={t('editor.estYear')}
          studioSeries={t('editor.studioSeries')}
          safeWorkLabel={t('editor.safeWork')}
          variant="editor"
        />

        {/* ── Editor Toolbar (6 tabs) ── */}
        <EditorToolbar activeTab={activeTab} onTabChange={setActiveTab} />

        {/* ── Active Feature Panel ── */}
        {renderPanel()}

        {/* ── Engagement Banner ── */}
        <View style={styles.banner}>
          <View style={styles.bannerAccent} />
          <View style={styles.bannerContent}>
            <View style={styles.bannerIconWrap}>
              <SparklesIcon size={18} color="#FBBF24" />
            </View>
            <Text style={styles.bannerText}>
              {t('editor.engagement1')}<Text style={styles.bannerHighlight}>{t('editor.engagementHighlight')}</Text>{'\n'}
              {t('editor.engagement2')}
            </Text>
          </View>
        </View>

      </ScrollView>

      {/* ── Bottom Navigation (unchanged) ── */}
      <View style={styles.bottomNav}>
        <View style={styles.navRow}>
          <TouchableOpacity style={styles.navItem} activeOpacity={0.6} onPress={() => navigation.goBack()}>
            <View style={styles.navIconActive}>
              <DownloadIcon size={22} color="#1C1917" />
            </View>
            <Text style={styles.navLabelActive}>{t('editor.saveNav')}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} activeOpacity={0.6}>
            <View style={styles.navIconBox}>
              <DownloadIcon size={22} color="#9CA3AF" />
            </View>
            <Text style={styles.navLabel}>{t('editor.downloadNav')}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} activeOpacity={0.6}>
            <View style={styles.navIconBox}>
              <ShareOutIcon size={22} color="#9CA3AF" />
            </View>
            <Text style={styles.navLabel}>{t('editor.shareNav')}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} activeOpacity={0.6}>
            <View style={styles.navIconBox}>
              <ChatIcon size={22} color="#25D366" />
            </View>
            <Text style={[styles.navLabel, { color: '#25D366' }]}>{t('editor.whatsappNav')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#12141d',
  },
  header: {
    backgroundColor: '#1a1c26',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1F2937',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    color: '#D1D5DB',
    fontSize: 18,
    fontWeight: '700',
  },
  headerAction: {
    padding: 2,
  },
  saveText: {
    color: '#7C4DFF',
    fontSize: 16,
    fontWeight: '700',
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 16,
    paddingBottom: 24,
  },

  banner: {
    width: '100%',
    maxWidth: 350,
    backgroundColor: '#1a1c26',
    borderRadius: 16,
    flexDirection: 'row',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#1F2937',
    marginTop: 20,
  },
  bannerAccent: {
    width: 6,
    backgroundColor: '#F59E0B',
  },
  bannerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    gap: 12,
  },
  bannerIconWrap: {
    marginTop: 2,
  },
  bannerText: {
    flex: 1,
    color: '#D1D5DB',
    fontSize: 12,
    lineHeight: 18,
  },
  bannerHighlight: {
    color: '#F59E0B',
    fontWeight: '700',
  },
  bottomNav: {
    backgroundColor: '#0F111A',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.5,
    shadowRadius: 25,
    elevation: 10,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    maxWidth: 350,
    alignSelf: 'center',
    width: '100%',
  },
  navItem: {
    alignItems: 'center',
    gap: 4,
  },
  navIconActive: {
    backgroundColor: '#F59E0B',
    padding: 10,
    borderRadius: 12,
  },
  navIconBox: {
    padding: 10,
  },
  navLabelActive: {
    color: '#F59E0B',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  navLabel: {
    color: '#9CA3AF',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
})
