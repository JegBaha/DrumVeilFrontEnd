import { MetalMania_400Regular, useFonts } from '@expo-google-fonts/metal-mania';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { ImageBackground, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { SafeAreaView } from 'react-native-safe-area-context';

// Constants
const HIT_ZONE_X = 500;
const HIT_ZONE_WIDTH = 50;
const START_X = 0;
const BPM = 160;
const BEAT_INTERVAL = 60 / BPM;

const DRUM_PITCHES: { [key: number]: string } = {
  36: 'Kick',
  38: 'Snare',
  42: 'Hi-Hat',
  46: 'Open Hi-Hat',
  41: 'Low Floor Tom',
  43: 'High Floor Tom',
  45: 'Low Mid Tom',
  47: 'Mid Tom',
  48: 'High Mid Tom',
  50: 'High Tom',
  49: 'Crash Cymbal',
  51: 'Ride Cymbal',
  53: 'Chinese Cymbal',
  55: 'Splash Cymbal',
  57: 'Crash Cymbal 2',
};

const PITCH_POSITIONS: { [key: number]: number } = {
  36: 0, 38: 1, 42: 2, 46: 3, 41: 4, 43: 5, 45: 6, 47: 7, 48: 8, 50: 9, 49: 10, 51: 11, 53: 12, 55: 13, 57: 14,
};

const PITCH_KEYS: { [key: number]: string } = {
  36: ' ',
  38: 'j',
  42: 'k',
  46: 'l',
  41: 'a',
  43: 's',
  45: 'd',
  47: 'f',
  48: 'g',
  50: 'h',
  49: 'q',
  51: 'w',
  53: 'e',
  55: 'r',
  57: 't',
};

const PITCH_ICONS: { [key: number]: string } = {
  36: 'fire', 38: 'music-note', 42: 'triangle', 46: 'triangle-down', 41: 'drum', 43: 'drumstick', 45: 'drumstick', 47: 'drumstick', 48: 'drumstick', 50: 'drumstick', 49: 'bell', 51: 'bell', 53: 'bell', 55: 'bell', 57: 'bell',
};

const PITCH_COLORS: { [key: number]: string } = {
  36: '#FF3333', 38: '#B0B0B0', 42: '#FFD700', 46: '#00FF00', 41: '#FF4500', 43: '#FF8C00', 45: '#FFA500', 47: '#FF6347', 48: '#FF7F50', 50: '#FF69B4', 49: '#FFD700', 51: '#DAA520', 53: '#FFA500', 55: '#ADFF2F', 57: '#FF4500',
};

const HIT_FEEDBACK_MESSAGES = [
  'Perfect!', 'Crushing!', 'Nailed It!', 'Epic Hit!', 'Smashed!', 'On Fire!', 'Boom!', 'Killer!'
];

const DIFFICULTY_SETTINGS = {
  1: { noteSpeed: 250, hitTolerance: 100, noteDensity: 0.4 }, // Kolay
  2: { noteSpeed: 350, hitTolerance: 75, noteDensity: 0.6 },  // Orta
  3: { noteSpeed: 450, hitTolerance: 50, noteDensity: 0.8 },  // Zor
};

const generateMetalcoreNotes = (difficulty: number): { pitch: number; prob: number; time: number }[] => {
  const notes: { pitch: number; prob: number; time: number }[] = [];
  const duration = 20;
  let time = 0;
  const noteDensity = DIFFICULTY_SETTINGS[difficulty].noteDensity;

  Object.keys(PITCH_POSITIONS).forEach((pitch, index) => {
    if (Math.random() < 0.3 * noteDensity) {
      notes.push({ pitch: Number(pitch), prob: 0.8, time: index * 0.5 });
    }
  });

  while (time < duration) {
    const beat = Math.floor(time / BEAT_INTERVAL);
    const isQuarterBeat = time % BEAT_INTERVAL < 0.01;

    if (isQuarterBeat) {
      if (Math.random() < 0.5 * noteDensity) notes.push({ pitch: 36, prob: 0.9, time });
      if (beat % 2 === 0 && Math.random() < 0.2 * noteDensity) notes.push({ pitch: 36, prob: 0.9, time: time + BEAT_INTERVAL / 2 });
      if ((beat % 4 === 2 || beat % 4 === 0) && Math.random() < 0.7) notes.push({ pitch: 38, prob: 0.95, time });
      if (Math.random() < 0.6 * noteDensity) notes.push({ pitch: 42, prob: 0.85, time });
      if (Math.random() < 0.1 * noteDensity) notes.push({ pitch: 46, prob: 0.85, time });
      if (Math.random() < 0.2 * noteDensity) {
        const tomPitches = [41, 43, 45, 47, 48, 50];
        const cymbalPitches = [49, 51, 53, 55, 57];
        const randomPitch = Math.random() < 0.5 ? tomPitches[Math.floor(Math.random() * tomPitches.length)] : cymbalPitches[Math.floor(Math.random() * cymbalPitches.length)];
        notes.push({ pitch: randomPitch, prob: 0.8, time });
      }
    }

    if (Math.random() < 0.3 * noteDensity) notes.push({ pitch: 42, prob: 0.8, time: time + BEAT_INTERVAL / 4 });
    if (Math.random() < 0.15 * noteDensity) notes.push({ pitch: 36, prob: 0.8, time: time + BEAT_INTERVAL / 4 });

    time += BEAT_INTERVAL / 4;
  }

  return notes.sort((a, b) => a.time - b.time).slice(0, 200);
};

interface NoteProps {
  pred: { pitch: number; prob: number; time: number };
  index: number;
  currentTime: number;
  difficulty: number;
  hitNotes: Set<number>;
  isInHitZone: (noteX: number, noteY: number, pitch: number) => boolean;
  isMissed: (noteTime: number, index: number) => boolean;
}

const NoteBlock = memo(({ pred, index, currentTime, difficulty, hitNotes, isInHitZone, isMissed }: NoteProps) => {
  const positionX = START_X + ((currentTime - pred.time) * DIFFICULTY_SETTINGS[difficulty].noteSpeed);
  const positionY = PITCH_POSITIONS[pred.pitch] * 50;
  const inHitZone = isInHitZone(positionX, positionY, pred.pitch);
  const missed = isMissed(pred.time, index);
  const isHit = hitNotes.has(index);

  if (positionX < -50 || positionX > 600) return null;

  return (
    <Animatable.View
      animation={inHitZone ? { 0: { scale: 1 }, 1: { scale: 1.2 } } : undefined}
      duration={200}
      style={[
        styles.note,
        {
          left: positionX,
          top: positionY,
          backgroundColor: missed ? '#FF0000' : isHit ? '#00FF00' : PITCH_COLORS[pred.pitch],
          borderColor: inHitZone ? '#FFFF00' : '#1C2526',
          borderWidth: inHitZone ? 3 : 1,
        },
      ]}
    >
      <MaterialCommunityIcons name={PITCH_ICONS[pred.pitch]} size={20} color="white" />
    </Animatable.View>
  );
});

const DrumNotes: React.FC = () => {
  const [fontsLoaded, fontError] = useFonts({ MetalMania_400Regular });
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [totalHits, setTotalHits] = useState(0);
  const [successfulHits, setSuccessfulHits] = useState(0);
  const [hitNotes, setHitNotes] = useState<Set<number>>(new Set());
  const [hitFeedback, setHitFeedback] = useState<string | null>(null);
  const [showFlash, setShowFlash] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [difficulty, setDifficulty] = useState(1); // Kolay modda başlar
  const parsedPredictionsRef = useRef(generateMetalcoreNotes(1));
  const [parsedPredictions, setParsedPredictions] = useState(parsedPredictionsRef.current);
  const lastFrameTime = useRef(0);
  const lastKeyPressTime = useRef(0);

  const isInHitZone = useCallback((noteX: number, noteY: number, pitch: number) => {
    const xDiff = Math.abs(noteX - HIT_ZONE_X);
    const expectedY = PITCH_POSITIONS[pitch] * 50;
    const yDiff = Math.abs(noteY - expectedY);
    return xDiff <= DIFFICULTY_SETTINGS[difficulty].hitTolerance && yDiff <= 50;
  }, [difficulty]);

  const isMissed = useCallback((noteTime: number, index: number) => {
    const positionX = START_X + ((currentTime - noteTime) * DIFFICULTY_SETTINGS[difficulty].noteSpeed);
    return positionX > (HIT_ZONE_X + DIFFICULTY_SETTINGS[difficulty].hitTolerance) && !hitNotes.has(index);
  }, [currentTime, difficulty, hitNotes]);

  const handleHit = useCallback((pitchNum: number) => {
    const now = Date.now();
    if (now - lastKeyPressTime.current < 100) return;
    lastKeyPressTime.current = now;

    const hitNote = parsedPredictions.find((pred, index) => {
      const positionX = START_X + ((currentTime - pred.time) * DIFFICULTY_SETTINGS[difficulty].noteSpeed);
      const xDiff = Math.abs(positionX - HIT_ZONE_X);
      return pred.pitch === pitchNum && xDiff <= DIFFICULTY_SETTINGS[difficulty].hitTolerance && !hitNotes.has(index);
    });

    if (hitNote) {
      const newCombo = combo + 1;
      setCombo(newCombo);
      setScore((prev) => prev + 10 * Math.min(newCombo, 5));
      setSuccessfulHits((prev) => prev + 1);
      setHitNotes((prev) => new Set(prev).add(parsedPredictions.indexOf(hitNote)));
      setHitFeedback(HIT_FEEDBACK_MESSAGES[Math.floor(Math.random() * HIT_FEEDBACK_MESSAGES.length)]);
      setShowFlash(true);
      setTimeout(() => setHitFeedback(null), 300);
      setTimeout(() => setShowFlash(false), 100);
    }

    setTotalHits((prev) => prev + 1);
  }, [combo, currentTime, difficulty, hitNotes, parsedPredictions]);

  useEffect(() => {
    if (Platform.OS !== 'web') return;

    const handleKeyPress = (event: KeyboardEvent) => {
      const key = event.key === ' ' ? ' ' : event.key.toLowerCase();
      const pitch = Object.keys(PITCH_KEYS).find(p => PITCH_KEYS[Number(p)] === key);
      if (!pitch) return;

      handleHit(Number(pitch));
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleHit]);

  useEffect(() => {
    if (__DEV__) {
      console.log(`Oyun başladı, zorluk: ${difficulty === 1 ? 'Kolay' : difficulty === 2 ? 'Orta' : 'Zor'}`);
    }

    let animationFrameId: number;
    const updateTime = (timestamp: number) => {
      if (!lastFrameTime.current) lastFrameTime.current = timestamp;
      const deltaTime = Math.min((timestamp - lastFrameTime.current) / 1000, 0.016); // 60 FPS cap
      lastFrameTime.current = timestamp;

      setCurrentTime((prev) => prev + deltaTime);

      if (Math.floor(timestamp / 16.67) % 30 === 0) {
        const allNotesPassed = parsedPredictions.every((pred) => {
          const positionX = START_X + ((currentTime - pred.time) * DIFFICULTY_SETTINGS[difficulty].noteSpeed);
          return positionX > (HIT_ZONE_X + DIFFICULTY_SETTINGS[difficulty].hitTolerance);
        });

        if (allNotesPassed && parsedPredictions.length > 0) {
          setGameEnded(true);
        }
      }

      animationFrameId = requestAnimationFrame(updateTime);
    };

    animationFrameId = requestAnimationFrame(updateTime);
    return () => cancelAnimationFrame(animationFrameId);
  }, [difficulty, parsedPredictions]);

  const changeDifficulty = useCallback((newDifficulty: number) => {
    setDifficulty(newDifficulty);
    const newNotes = generateMetalcoreNotes(newDifficulty);
    setParsedPredictions(newNotes);
    parsedPredictionsRef.current = newNotes;
    setCurrentTime(0);
    setHitNotes(new Set());
    setScore(0);
    setCombo(0);
    setTotalHits(0);
    setSuccessfulHits(0);
    setGameEnded(false);
  }, []);

  const restartGame = useCallback(() => {
    setCurrentTime(0);
    setScore(0);
    setCombo(0);
    setTotalHits(0);
    setSuccessfulHits(0);
    setHitNotes(new Set());
    setGameEnded(false);
    const newNotes = generateMetalcoreNotes(difficulty);
    setParsedPredictions(newNotes);
    parsedPredictionsRef.current = newNotes;
  }, [difficulty]);

  const goBack = useCallback(() => router.back(), [router]);

  if (!fontsLoaded || fontError) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>{fontError ? 'Font yükleme hatası!' : 'Fontlar yükleniyor...'}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('./assets/images/drum_background3.jpg')}
        style={styles.background}
        imageStyle={styles.backgroundImage}
      >
        <View style={styles.overlay}>
          <Animatable.View animation="fadeIn" style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={goBack}>
              <MaterialCommunityIcons name="arrow-left" size={24} color="#FF3333" />
            </TouchableOpacity>
            <Text style={styles.headerText}>Drumveil Ritual</Text>
          </Animatable.View>

          <Animatable.View animation="fadeIn" delay={200} style={styles.statsContainer}>
            <Text style={styles.statText}>Skor: {score}</Text>
            <Text style={styles.statText}>Combo: {combo}x</Text>
            <Text style={styles.statText}>
              Doğruluk: {totalHits > 0 ? ((successfulHits / totalHits) * 100).toFixed(2) : 0}%
            </Text>
          </Animatable.View>

          <View style={styles.difficultyContainer}>
            {[1, 2, 3].map((level) => (
              <TouchableOpacity
                key={level}
                onPress={() => changeDifficulty(level)}
                style={[styles.difficultyButton, difficulty === level && styles.activeDifficultyButton]}
              >
                <Text style={styles.difficultyText}>
                  {level === 1 ? 'Kolay' : level === 2 ? 'Orta' : 'Zor'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.hintContainer}>
            {parsedPredictions
              .filter((p) => {
                const x = START_X + ((currentTime - p.time) * DIFFICULTY_SETTINGS[difficulty].noteSpeed);
                return x >= -50 && x <= 600;
              })
              .slice(0, 1)
              .map((p) => (
                <Text key={p.time} style={styles.hintText}>
                  {DRUM_PITCHES[p.pitch]} için: {PITCH_KEYS[p.pitch] === ' ' ? 'SPACE' : PITCH_KEYS[p.pitch].toUpperCase()}
                </Text>
              ))}
          </View>

          <View style={styles.highwayContainer}>
            <View style={styles.highway}>
              <View style={styles.hitZone}>
                {showFlash && (
                  <Animatable.View
                    animation="flash"
                    duration={100}
                    style={styles.flashEffect}
                  />
                )}
                {Object.keys(PITCH_POSITIONS).map((pitch) => (
                  <TouchableOpacity
                    key={pitch}
                    style={styles.hitZoneLane}
                    onPress={() => Platform.OS !== 'web' && handleHit(Number(pitch))}
                  />
                ))}
              </View>
              {Object.keys(PITCH_POSITIONS).map((pitch) => (
                <View key={pitch} style={styles.lane}>
                  <Text style={styles.laneText}>
                    {DRUM_PITCHES[Number(pitch)]} ({PITCH_KEYS[Number(pitch)] === ' ' ? 'SPACE' : PITCH_KEYS[Number(pitch)].toUpperCase()})
                  </Text>
                </View>
              ))}
              {parsedPredictions.map((pred, index) => (
                <NoteBlock
                  key={`${pred.time}-${index}`}
                  pred={pred}
                  index={index}
                  currentTime={currentTime}
                  difficulty={difficulty}
                  hitNotes={hitNotes}
                  isInHitZone={isInHitZone}
                  isMissed={isMissed}
                />
              ))}
            </View>
          </View>

          {hitFeedback && (
            <Animatable.View animation="zoomIn" duration={300} style={styles.feedbackContainer}>
              <Text style={styles.feedbackText}>{hitFeedback}</Text>
            </Animatable.View>
          )}

          {gameEnded && (
            <Animatable.View animation="fadeIn" style={styles.modal}>
              <Text style={styles.modalTitle}>Ritual Complete!</Text>
              <Text style={styles.modalText}>
                Skor: {score} | Combo: {combo}x | Doğruluk: {totalHits > 0 ? ((successfulHits / totalHits) * 100).toFixed(2) : 0}%
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.modalButton} onPress={restartGame}>
                  <Text style={styles.buttonText}>Yeniden Başlat</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalButton} onPress={goBack}>
                  <Text style={styles.buttonText}>Ana Menü</Text>
                </TouchableOpacity>
              </View>
            </Animatable.View>
          )}

          <ScrollView style={styles.notesList}>
            {parsedPredictions
              .filter((p) => Math.abs(p.time - currentTime) <= 0.5)
              .map((p, index) => (
                <Text key={`${p.time}-${index}`} style={styles.noteText}>
                  {DRUM_PITCHES[p.pitch]} @ {p.time.toFixed(2)}s
                </Text>
              ))}
          </ScrollView>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: { flex: 1 },
  backgroundImage: { opacity: 0.5 },
  overlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.6)', padding: 10 },
  header: { alignItems: 'center', marginBottom: 10 },
  headerText: { fontFamily: 'MetalMania_400Regular', fontSize: 32, color: '#FF3333', textShadowColor: '#000', textShadowOffset: { width: 2, height: 2 }, textShadowRadius: 2 },
  backButton: { position: 'absolute', top: 0, left: 0, padding: 10 },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-between', padding: 5, marginBottom: 10, backgroundColor: 'rgba(255, 0, 0, 0.2)', borderWidth: 1, borderColor: '#FF3333', borderRadius: 5 },
  statText: { fontFamily: 'MetalMania_400Regular', fontSize: 14, color: '#FFF' },
  difficultyContainer: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 },
  difficultyButton: { padding: 10, backgroundColor: 'rgba(255, 0, 0, 0.3)', borderWidth: 1, borderColor: '#FF3333', borderRadius: 5 },
  activeDifficultyButton: { backgroundColor: '#FF3333' },
  difficultyText: { fontFamily: 'MetalMania_400Regular', fontSize: 14, color: '#FFF' },
  hintContainer: { backgroundColor: 'rgba(0, 0, 0, 0.7)', padding: 5, borderRadius: 5, marginBottom: 10, alignItems: 'center' },
  hintText: { fontFamily: 'MetalMania_400Regular', fontSize: 14, color: '#FF0' },
  highwayContainer: { height: 350, marginBottom: 10 },
  highway: { flex: 1, backgroundColor: '#111', borderWidth: 1, borderColor: '#FF3333', borderRadius: 5, overflow: 'hidden' },
  lane: { height: 50, borderBottomWidth: 1, borderBottomColor: '#333' },
  laneText: { position: 'absolute', left: 5, top: 5, fontFamily: 'MetalMania_400Regular', fontSize: 12, color: '#FFF' },
  hitZone: { position: 'absolute', top: 0, left: HIT_ZONE_X, width: HIT_ZONE_WIDTH, height: '100%', backgroundColor: 'rgba(255, 255, 0, 0.3)', borderWidth: 1, borderColor: '#FF0' },
  hitZoneLane: { height: 50, borderBottomWidth: 1, borderBottomColor: '#555' },
  flashEffect: { position: 'absolute', width: '100%', height: '100%', backgroundColor: 'rgba(255, 255, 255, 0.3)' },
  note: { width: 20, height: 20, position: 'absolute', borderRadius: 5, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  feedbackContainer: { position: 'absolute', bottom: 50, left: 0, right: 0, alignItems: 'center' },
  feedbackText: { fontFamily: 'MetalMania_400Regular', fontSize: 18, color: '#FF0', textShadowColor: '#000', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 2 },
  notesList: { maxHeight: 100 },
  noteText: { fontFamily: 'MetalMania_400Regular', fontSize: 12, color: '#FFF', padding: 5 },
  modal: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.8)', justifyContent: 'center', alignItems: 'center' },
  modalTitle: { fontFamily: 'MetalMania_400Regular', fontSize: 24, color: '#FF3333', marginBottom: 10 },
  modalText: { fontFamily: 'MetalMania_400Regular', fontSize: 16, color: '#FFF', marginBottom: 10 },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-around', width: '80%' },
  modalButton: { padding: 10, backgroundColor: 'rgba(255, 0, 0, 0.3)', borderWidth: 1, borderColor: '#FF3333', borderRadius: 5 },
  buttonText: { fontFamily: 'MetalMania_400Regular', fontSize: 14, color: '#FFF', textAlign: 'center' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' },
  loadingText: { fontSize: 16, color: '#FFF' },
});

export default DrumNotes;