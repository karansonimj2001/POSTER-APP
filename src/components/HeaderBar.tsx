/**
 * Reusable header with back button and centered title.
 * Not currently used by any screen; all screens have custom headers.
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { useAppNavigation } from '../navigation/types';

type HeaderBarProps = {
  title: string;
  onBack?: () => void;
  showBack?: boolean;
};

const HeaderBar: React.FC<HeaderBarProps> = ({ title, onBack, showBack = true }) => {
  const navigation = useAppNavigation();
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.headerBar}>
      <StatusBar barStyle="light-content" backgroundColor="#0D0E1C" />
      {showBack ? (
        <TouchableOpacity style={styles.backBtn} activeOpacity={0.7} onPress={handleBack}>
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.backBtnPlaceholder} />
      )}
      <Text style={styles.headerTitle}>{title}</Text>
      {/* placeholder to keep title centered */}
      <View style={styles.backBtnPlaceholder} />
    </View>
  );
};

const styles = StyleSheet.create({
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
  backBtnPlaceholder: {
    width: 40,
    height: 40,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    flex: 1,
  },
});

export default HeaderBar;
