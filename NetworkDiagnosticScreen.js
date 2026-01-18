import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import Constants from 'expo-constants';

const NetworkDiagnosticScreen = () => {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(true);

  const getApiUrl = () => {
    const cfg = Constants.expoConfig || Constants.manifest;
    return (cfg && cfg.extra && cfg.extra.apiUrl) || 'https://tryeverything-backend.vercel.app';
  };

  const runDiagnostics = async () => {
    setLoading(true);
    const apiUrl = getApiUrl();
    const newResults = {
      apiUrl,
      tests: {}
    };

    // Test 1: Backend Root
    try {
      const startTime = Date.now();
      const res = await fetch(`${apiUrl}/`, { 
        method: 'GET', 
        timeout: 5000 
      });
      const time = Date.now() - startTime;
      newResults.tests['Backend Root'] = {
        status: res.ok ? '?' : '?',
        message: await res.text(),
        time: `${time}ms`
      };
    } catch (err) {
      newResults.tests['Backend Root'] = {
        status: '?',
        message: err.message,
        time: 'Timeout'
      };
    }

    // Test 2: Auth Endpoint (no token)
    try {
      const startTime = Date.now();
      const res = await fetch(`${apiUrl}/api/auth/profile`, {
        method: 'GET',
        timeout: 5000,
        headers: { 'Content-Type': 'application/json' }
      });
      const time = Date.now() - startTime;
      const data = await res.json();
      newResults.tests['Auth Endpoint'] = {
        status: res.status === 401 ? '?' : '??',
        message: res.status === 401 ? 'Expected 401 (no token)' : `Got ${res.status}`,
        time: `${time}ms`,
        response: JSON.stringify(data)
      };
    } catch (err) {
      newResults.tests['Auth Endpoint'] = {
        status: '?',
        message: err.message,
        time: 'Timeout'
      };
    }

    // Test 3: Supabase URL Reachable
    try {
      const startTime = Date.now();
      const res = await fetch('https://afgnyavcxsvmwpaqxbn.supabase.co/rest/v1/', {
        method: 'HEAD',
        timeout: 5000
      });
      const time = Date.now() - startTime;
      newResults.tests['Supabase API'] = {
        status: res.ok ? '?' : '??',
        message: `Status ${res.status}`,
        time: `${time}ms`
      };
    } catch (err) {
      newResults.tests['Supabase API'] = {
        status: '?',
        message: err.message,
        time: 'Timeout'
      };
    }

    setResults(newResults);
    setLoading(false);
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>?? Network Diagnostics</Text>
      
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Configured API URL:</Text>
        <Text style={styles.url}>{results.apiUrl || 'Loading...'}</Text>
      </View>

      {loading ? (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#556B2F" />
          <Text style={styles.loadingText}>Running tests...</Text>
        </View>
      ) : (
        <View>
          {Object.entries(results.tests || {}).map(([ testName, result ]) => (
            <View key={testName} style={styles.testCard}>
              <View style={styles.testHeader}>
                <Text style={styles.testStatus}>{result.status}</Text>
                <Text style={styles.testName}>{testName}</Text>
              </View>
              <Text style={styles.testMessage}>{result.message}</Text>
              <Text style={styles.testTime}>Response time: {result.time}</Text>
              {result.response && (
                <Text style={styles.response}>{result.response}</Text>
              )}
            </View>
          ))}
        </View>
      )}

      <TouchableOpacity style={styles.button} onPress={runDiagnostics} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Running...' : 'Run Again'}</Text>
      </TouchableOpacity>

      <View style={styles.helpCard}>
        <Text style={styles.helpTitle}>?? What These Tests Mean:</Text>
        <Text style={styles.helpText}>
          <Text style={{ fontWeight: 'bold' }}>? Backend Root:</Text> Backend is deployed and responding
        </Text>
        <Text style={styles.helpText}>
          <Text style={{ fontWeight: 'bold' }}>? Auth Endpoint:</Text> Should return 401 without token (proves endpoint exists)
        </Text>
        <Text style={styles.helpText}>
          <Text style={{ fontWeight: 'bold' }}>? Supabase API:</Text> Database is reachable from your phone
        </Text>
        <Text style={styles.helpText}>
          <Text style={{ fontWeight: 'bold' }}>? If any fail:</Text> Check app.json apiUrl and Vercel env vars
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#556B2F',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#556B2F',
  },
  cardTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  url: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#333',
    backgroundColor: '#f0f0f0',
    padding: 8,
    borderRadius: 4,
  },
  testCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#e0e0e0',
  },
  testHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  testStatus: {
    fontSize: 18,
    marginRight: 8,
  },
  testName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  testMessage: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  testTime: {
    fontSize: 11,
    color: '#999',
    fontStyle: 'italic',
  },
  response: {
    fontSize: 10,
    fontFamily: 'monospace',
    color: '#666',
    backgroundColor: '#f5f5f5',
    padding: 6,
    borderRadius: 4,
    marginTop: 4,
  },
  button: {
    backgroundColor: '#556B2F',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginVertical: 16,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
  },
  helpCard: {
    backgroundColor: '#fff8e1',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
  },
  helpTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  helpText: {
    fontSize: 12,
    color: '#555',
    marginBottom: 6,
    lineHeight: 18,
  },
});

export default NetworkDiagnosticScreen;
