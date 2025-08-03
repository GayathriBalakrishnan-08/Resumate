// build-resume.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import { useResumeHistory } from "./context/ResumeHistoryContext";
import { useAuth } from "./context/AuthContext";
import { Linking, TouchableOpacity } from "react-native"; // Add this at the top with your imports




const BuildResumeScreen = () => {
  const navigation = useNavigation();
  const { addResume } = useResumeHistory();
  const { user } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [education, setEducation] = useState("");
  const [experience, setExperience] = useState("");
  const [skills, setSkills] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [template, setTemplate] = useState("1");
  const [pdfUrl, setPdfUrl] = useState("");

  const handleGenerateResume = async () => {
    if (!name || !email || !phone || !education || !experience || !skills) {
      Alert.alert("Missing Fields", "Please fill all the fields.");
      return;
    }

    try {
      const resumeData = {
        name,
        email,
        phone,
        job_description: jobDescription,
        education: education.split(",").map(item => item.trim()),
        experience: experience.split(",").map(item => item.trim()),
        skills: skills.split(",").map(item => item.trim()),
        template,
      };

      const response = await fetch("http://localhost:5000/generate-resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(resumeData),
      });

      const result = await response.json();

      if (result && result.pdf_url) {
        setPdfUrl(result.pdf_url);

        addResume({
          name,
          email,
          phone,
          pdfUri: result.pdf_url,
          createdAt: new Date().toISOString(),
          userEmail: user?.email || "", // use logged-in user's email
        });
        

        Alert.alert("Success", "Resume generated successfully!");
      } else {
        Alert.alert("Error", "Failed to generate resume.");
      }
    } catch (error) {
      console.error("Resume Generation Error:", error);
      Alert.alert("Error", "An error occurred while generating the resume.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Build Your Resume</Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone"
        value={phone}
        onChangeText={setPhone}
      />
      <TextInput
        style={styles.input}
        placeholder="Education (comma-separated)"
        value={education}
        onChangeText={setEducation}
      />
      <TextInput
        style={styles.input}
        placeholder="Experience (comma-separated)"
        value={experience}
        onChangeText={setExperience}
      />
      <TextInput
        style={styles.input}
        placeholder="Skills (comma-separated)"
        value={skills}
        onChangeText={setSkills}
      />
      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Job Description (optional)"
        value={jobDescription}
        onChangeText={setJobDescription}
        multiline
      />

      <View style={styles.pickerContainer}>
        <Text style={styles.pickerLabel}>Select Resume Template:</Text>
        <Picker
          selectedValue={template}
          onValueChange={(itemValue) => setTemplate(itemValue)}
        >
          {Array.from({ length: 10 }, (_, i) => (
            <Picker.Item key={i + 1} label={`Template ${i + 1}`} value={`${i + 1}`} />
          ))}
        </Picker>
      </View>

      <Button title="Generate Resume" onPress={handleGenerateResume} />

      {pdfUrl ? (
  <View style={styles.result}>
    <Text style={styles.link}>PDF Link:</Text>
    <TouchableOpacity onPress={() => Linking.openURL(pdfUrl)}>
      <Text style={styles.url}>View PDF</Text>
    </TouchableOpacity>
  </View>
) : null}

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 15,
    padding: 10,
    borderRadius: 5,
  },
  result: {
    marginTop: 20,
    backgroundColor: "#e6f7ff",
    padding: 10,
    borderRadius: 5,
  },
  link: {
    fontWeight: "bold",
  },
  url: {
    color: "#007aff",
    marginTop: 5,
  },
  pickerContainer: {
    marginBottom: 20,
  },
  pickerLabel: {
    fontWeight: "bold",
    marginBottom: 5,
  },
});

export default BuildResumeScreen;
