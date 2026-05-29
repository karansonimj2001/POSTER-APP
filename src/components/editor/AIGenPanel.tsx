/**
 * AI generation panel — text prompt input + generate button.
 */
import React from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import { WandIcon, LightningIcon } from '../Icons'
import { useTranslation } from 'react-i18next'

export default function AIGenPanel() {
  const { t } = useTranslation()
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{t('aiGenPanel.prompt')}</Text>
      <View style={styles.inputWrap}>
        <TextInput
          style={styles.textArea}
          placeholder={t('aiGenPanel.placeholder')}
          placeholderTextColor="#5c6373"
          multiline
          textAlignVertical="top"
        />
        <View style={styles.wandIcon}>
          <WandIcon size={18} color="#5c6373" />
        </View>
      </View>
      <TouchableOpacity style={styles.generateBtn} activeOpacity={0.8}>
        <LightningIcon size={18} color="#FFFFFF" />
        <Text style={styles.generateText}>{t('aiGenPanel.generate')}</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    width: '100%',
  },
  label: {
    color: '#717684',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 12,
    paddingLeft: 4,
  },
  inputWrap: {
    position: 'relative',
  },
  textArea: {
    backgroundColor: '#343b49',
    borderRadius: 16,
    padding: 20,
    color: '#E5E7EB',
    fontSize: 15,
    lineHeight: 22,
    minHeight: 145,
    textAlignVertical: 'top',
  },
  wandIcon: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    opacity: 0.6,
  },
  generateBtn: {
    backgroundColor: '#7f47f1',
    borderRadius: 16,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    shadowColor: '#7f47f1',
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  generateText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
    marginLeft: 6,
  },
})
