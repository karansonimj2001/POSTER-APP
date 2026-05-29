/**
 * AI input bar used on PosterDetailScreen — floating text input with send arrow.
 */
import React, { useRef, useState, useEffect } from 'react'
import { View, TextInput, TouchableOpacity, Animated, StyleSheet, Dimensions } from 'react-native'
import { KeyboardController } from 'react-native-keyboard-controller'
import { ArrowUpIcon } from './Icons'
import { useTranslation } from 'react-i18next'

const screenWidth = Dimensions.get('window').width
const BAR_HEIGHT = 84
const BAR_WIDTH = Math.min(screenWidth - 32, 340)

interface AIInputBarProps {
  translateY: any
  opacity: any
  onSubmit: (text: string) => void
}

export default function AIInputBar({ translateY, opacity, onSubmit }: AIInputBarProps) {
  const { t } = useTranslation()
  const [text, setText] = useState('')
  const inputRef = useRef<TextInput>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus()
    }, 450)
    return () => clearTimeout(timer)
  }, [])

  const handleSubmit = () => {
    const trimmed = text.trim()
    if (trimmed) {
      KeyboardController.dismiss()
      onSubmit(trimmed)
    }
  }

  return (
    <Animated.View style={[styles.wrapper, { transform: [{ translateY }], opacity }]}>  

      <View style={styles.container}>
        <TextInput
          ref={inputRef}
          style={styles.input}
          placeholder={t('aiInputBar.placeholder')}
          placeholderTextColor="#6B7280"
          value={text}
          onChangeText={setText}
          onSubmitEditing={handleSubmit}
          returnKeyType="send"
        />
        <TouchableOpacity
          style={styles.submitBtn}
          activeOpacity={0.8}
          onPress={handleSubmit}
        >
          <ArrowUpIcon size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 98,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 50,
  },
  container: {
    width: BAR_WIDTH,
    height: BAR_HEIGHT,
    backgroundColor: '#11141b',
    borderRadius: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 24,
    paddingRight: 6,
    paddingVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  input: {
    flex: 1,
    color: '#D1D5DB',
    fontSize: 14,
    fontWeight: '500',
    height: '100%',
    marginRight: 12,
  },
  submitBtn: {
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
})
