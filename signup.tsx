import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet, Platform } from "react-native";
import { getDBConnection } from "../utils/database";
import { useRouter } from "expo-router";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [db, setDb] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const initializeDB = async () => {
      const database = await getDBConnection();
      setDb(database);
      console.log("✅ Database initialized in SignUp:", database);
    };
    initializeDB();
  }, []);

  const sendWelcomeEmail = async (email, name) => {
    try {
      const response = await fetch("http://localhost:5000/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log("✅ Welcome email sent:", email);
      } else {
        console.error("❌ Failed to send email:", data.error);
      }
    } catch (error) {
      console.error("❌ Error sending email:", error);
    }
  };

  const handleSignUp = async () => {
    console.log("🟡 SignUp button clicked");

    if (!db) {
      Alert.alert("Error", "Database not initialized.");
      return;
    }

    if (!name || !email || !password) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    if (Platform.OS === "web") {
      try {
        const tx = db.transaction("users", "readwrite");
        const store = tx.objectStore("users");
        const existingUser = await store.get(email);

        if (existingUser) {
          Alert.alert("Error", "User already exists. Try logging in.");
          return;
        }

        await store.put({ name, email, password });
        Alert.alert("Success", "Account created! Check your email.");
        console.log("✅ User added successfully:", email);

        // Send welcome email
        await sendWelcomeEmail(email, name);

        setTimeout(() => router.push("/login"), 1000);
      } catch (error) {
        console.error("❌ IndexedDB Error:", error);
        Alert.alert("Error", "Could not create account.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <TextInput placeholder="Full Name" style={styles.input} value={name} onChangeText={setName} />
      <TextInput placeholder="Email" style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" />
      <TextInput placeholder="Password" secureTextEntry style={styles.input} value={password} onChangeText={setPassword} />
      <Button title="Submit" onPress={handleSignUp} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    backgroundColor: "#fff" 
  },
  title: { 
    fontSize: 24, 
    fontWeight: "bold", 
    marginBottom: 20 
  },
  input: { 
    width: "80%", 
    padding: 10, 
    marginVertical: 5, 
    borderWidth: 1, 
    borderColor: "#ccc", 
    borderRadius: 5 
  },
  buttonContainer: { 
    width: "80%", 
    marginVertical: 5 
  }
});
