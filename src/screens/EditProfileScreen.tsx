/**
 * Edit profile screen — lets user update name, phone, language, location, interests.
 * Saves changes to UserContext + AsyncStorage.
 */
import React, { useState } from 'react'
import { View, Text, TouchableOpacity, Image, StatusBar, StyleSheet, ScrollView, TextInput, Modal, FlatList } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Svg, { Path, Circle } from 'react-native-svg'
import { CommonActions } from '@react-navigation/native'
import { useAppNavigation } from '../navigation/types'
import { ArrowLeft } from '../components/Icons'
import { useUser } from '../context/UserContext'
import { useTranslation } from 'react-i18next'
import { changeLanguage } from '../i18n'

function BackArrow({ size = 24, color = '#7C3AED' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <Path d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </Svg>
  )
}

function CameraSvg({ size = 16, color = '#FFFFFF' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill={color}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.172-1.172A2 2 0 009.828 3H6.172a2 2 0 00-1.414.586L3.586 4.707A1 1 0 012.879 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
      />
    </Svg>
  )
}

function InfoSvg({ size = 14, color = '#6B7280' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <Circle cx="12" cy="12" r="10" />
      <Path d="M12 16v-4" />
      <Path d="M12 8h.01" />
    </Svg>
  )
}

function ChevronDown({ size = 16, color = '#7C3AED' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <Path d="M6 9l6 6 6-6" />
    </Svg>
  )
}

function WhatsAppSvg({ size = 20, color = '#22C55E' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </Svg>
  )
}

const LANGUAGES = ['Hindi', 'English']
const STATES = ['Delhi', 'Mumbai', 'Bangalore', 'Bihar', 'Gujarat', 'Karnataka', 'Maharashtra', 'Punjab', 'Rajasthan', 'Tamil Nadu', 'Uttar Pradesh']

export default function EditProfileScreen() {
  const { t, i18n } = useTranslation()
  const navigation = useAppNavigation()
  const { user, setUser } = useUser()

  const [name, setName] = useState(user.name || '')
  const [language, setLanguage] = useState(user.language)
  const [state, setState] = useState(user.location)
  const [businessName, setBusinessName] = useState(user.businessName || '')
  const [whatsapp, setWhatsapp] = useState(user.phone)
  const [langModal, setLangModal] = useState(false)
  const [stateModal, setStateModal] = useState(false)

  const handleSave = async () => {
    await setUser({
      name,
      language,
      location: state,
      businessName,
      phone: whatsapp || user.phone,
    })
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'MainApp' }],
      })
    )
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor="#13151D" />

      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} activeOpacity={0.7}>
          <BackArrow size={24} color="#7C3AED" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('editProfile.headerTitle')}</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* ── Avatar ── */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarBorder}>
              <Image
                source={require('../../assets/images/user_avatar.png')}
                style={styles.avatarImg}
              />
            </View>
            <View style={styles.cameraBadge}>
              <CameraSvg size={14} color="#FFFFFF" />
            </View>
          </View>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.changePhotoText}>{t('editProfile.changePhoto')}</Text>
          </TouchableOpacity>
        </View>

        {/* ── Form ── */}
        <View style={styles.form}>
          {/* Name */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>{t('editProfile.nameLabel')}</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholderTextColor="#6B7280"
            />
          </View>

          {/* Phone */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>{t('editProfile.phoneLabel')}</Text>
            <View style={[styles.input, styles.phoneInput]}>
              <Text style={styles.phoneText}>{t('editProfile.phoneDisplay', { phone: user.phone || '98765 43210' })}</Text>
            </View>
            <View style={styles.phoneNoteRow}>
              <InfoSvg size={14} color="#6B7280" />
              <Text style={styles.phoneNote}>{t('editProfile.changeNumber')}</Text>
            </View>
          </View>

          {/* Language */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>{t('editProfile.languageLabel')}</Text>
            <TouchableOpacity style={styles.dropdown} onPress={() => setLangModal(true)} activeOpacity={0.7}>
              <Text style={styles.dropdownText}>{language}</Text>
              <ChevronDown size={20} color="#7C3AED" />
            </TouchableOpacity>
          </View>

          {/* State */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>{t('editProfile.stateLabel')}</Text>
            <TouchableOpacity style={styles.dropdown} onPress={() => setStateModal(true)} activeOpacity={0.7}>
              <Text style={styles.dropdownText}>{state}</Text>
              <ChevronDown size={20} color="#7C3AED" />
            </TouchableOpacity>
          </View>

          {/* Business Name */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>{t('editProfile.businessLabel')}</Text>
            <TextInput
              style={styles.input}
              value={businessName}
              onChangeText={setBusinessName}
              placeholder={t('editProfile.businessHint')}
              placeholderTextColor="#6B7280"
            />
          </View>

          {/* WhatsApp */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>{t('editProfile.whatsappLabel')}</Text>
            <View style={styles.whatsappRow}>
              <View style={styles.whatsappIconWrap}>
                <WhatsAppSvg size={20} color="#22C55E" />
              </View>
              <TextInput
                style={[styles.input, styles.whatsappInput]}
                value={whatsapp}
                onChangeText={setWhatsapp}
                placeholder={t('editProfile.whatsappPlaceholder')}
                placeholderTextColor="#6B7280"
                keyboardType="phone-pad"
              />
            </View>
          </View>

          {/* ── Action Buttons ── */}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.9}>
              <Text style={styles.saveBtnText}>{t('editProfile.save')}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
              <Text style={styles.cancelBtnText}>{t('editProfile.cancel')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Language Modal */}
      <Modal visible={langModal} transparent animationType="fade" onRequestClose={() => setLangModal(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setLangModal(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('editProfile.selectLang')}</Text>
            {LANGUAGES.map(lang => (
              <TouchableOpacity
                key={lang}
                style={[styles.modalItem, language === lang && styles.modalItemActive]}
                onPress={() => { setLanguage(lang); setLangModal(false); changeLanguage(lang === 'Hindi' ? 'hi' : 'en') }}
              >
                <Text style={[styles.modalItemText, language === lang && styles.modalItemTextActive]}>
                  {lang}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* State Modal */}
      <Modal visible={stateModal} transparent animationType="fade" onRequestClose={() => setStateModal(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setStateModal(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('editProfile.selectState')}</Text>
            {STATES.map(st => (
              <TouchableOpacity
                key={st}
                style={[styles.modalItem, state === st && styles.modalItemActive]}
                onPress={() => { setState(st); setStateModal(false) }}
              >
                <Text style={[styles.modalItemText, state === st && styles.modalItemTextActive]}>
                  {st}
                </Text>
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
    backgroundColor: '#13151D',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },

  // ── Header ──
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1f2937',
  },
  backBtn: {
    marginRight: 24,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // ── Avatar ──
  avatarSection: {
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 40,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  avatarBorder: {
    width: 112,
    height: 112,
    borderRadius: 56,
    borderWidth: 4,
    borderColor: '#7C3AED',
    padding: 4,
    overflow: 'hidden',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    borderRadius: 48,
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: '#7C3AED',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#13151D',
  },
  changePhotoText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    color: '#9CA3AF',
    textTransform: 'uppercase',
  },

  // ── Form ──
  form: {
    paddingHorizontal: 24,
  },
  fieldGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  input: {
    width: '100%',
    backgroundColor: '#1C1E26',
    borderWidth: 1,
    borderColor: '#2D313E',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    color: '#FFFFFF',
    fontSize: 16,
  },
  phoneInput: {
    borderStyle: 'dashed',
  },
  phoneText: {
    color: '#6B7280',
    fontSize: 16,
  },
  phoneNoteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  phoneNote: {
    fontSize: 11,
    color: '#6B7280',
    marginLeft: 4,
  },

  // ── Dropdown ──
  dropdown: {
    width: '100%',
    backgroundColor: '#1C1E26',
    borderWidth: 1,
    borderColor: '#2D313E',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    color: '#FFFFFF',
    fontSize: 16,
  },

  // ── WhatsApp ──
  whatsappRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  whatsappIconWrap: {
    position: 'absolute',
    left: 16,
    zIndex: 1,
  },
  whatsappInput: {
    paddingLeft: 48,
  },

  // ── Actions ──
  actions: {
    alignItems: 'center',
    paddingTop: 40,
  },
  saveBtn: {
    width: '100%',
    backgroundColor: '#7C3AED',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
    marginBottom: 24,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  cancelBtnText: {
    color: '#9CA3AF',
    fontSize: 16,
    fontWeight: '500',
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
    backgroundColor: '#1C1E26',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2D313E',
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
    backgroundColor: 'rgba(124,58,237,0.15)',
  },
  modalItemText: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  modalItemTextActive: {
    color: '#7C3AED',
    fontWeight: '600',
  },
})