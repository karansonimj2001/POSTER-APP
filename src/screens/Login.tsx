import React, { useRef, useEffect, useState } from 'react'
import { SafeAreaView, View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Animated, Dimensions, Alert } from 'react-native'
import { useNavigation, CommonActions } from '@react-navigation/native'

let screenHeight = Dimensions.get('window').height

export default function LoginContainer() {
 
  let navigation = useNavigation<any>()
  let slideAnim = useRef(new Animated.Value(screenHeight)).current
  
  const [ph, setPh] = useState('')
  const [isOtp, setIsOtp] = useState(false)
  const [err, setErr] = useState(false)
  const [timer, setTimer] = useState(45)
  const [otpErr, setOtpErr] = useState(false)
  let shakeAnim = useRef(new Animated.Value(0)).current

  const triggerShake = () => {
    shakeAnim.setValue(0)
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 80, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 80, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 80, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 80, useNativeDriver: true }),
    ]).start()
  }

  const clearOtpErr = () => {
    setOtpErr(false)
  }

  const [otp1, setOtp1] = useState('')
  const [otp2, setOtp2] = useState('')
  const [otp3, setOtp3] = useState('')
  const [otp4, setOtp4] = useState('')

  let ref1 = useRef<any>(null)
  let ref2 = useRef<any>(null)
  let ref3 = useRef<any>(null)
  let ref4 = useRef<any>(null)

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 600,
      useNativeDriver: true,
    }).start()
  }, [])

  useEffect(() => {
    let interval: any = null
    if (isOtp && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1)
      }, 1000)
    } else if (timer === 0) {
      clearInterval(interval)
    }
    return () => clearInterval(interval)
  }, [isOtp, timer])

  const handleSubmit = (e?: any) => {
    if (isOtp == false) {
      if (ph.length == 10) {
        setErr(false)
        setTimer(45)
        setIsOtp(true) 
      } else {
        setErr(true) 
      }
    } else {
      const enteredOtp = otp1 + otp2 + otp3 + otp4
      if (enteredOtp === '1234') {
        setOtpErr(false)
        Alert.alert("Success", "Logged In", [
          {
            text: "OK",
            onPress: () => {
              navigation.navigate('Language')
            }
          }
        ])
      } else {
        setOtpErr(true)
        triggerShake()
        if (enteredOtp === '4321') {
          Alert.alert("Error", "Incorrect OTP! You entered 4321, which is incorrect. Please enter 1234.")
        } else {
          Alert.alert("Error", "Wrong OTP! Please enter the correct OTP (1234).")
        }
        setOtp1('')
        setOtp2('')
        setOtp3('')
        setOtp4('')
        if (ref1.current) ref1.current.focus()
      }
    }
  }

  const handleResend = () => {
    setTimer(45)
    setOtp1('')
    setOtp2('')
    setOtp3('')
    setOtp4('')
    if (ref1.current) ref1.current.focus()
    Alert.alert("OTP Sent", "A new OTP has been sent to +91 " + ph)
  }

  return (
    <SafeAreaView style={[mystyles.mainWrapper, { display: 'flex', flexDirection: 'column' }]}>
      <Animated.View style={[mystyles.contentDiv, { transform: [{ translateY: slideAnim }] }]}>
        
        <View style={{display: 'flex', alignItems: 'center', marginBottom: 50}}>
          <View style={mystyles.logo_container}>
            <Image 
              source={require('../../assets/images/icon.png')} 
              style={{width: '100%', height: '100%', borderRadius: 16}} 
            />
          </View>
          <Text style={mystyles.purpleText}>WELCOME</Text>
        </View>

        <Text style={{color: 'white', fontSize: 32, fontWeight: 'bold', marginBottom: 12}}>Enter your phone{'\n'}number</Text>
        <Text style={{color: '#94A3B8', fontSize: 15, marginBottom: 20}}>We'll send a quick OTP. No spam, ever.</Text>
        
        {isOtp == false ? (
          <View style={mystyles.badge}>
            <Text style={{color: '#22C55E', fontSize: 10, fontWeight: 'bold'}}>🔒 YOUR NUMBER IS 100% SECURE</Text>
          </View>
        ) : null}

        <View style={{flexDirection: 'row', marginBottom: 8}}>
          <View style={{ flex: 1 }} />
          {err == true && isOtp == false ? <Text style={{color: 'red', fontWeight: 'bold'}}>Incorrect Number ✕</Text> : null}
          {isOtp == true ? <Text style={{color: '#A855F7', fontWeight: 'bold'}}>OTP Sent ✓</Text> : null}
        </View>

        <View style={mystyles.formControl}>
          {ph.length == 10 && err == false ? <Text style={{fontSize: 18, marginRight: 8}}>🇮🇳</Text> : null}
          
          <Text style={{fontSize: 16, fontWeight: 'bold', color: 'black', marginRight: 12}}>+91</Text>
          <View style={{width: 1, height: 24, backgroundColor: 'gray', marginRight: 12}} />
          
          <TextInput 
            style={[mystyles.textInp, err == true && isOtp == false ? { color: 'red' } : null]}
            placeholder="Enter Number"
            placeholderTextColor="gray"
            keyboardType="numeric"
            value={ph}
            editable={!isOtp}
            maxLength={10}
            onChangeText={(t) => {
              setPh(t)
              setErr(false)
            }}
          />
        </View>

        {isOtp == true ? (
          <View style={{alignItems: 'center', marginBottom: 24}}>
            <Animated.View style={{flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 16, transform: [{ translateX: shakeAnim }] }}>
              
              <TextInput ref={ref1} style={[mystyles.otpBox, otpErr ? { borderColor: '#EF4444', color: '#EF4444' } : null]} value={otp1} maxLength={1} keyboardType="numeric" textAlign="center" placeholder="-" placeholderTextColor="gray"
                onChangeText={(t) => {
                  setOtp1(t)
                  clearOtpErr()
                  if(t != '') { ref2.current.focus() }
                }}
              />
              <TextInput ref={ref2} style={[mystyles.otpBox, otpErr ? { borderColor: '#EF4444', color: '#EF4444' } : null]} value={otp2} maxLength={1} keyboardType="numeric" textAlign="center" placeholder="-" placeholderTextColor="gray"
                onChangeText={(t) => {
                  setOtp2(t)
                  clearOtpErr()
                  if(t != '') { ref3.current.focus() }
                }}
                onKeyPress={({nativeEvent}) => { if(nativeEvent.key === 'Backspace' && otp2 == '') ref1.current.focus() }}
              />
              <TextInput ref={ref3} style={[mystyles.otpBox, otpErr ? { borderColor: '#EF4444', color: '#EF4444' } : null]} value={otp3} maxLength={1} keyboardType="numeric" textAlign="center" placeholder="-" placeholderTextColor="gray"
                onChangeText={(t) => {
                  setOtp3(t)
                  clearOtpErr()
                  if(t != '') { ref4.current.focus() }
                }}
                onKeyPress={({nativeEvent}) => { if(nativeEvent.key === 'Backspace' && otp3 == '') ref2.current.focus() }}
              />
              <TextInput ref={ref4} style={[mystyles.otpBox, otpErr ? { borderColor: '#EF4444', color: '#EF4444' } : null]} value={otp4} maxLength={1} keyboardType="numeric" textAlign="center" placeholder="-" placeholderTextColor="gray"
                onChangeText={(t) => {
                  setOtp4(t)
                  clearOtpErr()
                }}
                onKeyPress={({nativeEvent}) => { if(nativeEvent.key === 'Backspace' && otp4 == '') ref3.current.focus() }}
              />

            </Animated.View>
            <View style={{backgroundColor: 'rgba(34, 197, 94, 0.2)', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20}}>
              <Text style={{color: '#22C55E', fontWeight: 'bold'}}>✔ OTP auto-detected</Text>
            </View>
          </View>
        ) : null}

        <TouchableOpacity style={mystyles.submitBtn} onPress={handleSubmit}>
          <Text style={{color: 'white', fontWeight: 'bold', fontSize: 16}}>
            {isOtp ? 'CONTINUE  →' : 'SEND OTP  →'}
          </Text>
        </TouchableOpacity>

        {isOtp ? (
          <View style={{ alignItems: 'center', marginTop: 10 }}>
            {timer > 0 ? (
              <Text style={{ color: 'gray', fontSize: 13, textAlign: 'center' }}>
                Didn't receive code? <Text style={{ color: '#A855F7', fontWeight: 'bold' }}>Resend in 0:{timer < 10 ? `0${timer}` : timer}</Text>
              </Text>
            ) : (
              <TouchableOpacity onPress={handleResend} activeOpacity={0.7}>
                <Text style={{ color: '#A855F7', fontSize: 14, fontWeight: 'bold', textDecorationLine: 'underline' }}>
                  Resend OTP
                </Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <Text style={{ color: 'gray', fontSize: 10, textAlign: 'center' }}>
            By continuing, you agree to{'\n'}our{'\n'}
            <Text style={{ color: '#8B5CF6' }}>Terms of Service</Text> · <Text style={{ color: '#8B5CF6' }}>Privacy Policy</Text>
          </Text>
        )}

      </Animated.View>
    </SafeAreaView>
  )
}

const mystyles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    backgroundColor: '#0F0F13',
  },
  contentDiv: {
    flex: 1,
    padding: 24,
    paddingTop: 80,
  },
  logo_container: {
    width: 60,
    height: 60,
    borderRadius: 16,
    marginBottom: 16,
    backgroundColor: '#1E1E2E',
    shadowColor: '#A855F7',
    shadowOpacity: 0.6,
    shadowRadius: 25,
  },
  purpleText: {
    color: '#A855F7',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 3,
  },
  badge: {
    backgroundColor: '#131A20',
    alignSelf: 'flex-start',
    padding: 10,
    borderRadius: 8,
    marginBottom: 40,
  },
  formControl: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    paddingLeft: 16,
    paddingRight: 16,
    height: 60,
    marginBottom: 24,
  },
  textInp: {
    flex: 1,
    fontSize: 16,
    color: 'black',
  },
  otpBox: {
    width: 60,
    height: 60,
    backgroundColor: '#1A1A2E',
    borderWidth: 1,
    borderColor: '#2E1F6E',
    borderRadius: 12,
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  submitBtn: {
    backgroundColor: '#8B5CF6',
    borderRadius: 16,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
})
