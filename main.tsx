import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Linking,
} from "react-native";
import { useRouter } from "expo-router";

export default function MainScreen() {
  const router = useRouter();
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();
  }, []);

  // 🔗 Function to open Google Maps
  const openGoogleMaps = () => {
    const latitude = 12.9716; // Example: Bengaluru
    const longitude = 77.5946;
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.title, { opacity: fadeAnim }]}>
        WELCOME TO RESUMATE
      </Animated.Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/select-template")}
      >
        <Text style={styles.buttonText}>BUILD RESUME</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/ats-score-checker")}
      >
        <Text style={styles.buttonText}>ATS SCORE CHECKER</Text>
      </TouchableOpacity>

      {/* 🌍 Google Maps Redirect Button */}
      <TouchableOpacity style={styles.button} onPress={openGoogleMaps}>
        <Text style={styles.buttonText}>FIND ORGANISATIONS NEAR ME</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/resume-history")}
      >
        <Text style={styles.buttonText}>VIEW RESUME HISTORY</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#2e86c1",
  },
  button: {
    backgroundColor: "#3498db",
    padding: 15,
    width: "80%",
    alignItems: "center",
    borderRadius: 5,
    marginVertical: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
});
