/**
 * Horizontal toolbar for the poster editor — switches between AI, Text, Photo,
 * Stickers, Background, and Filters panels.
 */
import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import { SparklesIcon, TextIcon, CameraIcon, StickerIcon, LayersIcon, FilterIcon } from '../Icons'
import { useTranslation } from 'react-i18next'

export type EditorTab = 'ai' | 'text' | 'photo' | 'stickers' | 'background' | 'filters'

interface EditorToolbarProps {
  activeTab: EditorTab
  onTabChange: (tab: EditorTab) => void
}

const tabs: { key: EditorTab; label: string; Icon: React.ComponentType<any> }[] = [
  { key: 'ai', label: 'editorToolbar.ai', Icon: SparklesIcon },
  { key: 'text', label: 'editorToolbar.text', Icon: TextIcon },
  { key: 'photo', label: 'editorToolbar.photo', Icon: CameraIcon },
  { key: 'stickers', label: 'editorToolbar.stickers', Icon: StickerIcon },
  { key: 'background', label: 'editorToolbar.background', Icon: LayersIcon },
  { key: 'filters', label: 'editorToolbar.filters', Icon: FilterIcon },
]

export default function EditorToolbar({ activeTab, onTabChange }: EditorToolbarProps) {
  const { t } = useTranslation()
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} nestedScrollEnabled contentContainerStyle={styles.scrollContainer}>
      {tabs.map(({ key, label, Icon }) => {
        const isActive = key === activeTab
        return (
          <TouchableOpacity
            key={key}
            style={styles.tabItem}
            activeOpacity={0.7}
            onPress={() => onTabChange(key)}
          >
            {isActive ? (
              <View style={styles.activeWrap}>
                <Icon size={22} color="#FFFFFF" />
                <Text style={styles.activeLabel}>{t(label)}</Text>
              </View>
            ) : (
              <>
                <Icon size={22} color="#6B7280" />
                <Text style={styles.tabLabel}>{t(label)}</Text>
              </>
            )}
          </TouchableOpacity>
        )
      })}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    backgroundColor: '#131b2e',
    borderRadius: 40,
    height: 60,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.4,
    shadowRadius: 25,
    elevation: 10,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 6,
  },
  activeWrap: {
    backgroundColor: '#8b5cf6',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 6,
    alignItems: 'center',
    shadowColor: '#8b5cf6',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  tabLabel: {
    color: '#6B7280',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginTop: 4,
    textTransform: 'uppercase',
  },
  activeLabel: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginTop: 4,
    textTransform: 'uppercase',
  },
})
