import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

/**
 * Shape of persisted user data, stored in AsyncStorage under key 'user_data'.
 */
type UserData = {
  name: string
  phone: string
  purpose: 'myself' | 'business'
  businessName?: string
  language: string
  location: string
  interests: string[]
  isPro: boolean
}

type UserContextType = {
  user: UserData
  setUser: (data: Partial<UserData>) => Promise<void>
  loading: boolean
}

const defaultUser: UserData = {
  name: '',
  phone: '',
  purpose: 'myself',
  businessName: '',
  language: 'Hindi',
  location: '',
  interests: [],
  isPro: false,
}

const UserContext = createContext<UserContextType>({
  user: defaultUser,
  setUser: async () => {},
  loading: true,
})

export const useUser = () => useContext(UserContext)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<UserData>(defaultUser)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    AsyncStorage.getItem('user_data')
      .then(json => {
        if (json) setUserState({ ...defaultUser, ...JSON.parse(json) })
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const setUser = async (data: Partial<UserData>) => {
    const merged = { ...user, ...data }
    setUserState(merged)
    await AsyncStorage.setItem('user_data', JSON.stringify(merged))
  }

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  )
}
