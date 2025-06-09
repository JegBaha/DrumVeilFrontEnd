import { MetalMania_400Regular, useFonts } from '@expo-google-fonts/metal-mania';
import { Montserrat_400Regular, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { ImageBackground } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

const dummyData = {
  name: 'Baa',
  avatar: "https://v2.convertapi.com/d/zj7i7mrr76kua6vk2jha3uarz4p2ob7z/2023-10-12-Sleep-Token-II-Day-1-138-300x300.jpg",
  favoriteGenres: ['Heavy Metal', 'Progressive Metal', 'Punk Rock', 'Grunge'],
  level: 'Pro Drummer',
  uploadedSongs: [
    { id: '1', title: 'Vore', artist: 'Sleep Token', duration: '5:31' },
    { id: '2', title: 'Black Hole', artist: 'Architects', duration: '5:01' },
    { id: '3', title: 'No Loss, No Love', artist: 'Spiritbox', duration: '2:49' },
  ],
};

export default function Profile() {
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    MetalMania_400Regular,
    Montserrat_400Regular,
    Montserrat_700Bold,
  });
  const router = useRouter();

  if (!fontsLoaded) {
    return null;
  }

  const goBack = () => {
    router.back();
  };

  const renderGenreTag = ({ item }: { item: string }) => (
    <Animatable.View animation="fadeIn" style={styles.genreTag}>
      <Text style={styles.genreText}>{item}</Text>
    </Animatable.View>
  );

  const renderSongItem = ({ item }: { item: { id: string; title: string; artist: string; duration: string } }) => (
    <Animatable.View animation="fadeInUp" style={styles.songCard}>
      <Text style={styles.songTitle}>{item.title}</Text>
      <Text style={styles.songArtist}>{item.artist}</Text>
      <Text style={styles.songDuration}>{item.duration}</Text>
    </Animatable.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('./assets/images/drum_background.jpg')}
        style={styles.background}
        cache="force-cache"
      >
        <LinearGradient
          colors={['rgba(0, 0, 0, 0.8)', 'rgba(0, 0, 0, 0.9)']}
          style={styles.gradient}
        >
          <TouchableOpacity style={styles.backButton} onPress={goBack}>
            <MaterialCommunityIcons name="arrow-left" size={30} color="#FF3333" />
          </TouchableOpacity>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* Avatar and Name */}
            <Animatable.View animation="zoomIn" duration={1000} style={styles.avatarContainer}>
              <ImageBackground
                source={{ uri: dummyData.avatar }}
                style={styles.avatar}
                imageStyle={styles.avatarImage}
              >
                <LinearGradient
                  colors={['transparent', Colors[colorScheme ?? 'light'].neonRed]}
                  style={styles.avatarGradient}
                />
              </ImageBackground>
              <Text style={styles.name}>{dummyData.name}</Text>
            </Animatable.View>

            {/* Level */}
            <Animatable.View animation="fadeIn" delay={200} style={styles.section}>
              <BlurView intensity={80} style={styles.blurCard}>
                <Text style={styles.sectionTitle}>Level</Text>
                <Text style={styles.levelText}>{dummyData.level}</Text>
              </BlurView>
            </Animatable.View>

            {/* Favorite Genres */}
            <Animatable.View animation="fadeIn" delay={400} style={styles.section}>
              <BlurView intensity={80} style={styles.blurCard}>
                <Text style={styles.sectionTitle}>Favorite Genres</Text>
                <FlatList
                  data={dummyData.favoriteGenres}
                  renderItem={renderGenreTag}
                  keyExtractor={(item) => item}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.genreList}
                />
              </BlurView>
            </Animatable.View>

            {/* Uploaded Songs */}
            <Animatable.View animation="fadeIn" delay={600} style={styles.section}>
              <BlurView intensity={80} style={styles.blurCard}>
                <Text style={styles.sectionTitle}>Uploaded Songs</Text>
                <FlatList
                  data={dummyData.uploadedSongs}
                  renderItem={renderSongItem}
                  keyExtractor={(item) => item.id}
                  showsVerticalScrollIndicator={false}
                />
              </BlurView>
            </Animatable.View>
          </ScrollView>
        </LinearGradient>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  gradient: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: 'rgba(255, 51, 51, 0.2)',
    padding: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#FF3333',
    zIndex: 10,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: Colors.light.neonRed,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarGradient: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  name: {
    fontFamily: 'MetalMania_400Regular',
    fontSize: 28,
    color: Colors.light.neonRed,
    textShadowColor: 'rgba(255, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
    marginTop: 10,
  },
  section: {
    marginBottom: 20,
  },
  blurCard: {
    borderRadius: 15,
    padding: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 0, 0, 0.3)',
  },
  sectionTitle: {
    fontFamily: 'MetalMania_400Regular',
    fontSize: 22,
    color: Colors.light.neonRed,
    marginBottom: 10,
  },
  levelText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 18,
    color: '#fff',
  },
  genreList: {
    paddingVertical: 5,
  },
  genreTag: {
    backgroundColor: 'rgba(255, 0, 0, 0.2)',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 15,
    marginRight: 10,
    borderWidth: 1,
    borderColor: Colors.light.neonRed,
  },
  genreText: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
    color: '#fff',
  },
  songCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 0, 0, 0.2)',
  },
  songTitle: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 16,
    color: Colors.light.neonRed,
  },
  songArtist: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
    color: '#fff',
  },
  songDuration: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 12,
    color: '#ccc',
    marginTop: 5,
  },
});