import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { Header } from '../../components/common/Header';
import { Tabs } from '../../components/common/Tabs';
import { NotificationCard } from '../../components/hospital/NotificationCard';
import { EmptyState } from '../../components/common/EmptyState';
import { useNotifications } from '../../context/NotificationContext';

export const NotificationsScreen = ({ navigation }) => {
  const { notifications, markAsRead, markAllAsRead, clearNotifications } = useNotifications();
  const [activeTab, setActiveTab] = useState('All');

  const tabs = [
    { key: 'All', label: 'All Alerts' },
    { key: 'unread', label: 'Unread' },
    { key: 'urgent', label: 'Critical' },
  ];

  const filtered = (Array.isArray(notifications) ? notifications : []).filter((n) => {
    if (activeTab === 'unread') return !n.read;
    if (activeTab === 'urgent') return n.priority === 'urgent' || n.priority === 'critical' || n.priority === 'Critical';
    return true;
  });

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Hospital Notification Center"
        showBack={true}
        onBackPress={() => navigation.goBack()}
        showRole={true}
      />

      <View style={styles.tabSection}>
        <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
        <View style={styles.quickActions}>
          <TouchableOpacity onPress={markAllAsRead}>
            <Text style={styles.actionText}>Mark All Read</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={clearNotifications}>
            <Text style={[styles.actionText, { color: COLORS.triageRed }]}>Clear</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {filtered.length > 0 ? (
          filtered.map((item) => (
            <NotificationCard
              key={item.id}
              notification={item}
              onPress={() => markAsRead(item.id)}
            />
          ))
        ) : (
          <EmptyState
            icon="notifications-off-outline"
            title="All Caught Up"
            message="You have no pending notifications or urgent clinical alerts."
          />
        )}

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.cardBg,
  },
  tabSection: {
    paddingHorizontal: 16,
    paddingTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.hospitalBlue,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
});
