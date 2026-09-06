import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { DEMO_PRESETS, ROLE_ICONS } from '../constants/roles';
import { useAuth } from '../context/AuthContext';

export const RoleSwitcherModal = () => {
  const { isRoleModalVisible, setIsRoleModalVisible, currentRole, switchRole } = useAuth();

  return (
    <Modal
      visible={isRoleModalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setIsRoleModalVisible(false)}
    >
      <View style={styles.backdrop}>
        <SafeAreaView style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <View style={styles.badge}>
                <Ionicons name="flash" size={14} color={COLORS.hospitalBlue} />
                <Text style={styles.badgeText}>DEV PERSONA SWITCHER</Text>
              </View>
              <Text style={styles.title}>Switch SHOS Role (15 Roles)</Text>
              <Text style={styles.subtitle}>
                Tap any hospital persona to preview their dedicated workflow in 1 tap
              </Text>
            </View>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsRoleModalVisible(false)}
            >
              <Ionicons name="close" size={22} color={COLORS.slate} />
            </TouchableOpacity>
          </View>

          {/* Role List */}
          <ScrollView
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          >
            {DEMO_PRESETS.map((preset) => {
              const isActive = currentRole === preset.role;
              const iconName = ROLE_ICONS[preset.role] || 'person';

              return (
                <TouchableOpacity
                  key={preset.role}
                  style={[
                    styles.roleCard,
                    isActive && styles.activeRoleCard,
                  ]}
                  activeOpacity={0.7}
                  onPress={() => switchRole(preset.role)}
                >
                  <View
                    style={[
                      styles.iconCircle,
                      isActive && styles.activeIconCircle,
                    ]}
                  >
                    <Ionicons
                      name={iconName}
                      size={20}
                      color={isActive ? COLORS.cardBg : COLORS.hospitalBlue}
                    />
                  </View>

                  <View style={styles.roleInfo}>
                    <View style={styles.nameRow}>
                      <Text
                        style={[
                          styles.roleLabel,
                          isActive && styles.activeRoleLabel,
                        ]}
                      >
                        {preset.label}
                      </Text>
                      {isActive && (
                        <View style={styles.activeTag}>
                          <Text style={styles.activeTagText}>CURRENT</Text>
                        </View>
                      )}
                    </View>

                    <Text style={styles.userName}>{preset.name}</Text>
                    <Text style={styles.roleDesc}>{preset.desc}</Text>
                  </View>

                  <Ionicons
                    name={isActive ? 'radio-button-on' : 'chevron-forward'}
                    size={20}
                    color={isActive ? COLORS.hospitalBlue : COLORS.slateLight}
                  />
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Footer Note */}
          <View style={styles.footer}>
            <Ionicons name="shield-checkmark-outline" size={16} color={COLORS.slate} />
            <Text style={styles.footerText}>
              SHOS Role-Based Access Control • Prototype Mode
            </Text>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(10, 37, 64, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: COLORS.cardBg,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  headerTitleRow: {
    flex: 1,
    marginRight: 10,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.tealLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.hospitalBlue,
    marginLeft: 4,
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.navy,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.slate,
    marginTop: 2,
    lineHeight: 16,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.offWhite,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    backgroundColor: COLORS.cardBg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    marginBottom: 8,
  },
  activeRoleCard: {
    backgroundColor: COLORS.tealLight,
    borderColor: COLORS.hospitalBlue,
    borderWidth: 1.5,
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.offWhite,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activeIconCircle: {
    backgroundColor: COLORS.hospitalBlue,
  },
  roleInfo: {
    flex: 1,
    marginRight: 8,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roleLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.navy,
  },
  activeRoleLabel: {
    color: COLORS.hospitalBlue,
  },
  activeTag: {
    backgroundColor: COLORS.hospitalBlue,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  activeTagText: {
    color: COLORS.cardBg,
    fontSize: 9,
    fontWeight: '800',
  },
  userName: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.navyLight,
    marginTop: 1,
  },
  roleDesc: {
    fontSize: 11,
    color: COLORS.slate,
    marginTop: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    gap: 6,
  },
  footerText: {
    fontSize: 11,
    color: COLORS.slate,
    fontWeight: '500',
  },
});
