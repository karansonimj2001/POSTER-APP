/**
 * Marketing landing page with auto-scrolling preview cards.
 * Tapping "Get Started" navigates to Login.
 */
import { Dimensions, StyleSheet, View, Text, TouchableOpacity, Image, Animated, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import React, { useEffect, useRef } from 'react'
import { SvgIcon } from '../components/SvgIcon';

import { useAppNavigation } from '../navigation/types'
import { useTranslation } from 'react-i18next'

const screenWidth = Dimensions.get('window').width
const screenHeight = Dimensions.get('window').height

const cards = [
  { id: 1, bgColor: '#1A1A2E', rotate: '-5deg' },
  { id: 2, bgColor: '#13132B', rotate: '0deg' },
  { id: 3, bgColor: '#1A1A35', rotate: '5deg' },
  { id: 4, bgColor: '#0D0D1A', rotate: '-2deg' },
]

export default function Landing() {
  const { t } = useTranslation()
  const navigation = useAppNavigation()
  const slideUpAnim = useRef(new Animated.Value(screenHeight)).current
  const scrollRef = useRef<ScrollView>(null)
  const scrollX = useRef(new Animated.Value(0)).current

  useEffect(() => {
    let scrollVal = 0
    const myTimer = setInterval(() => {
      scrollVal = scrollVal + screenWidth * 0.65 + 20
      if (scrollVal > (cards.length - 1) * (screenWidth * 0.65 + 20)) {
        scrollVal = 0
      }
      if (scrollRef.current !== null) {
        scrollRef.current.scrollTo({ x: scrollVal, animated: true })
      }
    }, 2000)

    return () => {
      clearInterval(myTimer)
    }
  }, [])

  useEffect(() => {
    Animated.timing(slideUpAnim, {
      toValue: 0,
      duration: 800,
      delay: 300,
      useNativeDriver: true,
    }).start()
  }, [])

  function gotoLogin() {
    navigation.navigate('Login')
  }

  return (
    <SafeAreaView style={appStyles.mainBg} edges={['top', 'bottom']}>
      
      {/* top part */}
      <View style={{ flex: 1, justifyContent: 'center', paddingTop: 50, paddingBottom: screenHeight * 0.35 }}>
        <ScrollView 
          ref={scrollRef}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: screenWidth * 0.15, alignItems: 'center' }}
          snapToInterval={screenWidth * 0.65 + 20}
          decelerationRate="fast"
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false }
          )}
        >
          {cards.map((item, index) => (
            <View key={item.id} style={[appStyles.imgBox, { transform: [{ rotate: item.rotate }] }]}>
              <Image 
                source={require('../../assets/images/floating-cluster.png')} 
                style={{ width: '100%', height: '100%' }} 
                resizeMode="contain"
              />
            </View>
          ))}
        </ScrollView>
      </View>

      <Animated.View style={[appStyles.btmSheet, { transform: [{ translateY: slideUpAnim }] }]}>
        
        <View style={{ width: 60, height: 4, backgroundColor: '#E2E8F0', borderRadius: 2, marginBottom: 20, overflow: 'hidden' }}>
          <Animated.View 
            style={{
              width: 30, height: 4, backgroundColor: '#7B2FFF', borderRadius: 2,
              transform: [{ 
                translateX: scrollX.interpolate({
                  inputRange: [0, (cards.length - 1) * (screenWidth * 0.65 + 20)],
                  outputRange: [0, 30],
                  extrapolate: 'clamp'
                }) 
              }] 
            }} 
          />
        </View>
        
        <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#1E1E2E', marginBottom: 12 }}>
          {t('landing.heading')}
        </Text>
        
        <Text style={{ fontSize: 14, color: '#64748B', marginBottom: 20 }}>
          {t('landing.subtitle')}
        </Text>
        
        <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 30 }}>
          <Text style={{ color: '#F59E0B' }}>{t('landing.socialProof')}</Text>
          <SvgIcon name="indiaFlag" size={24} color="#FFFFFF" />
        </Text>
        
        <TouchableOpacity style={appStyles.btnStyle} onPress={gotoLogin}>
          <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>{t('landing.getStarted')}</Text>
          <SvgIcon name="arrowRight" size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </Animated.View>

    </SafeAreaView>
  )
}

const appStyles = StyleSheet.create({
  mainBg: {
    flex: 1,
    backgroundColor: '#0A0A12',
  },
  imgBox: {
    width: screenWidth * 0.65,
    height: screenHeight * 0.4,
    marginHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btmSheet: {
    backgroundColor: '#F8FAFC',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 30,
    paddingBottom: 40,
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  btnStyle: {
    backgroundColor: '#7B2FFF',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
})

