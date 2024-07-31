import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const UploadSuccess = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Ionicons
        name="checkmark-circle"
        size={100}
        color="#4CAF50"
        style={styles.icon}
      />
      <Text style={styles.title}>Your Aadhar Card Uploaded Successfully</Text>
      <Button
        title="Go to Profile"
        onPress={() => navigation.navigate("Welcome")}
        color="#4CAF50"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  icon: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 30,
  },
});

export default UploadSuccess;
