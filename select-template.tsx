import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";

export default function SelectTemplate() {
  const router = useRouter();

  const handleSelect = (templateId: string) => {
    router.push(`/build-resume?template=${templateId}`);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.container}>
        <Text style={styles.heading}>Choose a Resume Template</Text>

        {Array.from({ length: 10 }, (_, i) => (
          <TouchableOpacity
            key={i + 1}
            style={styles.card}
            onPress={() => handleSelect((i + 1).toString())}
          >
            <Text style={styles.cardText}>Template {i + 1}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 20,
  },
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
  card: {
    padding: 20,
    backgroundColor: "#f0f0f0",
    marginBottom: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  cardText: {
    fontSize: 18,
    color: "#333",
  },
});
