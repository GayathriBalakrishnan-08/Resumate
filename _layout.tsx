import { useEffect } from "react";
import { Platform } from "react-native";
import { Stack } from "expo-router";
import { getDBConnection, createTable } from "../utils/database";
import { ResumeHistoryProvider } from "./context/ResumeHistoryContext";
import { AuthProvider } from "./context/AuthContext";

export default function Layout() {
  useEffect(() => {
    const initializeDB = async () => {
      if (Platform.OS !== "web") {
        const db = await getDBConnection();
        await createTable();
      }
    };
    initializeDB();
  }, []);

  return (
    <AuthProvider>
      <ResumeHistoryProvider>
        <Stack />
      </ResumeHistoryProvider>
    </AuthProvider>
  );
}
