import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { COLORS } from '../../constants/colors';
import { Header } from '../../components/common/Header';
import { StatCard } from '../../components/common/StatCard';
import { TaskCard } from '../../components/hospital/TaskCard';
import { useAuth } from '../../context/AuthContext';
import { useHospitalData } from '../../context/HospitalDataContext';

export const WardBoyDashboard = ({ navigation }) => {
  const { currentUser } = useAuth();
  const { tasks, updateTaskStatus } = useHospitalData();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 500);
  };

  const [workloadFilter, setWorkloadFilter] = React.useState('all');

  const safeTasks = Array.isArray(tasks) ? tasks : [];
  const pendingTasks = safeTasks.filter((t) => t.status === 'pending' || t.status === 'Assigned');
  const inProgressTasks = safeTasks.filter((t) => t.status === 'in_progress' || t.status === 'In Progress' || t.status === 'Accepted');
  const completedTasks = safeTasks.filter((t) => t.status === 'completed' || t.status === 'Completed');

  const filteredTasks = safeTasks.filter((t) => {
    if (workloadFilter === 'all') return true;
    if (workloadFilter === 'pending') return t.status === 'pending' || t.status === 'Assigned';
    if (workloadFilter === 'in_progress') return t.status === 'in_progress' || t.status === 'In Progress' || t.status === 'Accepted';
    if (workloadFilter === 'completed') return t.status === 'completed' || t.status === 'Completed';
    return true;
  });

  const handleStatusChange = (taskId, newStatus) => {
    updateTaskStatus(taskId, newStatus);
    const label = newStatus === 'In Progress' ? 'Started' : newStatus === 'Completed' ? 'Marked Completed' : 'Accepted';
    Alert.alert('Escort Workflow Advanced', `Task #${taskId} ${label}. Nurse & Attendant notified.`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Patient Care Assistant (PCA)"
        showRole={true}
        showNotification={true}
        onNotificationPress={() => navigation.navigate('Notifications')}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Profile Card */}
        <View style={styles.profileHeader}>
          <Text style={styles.stationLabel}>LOGISTICS & WHEELCHAIR DESK</Text>
          <Text style={styles.workerName}>{currentUser?.name || 'Suresh Kumar'}</Text>
          <Text style={styles.stationSub}>Duty Station: Ground Floor Main Lobby & ER</Text>
        </View>

        {/* Task Workflow Stats (Touch to filter) */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <Text style={styles.sectionHeading}>TASK PIPELINE</Text>
          <Text style={{ fontSize: 11, color: COLORS.hospitalBlue, fontWeight: '600' }}>Tap card to filter</Text>
        </View>

        <View style={styles.statsGrid}>
          <StatCard
            label="Pending"
            value={pendingTasks.length.toString()}
            change={workloadFilter === 'pending' ? '● Active Filter' : 'Awaiting'}
            changeType="neutral"
            icon="time"
            color={COLORS.warning}
            onPress={() => setWorkloadFilter(workloadFilter === 'pending' ? 'all' : 'pending')}
            style={workloadFilter === 'pending' ? { borderColor: COLORS.warning, borderWidth: 2 } : null}
          />
          <StatCard
            label="In Progress"
            value={inProgressTasks.length.toString()}
            change={workloadFilter === 'in_progress' ? '● Active Filter' : 'Active Now'}
            changeType="positive"
            icon="walk"
            color={COLORS.hospitalBlue}
            onPress={() => setWorkloadFilter(workloadFilter === 'in_progress' ? 'all' : 'in_progress')}
            style={workloadFilter === 'in_progress' ? { borderColor: COLORS.hospitalBlue, borderWidth: 2 } : null}
          />
          <StatCard
            label="Completed"
            value={completedTasks.length.toString()}
            change={workloadFilter === 'completed' ? '● Active Filter' : 'Today'}
            changeType="positive"
            icon="checkmark-circle"
            color={COLORS.triageGreen}
            onPress={() => setWorkloadFilter(workloadFilter === 'completed' ? 'all' : 'completed')}
            style={workloadFilter === 'completed' ? { borderColor: COLORS.triageGreen, borderWidth: 2 } : null}
          />
        </View>

        {/* Tasks List with Accept -> Start -> Complete */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <View>
            <Text style={styles.sectionHeading}>ACTIVE DISPATCH QUEUE ({filteredTasks.length})</Text>
            <Text style={{ fontSize: 11, color: COLORS.slate }}>Tap card or button to advance escort status</Text>
          </View>
          {workloadFilter !== 'all' && (
            <TouchableOpacity onPress={() => setWorkloadFilter('all')}>
              <Text style={{ fontSize: 11, fontWeight: '700', color: COLORS.hospitalBlue }}>Clear Filter</Text>
            </TouchableOpacity>
          )}
        </View>

        {filteredTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onStatusChange={handleStatusChange}
          />
        ))}

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
  content: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  profileHeader: {
    backgroundColor: COLORS.offWhite,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  stationLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.hospitalTeal,
    letterSpacing: 0.5,
  },
  workerName: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.navy,
    marginTop: 2,
  },
  stationSub: {
    fontSize: 12,
    color: COLORS.slate,
    marginTop: 2,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.slate,
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
});
