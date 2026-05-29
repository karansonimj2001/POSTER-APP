/**
 * Onboarding step 5 — pick an Indian state from a searchable list.
 * Saves location to OnboardingContext, then navigates to OnboardingComplete.
 */
import React, { useState, useRef, useEffect, useContext } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, Dimensions, TextInput, StatusBar, Alert } from 'react-native'
import { useAppNavigation } from '../navigation/types'
import { useTranslation } from 'react-i18next'
import { OnboardingContext } from '../onboarding/OnboardingContext'

const screenWidth = Dimensions.get('window').width
const screenHeight = Dimensions.get('window').height

interface StateItem {
  id: string;
  name: string;
  nameHindi: string;
}

const STATES_LIST: StateItem[] = [
  { id: 'bihar', name: 'Bihar', nameHindi: 'बिहार' },
  { id: 'delhi', name: 'Delhi', nameHindi: 'दिल्ली' },
  { id: 'gujarat', name: 'Gujarat', nameHindi: 'गुजरात' },
  { id: 'karnataka', name: 'Karnataka', nameHindi: 'कर्नाटक' },
  { id: 'madhya_pradesh', name: 'Madhya Pradesh', nameHindi: 'मध्य प्रदेश' },
  { id: 'punjab', name: 'Punjab', nameHindi: 'पंजाब' },
  { id: 'rajasthan', name: 'Rajasthan', nameHindi: 'राजस्थान' },
  { id: 'tamil_nadu', name: 'Tamil Nadu', nameHindi: 'तमिलनाडु' },
  { id: 'uttar_pradesh', name: 'Uttar Pradesh', nameHindi: 'उत्तर प्रदेश' },
  { id: 'maharashtra', name: 'Maharashtra', nameHindi: 'महाराष्ट्र' },
]

// Custom Search Glass Icon using pure CSS
const SearchIcon = () => (
  <View style={styles.searchIconOuter}>
    <View style={styles.searchIconCircle} />
    <View style={styles.searchIconLine} />
  </View>
)

// Custom Location Pin Icon using pure CSS
const PinIcon = () => (
  <View style={styles.pinIconContainer}>
    <View style={styles.pinCircleOuter}>
      <View style={styles.pinCircleInner} />
    </View>
    <View style={styles.pinPoint} />
  </View>
)

// Custom Right Chevron Arrow using pure CSS
const ChevronRight = () => (
  <View style={styles.chevronContainer}>
    <View style={[styles.chevronLine, { transform: [{ rotate: '45deg' }], top: 5 }]} />
    <View style={[styles.chevronLine, { transform: [{ rotate: '-45deg' }], top: 11 }]} />
  </View>
)

export default function StateSelection({ route }: any) {
  const { t } = useTranslation()
  const navigation = useAppNavigation()
  const onboarding = useContext(OnboardingContext)
  const [selectedStateId, setSelectedStateId] = useState<string>('bihar') // Default Bihar like screenshot
  const [searchQuery, setSearchQuery] = useState('')

  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(30)).current

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start()
  }, [])

  const handleContinue = () => {
    if (!selectedStateId) {
      Alert.alert(t('stateSelection.requiredTitle'), t('stateSelection.requiredMessage'))
      return
    }
    const stateNameObj = STATES_LIST.find(s => s.id === selectedStateId);
    const stateLabel = stateNameObj ? stateNameObj.name : 'Bihar';
    
    const nextParams = {
      language: route.params?.language || 'Hindi',
      purpose: route.params?.purpose || 'For Myself',
      name: route.params?.name || 'User1',
      state: stateLabel
    };

    onboarding?.setData(prev => ({ ...prev, location: stateLabel }));
    navigation.navigate('OnboardingComplete', nextParams);
  }

  const handleBack = () => {
    navigation.goBack()
  }

  const handleGPSLocation = () => {
    Alert.alert(t('stateSelection.gpsTitle'), t('stateSelection.gpsMessage'))
    setSelectedStateId('delhi') // Simulate GPS change
  }

  const filteredStates = STATES_LIST.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.nameHindi.includes(searchQuery)
  )

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0D0E1C" />

      {/* Header Bar */}
      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.backBtn} activeOpacity={0.7} onPress={handleBack}>
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('stateSelection.headerTitle')}</Text>
        <View style={styles.backBtnPlaceholder} />
      </View>
      <View style={styles.headerLine} />

      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          
          {/* Progress Dots */}
          <View style={styles.progressContainer}>
            <View style={styles.inactiveProgress} />
            <View style={styles.inactiveProgress} />
            <View style={styles.inactiveProgress} />
            <View style={styles.activeProgress} />
            <View style={styles.inactiveProgress} />
          </View>

          {/* Last Step Badge */}
          <View style={styles.badgeBanner}>
            <Text style={styles.badgeText}>{t('stateSelection.lastStep')}</Text>
          </View>

          {/* Headings */}
          <Text style={styles.mainHeading}>{t('stateSelection.heading')}</Text>
          <Text style={styles.subHeading}>{t('stateSelection.headingEn')}</Text>
          <Text style={styles.descText}>{t('stateSelection.subtitle')}</Text>

          {/* Search Box */}
          <View style={styles.searchWrapper}>
            <SearchIcon />
            <TextInput 
              style={styles.searchInput}
              placeholder={t('stateSelection.searchPlaceholder')}
              placeholderTextColor="#484B68"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* GPS Location Button Card */}
          <TouchableOpacity 
            style={styles.gpsCard} 
            activeOpacity={0.8}
            onPress={handleGPSLocation}
          >
            <View style={styles.gpsLeftContainer}>
              <View style={styles.gpsIconCircle}>
                <PinIcon />
              </View>
              <View style={styles.gpsTextWrapper}>
                <Text style={styles.gpsTitle}>{t('stateSelection.useLocation')}</Text>
                <Text style={styles.gpsSubtitle}>{t('stateSelection.gpsLabel')}</Text>
              </View>
            </View>
            <ChevronRight />
          </TouchableOpacity>

          {/* Section Title */}
          <Text style={styles.sectionTitle}>{t('stateSelection.allStates')}</Text>

          {/* States List */}
          <View style={styles.statesListContainer}>
            {filteredStates.map((state) => {
              const isSelected = selectedStateId === state.id
              return (
                <TouchableOpacity
                  key={state.id}
                  activeOpacity={0.85}
                  onPress={() => setSelectedStateId(state.id)}
                  style={[
                    styles.stateCard,
                    isSelected ? styles.selectedStateCard : styles.unselectedStateCard
                  ]}
                >
                  <View style={styles.stateTextWrapper}>
                    <Text style={styles.stateName}>{t(`stateSelection.states.${state.id}.name`)}</Text>
                    <Text style={styles.stateHindi}>{t(`stateSelection.states.${state.id}.nameHindi`)}</Text>
                  </View>

                  {/* Yellow Checkmark Badge */}
                  {isSelected && (
                    <View style={styles.checkBadge}>
                      <Text style={styles.checkText}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              )
            })}
            
            {filteredStates.length === 0 && (
              <Text style={styles.noResultsText}>{t('stateSelection.noResults', { query: searchQuery })}</Text>
            )}
          </View>

        </Animated.View>
      </ScrollView>

      {/* Bottom Button Panel */}
      <View style={styles.bottomPanel}>
        <TouchableOpacity style={styles.continueBtn} activeOpacity={0.8} onPress={handleContinue}>
          <Text style={styles.btnText}>{t('stateSelection.continue')}  →</Text>
        </TouchableOpacity>
      </View>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A14',
  },
  headerBar: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backBtnText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  backBtnPlaceholder: {
    width: 40,
  },
  headerLine: {
    height: 1,
    backgroundColor: '#1E1F35',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 120, // Space for absolute bottom panel
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  activeProgress: {
    width: 32,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#8B5CF6',
    marginHorizontal: 3,
  },
  inactiveProgress: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#334155',
    marginHorizontal: 3,
  },
  badgeBanner: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(245, 158, 11, 0.08)',
    borderWidth: 1.5,
    borderColor: 'rgba(245, 158, 11, 0.25)',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  badgeText: {
    color: '#F59E0B',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  mainHeading: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: 'bold',
    textAlign: 'left',
    lineHeight: 42,
    marginBottom: 8,
  },
  subHeading: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'left',
    marginBottom: 8,
  },
  descText: {
    color: '#8E8FCA',
    fontSize: 15,
    textAlign: 'left',
    lineHeight: 22,
    marginBottom: 24,
  },
  searchWrapper: {
    width: '100%',
    height: 56,
    backgroundColor: '#131424',
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#1E1F35',
  },
  searchInput: {
    flex: 1,
    height: '100%',
    color: '#FFFFFF',
    fontSize: 15,
    marginLeft: 12,
  },
  searchIconOuter: {
    width: 18,
    height: 18,
    position: 'relative',
  },
  searchIconCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#8E8FCA',
  },
  searchIconLine: {
    position: 'absolute',
    bottom: 1,
    right: 1,
    width: 5,
    height: 2,
    backgroundColor: '#8E8FCA',
    transform: [{ rotate: '45deg' }],
  },
  gpsCard: {
    width: '100%',
    height: 74,
    backgroundColor: '#131424',
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 28,
    borderWidth: 1.5,
    borderColor: '#1E1F35',
  },
  gpsLeftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gpsIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#20213E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gpsTextWrapper: {
    marginLeft: 14,
  },
  gpsTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  gpsSubtitle: {
    color: '#8E8FCA',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  pinIconContainer: {
    width: 18,
    height: 22,
    alignItems: 'center',
    position: 'relative',
  },
  pinCircleOuter: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pinCircleInner: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#20213E',
  },
  pinPoint: {
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#8B5CF6',
    marginTop: -2,
  },
  chevronContainer: {
    width: 10,
    height: 18,
    position: 'relative',
  },
  chevronLine: {
    position: 'absolute',
    right: 2,
    width: 8,
    height: 2,
    backgroundColor: '#8E8FCA',
  },
  sectionTitle: {
    color: '#8E8FCA',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1.5,
    marginBottom: 16,
  },
  statesListContainer: {
    width: '100%',
  },
  stateCard: {
    width: '100%',
    height: 72,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 12,
    borderWidth: 2,
  },
  selectedStateCard: {
    backgroundColor: '#131424',
    borderColor: '#7C3AED',
  },
  unselectedStateCard: {
    backgroundColor: '#131424',
    borderColor: 'transparent',
  },
  stateTextWrapper: {
    justifyContent: 'center',
  },
  stateName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  stateHindi: {
    color: '#8E8FCA',
    fontSize: 12.5,
    fontWeight: '500',
    marginTop: 3,
  },
  checkBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#F59E0B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  noResultsText: {
    color: '#8E8FCA',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 20,
  },
  bottomPanel: {
    width: '100%',
    paddingHorizontal: 24,
    paddingBottom: 34,
    paddingTop: 10,
    backgroundColor: '#0A0A14',
    position: 'absolute',
    bottom: 0,
  },
  continueBtn: {
    backgroundColor: '#7C3AED',
    borderRadius: 20,
    height: 58,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});
