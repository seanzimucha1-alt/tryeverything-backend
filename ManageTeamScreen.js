import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from './ThemeContext';
import { useData } from './DataContext';
import { supabase, API_BASE_URL } from './supabaseClient';

const TeamMemberItem = ({ member, theme, onRemove, canRemove }) => (
  <View style={[styles.memberCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
    <View style={{ flex: 1 }}>
      <Text style={[styles.memberName, { color: theme.text }]}>{member.name}</Text>
      <Text style={[styles.memberEmail, { color: theme.textSecondary }]}>{member.email}</Text>
    </View>
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Text style={[styles.memberRole, { color: theme.primary }]}>{member.role}</Text>
      {canRemove && (
        <TouchableOpacity
          onPress={() => onRemove(member.id)}
          style={styles.removeButton}
        >
          <Ionicons name="trash" size={20} color="#EF4444" />
        </TouchableOpacity>
      )}
    </View>
  </View>
);

const ManageTeamScreen = ({ onBack }) => {
  const { theme } = useTheme();
  const { teamMembers, inviteMember, loggedInUser } = useData();
  const [modalVisible, setModalVisible] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Staff');
  const [authToken, setAuthToken] = useState(null);
  // Allow Admin role or store owners (staff/admin roles who own stores) to manage team
  const isAdmin = loggedInUser.role === 'Admin' || loggedInUser.role === 'Staff' || loggedInUser.role === 'Seller';

  // Get auth token for API requests
  useEffect(() => {
    const getAuthToken = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.access_token) {
        setAuthToken(session.access_token);
      }
    };
    getAuthToken();
  }, []);

  const handleInvite = async () => {
    if (!inviteEmail) {
      Alert.alert('Error', 'Please enter an email address.');
      return;
    }

    try {
      if (!authToken) {
        Alert.alert('Error', 'Authentication required. Please log in again.');
        return;
      }

      // Send invitation email via backend API
      const response = await fetch(`${API_BASE_URL}/api/team/invite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          email: inviteEmail,
          role: inviteRole.toLowerCase() // Convert to lowercase to match backend
        })
      });

      if (response.ok) {
        Alert.alert('Success', `Invitation sent to ${inviteEmail}`);
        setModalVisible(false);
        setInviteEmail('');
      } else {
        Alert.alert('Error', 'Failed to send invitation');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error occurred');
    }
  };

  const handleRemoveMember = (memberId) => {
    Alert.alert(
      'Remove Member',
      'Are you sure you want to remove this team member?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              if (!authToken) {
                Alert.alert('Error', 'Authentication required. Please log in again.');
                return;
              }

              const response = await fetch(`${API_BASE_URL}/api/team/remove/${memberId}`, {
                method: 'DELETE',
                headers: {
                  'Authorization': `Bearer ${authToken}`
                }
              });

              if (response.ok) {
                Alert.alert('Success', 'Team member removed');
                // Update local state or refetch data
              } else {
                Alert.alert('Error', 'Failed to remove member');
              }
            } catch (error) {
              Alert.alert('Error', 'Network error occurred');
            }
          }
        }
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Manage Team</Text>
        {isAdmin ? (
          <TouchableOpacity style={styles.backButton} onPress={() => setModalVisible(true)}>
            <Ionicons name="add" size={28} color={theme.text} />
          </TouchableOpacity>
        ) : <View style={{ width: 28 }} />}
      </View>

      <FlatList
        data={teamMembers}
        renderItem={({ item }) => (
          <TeamMemberItem
            member={item}
            theme={theme}
            onRemove={handleRemoveMember}
            canRemove={isAdmin && item.id !== loggedInUser.id}
          />
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<Text style={{ color: theme.textSecondary, textAlign: 'center' }}>No team members yet.</Text>}
      />

      {/* Invite Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Invite New Member</Text>

            <Text style={styles.inputLabel}>Email Address</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.border, color: theme.text, borderColor: theme.border }]}
              placeholder="member@example.com"
              placeholderTextColor={theme.textSecondary}
              value={inviteEmail}
              onChangeText={setInviteEmail}
              keyboardType="email-address"
            />

            <Text style={styles.inputLabel}>Role</Text>
            <View style={styles.roleSelector}>
              {/* Store owners can only invite Staff and Deliverer */}
              {(loggedInUser.role === 'Admin' ? ['Admin', 'Staff', 'Deliverer'] : ['Staff', 'Deliverer']).map(role => (
                <TouchableOpacity
                  key={role}
                  style={[styles.roleOption, { borderColor: theme.border }, inviteRole === role && { backgroundColor: theme.primary, borderColor: theme.primary }]}
                  onPress={() => setInviteRole(role)}
                >
                  <Text style={[styles.roleText, { color: theme.textSecondary }, inviteRole === role && { color: '#FFFFFF' }]}>{role}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={[styles.inviteButton, { backgroundColor: theme.primary }]} onPress={handleInvite}>
              <Text style={styles.inviteButtonText}>Send Invite</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ marginTop: 15 }} onPress={() => setModalVisible(false)}>
              <Text style={{ textAlign: 'center', color: theme.textSecondary, fontWeight: '600' }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 20 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  backButton: { padding: 4 },
  listContent: { paddingHorizontal: 20 },
  memberCard: { padding: 16, borderRadius: 12, borderWidth: 1, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  memberName: { fontSize: 16, fontWeight: '600' },
  memberEmail: { fontSize: 12, marginTop: 2 },
  memberRole: { fontSize: 14, fontWeight: 'bold' },
  modalContainer: { flex: 1, justifyContent: 'flex-end' },
  modalContent: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, height: '55%' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 24 },
  inputLabel: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 },
  input: { borderWidth: 1, borderRadius: 12, padding: 12, fontSize: 16, marginBottom: 20 },
  roleSelector: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 30 },
  roleOption: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8, borderWidth: 1 },
  roleText: { fontWeight: '600' },
  inviteButton: { paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  inviteButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
});

export default ManageTeamScreen;