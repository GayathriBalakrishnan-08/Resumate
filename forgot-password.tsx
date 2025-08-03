import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet, Platform } from "react-native";
import { getDBConnection } from "../utils/database";
import { useRouter } from "expo-router";

export default function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [db, setDb] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const initializeDB = async () => {
      const database = await getDBConnection();
      setDb(database);
    };
    initializeDB();
  }, []);

  const handleResetPassword = async () => {
    if (!email || !newPassword || !confirmPassword) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    if (Platform.OS !== "web") {
      db.transaction(tx => {
        tx.executeSql(
          "SELECT * FROM users WHERE email = ?",
          [email],
          (_, { rows }) => {
            if (rows.length > 0) {
              db.transaction(tx => {
                tx.executeSql(
                  "UPDATE users SET password = ? WHERE email = ?",
                  [newPassword, email],
                  () => {
                    Alert.alert("Success", "Password reset successful!");
                    router.push("/login"); // Redirect to login
                  },
                  (_, error) => Alert.alert("Error", "Could not reset password.")
                );
              });
            } else {
              Alert.alert("Error", "User not found.");
            }
          }
        );
      });
    } else {
      // Web: Check IndexedDB
      const tx = db.transaction("users", "readwrite");
      const store = tx.objectStore("users");
      const user = await store.get(email);

      if (user) {
        user.password = newPassword;
        await store.put(user);
        Alert.alert("Success", "Password reset successful!");
        router.push("/login"); // Redirect to login
      } else {
        Alert.alert("Error", "User not found.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      <TextInput placeholder="Email" style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" />
      <TextInput placeholder="New Password" secureTextEntry style={styles.input} value={newPassword} onChangeText={setNewPassword} />
      <TextInput placeholder="Confirm Password" secureTextEntry style={styles.input} value={confirmPassword} onChangeText={setConfirmPassword} />
      <Button title="Submit" onPress={handleResetPassword} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  input: { width: "80%", padding: 10, marginVertical: 5, borderWidth: 1, borderColor: "#ccc", borderRadius: 5 },
});
