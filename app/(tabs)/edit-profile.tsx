import { MetalMania_400Regular, useFonts } from '@expo-google-fonts/metal-mania';
import { Montserrat_400Regular } from '@expo-google-fonts/montserrat';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ImageBackground } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { SafeAreaView } from 'react-native-safe-area-context';

import BlurCard from '@/components/BlurCard';
import { STYLES } from '@/constants/Styles';

const EditProfileScreen = () => {
  const [fontsLoaded] = useFonts({ MetalMania_400Regular, Montserrat_400Regular });
  const router = useRouter();
  const [username, setUsername] = useState('Baa');
  const [bio, setBio] = useState('Drum sever!');

  if (!fontsLoaded) {
    return <View style={styles.loadingContainer}><Text style={styles.loadingText}>Fontlar yükleniyor...</Text></View>;
  }

  const saveProfile = () => {
    // Backend entegrasyonu için placeholder
    console.log('Profil kaydedildi:', { username, bio });
    router.back();
  };

  const goBack = () => router.back();

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('./assets/images/drum_background.jpg')}
        style={styles.background}
        cache="force-cache"
      >
        <LinearGradient colors={['rgba(0, 0, 0, 0.8)', 'rgba(0, 0, 0, 0.9)']} style={styles.gradient}>
          <TouchableOpacity style={styles.backButton} onPress={goBack}>
            <MaterialCommunityIcons name="arrow-left" size={30} color={STYLES.neonRed} />
          </TouchableOpacity>
          <View style={styles.content}>
            <Animatable.Text animation="zoomIn" duration={1000} style={styles.title}>
              Profili Düzenle
            </Animatable.Text>
            <BlurCard>
              <TextInput
                style={styles.input}
                value={username}
                onChangeText={setUsername}
                placeholder="Kullanıcı Adı"
                placeholderTextColor="#B0B0B0"
              />
              <TextInput
                style={styles.input}
                value={bio}
                onChangeText={setBio}
                placeholder="Biyografi"
                placeholderTextColor="#B0B0B0"
                multiline
              />
              <TouchableOpacity style={styles.saveButton} onPress={saveProfile}>
                <Text style={styles.saveText}>Kaydet</Text>
              </TouchableOpacity>
            </BlurCard>
          </View>
        </LinearGradient>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: { flex: 1, resizeMode: 'cover' },
  gradient: { flex: 1 },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: 'rgba(255, 51, 51, 0.2)',
    padding: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: STYLES.neonRed,
    zIndex: 10,
  },
  content: { flex: 1, padding: 20, alignItems: 'center', justifyContent: 'center' },
  title: {
    fontFamily: 'MetalMania_400Regular',
    fontSize: 36,
    color: STYLES.neonRed,
    textShadowColor: '#B0B0B0',
    textShadowOffset: { width: 4, height: 4 },
    textShadowRadius: 8,
    marginBottom: 20,
  },
  input: {
    backgroundColor: 'rgba(255, 51, 51, 0.2)',
    borderWidth: 1,
    borderColor: STYLES.neonRed,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
    color: '#fff',
    width: '100%',
  },
  saveButton: {
    backgroundColor: STYLES.neonRed,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  saveText: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 16,
    color: '#1C2526',
  },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: '#fff', fontSize: 18 },
});

export default EditProfileScreen;