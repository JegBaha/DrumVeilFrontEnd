import { MetalMania_400Regular, useFonts } from '@expo-google-fonts/metal-mania';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Animatable from 'react-native-animatable';

const HomeScreen: React.FC = () => {
  const [fontsLoaded, fontsError] = useFonts({ MetalMania_400Regular });
  const router = useRouter();
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(true);

  // Tema müziğini yükleme ve oynatma
  useEffect(() => {
    const loadThemeMusic = async () => {
      const { sound } = await Audio.Sound.createAsync(
        require('./assets/sounds/theme_music.mp3'),
        { shouldPlay: true, isLooping: true }
      );
      setSound(sound);
    };

    loadThemeMusic();

    return () => {
      sound?.unloadAsync();
    };
  }, []);

  // Tema müziğini açıp kapatma
  const toggleMusic = async () => {
    if (isMusicPlaying) {
      await sound?.pauseAsync();
    } else {
      await sound?.playAsync();
    }
    setIsMusicPlaying(!isMusicPlaying);
  };

  const goToDrumNotes = () => {
    console.log('DrumNotes sayfasına yönlendiriliyor...');
    router.push('/DrumNotes');
  };

  const goToProfile = () => {
    router.push('/profile');
  };

  const goToSocial = () => {
    router.push('/social');
  };

  const goToChat = () => {
    router.push('/chat');
  };

  const goToSettings = () => {
    router.push('/settings');
  };

  const goToAchievements = () => {
    router.push('/achievements');
  };

  if (!fontsLoaded || fontsError) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>
          {fontsError ? 'Font yükleme hatası!' : 'Fontlar yükleniyor...'}
        </Text>
      </View>
    );
  }

  return (
    <ImageBackground
      source={require('./assets/images/drum_background2.jpg')}
      style={styles.container}
      imageStyle={styles.backgroundImage}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.musicButton} onPress={toggleMusic}>
          <MaterialCommunityIcons
            name={isMusicPlaying ? 'music' : 'music-off'}
            size={30}
            color="#FF3333"
          />
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <Animatable.Text
            animation="zoomIn"
            duration={1000}
            style={styles.title}
          >
            Drumveil Ritual
          </Animatable.Text>
        </View>

        <View style={styles.rightButtonContainer}>
          <Animatable.View animation="fadeIn" delay={200} style={styles.iconButton}>
            <TouchableOpacity onPress={goToProfile}>
              <MaterialCommunityIcons name="account-circle" size={30} color="#FF3333" />
            </TouchableOpacity>
          </Animatable.View>
          <Animatable.View animation="fadeIn" delay={300} style={styles.iconButton}>
            <TouchableOpacity onPress={goToSocial}>
              <MaterialCommunityIcons name="account-group" size={30} color="#FF3333" />
            </TouchableOpacity>
          </Animatable.View>
          <Animatable.View animation="fadeIn" delay={400} style={styles.iconButton}>
            <TouchableOpacity onPress={goToChat}>
              <MaterialCommunityIcons name="chat" size={30} color="#FF3333" />
            </TouchableOpacity>
          </Animatable.View>
          <Animatable.View animation="fadeIn" delay={500} style={styles.iconButton}>
            <TouchableOpacity onPress={goToSettings}>
              <MaterialCommunityIcons name="cog" size={30} color="#FF3333" />
            </TouchableOpacity>
          </Animatable.View>
          <Animatable.View animation="fadeIn" delay={600} style={styles.iconButton}>
            <TouchableOpacity onPress={goToAchievements}>
              <MaterialCommunityIcons name="trophy" size={30} color="#FF3333" />
            </TouchableOpacity>
          </Animatable.View>
        </View>

        <Animatable.View animation="fadeInUp" delay={700} style={styles.buttonContainer}>
          <TouchableOpacity style={styles.unleashButton} onPress={goToDrumNotes}>
            <MaterialCommunityIcons name="fire" size={24} color="#1C2526" />
            <Text style={styles.buttonText}>Unleash the Drums</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.extractButton} onPress={goToDrumNotes}>
            <MaterialCommunityIcons name="drums" size={24} color="#1C2526" />
            <Text style={styles.buttonText}>Davul Notalarını Çıkar</Text>
          </TouchableOpacity>
        </Animatable.View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    opacity: 0.3,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(28, 37, 38, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  musicButton: {
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
  titleContainer: {
    position: 'absolute',
    top: 40,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
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
  rightButtonContainer: {
    position: 'absolute',
    right: 20,
    top: 80,
    alignItems: 'center',
  },
  iconButton: {
    backgroundColor: 'rgba(255, 51, 51, 0.2)',
    padding: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#FF3333',
    marginVertical: 10,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  unleashButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF3333',
    padding: 15,
    borderRadius: 15,
    width: '90%',
    borderWidth: 2,
    borderColor: '#B0B0B0',
    marginBottom: 10,
  },
  extractButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF3333',
    padding: 15,
    borderRadius: 15,
    width: '90%',
    borderWidth: 2,
    borderColor: '#B0B0B0',
  },
  buttonText: {
    color: '#1C2526',
    textAlign: 'center',
    fontSize: 18,
    fontFamily: 'MetalMania_400Regular',
    marginLeft: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default HomeScreen;