/**
 * Main app shell — contains a Drawer navigator wrapping a Bottom Tab navigator.
 * Drawer: nav items + profile header + sign out.
 * Tabs: HomeTab, TemplatesTab, ProfileTab.
 */
import React from 'react'
import { useTranslation } from 'react-i18next'
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { CommonActions } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import HomeScreen from './HomeScreen'
import TemplatesScreen from './TemplatesScreen'
import ProfileScreen from './ProfileScreen'
import { HomeIcon, TemplatesIcon, ProfileIcon, BusinessIcon, GlobeIcon, TargetIcon, PencilIcon, MapPinIcon, LogOutIcon } from '../components/Icons'
import { ArrowLeft, FireIcon, ArrowRight, CrownIcon } from '../components/Icons';
import { SvgIcon } from '../components/SvgIcon';
import { useUser } from '../context/UserContext'

const Tab = createBottomTabNavigator()
const Drawer = createDrawerNavigator()

// Custom tab bar component rendered instead of the default BottomTabBar
// Maps 3 tab routes → HomeIcon, TemplatesIcon, ProfileIcon with active/highlight styling
function MyTabBar({ state, descriptors, navigation }: any) {
  const { t } = useTranslation()
  return (
    <View style={styles.tabBar}>
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key]
        const isFocused = state.index === index

        // Tab press handler — respects canPreventDefault (e.g. for auth gating)
        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          })

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params)
          }
        }

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          })
        }

        // Dynamically select icon and label per tab route
        let IconComponent = HomeIcon
        let displayLabel = t('mainApp.tabHome')
        if (route.name === 'TemplatesTab') {
          IconComponent = TemplatesIcon
          displayLabel = t('mainApp.tabTemplates')
        } else if (route.name === 'ProfileTab') {
          IconComponent = ProfileIcon
          displayLabel = t('mainApp.tabProfile')
        }

        return (
          <TouchableOpacity
            key={index}
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabItem}
            activeOpacity={0.7}
          >
            {/* Active tab gets a purple highlight background */}
            <View style={[styles.tabIconWrapper, isFocused && styles.activeTabWrapper]}>
              <IconComponent size={24} color={isFocused ? '#FFFFFF' : '#64748B'} />
            </View>
            <Text style={[styles.tabLabel, isFocused && styles.activeTabLabel]}>{displayLabel}</Text>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

function BottomTabs() {
  return (
    <Tab.Navigator
      tabBar={props => <MyTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="HomeTab" component={HomeScreen} />
      <Tab.Screen name="TemplatesTab" component={TemplatesScreen} />
      <Tab.Screen name="ProfileTab" component={ProfileScreen} />
    </Tab.Navigator>
  )
}

// Extracts the currently active tab name from the nested drawer → tab navigator state
function getActiveTab(state: any): string {
  const tabNavigator = state?.routes?.[0]?.state
  const activeRoute = tabNavigator?.routes?.[tabNavigator?.index || 0]
  return activeRoute?.name || 'HomeTab'
}

// Custom drawer sidebar — profile header, nav items, onboarding section, sign-out
function CustomDrawerContent(props: any) {
  const { t } = useTranslation()
  const { user } = useUser()
  // Determine which tab is active to highlight the matching drawer item
  const activeTab = getActiveTab(props.state)

  // Main navigation items — these mirror the bottom tabs
  const mainNavigationItems = [
    {
      label: t('mainApp.navHome'),
      Icon: HomeIcon,
      screen: 'HomeTab',
      isActive: activeTab === 'HomeTab',
    },
    {
      label: t('mainApp.navTemplates'),
      Icon: TemplatesIcon,
      screen: 'TemplatesTab',
      isActive: activeTab === 'TemplatesTab',
    },
    {
      label: t('mainApp.navProfile'),
      Icon: ProfileIcon,
      screen: 'ProfileTab',
      isActive: activeTab === 'ProfileTab',
    },
  ]

  // Secondary onboarding items — all point to EditProfile screen for now
  const onboardingItems = [
    { label: t('mainApp.navBusiness'), Icon: BusinessIcon, target: 'EditProfile' },
    { label: t('mainApp.navLanguage'), Icon: GlobeIcon, target: 'EditProfile' },
    { label: t('mainApp.navHelp'), Icon: TargetIcon, target: 'HelpCenter' },
    { label: t('mainApp.navPostDetails'), Icon: PencilIcon, target: 'EditProfile' },
    { label: t('mainApp.navState'), Icon: MapPinIcon, target: 'EditProfile' },
  ]

  return (
    <View style={drawerStyles.container}>
      {/* Profile Header */}
      <View style={drawerStyles.profileHeader}>
        <View style={drawerStyles.avatarContainer}>
          <Image 
            source={require('../../assets/images/user_avatar.png')} 
            style={drawerStyles.avatar} 
          />
          <View style={drawerStyles.onlineDot} />
        </View>
        <Text style={drawerStyles.profileName}>{user.name || 'Aradhya'}</Text>
        {user.isPro && (
          <View style={drawerStyles.proBadge}>
            <CrownIcon size={16} color="#F59E0B" />
            <Text style={drawerStyles.proBadgeText}>{t('mainApp.proBadge')}</Text>
          </View>
        )}
        <View style={drawerStyles.streakContainer}>
          <FireIcon size={16} color="#F59E0B" />
          <Text style={drawerStyles.streakText}>{t('mainApp.streak')}</Text>
        </View>
      </View>

      <View style={drawerStyles.divider} />

      {/* Main Drawer Items */}
      <ScrollView contentContainerStyle={drawerStyles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={drawerStyles.sectionHeading}>{t('mainApp.navSection')}</Text>
        {mainNavigationItems.map((item, idx) => (
          <TouchableOpacity
            key={idx}
            style={[drawerStyles.drawerItem, item.isActive && drawerStyles.activeDrawerItem]}
            activeOpacity={0.8}
            onPress={() => {
              // TemplatesTab opens AllTemplates screen; others go to the nested tab navigator
              if (item.screen === 'TemplatesTab') {
                props.navigation.navigate('AllTemplates')
              } else {
                props.navigation.navigate('MainTabs', { screen: item.screen })
              }
              props.navigation.closeDrawer()
            }}
          >
            <View style={drawerStyles.itemContent}>
              <View style={drawerStyles.iconContainer}>
                <item.Icon size={20} color={item.isActive ? '#FFFFFF' : '#8E8FCA'} />
              </View>
              <Text style={[drawerStyles.itemLabel, item.isActive && drawerStyles.activeItemLabel]}>
                {item.label}
              </Text>
            </View>
            {/* Active indicator dot on the right */}
            {item.isActive && <View style={drawerStyles.activeIndicator} />}
          </TouchableOpacity>
        ))}

        <View style={drawerStyles.dividerSpacer} />
        <Text style={drawerStyles.sectionHeading}>{t('mainApp.onboardingSection')}</Text>
        
        {onboardingItems.map((item, idx) => (
          <TouchableOpacity
            key={idx}
            style={drawerStyles.drawerItem}
            activeOpacity={0.8}
            onPress={() => {
              if (item.target) {
                props.navigation.navigate(item.target)
              } else {
                Alert.alert(t('mainApp.comingSoon'), t('mainApp.comingSoonDesc'))
              }
              props.navigation.closeDrawer()
            }}
          >
            <View style={drawerStyles.itemContent}>
              <View style={drawerStyles.iconContainer}>
                <item.Icon size={20} color="#8E8FCA" />
              </View>
              <Text style={drawerStyles.itemLabel}>{item.label}</Text>
            </View>
            <SvgIcon name="arrowRight" size={14} color="#484B68" />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Footer / Logout */}
      <View style={drawerStyles.footer}>
        <TouchableOpacity
          style={drawerStyles.logoutButton}
          activeOpacity={0.8}
          onPress={async () => {
            // Clear all persisted user data + onboarding flag
            try {
              await AsyncStorage.removeItem('onboardingDone')
              await AsyncStorage.removeItem('user_data')
            } catch (e) {}
            props.navigation.closeDrawer()
            // Reset navigation stack back to Landing (can't go back to MainApp)
            props.navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: 'Landing' }],
              })
            )
          }}
        >
          <LogOutIcon size={18} color="#EF4444" style={{marginRight: 8}} />
          <Text style={drawerStyles.logoutText}>{t('mainApp.signOut')}</Text>
        </TouchableOpacity>
        <Text style={drawerStyles.appVersion}>{t('mainApp.appVersion')}</Text>
      </View>
    </View>
  )
}

export default function MainApp() {
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: '#0A0A14',
          width: 300,
        },
      }}
    >
      <Drawer.Screen name="MainTabs" component={BottomTabs} />
    </Drawer.Navigator>
  )
}

const drawerStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A14',
    paddingTop: 50,
  },
  profileHeader: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    width: 74,
    height: 74,
    borderRadius: 37,
    borderWidth: 2,
    borderColor: '#8B5CF6',
    padding: 3,
    marginBottom: 12,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 33,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#22C55E',
    borderWidth: 2,
    borderColor: '#0A0A14',
  },
  profileName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  proBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  proBadgeText: {
    color: '#F59E0B',
    fontSize: 9.5,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  streakText: {
    color: '#A855F7',
    fontSize: 11,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#1E1F35',
    marginHorizontal: 16,
  },
  dividerSpacer: {
    height: 1,
    backgroundColor: '#1E1F35',
    marginHorizontal: 16,
    marginVertical: 14,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  sectionHeading: {
    color: '#484B68',
    fontSize: 10.5,
    fontWeight: 'bold',
    letterSpacing: 1.5,
    marginBottom: 8,
    paddingLeft: 6,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 6,
  },
  activeDrawerItem: {
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 24,
    height: 24,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemLabel: {
    color: '#8E8FCA',
    fontSize: 14,
    fontWeight: '600',
  },
  activeItemLabel: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  activeIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#8B5CF6',
  },
  arrowIcon: {
    color: '#484B68',
    fontSize: 14,
    fontWeight: 'bold',
  },
  footer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#1E1F35',
    paddingTop: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.15)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    justifyContent: 'center',
    marginBottom: 10,
  },
  logoutText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: 'bold',
  },
  appVersion: {
    color: '#484B68',
    fontSize: 11,
    textAlign: 'center',
  },
})

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 74,
    backgroundColor: '#0F0F1A',
    borderTopWidth: 1,
    borderTopColor: '#1E1F35',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 14,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIconWrapper: {
    padding: 10,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  activeTabWrapper: {
    backgroundColor: '#1F1E38',
  },
  tabLabel: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: 'bold',
    marginTop: 3,
  },
  activeTabLabel: {
    color: '#FFFFFF',
  },
})

