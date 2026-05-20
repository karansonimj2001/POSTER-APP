import React, { useEffect, useRef, useState } from 'react'
import { View, Text, StyleSheet, Animated, Dimensions, Easing, Image, StatusBar } from 'react-native'
import { useNavigation, CommonActions } from '@react-navigation/native'

let sw = Dimensions.get('window').width
let sh = Dimensions.get('window').height

let myStars: any = []
for (let i = 0; i < 30; i++) {
  myStars.push({
    id: i,
    x: Math.random() * sw,
    size: Math.random() * 3 + 1,
    speed: Math.random() * 4000 + 4000,
    delay: Math.random() * 2500,
    op: Math.random() * 0.5 + 0.2,
  })
}

export default function Splash() {
  let navigation = useNavigation<any>()
  let [isStarted, setIsStarted] = useState(false)

  let logoScale = useRef(new Animated.Value(0)).current
  let textFade = useRef(new Animated.Value(0)).current
  let subFade = useRef(new Animated.Value(0)).current
  let progBar = useRef(new Animated.Value(0)).current
  let starAnims = useRef(myStars.map(() => new Animated.Value(0))).current

  useEffect(() => {
    setIsStarted(true)

    starAnims.forEach((anim: any, idx: number) => {
      let s = myStars[idx]
      Animated.loop(
        Animated.sequence([
          Animated.delay(s.delay),
          Animated.timing(anim, {
            toValue: 1,
            duration: s.speed,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ])
      ).start()
    })

    Animated.spring(logoScale, {
      toValue: 1,
      friction: 7,
      tension: 50,
      useNativeDriver: true,
    }).start()

    Animated.timing(textFade, {
      toValue: 1,
      duration: 700,
      delay: 500,
      useNativeDriver: true,
    }).start()

    Animated.timing(subFade, {
      toValue: 1,
      duration: 600,
      delay: 900,
      useNativeDriver: false,
    }).start()

    Animated.timing(progBar, {
      toValue: 1,
      duration: 3000,
      delay: 1200,
      useNativeDriver: false,
    }).start()

    let t = setTimeout(() => {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Landing' }],
        })
      )
    }, 8000)

    return () => clearTimeout(t)
  }, [])

  return (
    <View style={spStyles.bg}>
      <StatusBar barStyle="light-content" backgroundColor="#0D0D1A" />

      {isStarted == true ? myStars.map((s: any, i: number) => {
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
      }) : null}

      <Animated.Image
        source={require('../../assets/images/icon.png')}
        style={{
          width: 110, height: 110, borderRadius: 24, marginBottom: 24,
          transform: [{ scale: logoScale }], opacity: logoScale,
        }}
        resizeMode="cover"
      />

      <Animated.Text style={{ color: 'white', fontSize: 28, fontWeight: 'bold', marginBottom: 8, opacity: textFade }}>
        Poster Maker
      </Animated.Text>

      <Animated.Text style={{ color: '#8888AA', fontSize: 15, opacity: subFade }}>
        Make every occasion special
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
        <Text style={{ color: '#4A4A6A', fontSize: 10, fontWeight: 'bold' }}>LOADING...</Text>
      </View>
    </View>
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
