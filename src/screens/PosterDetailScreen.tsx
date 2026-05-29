/**
 * Poster detail view — shows a full-size poster preview with AI assistant,
 * download/share/link actions. Accessed from HomeScreen, TemplatesScreen, etc.
 */
import React, { useState, useRef, useCallback, useEffect } from 'react'
import {
  View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions,
  StatusBar, Image, Platform, ScrollView, BackHandler, TextInput, Alert,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { KeyboardController, KeyboardAvoidingView } from 'react-native-keyboard-controller'
import { useRoute } from '@react-navigation/native'
import type { RouteProp } from '@react-navigation/native'
import { useAppNavigation, type RootStackParamList } from '../navigation/types'
import { SparklesIcon, DownloadIcon, LinkIcon, ChatIcon, ArrowUpIcon } from '../components/Icons'
import PosterPreviewCard from '../components/PosterPreviewCard'
import { SvgIcon } from '../components/SvgIcon'
import AIResultCard from '../components/AIResultCard'
import { useTranslation } from 'react-i18next'

export default function PosterDetailScreen() {
  const { t } = useTranslation()
  const navigation = useAppNavigation()
  const route = useRoute<RouteProp<RootStackParamList, 'PosterDetail'>>()
  const poster = route.params?.poster
  const isHighlight = poster?.type === 'highlight'
  const hasImage = !!poster?.image

  // AI Assistant state (same as HomeScreen)
  const [phase, setPhase] = useState<'idle' | 'input' | 'result'>('idle')
  const [queryText, setQueryText] = useState('')
  const [inputText, setInputText] = useState('')

  const fabScale = useRef(new Animated.Value(1)).current
  const inputSlide = useRef(new Animated.Value(0)).current
  const inputOpacity = useRef(new Animated.Value(0)).current
  const resultScale = useRef(new Animated.Value(0.8)).current
  const resultOpacity = useRef(new Animated.Value(0)).current
  const backdropOpacity = useRef(new Animated.Value(0)).current

  const animateToInput = useCallback(() => {
    setPhase('input')
    Animated.parallel([
      Animated.timing(fabScale, { toValue: 0, useNativeDriver: false, duration: 200 }),
      Animated.sequence([
        Animated.delay(80),
        Animated.parallel([
          Animated.timing(inputSlide, { toValue: 1, useNativeDriver: false, duration: 350 }),
          Animated.timing(inputOpacity, { toValue: 1, useNativeDriver: false, duration: 250 }),
        ]),
      ]),
    ]).start()
  }, [])

  const animateToResult = useCallback((text: string) => {
    KeyboardController.dismiss()
    setQueryText(text)
    setPhase('result')
    Animated.parallel([
      Animated.timing(inputOpacity, { toValue: 0, useNativeDriver: false, duration: 150 }),
      Animated.sequence([
        Animated.delay(80),
        Animated.parallel([
          Animated.timing(backdropOpacity, { toValue: 1, useNativeDriver: false, duration: 250 }),
          Animated.timing(resultOpacity, { toValue: 1, useNativeDriver: false, duration: 300 }),
          Animated.timing(resultScale, { toValue: 1, useNativeDriver: false, duration: 300 }),
        ]),
      ]),
    ]).start()
  }, [])

  const animateToIdle = useCallback(() => {
    KeyboardController.dismiss()
    Animated.parallel([
      Animated.timing(backdropOpacity, { toValue: 0, useNativeDriver: false, duration: 200 }),
      Animated.timing(resultOpacity, { toValue: 0, useNativeDriver: false, duration: 200 }),
      Animated.timing(resultScale, { toValue: 0.8, useNativeDriver: false, duration: 200 }),
      Animated.timing(inputSlide, { toValue: 0, useNativeDriver: false, duration: 200 }),
      Animated.timing(inputOpacity, { toValue: 0, useNativeDriver: false, duration: 200 }),
      Animated.sequence([
        Animated.delay(150),
        Animated.timing(fabScale, { toValue: 1, useNativeDriver: false, duration: 250 }),
      ]),
    ]).start(() => setPhase('idle'))
  }, [])

  // Hardware back button → dismiss AI flow (goes back to idle, doesn't navigate away)
  useEffect(() => {
    const onBackPress = () => {
      if (phase !== 'idle') {
        animateToIdle()
        return true   // We handled the back press
      }
      return false    // Let the system handle it (go to previous screen)
    }
    const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress)
    return () => sub.remove()
  }, [phase, animateToIdle])

  // When user navigates away (blur event), reset all AI animations to initial state
  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      KeyboardController.dismiss()
      fabScale.setValue(1)
      inputSlide.setValue(0)
      inputOpacity.setValue(0)
      resultScale.setValue(0.8)
      resultOpacity.setValue(0)
      backdropOpacity.setValue(0)
      setPhase('idle')
    })
    return unsubscribe
  }, [navigation])

  const renderPosterCard = () => {
    if (isHighlight) {
      return (
        <View style={[styles.highlightCard, { backgroundColor: poster.color || '#6B7280' }]}>
          <Text style={styles.highlightCardTitle}>{poster.title || t('posterDetail.fallbackTitle')}</Text>
        </View>
      )
    }

    if (hasImage) {
      return (
        <View style={styles.posterCard}>
          <Image source={poster.image} style={styles.posterImage} resizeMode="cover" />
          <Text style={styles.posterCardTitle}>{poster.title}</Text>
        </View>
      )
    }

    return (
      <PosterPreviewCard
        name={t('posterDetail.name')}
        role={t('posterDetail.role')}
        estYear={t('posterDetail.estYear')}
        studioSeries={t('posterDetail.studioSeries')}
        safeWorkLabel={t('posterDetail.safeWork')}
        variant="detail"
      />
    )
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0B14" />
      <KeyboardAvoidingView>

        {/* ── Top Navigation Bar ── */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <SvgIcon name="arrowLeft" size={22} color="#9CA3AF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{poster?.title || 'Poster'}</Text>
          <TouchableOpacity style={styles.editBtn} activeOpacity={0.7} onPress={() => navigation.navigate('PosterEditor')}>
            <Text style={styles.editBtnText}>{t('posterDetail.edit')}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

          {/* ── Poster Preview Card ── */}
          {renderPosterCard()}

          {/* ── Action Panel ── */}
          <View style={styles.actionPanel}>
            <TouchableOpacity style={styles.actionCol} activeOpacity={0.7} onPress={() => Alert.alert(t('posterDetail.download'), t('posterDetail.downloadMessage'))}>
              <View style={styles.actionIconBox}>
                <DownloadIcon size={22} color="#A78BFA" />
              </View>
              <Text style={styles.actionLabel}>{t('posterDetail.download')}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCol} activeOpacity={0.7}>
              <View style={[styles.actionIconBox, styles.actionIconPlain]}>
                <SvgIcon name="arrowRight" size={20} color="#9CA3AF" />
              </View>
              <Text style={styles.actionLabel}>{t('posterDetail.share')}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCol} activeOpacity={0.7}>
              <View style={[styles.actionIconBox, styles.actionIconGreen]}>
                <ChatIcon size={22} color="#25D366" />
              </View>
              <Text style={[styles.actionLabel, styles.actionLabelGreen]}>{t('posterDetail.whatsapp')}</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>

      </KeyboardAvoidingView>

        {/* ── AI FAB ── */}
        {phase === 'idle' && (
          <Animated.View style={[styles.fabBtn, { transform: [{ scale: fabScale }], opacity: fabScale }]}>
            <TouchableOpacity style={styles.fabTouchable} activeOpacity={0.8} onPress={animateToInput}>
              <SparklesIcon size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* ── AI Input Bar (direct, no Animated) ── */}
        {phase === 'input' && (
          <View style={styles.directInputBar}>
            <TextInput
              style={styles.directInput}
              placeholder={t('posterDetail.aiPrompt')}
              placeholderTextColor="#6B7280"
              value={inputText}
              onChangeText={setInputText}
              autoFocus
              onSubmitEditing={() => {
                const trimmed = inputText.trim()
                if (trimmed) {
                  KeyboardController.dismiss()
                  animateToResult(trimmed)
                }
              }}
              returnKeyType="send"
            />
            <TouchableOpacity
              style={styles.directSubmitBtn}
              activeOpacity={0.8}
              onPress={() => {
                const trimmed = inputText.trim()
                if (trimmed) {
                  KeyboardController.dismiss()
                  animateToResult(trimmed)
                }
              }}
            >
              <ArrowUpIcon size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        )}

        {/* ── AI Result Card ── */}
        {phase === 'result' && (
          <AIResultCard
            scale={resultScale}
            opacity={resultOpacity}
            backdropOpacity={backdropOpacity}
            queryText={queryText}
            onClose={animateToIdle}
          />
        )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0B14',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  backBtn: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    color: '#A78BFA',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: -0.3,
  },
  editBtn: {
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  editBtnText: {
    color: '#A78BFA',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 40,
  },
  posterCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 40,
    paddingVertical: 40,
    paddingHorizontal: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 15,
    marginBottom: 40,
  },
  posterImage: {
    width: '100%',
    height: 300,
    borderRadius: 24,
    marginBottom: 16,
  },
  posterCardTitle: {
    color: '#0A0B14',
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.3,
    textAlign: 'center',
  },
  highlightCard: {
    width: '100%',
    borderRadius: 40,
    paddingVertical: 80,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 15,
    marginBottom: 40,
  },
  highlightCardTitle: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: -0.5,
    textAlign: 'center',
  },

  actionPanel: {
    width: '100%',
    backgroundColor: '#151724',
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  actionCol: {
    alignItems: 'center',
    gap: 8,
  },
  actionIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(167,139,250,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionIconPlain: {
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  actionIconGreen: {
    backgroundColor: 'rgba(37,211,102,0.1)',
  },
  actionLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#6B7280',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  actionLabelGreen: {
    color: '#25D366',
  },
  directInputBar: {
    position: 'absolute',
    bottom: 98,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 50,
  },
  directInput: {
    width: Math.min(Dimensions.get('window').width - 32, 340),
    height: 84,
    backgroundColor: '#11141b',
    borderRadius: 32,
    color: '#D1D5DB',
    fontSize: 14,
    fontWeight: '500',
    paddingLeft: 24,
    paddingRight: 64,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    elevation: 12,
  },
  directSubmitBtn: {
    position: 'absolute',
    right: 16,
    top: 16,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#A78BFA',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#A78BFA',
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 8,
  },
  fabBtn: {
    position: 'absolute',
    bottom: 98,
    left: 24,
    zIndex: 40,
  },
  fabTouchable: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#A78BFA',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#A78BFA',
    shadowOpacity: 0.6,
    shadowRadius: 15,
    elevation: 8,
  },
})
