import { MetalMania_400Regular, useFonts } from '@expo-google-fonts/metal-mania';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { SafeAreaView } from 'react-native-safe-area-context';

const mockAchievements = [
  { id: 1, name: 'Combo King', description: '50x combo yap', required: 50, key: 'combo', achieved: false },
  { id: 2, name: 'Score Master', description: '1000 skor ulaş', required: 1000, key: 'score', achieved: false },
  { id: 3, name: 'Precision Drummer', description: '%90 doğruluk elde et', required: 90, key: 'accuracy', achieved: false },
];

const AchievementsScreen: React.FC = () => {
  const [fontsLoaded] = useFonts({ MetalMania_400Regular });
  const router = useRouter();
  const { score = '0', combo = '0', accuracy = '0' } = useLocalSearchParams();

  const achievements = mockAchievements.map((ach) => {
    let achieved = false;
    if (ach.key === 'score') achieved = Number(score) >= ach.required;
    if (ach.key === 'combo') achieved = Number(combo) >= ach.required;
    if (ach.key === 'accuracy') achieved = Number(accuracy) >= ach.required;
    return { ...ach, achieved };
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Fontlar yükleniyor...</Text>
      </View>
    );
  }

  const goBack = () => router.back();

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
            <Text style={styles.title}>Achievements</Text>
          </Animatable.View>
          <ScrollView>
            {achievements.map((achievement) => (
              <Animatable.View
                key={achievement.id}
                animation="fadeInUp"
                delay={achievement.id * 100}
                style={styles.achievementCard}
              >
                <Text style={styles.achievementName}>{achievement.name}</Text>
                <Text style={styles.achievementDesc}>{achievement.description}</Text>
                <Text style={styles.achievementStatus}>{achievement.achieved ? 'Unlocked' : 'Locked'}</Text>
              </Animatable.View>
            ))}
          </ScrollView>
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
  achievementCard: {
    backgroundColor: 'rgba(255, 51, 51, 0.2)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#FF3333',
  },
  achievementName: {
    fontFamily: 'MetalMania_400Regular',
    fontSize: 18,
    color: '#FFFFFF',
  },
  achievementDesc: {
    fontFamily: 'MetalMania_400Regular',
    fontSize: 14,
    color: '#B0B0B0',
  },
  achievementStatus: {
    fontFamily: 'MetalMania_400Regular',
    fontSize: 14,
    color: '#FF3333',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default AchievementsScreen;