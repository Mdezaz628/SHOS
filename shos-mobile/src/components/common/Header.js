import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../../constants/colors';
import { TYPOGRAPHY } from '../../constants/typography';
import { ROLE_LABELS } from '../../constants/roles';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';

export const Header = ({
  title,
  showBack,
  onBack,
  onBackPress,
  navigation: navProp,
  showHome = false,
  onHomePress,
  showRole = true,
  showProfile = true,
  showNotification = true,
  onNotificationPress,
}) => {
  const hookNav = useNavigation();
  const navigation = navProp || hookNav;
  const { currentRole, setIsRoleModalVisible, currentUser } = useAuth();
  const { unreadCount } = useNotifications();

  // Auto-detect if we can go back if showBack wasn't explicitly set
  const canGoBack = navigation?.canGoBack ? navigation.canGoBack() : false;
  const shouldShowBack = showBack !== undefined ? showBack : canGoBack;

  const handleBack = () => {
    if (onBack) return onBack();
    if (onBackPress) return onBackPress();
    if (navigation?.canGoBack && navigation.canGoBack()) {
      return navigation.goBack();
    }
    // Fallback if inside a stack or tab
    if (navigation?.navigate) {
      if (currentRole === 'patient') {
        navigation.navigate('PatientTabs', { screen: 'Home' });
      } else {
        navigation.goBack();
      }
    }
  };

  const handleHome = () => {
    if (onHomePress) return onHomePress();
    if (navigation?.navigate) {
      if (currentRole === 'patient') {
        navigation.navigate('PatientTabs', { screen: 'Home' });
      } else {
        // Go back to the root of the current role navigator
        navigation.popToTop ? navigation.popToTop() : navigation.goBack();
      }
    }
  };

  const handleProfile = () => {
    if (navigation?.navigate) {
      if (currentRole === 'patient') {
        navigation.navigate('PatientTabs', { screen: 'Profile' });
      } else {
        navigation.navigate('Profile');
      }
    }
  };

  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryDark} />
      <View style={styles.container}>
        <View style={styles.leftRow}>
          {shouldShowBack ? (
            <TouchableOpacity
              onPress={handleBack}
              style={styles.backButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              accessibilityLabel="Go back"
            >
              <Ionicons name="chevron-back" size={24} color={COLORS.textWhite} />
            </TouchableOpacity>
          ) : showHome ? (
            <TouchableOpacity
              onPress={handleHome}
              style={styles.homeButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              accessibilityLabel="Home"
            >
              <Ionicons name="home-outline" size={20} color={COLORS.textWhite} />
            </TouchableOpacity>
          ) : (
            <View style={styles.logoBadge}>
              <Ionicons name="pulse" size={18} color={COLORS.textWhite} />
            </View>
          )}

          {/* If showBack is present, also allow a quick Home icon if screen isn't root */}
          {shouldShowBack && (
            <TouchableOpacity
              onPress={handleHome}
              style={styles.homeButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              accessibilityLabel="Home"
            >
              <Ionicons name="home-outline" size={18} color="#bae6fd" />
            </TouchableOpacity>
          )}

          <View style={styles.titleColumn}>
            <Text style={styles.brandTitle} numberOfLines={1}>
              {title || 'SHOS'}
            </Text>
            {showRole && (
              <Text style={styles.roleSubtitle} numberOfLines={1}>
                {ROLE_LABELS[currentRole] || 'Clinical Portal'}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.rightRow}>
          {/* Fast-Switch Persona Trigger (Dev Mode) */}
          <TouchableOpacity
            style={styles.switchPersonaBtn}
            onPress={() => setIsRoleModalVisible(true)}
            activeOpacity={0.8}
          >
            <Ionicons name="flash" size={13} color="#fef08a" />
            <Text style={styles.switchPersonaText}>Role</Text>
          </TouchableOpacity>

          {/* View Profile Button */}
          {showProfile && (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={handleProfile}
              activeOpacity={0.7}
              accessibilityLabel="View Profile"
            >
              <Ionicons name="person-circle-outline" size={22} color={COLORS.textWhite} />
            </TouchableOpacity>
          )}

          {/* Notifications Bell */}
          {showNotification && (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={onNotificationPress || (() => navigation?.navigate('Notifications'))}
              activeOpacity={0.7}
              accessibilityLabel="Notifications"
            >
              <Ionicons name="notifications-outline" size={20} color={COLORS.textWhite} />
              {unreadCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: COLORS.primaryDark,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 20 : 44,
  },
  container: {
    height: 60,
    backgroundColor: COLORS.primaryDark,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    paddingRight: 8,
    paddingVertical: 6,
  },
  homeButton: {
    paddingRight: 8,
    paddingVertical: 6,
  },
  logoBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  titleColumn: {
    flex: 1,
  },
  brandTitle: {
    fontSize: TYPOGRAPHY.lg,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.textWhite,
    letterSpacing: -0.3,
  },
  roleSubtitle: {
    fontSize: TYPOGRAPHY.xs,
    color: '#bae6fd',
    fontWeight: TYPOGRAPHY.medium,
  },
  rightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  switchPersonaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  switchPersonaText: {
    fontSize: 11,
    fontWeight: TYPOGRAPHY.heavy,
    color: COLORS.textWhite,
    textTransform: 'uppercase',
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: COLORS.critical,
    borderRadius: 9,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: COLORS.primaryDark,
  },
  badgeText: {
    fontSize: 9,
    color: COLORS.textWhite,
    fontWeight: TYPOGRAPHY.heavy,
  },
});

export default Header;
