import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { CameraView, Camera } from 'expo-camera';
import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';

export default function App() {
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [appState, setAppState] = useState<'idle' | 'listening' | 'processing'>('idle');
  const [statusMessage, setStatusMessage] = useState("Tap to start speaking");
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isCameraReady, setIsCameraReady] = useState<boolean>(false);
  const cameraRef = useRef<any>(null);

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === 'granted');
    })();
  }, []);

  // 1. START NATIVE AUDIO STREAM RECORDING
  const startVoiceRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== 'granted') {
        Alert.alert("Permission Denied", "Microphone access is required to capture your voice query.");
        resetToIdle();
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
    } catch (err) {
      console.error('Failed to start native recording stream', err);
      Alert.alert("Audio Error", "Could not initialize device microphone.");
      resetToIdle();
    }
  };

  // 2. STOP RECORDING & INTERCEPT AUDIO LOCAL PATH
  const stopAndProcessSequence = async () => {
    if (!recording || !cameraRef.current) return;
    
    if (!isCameraReady) {
      Alert.alert("Camera Warming Up", "The camera scanner lens is still initializing. Please wait a second and try again.");
      return;
    }

    setAppState('processing');
    setStatusMessage("📸 Clicking picture and compiling scene...");

    try {
      // Stop the mic recording and get local audio file path
      await recording.stopAndUnloadAsync();
      const audioUri = recording.getURI();
      setRecording(null);

      // Snap the camera capture frame
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.5 });
      setStatusMessage("🧠 Transcribing voice & analyzing photo with AI...");

      if (audioUri && photo.uri) {
        await uploadMediaToBackend(audioUri, photo.uri);
      } else {
        throw new Error("Missing media URI inputs");
      }

    } catch (error: any) {
      console.error('Sequence collection layout pipeline failed', error);
      Alert.alert("Capture Error", `Failed to snap frame: ${error?.message || error}`);
      resetToIdle();
    }
  };

  // 3. SHIP BOTH RAW FILES TO FLASK IN A SINGLE REQUEST
  const uploadMediaToBackend = async (audioFileUri: string, photoFileUri: string) => {
    try {
      const formData = new FormData();
      formData.append('query', 'Identify any obstacles or physical hazards in front of me.');
      
      // Append the raw recorded audio file (.m4a format)
      formData.append('audio', {
        uri: audioFileUri,
        name: 'voice_command.m4a',
        type: 'audio/m4a',
      } as any);

      // Append the snapped camera image asset
      formData.append('image', {
        uri: photoFileUri,
        name: 'scene_photo.jpg',
        type: 'image/jpeg',
      } as any);

      // Points to your live Render endpoint route configuration
      const BACKEND_URL = 'https://smartverse-hackathon-app-v0-2.onrender.com/process-scene'; 

      const response = await fetch(BACKEND_URL, {
        method: 'POST',
        body: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (!response.ok) {
        throw new Error(`Server status crash: ${response.status}`);
      }

      const result = await response.json();
      
      // Extraction targets result.spatial_description matched to backend response
      const aiResponseText = result.spatial_description || "Scene processed successfully.";

      setStatusMessage(`🤖 AI Answer:\n${aiResponseText}`);
      Speech.speak(aiResponseText, { language: 'en' });
      
      setTimeout(() => {
        resetToIdle();
      }, 12000);

    } catch (error: any) {
      console.error(error);
      Alert.alert(
        "Debugging Connection", 
        `Error Message: ${error?.message || error || 'Unknown Error'}`
      );
      resetToIdle();
    }
  }; // <--- FIX: This closing brace was missing!

  const resetToIdle = () => {
    setAppState('idle');
    setStatusMessage("Tap to start speaking");
  };

  const handleActionSequence = () => {
    if (appState === 'idle') {
      setAppState('listening');
      setStatusMessage("🎙️ Listening to you now...\nSpeak your question clearly.\n\n👉 Tap button again to take picture!");
      startVoiceRecording();
    } 
    else if (appState === 'listening') {
      stopAndProcessSequence();
    }
  };

  if (hasCameraPermission === null) {
    return <View style={styles.container}><Text style={styles.textPrompt}>Requesting camera...</Text></View>;
  }
  if (hasCameraPermission === false) {
    return <View style={styles.container}><Text style={styles.textPrompt}>No camera access.</Text></View>;
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Safe minimal frame size layout fix with native layout listener ready states */}
        <CameraView 
          style={styles.cameraActiveTiny} 
          ref={cameraRef} 
          onCameraReady={() => setIsCameraReady(true)}
        />
        
        <Text style={styles.textPrompt}>{statusMessage}</Text>

        <TouchableOpacity 
          style={[
            styles.giantCircularButton,
            appState === 'listening' && styles.buttonListening,
            appState === 'processing' && styles.buttonProcessing
          ]} 
          onPress={handleActionSequence}
          disabled={appState === 'processing'}
        >
          <Text style={styles.micIcon}>
            {appState === 'idle' ? '🎙️' : appState === 'listening' ? '📸' : '⏳'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  scrollContainer: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  
  // Safe minimal active frame footprint
  cameraActiveTiny: { width: 10, height: 10, position: 'absolute', bottom: 0, right: 0, opacity: 0.1 },
  
  giantCircularButton: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#1E1E1E',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 40,
    borderWidth: 4,
    borderColor: '#00ffff',
    shadowColor: '#00ffff',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 12,
  },
  buttonListening: { backgroundColor: '#ff4757', borderColor: '#ff6b81', shadowColor: '#ff4757' },
  buttonProcessing: { backgroundColor: '#2ed573', borderColor: '#7bed9f', shadowColor: '#2ed573' },
  micIcon: { fontSize: 72, color: '#ffffff' },
  
  textPrompt: { 
    color: '#ffffff', 
    fontSize: 24, 
    textAlign: 'center', 
    fontWeight: '700', 
    lineHeight: 36,
    minHeight: 120,
    paddingHorizontal: 10
  }
});