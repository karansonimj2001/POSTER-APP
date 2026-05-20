import React, { useEffect, useRef } from 'react'
import { SafeAreaView, View, Text, StyleSheet, Animated, Dimensions, TouchableOpacity, ScrollView, Image } from 'react-native'
import { useNavigation } from '@react-navigation/native'

let screenWidth = Dimensions.get('window').width
let screenHeight = Dimensions.get('window').height

let cards = [
  { id: 1, bgColor: '#1A1A2E', rotate: '-5deg' },
  { id: 2, bgColor: '#13132B', rotate: '0deg' },
  { id: 3, bgColor: '#1A1A35', rotate: '5deg' },
  { id: 4, bgColor: '#0D0D1A', rotate: '-2deg' },
]

export default function Landing() {
  let navigation = useNavigation<any>()
  let slideUpAnim = useRef(new Animated.Value(screenHeight)).current
  let scrollRef = useRef<any>(null)
  let scrollX = useRef(new Animated.Value(0)).current
  
  useEffect(() => {
    let scrollVal = 0
    let myTimer = setInterval(() => {
      scrollVal = scrollVal + screenWidth * 0.65 + 20 
      if (scrollVal > (cards.length - 1) * (screenWidth * 0.65 + 20)) {
        scrollVal = 0 
      }
      if(scrollRef.current != null) {
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
    <SafeAreaView style={appStyles.mainBg}>
      
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
          Make Every Day{'\n'}Feel Special
        </Text>
        
        <Text style={{ fontSize: 14, color: '#64748B', marginBottom: 20 }}>
          Get personalized wishes, quotes & posts — in your language, with your face.
        </Text>
        
        <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 30 }}>
          <Text style={{ color: '#F59E0B' }}>50 lakh+ log roz share karte hain </Text>
          🇮🇳
        </Text>
        
        <TouchableOpacity style={appStyles.btnStyle} onPress={gotoLogin}>
          <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Get Started</Text>
          <Text style={{ color: 'white', fontSize: 22, fontWeight: 'bold' }}>→</Text>
        </TouchableOpacity>
      </Animated.View>

    </View>
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
