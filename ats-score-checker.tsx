import React, { useState } from "react";
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet } from "react-native";
import * as DocumentPicker from "expo-document-picker";

export default function ATSScoreChecker() {
  const [resume, setResume] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState(null);

  // Function to handle resume upload
  const pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({
      type: ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
    });

    if (result.type !== "cancel") {
      setResume(result);
    }
  };

  // Function to handle ATS Score Calculation (Mock API Call)
  const checkATSScore = async () => {
    if (!resume || !jobDescription) {
      alert("Please upload a resume and enter the job description.");
      return;
    }

    // Mock API response (Replace with actual API call)
    const mockResponse = {
      score: 85,
      feedback: ["Include more technical skills", "Match job description keywords"],
    };

    setResult(mockResponse);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ATS Score Checker</Text>

      <TouchableOpacity style={styles.uploadButton} onPress={pickDocument}>
        <Text style={styles.buttonText}>{resume ? "Resume Uploaded" : "Upload Resume (PDF/DOCX)"}</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Paste Job Description here"
        multiline
        value={jobDescription}
        onChangeText={setJobDescription}
      />

      <Button title="Check ATS Score" onPress={checkATSScore} />

      {result && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>ATS Score: {result.score}%</Text>
          <Text>Feedback:</Text>
          {result.feedback.map((item, index) => (
            <Text key={index} style={styles.feedback}>{`• ${item}`}</Text>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  uploadButton: {
    backgroundColor: "#3498db",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  input: {
    width: "100%",
    height: 100,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
  },
  resultContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  resultText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  feedback: {
    fontSize: 16,
    marginTop: 5,
  },
});
