import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from './ThemeContext';

const MOCK_MESSAGES = [
  { id: '1', text: 'Hello! I have a question about my order.', sender: 'user' },
  { id: '2', text: 'Hi there! I am here to help. What is your question?', sender: 'seller' },
  { id: '3', text: 'When can I expect it to be shipped?', sender: 'user' },
];

const ChatScreen = ({ onBack, sellerName = 'Seller' }) => {
  const { theme } = useTheme();
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef();

  const handleSend = () => {
    if (inputText.trim()) {
      const newMessage = {
        id: (messages.length + 1).toString(),
        text: inputText,
        sender: 'user',
      };
      setMessages([...messages, newMessage]);
      setInputText('');
    }
  };

  const renderMessage = ({ item }) => {
    const isUserMessage = item.sender === 'user';
    return (
      <View style={[
        styles.messageBubble,
        isUserMessage ? styles.userBubble : styles.sellerBubble,
        { backgroundColor: isUserMessage ? theme.primary : theme.card }
      ]}>
        <Text style={[
          styles.messageText,
          { color: isUserMessage ? '#FFFFFF' : theme.text }
        ]}>{item.text}</Text>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>{sellerName}</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messageList}
        onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })}
        onLayout={() => flatListRef.current.scrollToEnd({ animated: true })}
      />

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}>
        <View style={[styles.inputContainer, { backgroundColor: theme.card, borderTopColor: theme.border }]}>
          <TextInput style={[styles.input, { backgroundColor: theme.border, color: theme.text }]} placeholder="Type a message..." placeholderTextColor={theme.textSecondary} value={inputText} onChangeText={setInputText} />
          <TouchableOpacity style={[styles.sendButton, { backgroundColor: theme.primary }]} onPress={handleSend}>
            <Ionicons name="send" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 15, borderBottomWidth: 1 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  backButton: { padding: 4 },
  messageList: { paddingHorizontal: 16, paddingTop: 20 },
  messageBubble: { maxWidth: '80%', padding: 12, borderRadius: 18, marginBottom: 10 },
  userBubble: { alignSelf: 'flex-end', borderBottomRightRadius: 4 },
  sellerBubble: { alignSelf: 'flex-start', borderBottomLeftRadius: 4 },
  messageText: { fontSize: 15 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', padding: 12, borderTopWidth: 1 },
  input: { flex: 1, height: 44, borderRadius: 22, paddingHorizontal: 16, fontSize: 16 },
  sendButton: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginLeft: 12 },
});

export default ChatScreen;