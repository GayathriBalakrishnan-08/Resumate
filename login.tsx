import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet, Platform } from "react-native";
import { getDBConnection } from "../utils/database";
import { useRouter } from "expo-router";
import { useAuth } from "./context/AuthContext";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [db, setDb] = useState(null);
  const router = useRouter();
  const { login: loginUser } = useAuth();

  useEffect(() => {
    const initializeDB = async () => {
      const database = await getDBConnection();
      setDb(database);
      console.log("✅ Database initialized in Login:", database);
    };
    initializeDB();
  }, []);

  const handleLogin = async () => {
    console.log("🟡 Login button clicked");

    if (!db) {
      Alert.alert("Error", "Database not initialized.");
      return;
    }

    if (!email || !password) {
      Alert.alert("Error", "Please enter your email and password.");
      return;
    }

    if (Platform.OS === "web") {
      try {
        const tx = db.transaction("users", "readonly");
        const store = tx.objectStore("users");
        const user = await store.get(email);

        if (user && user.password === password) {
          const userData = { email: user.email, name: user.name || "User" };
          await loginUser(userData); // 🔥 This sets the user in context
          Alert.alert("Success", "Login successful!");
          console.log("✅ User logged in successfully:", email);
          setTimeout(() => router.push("/main"), 1000);
        }        
      } catch (error) {
        console.error("❌ IndexedDB Error:", error);
        Alert.alert("Error", "Could not log in.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
  
      <TextInput 
        placeholder="Email" 
        style={styles.input} 
        value={email} 
        onChangeText={setEmail} 
      />
      <TextInput 
        placeholder="Password" 
        secureTextEntry 
        style={styles.input} 
        value={password} 
        onChangeText={setPassword} 
      />
  
      <View style={styles.buttonContainer}>
        <Button title="Login" onPress={handleLogin} />
      </View>
  
      <View style={styles.rowContainer}>
        <View style={styles.rowButton}>
          <Button title="Sign Up" onPress={() => router.push("/signup")} />
        </View>
        <View style={styles.rowButton}>
          <Button title="Forgot Password?" onPress={() => router.push("/forgot-password")} />
        </View>
      </View>
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
    marginVertical: 10 
  },
  rowContainer: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    width: "80%", 
    marginTop: 10 
  },
  rowButton: { 
    flex: 1, 
    marginHorizontal: 5 
  }
});
