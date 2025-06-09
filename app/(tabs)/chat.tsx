import { MetalMania_400Regular, useFonts } from '@expo-google-fonts/metal-mania';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ImageBackground, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Message {
  id: number;
  user: string;
  text: string;
  isOwnMessage: boolean;
  time: string;
}

interface Friend {
  id: number;
  username: string;
  status: 'online' | 'offline';
  isMuted: boolean;
  isBlocked: boolean;
}

const mockMessages: Message[] = [
  { id: 1, user: 'MetalHead42', text: 'Yo, that drum track was sick! 🥁', isOwnMessage: false, time: '10:05' },
  { id: 2, user: 'You', text: 'Thanks, man! Working on a new one!', isOwnMessage: true, time: '10:06' },
  { id: 3, user: 'MetalHead42', text: 'Can’t wait to see it! 🤘', isOwnMessage: false, time: '10:07' },
];

const mockFriends: Friend[] = [
  { id: 1, username: 'MetalHead42', status: 'online', isMuted: false, isBlocked: false },
  { id: 2, username: 'DrumVeilFan', status: 'offline', isMuted: false, isBlocked: false },
  { id: 3, username: 'RiffMaster', status: 'online', isMuted: true, isBlocked: false },
];

const ChatScreen: React.FC = () => {
  const [fontsLoaded] = useFonts({ MetalMania_400Regular });
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [friendsModalVisible, setFriendsModalVisible] = useState(false);
  const [friends, setFriends] = useState<Friend[]>(mockFriends);
  const [addFriendInput, setAddFriendInput] = useState('');
  const [activeTab, setActiveTab] = useState<'friends' | 'settings'>('friends');
  const [currentChatUser, setCurrentChatUser] = useState<string | null>(null);

  const sendMessage = useCallback(() => {
    if (!message.trim()) return;

    const newMessage: Message = {
      id: messages.length + 1,
      user: 'You',
      text: message,
      isOwnMessage: true,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, newMessage]);
    setMessage('');
  }, [message]);

  const addFriend = useCallback(() => {
    if (!addFriendInput.trim()) return;

    const newFriend: Friend = {
      id: friends.length + 1,
      username: addFriendInput,
      status: 'offline',
      isMuted: false,
      isBlocked: false,
    };
    setFriends((prev) => [...prev, newFriend]);
    setAddFriendInput('');
  }, [addFriendInput]);

  const removeFriend = useCallback((friendId: number) => {
    setFriends((prev) => prev.filter((f) => f.id !== friendId));
  }, []);

  const toggleMuteFriend = useCallback((friendId: number) => {
    setFriends((prev) =>
      prev.map((f) => (f.id === friendId ? { ...f, isMuted: !f.isMuted } : f))
    );
  }, []);

  const toggleBlockFriend = useCallback((friendId: number) => {
    setFriends((prev) =>
      prev.map((f) => (f.id === friendId ? { ...f, isBlocked: !f.isBlocked } : f))
    );
  }, []);

  const startChat = useCallback((username: string) => {
    setCurrentChatUser(username);
    setFriendsModalVisible(false);
    setMessages(mockMessages.filter((msg) => msg.user === username || msg.isOwnMessage));
  }, []);

  const goBack = useCallback(() => router.back(), [router]);

  if (!fontsLoaded) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Fontlar yükleniyor...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('./assets/images/drum_background2.jpg')}
        style={styles.background}
        imageStyle={styles.backgroundImage}
      >
        <View style={styles.overlay}>
          <Animatable.View animation="fadeIn" style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={goBack}>
              <MaterialCommunityIcons name="arrow-left" size={30} color="#FF3333" />
            </TouchableOpacity>
            <Text style={styles.title}>Chat Ritual</Text>
            <TouchableOpacity
              style={styles.friendsButton}
              onPress={() => setFriendsModalVisible(true)}
            >
              <MaterialCommunityIcons name="account-group" size={30} color="#FF3333" />
            </TouchableOpacity>
          </Animatable.View>

          <ScrollView style={styles.messagesContainer}>
            {messages.map((msg) => (
              <Animatable.View
                key={msg.id}
                animation="fadeInUp"
                delay={msg.id * 100}
                style={[
                  styles.messageBubble,
                  msg.isOwnMessage ? styles.ownMessage : styles.otherMessage,
                ]}
              >
                <Text style={styles.messageUser}>{msg.user}</Text>
                <Text style={styles.messageText}>{msg.text}</Text>
                <Text style={styles.messageTime}>{msg.time}</Text>
              </Animatable.View>
            ))}
          </ScrollView>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.messageInput}
              value={message}
              onChangeText={setMessage}
              placeholder="Mesaj yaz..."
              placeholderTextColor="#B0B0B0"
            />
            <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
              <MaterialCommunityIcons name="send" size={24} color="#1C2526" />
            </TouchableOpacity>
          </View>

          {/* Friends Modal */}
          <Modal
            visible={friendsModalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setFriendsModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <Animatable.View animation="zoomIn" style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>
                    {activeTab === 'friends' ? 'Arkadaşlar' : 'Sohbet Ayarları'}
                  </Text>
                  <TouchableOpacity
                    onPress={() => setFriendsModalVisible(false)}
                    style={styles.closeButton}
                  >
                    <MaterialCommunityIcons name="close" size={24} color="#FF3333" />
                  </TouchableOpacity>
                </View>

                <View style={styles.tabContainer}>
                  <TouchableOpacity
                    style={[styles.tabButton, activeTab === 'friends' && styles.activeTab]}
                    onPress={() => setActiveTab('friends')}
                  >
                    <Text style={styles.tabText}>Arkadaşlar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.tabButton, activeTab === 'settings' && styles.activeTab]}
                    onPress={() => setActiveTab('settings')}
                  >
                    <Text style={styles.tabText}>Ayarlar</Text>
                  </TouchableOpacity>
                </View>

                {activeTab === 'friends' ? (
                  <ScrollView style={styles.friendsList}>
                    {/* Add Friend Form */}
                    <View style={styles.addFriendContainer}>
                      <TextInput
                        style={styles.addFriendInput}
                        value={addFriendInput}
                        onChangeText={setAddFriendInput}
                        placeholder="Kullanıcı adı veya ID gir..."
                        placeholderTextColor="#B0B0B0"
                      />
                      <TouchableOpacity style={styles.addFriendButton} onPress={addFriend}>
                        <Text style={styles.addFriendButtonText}>Ekle</Text>
                      </TouchableOpacity>
                    </View>

                    {/* Friends List */}
                    {friends.map((friend) => (
                      <View key={friend.id} style={styles.friendItem}>
                        <Text style={styles.friendUsername}>
                          {friend.username} ({friend.status})
                        </Text>
                        <View style={styles.friendActions}>
                          <TouchableOpacity
                            style={styles.friendActionButton}
                            onPress={() => startChat(friend.username)}
                          >
                            <MaterialCommunityIcons name="chat" size={20} color="#FF3333" />
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles.friendActionButton}
                            onPress={() => toggleMuteFriend(friend.id)}
                          >
                            <MaterialCommunityIcons
                              name={friend.isMuted ? 'volume-off' : 'volume-high'}
                              size={20}
                              color="#FF3333"
                            />
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles.friendActionButton}
                            onPress={() => toggleBlockFriend(friend.id)}
                          >
                            <MaterialCommunityIcons
                              name={friend.isBlocked ? 'block-helper' : 'account-cancel'}
                              size={20}
                              color="#FF3333"
                            />
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles.friendActionButton}
                            onPress={() => removeFriend(friend.id)}
                          >
                            <MaterialCommunityIcons name="delete" size={20} color="#FF3333" />
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))}
                  </ScrollView>
                ) : (
                  <View style={styles.settingsContainer}>
                    <Text style={styles.settingsText}>Bildirimler: Açık</Text>
                    <Text style={styles.settingsText}>Tema: Koyu</Text>
                    <TouchableOpacity style={styles.settingsButton}>
                      <Text style={styles.settingsButtonText}>Ayarları Kaydet</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </Animatable.View>
            </View>
          </Modal>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  backgroundImage: {
    opacity: 0.3,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(28, 37, 38, 0.8)',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  backButton: {
    position: 'absolute',
    left: 0,
    backgroundColor: 'rgba(255, 51, 51, 0.2)',
    padding: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#FF3333',
    zIndex: 10,
  },
  friendsButton: {
    position: 'absolute',
    right: 0,
    backgroundColor: 'rgba(255, 51, 51, 0.2)',
    padding: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#FF3333',
    zIndex: 10,
  },
  title: {
    fontFamily: 'MetalMania_400Regular',
    fontSize: 48,
    color: '#FF3333',
    textShadowColor: '#B0B0B0',
    textShadowOffset: { width: 4, height: 4 },
    textShadowRadius: 8,
    textAlign: 'center',
  },
  messagesContainer: {
    flex: 1,
    marginBottom: 10,
  },
  messageBubble: {
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    maxWidth: '80%',
  },
  ownMessage: {
    backgroundColor: 'rgba(255, 51, 51, 0.2)',
    borderWidth: 1,
    borderColor: '#FF3333',
    alignSelf: 'flex-end',
  },
  otherMessage: {
    backgroundColor: 'rgba(176, 176, 176, 0.2)',
    borderWidth: 1,
    borderColor: '#B0B0B0',
    alignSelf: 'flex-start',
  },
  messageUser: {
    fontFamily: 'MetalMania_400Regular',
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 5,
  },
  messageText: {
    fontFamily: 'MetalMania_400Regular',
    fontSize: 14,
    color: '#B0B0B0',
  },
  messageTime: {
    fontFamily: 'MetalMania_400Regular',
    fontSize: 12,
    color: '#FFFFFF',
    alignSelf: 'flex-end',
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 51, 51, 0.2)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FF3333',
    padding: 10,
  },
  messageInput: {
    flex: 1,
    fontFamily: 'MetalMania_400Regular',
    fontSize: 14,
    color: '#FFFFFF',
    padding: 5,
  },
  sendButton: {
    backgroundColor: '#FF3333',
    padding: 10,
    borderRadius: 10,
    marginLeft: 10,
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 18,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: 'rgba(28, 37, 38, 0.9)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FF3333',
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalTitle: {
    fontFamily: 'MetalMania_400Regular',
    fontSize: 24,
    color: '#FF3333',
  },
  closeButton: {
    padding: 5,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  tabButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#FF3333',
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  activeTab: {
    backgroundColor: 'rgba(255, 51, 51, 0.3)',
  },
  tabText: {
    fontFamily: 'MetalMania_400Regular',
    fontSize: 16,
    color: '#FFFFFF',
  },
  friendsList: {
    flex: 1,
  },
  addFriendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  addFriendInput: {
    flex: 1,
    fontFamily: 'MetalMania_400Regular',
    fontSize: 14,
    color: '#FFFFFF',
    backgroundColor: 'rgba(255, 51, 51, 0.2)',
    borderWidth: 1,
    borderColor: '#FF3333',
    borderRadius: 5,
    padding: 5,
  },
  addFriendButton: {
    backgroundColor: '#FF3333',
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  addFriendButtonText: {
    fontFamily: 'MetalMania_400Regular',
    fontSize: 14,
    color: '#FFFFFF',
  },
  friendItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'rgba(255, 51, 51, 0.2)',
    borderRadius: 5,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: '#FF3333',
  },
  friendUsername: {
    fontFamily: 'MetalMania_400Regular',
    fontSize: 16,
    color: '#FFFFFF',
  },
  friendActions: {
    flexDirection: 'row',
  },
  friendActionButton: {
    padding: 5,
    marginLeft: 5,
  },
  settingsContainer: {
    padding: 10,
  },
  settingsText: {
    fontFamily: 'MetalMania_400Regular',
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 10,
  },
  settingsButton: {
    backgroundColor: '#FF3333',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  settingsButtonText: {
    fontFamily: 'MetalMania_400Regular',
    fontSize: 16,
    color: '#FFFFFF',
  },
});

export default ChatScreen;