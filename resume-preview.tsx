// app/resume-preview.tsx
import React, { useEffect, useState } from "react";
import { View, Text, Button, Alert, ScrollView } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ResumePreview() {
  const router = useRouter();
  const searchParams = useLocalSearchParams();
  const template = searchParams.template;
  

  const [resumeData, setResumeData] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      const storedData = await AsyncStorage.getItem("resumeData"); // ✅ AsyncStorage instead of localStorage
      if (storedData) {
        setResumeData(JSON.parse(storedData));
      }
    };
    loadData();
  }, []);

  if (!resumeData) {
    return (
      <View style={{ padding: 20 }}>
        <Text>Loading resume data...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 20 }}>
        Preview Resume
      </Text>

      <View style={{ borderWidth: 1, borderRadius: 10, padding: 15, backgroundColor: "#fff" }}>
        {template === "1" && <TemplateOne data={resumeData} />}
        {template === "2" && <TemplateTwo data={resumeData} />}
        {template === "3" && <TemplateThree data={resumeData} />}
      </View>

      <View style={{ marginTop: 20 }}>
        <Button title="Go Back" onPress={() => router.push("/build-resume")} />
      </View>

      {resumeData.professional_summary && (
  <View style={{ marginBottom: 15 }}>
    <Text style={{ fontWeight: "bold" }}>Professional Summary:</Text>
    <Text>{resumeData.professional_summary}</Text>
  </View>
)}

      

      <View style={{ marginTop: 10 }}>
        <Button
          title="Generate Resume PDF"
          onPress={async () => {
            try {
              const res = await fetch("http://<your-backend-url>/generate-resume", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...resumeData, template }),
              });

              if (res.ok) {
                Alert.alert("Success", "Resume generated successfully!");
              } else {
                Alert.alert("Error", "Failed to generate resume.");
              }
            } catch (error) {
              console.error(error);
              Alert.alert("Error", "Something went wrong.");
            }
          }}
        />
      </View>
    </ScrollView>
  );
}

