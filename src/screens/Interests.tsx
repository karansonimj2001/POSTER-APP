import React, { useState, useRef, useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, Dimensions, StatusBar } from 'react-native'
import { useNavigation } from '@react-navigation/native'

let screenWidth = Dimensions.get('window').width
let screenHeight = Dimensions.get('window').height

interface Category {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
}

const CATEGORIES: Category[] = [
  { id: 'hindu', title: 'Hindu', subtitle: 'Diwali, Holi +', icon: '🕉️' },
  { id: 'muslim', title: 'Muslim', subtitle: 'Eid, Ramadan +', icon: '☪️' },
  { id: 'christian', title: 'Christian', subtitle: 'Christmas, Easter +', icon: '✝️' },
  { id: 'jain', title: 'Jain', subtitle: 'Paryushana +', icon: '🟤' },
  { id: 'buddhist', title: 'Buddhist', subtitle: 'Vesak +', icon: '☸️' },
  { id: 'sikh', title: 'Sikh', subtitle: 'Gurpurab +', icon: '🔵' },
  { id: 'other', title: 'Other', subtitle: 'Custom preferences', icon: '🌍' },
]

export default function Interests({ route }: any) {
  const navigation = useNavigation<any>()
  const [selectedIds, setSelectedIds] = useState<string[]>(['hindu']) // default select Hindu like screenshot

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

  const handleToggle = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(item => item !== id))
    } else {
      setSelectedIds([...selectedIds, id])
    }
  }

  const handleContinue = () => {
    navigation.navigate('StateSelection', {
      language: route.params?.language || 'Hindi',
      purpose: route.params?.purpose || 'For Myself',
      name: route.params?.name || 'User1'
    })
  }

  const handleBack = () => {
    navigation.goBack()
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0D0E1C" />

      {/* Header Bar */}
      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.backBtn} activeOpacity={0.7} onPress={handleBack}>
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Onboarding</Text>
        <View style={styles.backBtnPlaceholder} />
      </View>
      <View style={styles.headerLine} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          
          {/* Progress Dots */}
          <View style={styles.progressContainer}>
            <View style={styles.inactiveProgress} />
            <View style={styles.inactiveProgress} />
            <View style={styles.activeProgress} />
            <View style={styles.inactiveProgress} />
            <View style={styles.inactiveProgress} />
          </View>

          {/* Almost There Badge */}
          <View style={styles.badgeBanner}>
            <Text style={styles.badgeText}>✨ ALMOST THERE! JUST 2 MORE STEPS</Text>
          </View>

          {/* Headings */}
          <Text style={styles.mainHeading}>What matters to{"\n"}you?</Text>
          <Text style={styles.sectionLabel}>FESTIVALS & OCCASIONS</Text>
          <Text style={styles.subHeading}>Choose the content you'd love to see daily</Text>

          {/* Grid of Interests */}
          <View style={styles.gridContainer}>
            {CATEGORIES.map((cat) => {
              const isSelected = selectedIds.includes(cat.id)
              return (
                <TouchableOpacity
                  key={cat.id}
                  activeOpacity={0.85}
                  onPress={() => handleToggle(cat.id)}
                  style={[
                    styles.gridCard,
                    isSelected ? styles.selectedCard : styles.unselectedCard
                  ]}
                >
                  {/* Icon Block */}
                  <View style={styles.iconContainer}>
                    <Text style={styles.iconText}>{cat.icon}</Text>
                  </View>

                  {/* Texts */}
                  <Text style={styles.cardTitle}>{cat.title}</Text>
                  <Text style={[styles.cardSubtitle, isSelected ? styles.selectedSubtitleColor : styles.unselectedSubtitleColor]}>
                    {cat.subtitle}
                  </Text>

                  {/* Yellow Checkmark Badge */}
                  {isSelected && (
                    <View style={styles.checkBadge}>
                      <Text style={styles.checkText}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              )
            })}
          </View>

        </Animated.View>
      </ScrollView>

      {/* Bottom Button Panel */}
      <View style={styles.bottomPanel}>
        <TouchableOpacity style={styles.continueBtn} activeOpacity={0.8} onPress={handleContinue}>
          <Text style={styles.btnText}>CONTINUE  →</Text>
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
    paddingBottom: 120, // increased padding bottom to clear bottomPanel
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
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'left',
    lineHeight: 44,
    marginBottom: 20,
  },
  sectionLabel: {
    color: '#8B5CF6',
    fontSize: 13,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 6,
  },
  subHeading: {
    color: '#8E8FCA',
    fontSize: 16,
    textAlign: 'left',
    marginBottom: 24,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },
  gridCard: {
    width: '48%',
    backgroundColor: '#131424',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    position: 'relative',
    height: 140,
  },
  selectedCard: {
    borderColor: '#7C3AED',
  },
  unselectedCard: {
    borderColor: 'transparent',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#20213E',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconText: {
    fontSize: 22,
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 12.5,
    fontWeight: '500',
  },
  selectedSubtitleColor: {
    color: '#8E8FCA',
  },
  unselectedSubtitleColor: {
    color: '#64748B',
  },
  checkBadge: {
    position: 'absolute',
    top: 20,
    right: 20,
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
  bottomPanel: {
    width: '100%',
    paddingHorizontal: 24,
    paddingBottom: 34,
    paddingTop: 10,
    backgroundColor: '#0A0A14',
    position: 'absolute', // Make it stick to the bottom of the screen
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
