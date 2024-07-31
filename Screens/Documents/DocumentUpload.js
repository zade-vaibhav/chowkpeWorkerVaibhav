import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";
import Pan from "../../assets/images/pandoc.png";
import Adhar from "../../assets/images/aadhardoc.png";
import Drive from "../../assets/images/drivingdoc.png";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import Tts from 'react-native-tts';

export default function DocumentUpload({ navigation }) {
  const [aadhar, setAadhar] = useState(false);
  const [pan, setPan] = useState(false);
  const [driving, setDriving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefresh, setIsRefresh] = useState(false);
  const [lang, setLang] = useState("English")

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

      if (!response.ok) {
        setIsLoading(false);
        // Alert.alert("somthng went wrong!!");
      }
      const result = await response.json();

      if (result.document.aadhar.submitted) {
        setAadhar(true);
      }
      if (result.document.pan.submitted) {
        setPan(true);
      }
      if (result.document.drivingLicence.submitted) {
        setDriving(true);
      }
    } catch (error) {
      console.log(error);
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
  }, [navigation]);

  useEffect(() => {
    const setLanguage = async () => {
      try {
        const language = await AsyncStorage.getItem("Lang");
        setLang(language);
      } catch (error) {
        console.error("Error fetching language from AsyncStorage:", error);
      }
    };

    setLanguage();
  }, []);

  const handleSubmit = async () => {
    setIsLoading(true)
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

      if (!response.ok) {
        setIsLoading(false);
        Alert.alert("Please upload atleast one document from these");
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();

      if (
        result?.document?.aadhar?.submitted ||
        result?.document?.pan?.submitted ||
        result?.document?.drivingLicence?.submitted
      ) {
        setIsLoading(false);
        navigation.replace("BankDetailPage");
      } else {
        setIsLoading(false);
        Alert.alert("Please upload atleast one document from these");
        return;
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  // speak
  function handelSpeak() {
    console.log("hello")
    Tts.speak(`
    ऊपर पूछे गए दस्तावेज़ों में से कोई एक अपलोड करें`)
  }

  return (
    <View style={styles.container}>
      {
        lang == "English" ? (
          <>
            <Text style={styles.heading}>Upload your documents</Text>
            <Text style={styles.subheading}>Choose the document you want to upload</Text>
          </>
        ) : (
          <>
            <Text style={styles.heading}>अपने दस्तावेज़ अपलोड करें</Text>
            <Text style={styles.subheading}>अपलोड करने के लिए दस्तावेज़ चुनें</Text>
          </>
        )
      }


      <View style={[styles.divContainer, styles.adharContainer]}>
        <View style={styles.containerDiv}>
          <View style={styles.leftPart}>
            {
              lang == "English" ? (
                <Text style={styles.divText}>Aadhar Card</Text>
              ) : (
                <Text style={styles.divText}>आधार कार्ड</Text>
              )
            }
            {aadhar ? (
              <Pressable style={styles.uploadBtn1}>
                <Text style={styles.uploadBtnText}>
                  {lang == "English" ? "Uploaded" : "अपलोड किया गया"}
                </Text>
              </Pressable>
            ) : (
              <Pressable
                style={styles.uploadBtn}
                onPress={() => navigation.navigate("AadharUpload")}
              >
                <Text style={styles.uploadBtnText}>
                  {lang == "English" ? "Upload" : "अपलोड"}
                </Text>
              </Pressable>
            )}
          </View>

          <View style={styles.rightPart}>
            <Image source={Adhar} style={styles.rotatedImage} />
          </View>
        </View>
      </View>

      <View style={[styles.divContainer, styles.panContainer]}>
        <View style={styles.containerDiv}>
          <View style={styles.leftPart}>
            {
              lang == "English" ? (
                <Text style={styles.divText}>Pan Card</Text>
              ) : (
                <Text style={styles.divText}>पैन कार्ड</Text>
              )
            }
            {pan ? (
              <Pressable style={styles.uploadBtn1}>
                <Text style={styles.uploadBtnText}>
                  {lang == "English" ? "Uploaded" : "अपलोड किया गया"}
                </Text>
              </Pressable>
            ) : (
              <Pressable
                style={styles.uploadBtn}
                onPress={() => navigation.navigate("PanUpload")}
              >
                <Text style={styles.uploadBtnText}>
                  {lang == "English" ? "Upload" : "अपलोड"}
                </Text>
              </Pressable>
            )}
          </View>


          <View style={styles.rightPart}>
            <Image source={Pan} style={styles.rotatedImage} />
          </View>
        </View>
      </View>

      <View style={[styles.divContainer, styles.driveContainer]}>
        <View style={styles.containerDiv}>
          <View style={styles.leftPart}>
            {
              lang == "English" ? (
                <Text style={styles.divText}>Driving License</Text>
              ) : (
                <Text style={styles.divText}>ड्राइविंग लाइसेंस</Text>
              )
            }
            {driving ? (
              <Pressable style={styles.uploadBtn1}>
                <Text style={styles.uploadBtnText}>
                  {lang == "English" ? "Uploaded" : "अपलोड किया गया"}
                </Text>
              </Pressable>
            ) : (
              <Pressable
                style={styles.uploadBtn}
                onPress={() => navigation.navigate("DrivingLicence")}
              >
                <Text style={styles.uploadBtnText}>
                  {lang == "English" ? "Upload" : "अपलोड"}
                </Text>
              </Pressable>
            )}
          </View>


          <View style={styles.rightPart}>
            <Image source={Drive} style={styles.rotatedImage} />
          </View>
        </View>
      </View>

      {isLoading ? (
        <TouchableOpacity style={styles.continueButton}>
          <ActivityIndicator size="small" color="white" />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.continueButton} onPress={handleSubmit}>
          <TouchableOpacity onPress={() => handelSpeak()}>
            <Image
              source={require("../../assets/images/skill/Vector.png")}
              style={styles.headingImage}
            />
          </TouchableOpacity>
          <Text style={styles.continueButtonText}>
            {lang == "English" ? "Continue" : "आगे"}
          </Text>

        </TouchableOpacity>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 6,
    textAlign: "center",
    color: 'black'
  },
  subheading: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
    marginBottom: 50,
    color: "#888",
  },
  divContainer: {
    width: "100%",
    marginBottom: 20,
    borderRadius: 10,
  },
  containerDiv: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderRadius: 10,
    overflow: "hidden",
  },
  adharContainer: {
    backgroundColor: "#F8DCC7",
  },
  panContainer: {
    backgroundColor: "#EEEEFF",
  },
  driveContainer: {
    backgroundColor: "#FBEBF5",
  },
  leftPart: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "center",
    marginLeft: 20,
  },
  rightPart: {
    flex: 1,
    alignItems: "center",
  },
  divText: {
    marginBottom: 10,
    fontWeight: "600",
    fontSize: 16,
    color: "black"
  },
  uploadBtn: {
    backgroundColor: "#AFB6E5",
    paddingVertical: 6,
    paddingHorizontal: 18,
    borderRadius: 5,
  },
  uploadBtn1: {
    backgroundColor: "green",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  uploadBtnText: {
    color: "#fff",
    fontSize: 16,
  },
  rotatedImage: {
    width: 220,
    height: 120,
    transform: [{ rotate: "10deg" }],
  },
  continueButton: {
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#021F93",
    borderRadius: 5,
    marginTop: 30,
  },
  continueButtonText: {
    color: "#fff",
    fontSize: 20,
  },
  headingImage: {
    width: 30,
    height: 20,
    marginRight: 10,
    resizeMode: "contain",
    position: "absolute",
    right: -176,
    bottom: 20
  }
});
