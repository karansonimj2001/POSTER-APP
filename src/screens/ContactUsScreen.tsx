/**
 * Contact us form — user can select a subject (General / Technical / Billing),
 * enter a message, and send it.
 */
import React, { useState } from 'react'
import { View, Text, TouchableOpacity, StatusBar, StyleSheet, ScrollView, TextInput, Modal } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Svg, { Path } from 'react-native-svg'
import { useTranslation } from 'react-i18next'
import { useAppNavigation } from '../navigation/types'

function BackArrow({ size = 24, color = '#8B5CF6' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <Path d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </Svg>
  )
}

function WhatsAppSvg({ size = 24, color = '#00E676' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.185-.573c.948.517 2.031.815 3.146.815 3.182 0 5.768-2.586 5.768-5.766 0-3.18-2.586-5.766-5.768-5.766zm3.29 8.12c-.144.405-.833.78-1.155.827-.291.043-.669.074-1.116-.071-.274-.088-.614-.216-1.047-.402-1.844-.792-3.041-2.66-3.133-2.783-.093-.123-.757-.999-.757-1.913 0-.913.48-1.36.65-1.543.171-.183.37-.229.493-.229.123 0 .247.001.353.006.113.005.263-.043.412.316.154.37.524 1.272.57 1.364.046.092.077.2.015.323-.061.123-.092.2-.184.307l-.278.324c-.092.108-.19.227-.082.413.108.185.48.792 1.03 1.28.708.629 1.303.824 1.488.916.185.093.293.077.401-.047.108-.123.462-.539.585-.724.123-.185.247-.154.416-.092.17.062 1.077.508 1.262.601.185.093.308.139.354.216.046.077.046.446-.097.852z" />
    </Svg>
  )
}

function EmailSvg({ size = 24, color = '#8B5CF6' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <Path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </Svg>
  )
}

function ChevronDown({ size = 20, color = '#6B7280' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <Path d="M6 9l6 6 6-6" />
    </Svg>
  )
}

function SendArrow({ size = 20, color = '#FFFFFF' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <Path d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </Svg>
  )
}

interface SupportCardProps {
  icon: React.ReactNode
  title: string
  subtitle: string
  badgeColor: string
  badgeText: string
}

function SupportCard({ icon, title, subtitle, badgeColor, badgeText }: SupportCardProps) {
  return (
    <View style={styles.supportCard}>
      <View style={[styles.supportIconWrap, { backgroundColor: `${badgeColor}1A` }]}>
        {icon}
      </View>
      <View>
        <Text style={styles.supportTitle}>{title}</Text>
        {subtitle ? <Text style={styles.supportSubtitle}>{subtitle}</Text> : null}
        <Text style={[styles.supportBadge, { color: badgeColor }]}>{badgeText}</Text>
      </View>
    </View>
  )
}

const SUBJECTS = ['General Inquiry', 'Technical Support', 'Billing']
const SUBJECT_KEYS = ['contactUs.subjectGeneral', 'contactUs.subjectTech', 'contactUs.subjectBilling']
// Subject labels are translated at render time

export default function ContactUsScreen() {
  const { t } = useTranslation()
  const navigation = useAppNavigation()
  const [subject, setSubject] = useState('General Inquiry')
  const [message, setMessage] = useState('')
  const [showSubjectModal, setShowSubjectModal] = useState(false)

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor="#0B0E14" />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* ── Header ── */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} activeOpacity={0.7}>
            <BackArrow size={24} color="#8B5CF6" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('contactUs.headerTitle')}</Text>
        </View>

        {/* ── Hero ── */}
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>{t('contactUs.heroTitle')}</Text>
          <Text style={styles.heroSub}>{t('contactUs.heroSub')}</Text>
        </View>

        {/* ── Support Cards ── */}
        <View style={styles.supportRow}>
          <SupportCard
            icon={<WhatsAppSvg size={24} color="#00E676" />}
            title={t('contactUs.whatsappTitle')}
            subtitle=""
            badgeColor="#00E676"
            badgeText={t('contactUs.whatsappBadge')}
          />
          <SupportCard
            icon={<EmailSvg size={24} color="#8B5CF6" />}
            title={t('contactUs.emailTitle')}
            subtitle=""
            badgeColor="#6B7280"
            badgeText={t('contactUs.emailBadge')}
          />
        </View>

        {/* ── Form Card ── */}
        <View style={styles.formCard}>
          {/* Subject */}
          <View style={styles.formField}>
            <Text style={styles.formLabel}>{t('contactUs.subject')}</Text>
            <TouchableOpacity style={styles.dropdown} onPress={() => setShowSubjectModal(true)} activeOpacity={0.7}>
              <Text style={styles.dropdownText}>{t(SUBJECT_KEYS[SUBJECTS.indexOf(subject)])}</Text>
              <ChevronDown size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Message */}
          <View style={styles.formField}>
            <Text style={styles.formLabel}>{t('contactUs.message')}</Text>
            <TextInput
              style={styles.textArea}
              placeholder={t('contactUs.messagePlaceholder')}
              placeholderTextColor="#6B7280"
              value={message}
              onChangeText={setMessage}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* Send Button */}
          <TouchableOpacity style={styles.sendBtn} activeOpacity={0.9}>
            <Text style={styles.sendBtnText}>{t('contactUs.sendMessage')}</Text>
            <SendArrow size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Subject Modal */}
      <Modal visible={showSubjectModal} transparent animationType="fade" onRequestClose={() => setShowSubjectModal(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowSubjectModal(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('contactUs.selectSubject')}</Text>
            {SUBJECTS.map((s, i) => (
              <TouchableOpacity
                key={i}
                style={[styles.modalItem, subject === s && styles.modalItemActive]}
                onPress={() => { setSubject(s); setShowSubjectModal(false) }}
              >
                <Text style={[styles.modalItemText, subject === s && styles.modalItemTextActive]}>{t(SUBJECT_KEYS[i])}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0E14',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },

  // ── Header ──
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingTop: 8,
    marginBottom: 24,
  },
  backBtn: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // ── Hero ──
  hero: {
    marginBottom: 32,
  },
  heroTitle: {
    fontSize: 30,
    fontWeight: '700',
    letterSpacing: -0.5,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  heroSub: {
    fontSize: 16,
    color: '#9CA3AF',
    lineHeight: 24,
  },

  // ── Support Cards ──
  supportRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  supportCard: {
    flex: 1,
    backgroundColor: '#161B26',
    borderRadius: 24,
    padding: 20,
    justifyContent: 'space-between',
    minHeight: 160,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  supportIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  supportTitle: {
    fontWeight: '700',
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 18,
    marginBottom: 4,
  },
  supportSubtitle: {
    color: '#9CA3AF',
    fontSize: 12,
    marginBottom: 4,
  },
  supportBadge: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },

  // ── Form ──
  formCard: {
    backgroundColor: '#161B26',
    borderRadius: 24,
    padding: 32,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  formField: {
    marginBottom: 32,
  },
  formLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    color: '#6B7280',
    textTransform: 'uppercase',
    marginBottom: 16,
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  textArea: {
    fontSize: 18,
    color: '#FFFFFF',
    padding: 0,
    minHeight: 100,
  },
  sendBtn: {
    width: '100%',
    backgroundColor: '#8B5CF6',
    paddingVertical: 20,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 30,
    elevation: 10,
  },
  sendBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },

  // ── Modal ──
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#161B26',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 4,
  },
  modalItemActive: {
    backgroundColor: 'rgba(139,92,246,0.15)',
  },
  modalItemText: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  modalItemTextActive: {
    color: '#8B5CF6',
    fontWeight: '600',
  },
})