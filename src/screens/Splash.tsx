/**
 * Animated splash screen with twinkling stars and a progress bar.
 * After 8 seconds checks onboarding status – navigates to MainApp or Landing.
 */
import React, { useEffect, useRef, useState } from 'react'
import { View, Text, StyleSheet, Animated, Dimensions, Easing, Image, StatusBar } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { CommonActions } from '@react-navigation/native'
import { useAppNavigation } from '../navigation/types'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useTranslation } from 'react-i18next'

// Screen dimensions for positioning stars and animations
const sw = Dimensions.get('window').width
const sh = Dimensions.get('window').height

// Defines a single animated star: position (x), visual properties (size, opacity), and animation timing (speed, delay)
interface StarData {
  id: number
  x: number
  size: number
  speed: number
  delay: number
  op: number
}

// Generate 30 stars with random positions, sizes, speeds, and delays
// Each star is an independent animated element that scrolls upward
const myStars: StarData[] = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  x: Math.random() * sw,             // Random horizontal position across screen width
  size: Math.random() * 3 + 1,        // Random size: 1–4 pixels
  speed: Math.random() * 4000 + 4000, // Random duration: 4–8 seconds for full vertical scroll
  delay: Math.random() * 2500,        // Random delay: 0–2.5 seconds before starting
  op: Math.random() * 0.5 + 0.2,      // Random opacity: 0.2–0.7
}))

export default function Splash() {
  const { t } = useTranslation()
  const navigation = useAppNavigation()
  const [isStarted, setIsStarted] = useState(false)

  // Animated values start at 0 (invisible) and animate to 1 (fully visible)
  const logoScale = useRef(new Animated.Value(0)).current
  const textFade = useRef(new Animated.Value(0)).current
  const subFade = useRef(new Animated.Value(0)).current
  const progBar = useRef(new Animated.Value(0)).current
  const starAnims = useRef(myStars.map(() => new Animated.Value(0))).current

  useEffect(() => {
    // Mark animation as started so stars render
    setIsStarted(true)

    // ── Start all 30 star animation loops ──
    // Each star independently scrolls from bottom to top at its own speed
    starAnims.forEach((anim: Animated.Value, idx: number) => {
      const s = myStars[idx]
      Animated.loop(
        Animated.sequence([
          Animated.delay(s.delay),         // Wait before first appearance
          Animated.timing(anim, {           // Scroll from 0 to 1
            toValue: 1,
            duration: s.speed,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ])
      ).start()
    })

    // Logo bounces in using spring physics (overshoot + settle)
    Animated.spring(logoScale, {
      toValue: 1,
      friction: 7,
      tension: 50,
      useNativeDriver: true,
    }).start()

    // Title fades in after 500ms delay
    Animated.timing(textFade, {
      toValue: 1,
      duration: 700,
      delay: 500,
      useNativeDriver: true,
    }).start()

    // Subtitle fades in after 900ms delay
    Animated.timing(subFade, {
      toValue: 1,
      duration: 600,
      delay: 900,
      useNativeDriver: false, // non-native because it affects layout (width)
    }).start()

    // Progress bar animates from 0% to 100% over 3 seconds (starts at 1.2s)
    Animated.timing(progBar, {
      toValue: 1,
      duration: 3000,
      delay: 1200,
      useNativeDriver: false,
    }).start()

    // After 8 seconds total, check if user has completed onboarding
    const timer = setTimeout(async () => {
      try {
        const done = await AsyncStorage.getItem('onboardingDone')
        if (done === 'true') {
          // User already completed onboarding → go directly to MainApp
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'MainApp' }],
            })
          )
        } else {
          // New user → send to Landing page (marketing)
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'Landing' }],
            })
          )
        }
      } catch (_e) {
        // On error, default to Landing
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'Landing' }],
          })
        )
      }
    }, 8000)

    // Cleanup: cancel timer if component unmounts
    return () => clearTimeout(timer)
  }, [])

  return (
    <SafeAreaView style={spStyles.bg} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor="#0D0D1A" />

      {isStarted && myStars.map((s: StarData, i: number) => {
        let mUp = starAnims[i].interpolate({
          inputRange: [0, 1],
          outputRange: [sh, -50],
        })
        return (
          <Animated.View
            key={s.id}
            style={{
              position: 'absolute', top: 0, left: s.x, width: s.size, height: s.size,
              borderRadius: 999, backgroundColor: 'white', opacity: s.op,
              transform: [{ translateY: mUp }],
            }}
          />
        )
      })}

      <Animated.Image
        source={require('../../assets/images/icon.png')}
        style={{
          width: 110, height: 110, borderRadius: 24, marginBottom: 24,
          transform: [{ scale: logoScale }], opacity: logoScale,
        }}
        resizeMode="cover"
      />

      <Animated.Text style={{ color: 'white', fontSize: 28, fontWeight: 'bold', marginBottom: 8, opacity: textFade }}>
        {t('splash.posterMaker')}
      </Animated.Text>

      <Animated.Text style={{ color: '#8888AA', fontSize: 15, opacity: subFade }}>
        {t('splash.tagline')}
      </Animated.Text>

      <View style={{ position: 'absolute', bottom: 60, alignItems: 'center', width: '100%' }}>
        <View style={{ width: 150, height: 3, backgroundColor: '#2E1F6E', borderRadius: 3, overflow: 'hidden', marginBottom: 12 }}>
          <Animated.View
            style={{
              height: '100%', backgroundColor: '#7B2FFF', borderRadius: 3,
              width: progBar.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            }}
          />
        </View>
        <Text style={{ color: '#4A4A6A', fontSize: 10, fontWeight: 'bold' }}>{t('splash.loading')}</Text>
      </View>
    </SafeAreaView>
  )
}

const spStyles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: '#0D0D1A',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
