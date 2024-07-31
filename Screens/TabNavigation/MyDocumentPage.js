// MyDocumentsPage.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { Alert, TouchableOpacity } from "react-native";
import {
  ScrollView,
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";

const MyDocumentsPage = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [documentData, setDocumentData] = useState({});
  const [isRefresh, setIsRefresh] = useState(false);

    async function getuserData() {
      try {
        const token = await AsyncStorage.getItem("uid");
        const response = await fetch(
          "https://chowkpe-server.onrender.com/api/v1/auth/getDocument",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "content-Type": "multipart/form-data",
            },
          }
        );

        const result = await response.json();
        console.log(result);
        if (result.success == true) {
          setDocumentData(result);
        }
      } catch (error) {
        Alert.alert("server error!!");
      }
    }

  useFocusEffect( 
    React.useCallback(() => {
      getuserData();
    }, [isRefresh])
  );

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setIsRefresh(!isRefresh);
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>My Documents</Text>
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Aadhar Card</Text>
        {!documentData?.document?.aadhar?.submitted ? (
          <View style={styles.imageContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate("EditAdhar")}
            >
              <Text style={styles.buttonText}>Add Aadhar +</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.imageContainer}>
            <Image
              source={{
                uri: documentData?.document?.aadhar.images[0],
              }} // Replace with your image URI
              style={styles.image}
              resizeMode="contain"
            />
            <Image
              source={{
                uri:documentData?.document?.aadhar.images[1],
              }} // Replace with your image URI
              style={styles.image}
              resizeMode="contain"
            />
          </View>
        )}
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>PAN Card</Text>

        {!documentData?.document?.pan?.submitted ? (
          <View style={styles.imageContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate("EditPan")}
            >
              <Text style={styles.buttonText}>Add Pan +</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.imageContainer}>
            <Image
              source={{
                uri: documentData?.document?.pan.image,
              }} // Replace with your image URI
              style={styles.image}
              resizeMode="contain"
            />
          </View>
        )}
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Driving License</Text>
        {!documentData?.document?.drivingLicence?.submitted ? (
          <View style={styles.imageContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate("EditDriving")}
            >
              <Text style={styles.buttonText}>Add Driver License +</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.imageContainer}>
            <Image
              source={{
                uri: documentData?.document?.drivingLicence.image,
              }} // Replace with your image URI
              style={styles.image}
              resizeMode="contain"
            />
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
    marginTop: 30,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
    color:"black"
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    color:"black"
  },
  imageContainer: {
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center",
    gap: 5,
  },
  image: {
    width: "100%", // Responsive width
    height: 200,
    borderRadius: 8,
  },
  button: {
    backgroundColor: "#021F93",
    height: 50,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    width: "85%",
    marginVertical:40
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default MyDocumentsPage;
