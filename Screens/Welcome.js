import React, { useEffect,useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Tts from 'react-native-tts';
import congragulations from "../assets/congrates.png";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Welcome({ navigation }) {
  const [lang,setLang] =useState("English")

  useEffect(() => {
    navigation.setOptions({
      headerTitle: " ",
      headerShown: false,
    });
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

    // speak
    function handelSpeak(){
      console.log("hello")
      Tts.stop()
      Tts.speak(`
      आपका पंजीकरण पूरा हो गया है, होम स्क्रीन पर जाने के लिए आरंभ करें बटन दबाएं`)
    }


  return (
    <View style={styles.container}>
      <Image source={congragulations} style={styles.congragulationsImage} />
      {
        lang == "English"? <Text style={styles.congratsText}>Congratulations!</Text>:<Text style={styles.congratsText}>बधाई हो!</Text>
      }
      
      {
        lang == "English"? <Text style={styles.subText}>
        Your sign-up has been completed successfully.
      </Text>:<Text style={styles.subText}>
आपका साइन-अप सफलतापूर्वक पूरा हो गया है.
      </Text>
      }
      
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.replace("Home")}
      >
        <TouchableOpacity onPress={() => handelSpeak()}>
              <Image
                source={require("../assets/images/skill/Vector.png")}
                style={styles.headingImage}
              />
            </TouchableOpacity>
            {
        lang == "English"?     <Text style={styles.buttonText}>Get started</Text>:<Text style={styles.buttonText}>आगे बढ़ो</Text>
      }
    
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(209, 227, 251, 1)",
    // padding: 20,
    marginTop: -44,
  },
  congragulationsImage: {
    height: "75%",
    width: "100%",
    // resizeMode: 'contain',
  },
  congratsText: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
    textAlign: "center",
    color:"black"
  },
  subText: {
    fontSize: 16,
    color: "gray",
    textAlign: "center",
    marginTop: 10,
  },
  button: {
    backgroundColor: "rgba(2,31,147,255)",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    width:"95%",
    alignItems: "center",
    marginTop:40
  },
  buttonText: {
    color: "white",
    fontSize: 18,
  },
  headingImage: {
    width: 30,
    height: 20,
    marginRight: 10,
    resizeMode: "contain",
    position: "absolute",
    right: -170,
    bottom: 25
  }
});
