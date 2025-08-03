// app/resume-history.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useResumeHistory } from './context/ResumeHistoryContext';
import { useAuth } from './context/AuthContext';
import ResumeHistoryComponent from '../components/ResumeHistory';

export default function ResumeHistoryScreen() {
    const { resumes } = useResumeHistory();
    const { user } = useAuth();
  
    if (!user) {
      return (
        <View style={styles.centered}>
          <Text style={styles.text}>Please login to view your resumes.</Text>
        </View>
      );
    }
  
    // ✅ Don't filter again – already filtered inside the provider!
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Your Resume History</Text>
        <ResumeHistoryComponent resumes={resumes} />

      </View>
    );
  }
  

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
  },
});
