import { MetalMania_400Regular, useFonts } from '@expo-google-fonts/metal-mania';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Alert, ImageBackground, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Post {
  id: number;
  user: string;
  content: string;
  likes: number;
  comments: number;
}

interface Friend {
  id: number;
  username: string;
}

interface UserProfile {
  username: string;
  level: number;
  favoriteGenres: string[];
  status: 'online' | 'offline';
}

const mockPosts: Post[] = [
  { id: 1, user: 'MetalHead42', content: 'New drum cover uploaded! 🔥 #MetalCore', likes: 128, comments: 15 },
  { id: 2, user: 'DrumVeilFan', content: 'Just hit a 50x combo in Drumveil Ritual! 🥁', likes: 85, comments: 10 },
  { id: 3, user: 'RiffMaster', content: 'Check out my latest track on SoundCloud! 🤘', likes: 203, comments: 22 },
];

const mockProfiles: UserProfile[] = [
  { username: 'MetalHead42', level: 12, favoriteGenres: ['Metalcore', 'Deathcore', 'Progressive Metal'], status: 'online' },
  { username: 'DrumVeilFan', level: 8, favoriteGenres: ['Metalcore', 'Hardcore', 'Punk'], status: 'offline' },
  { username: 'RiffMaster', level: 15, favoriteGenres: ['Thrash Metal', 'Heavy Metal', 'Power Metal'], status: 'online' },
];

const mockFriends: Friend[] = [
  { id: 1, username: 'MetalHead42' },
  { id: 2, username: 'DrumVeilFan' },
];

const SocialScreen: React.FC = () => {
  const [fontsLoaded] = useFonts({ MetalMania_400Regular });
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [friends, setFriends] = useState<Friend[]>(mockFriends);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);

  const handleLike = useCallback((postId: number) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId ? { ...post, likes: post.likes + 1 } : post
      )
    );
  }, []);

  const handleViewProfile = useCallback((username: string) => {
    const profile = mockProfiles.find((p) => p.username === username);
    if (profile) {
      setSelectedProfile(profile);
      setProfileModalVisible(true);
    }
  }, []);

  const handleAddFriend = useCallback((username: string) => {
    if (friends.some((f) => f.username === username)) {
      Alert.alert('Bilgi', `${username} zaten arkadaş listenizde!`);
      return;
    }

    const newFriend: Friend = {
      id: friends.length + 1,
      username,
    };
    setFriends((prev) => [...prev, newFriend]);
    Alert.alert('Başarılı', `${username} arkadaş olarak eklendi!`);
    setProfileModalVisible(false);
  }, [friends]);

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
            <Text style={styles.title}>Social Ritual</Text>
          </Animatable.View>

          <ScrollView style={styles.postsContainer}>
            {posts.map((post) => (
              <Animatable.View
                key={post.id}
                animation="fadeInUp"
                delay={post.id * 100}
                style={styles.postCard}
              >
                <TouchableOpacity onPress={() => handleViewProfile(post.user)}>
                  <Text style={styles.postUser}>
                    {post.user} {friends.some((f) => f.username === post.user) ? '(Arkadaş)' : ''}
                  </Text>
                </TouchableOpacity>
                <Text style={styles.postContent}>{post.content}</Text>
                <View style={styles.postActions}>
                  <Animatable.View animation={post.likes > mockPosts[post.id - 1].likes ? 'pulse' : undefined}>
                    <TouchableOpacity style={styles.actionButton} onPress={() => handleLike(post.id)}>
                      <MaterialCommunityIcons name="heart" size={20} color="#FF3333" />
                      <Text style={styles.actionText}>{post.likes} Likes</Text>
                    </TouchableOpacity>
                  </Animatable.View>
                  <TouchableOpacity style={styles.actionButton}>
                    <MaterialCommunityIcons name="comment" size={20} color="#FF3333" />
                    <Text style={styles.actionText}>{post.comments} Comments</Text>
                  </TouchableOpacity>
                </View>
              </Animatable.View>
            ))}
          </ScrollView>

          {/* Profile Modal */}
          <Modal
            visible={profileModalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setProfileModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <Animatable.View animation="zoomIn" style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Kullanıcı Profili</Text>
                  <TouchableOpacity
                    onPress={() => setProfileModalVisible(false)}
                    style={styles.closeButton}
                  >
                    <MaterialCommunityIcons name="close" size={24} color="#FF3333" />
                  </TouchableOpacity>
                </View>

                {selectedProfile && (
                  <View style={styles.profileContainer}>
                    <Text style={styles.profileUsername}>{selectedProfile.username}</Text>
                    <Text style={styles.profileStatus}>
                      Durum: {selectedProfile.status === 'online' ? 'Çevrimiçi' : 'Çevrimdışı'}
                    </Text>
                    <Text style={styles.profileLevel}>Seviye: {selectedProfile.level}</Text>
                    <Text style={styles.profileGenres}>
                      Sevdiği Türler: {selectedProfile.favoriteGenres.join(', ')}
                    </Text>
                    <TouchableOpacity
                      style={[
                        styles.addFriendButton,
                        friends.some((f) => f.username === selectedProfile.username) && styles.disabledButton,
                      ]}
                      onPress={() => handleAddFriend(selectedProfile.username)}
                      disabled={friends.some((f) => f.username === selectedProfile.username)}
                    >
                      <Text style={styles.addFriendButtonText}>
                        {friends.some((f) => f.username === selectedProfile.username) ? 'Arkadaş' : 'Arkadaş Ekle'}
                      </Text>
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
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    position: 'absolute',
    top: 0,
    left: 0,
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
  postsContainer: {
    flex: 1,
  },
  postCard: {
    backgroundColor: 'rgba(255, 51, 51, 0.2)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#FF3333',
  },
  postUser: {
    fontFamily: 'MetalMania_400Regular',
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 5,
  },
  postContent: {
    fontFamily: 'MetalMania_400Regular',
    fontSize: 16,
    color: '#B0B0B0',
    marginBottom: 10,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    fontFamily: 'MetalMania_400Regular',
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 5,
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
  profileContainer: {
    alignItems: 'center',
  },
  profileUsername: {
    fontFamily: 'MetalMania_400Regular',
    fontSize: 20,
    color: '#FFFFFF',
    marginBottom: 10,
  },
  profileStatus: {
    fontFamily: 'MetalMania_400Regular',
    fontSize: 16,
    color: '#B0B0B0',
    marginBottom: 5,
  },
  profileLevel: {
    fontFamily: 'MetalMania_400Regular',
    fontSize: 16,
    color: '#B0B0B0',
    marginBottom: 5,
  },
  profileGenres: {
    fontFamily: 'MetalMania_400Regular',
    fontSize: 16,
    color: '#B0B0B0',
    marginBottom: 15,
    textAlign: 'center',
  },
  addFriendButton: {
    backgroundColor: '#FF3333',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    width: '100%',
  },
  disabledButton: {
    backgroundColor: 'rgba(255, 51, 51, 0.3)',
    opacity: 0.6,
  },
  addFriendButtonText: {
    fontFamily: 'MetalMania_400Regular',
    fontSize: 16,
    color: '#FFFFFF',
  },
});

export default SocialScreen;