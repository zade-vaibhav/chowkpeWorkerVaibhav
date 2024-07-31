import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  StatusBar,
} from "react-native";
import { Checkbox } from "react-native-paper";
import Rectangle from "../../assets/images/provider/Rectangle.png";
import Frame from "../../assets/images/provider/LangSelect.png";
import Tts from 'react-native-tts';
import AsyncStorage from "@react-native-async-storage/async-storage";

const LanguageSelectScreen = ({ navigation }) => {
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [lang,setLang] =useState("English")
  const handleContinue = () => {
    if (selectedLanguage) {
      navigation.replace("SignupLoginScreen");
    } else {
      alert("Please select a language");
    }
  };

  const handleCheckboxPress = async (language) => {
    setSelectedLanguage((prevLanguage) =>
      prevLanguage === language ? "" : language
    );
    AsyncStorage.setItem("Lang", language);
    setLang(language)
  };



  // handel speek
  function handelSpeak() {
    Tts.speak(`अपनी पसंद की भाषा चुनें`)
  }


  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#021F93"
        translucent={true}
      />
      <View style={styles.topPart}>
        <ImageBackground source={Rectangle} style={styles.rectangleImage}>
          <Image source={Frame} style={styles.centerImage} />
        </ImageBackground>
      </View>

      <View style={styles.bottomPart}>
        <View style={styles.titleContainer}>
          {
            lang == "English" ? <Text style={styles.title}>Select a language to continue</Text>:<Text style={styles.title}>
                जारी रखने के लिए एक भाषा चुनें</Text>
          }
          <TouchableOpacity onPress={() => handelSpeak()}>
            <Image
              source={require("../../assets/images/skill/Vector.png")}
              style={styles.headingImage}
            />
          </TouchableOpacity>
        </View>
        {
            lang == "English" ?  <Text style={styles.message}>Select one from below</Text>:<Text style={styles.message}>
                नीचे से एक का चयन करें</Text>
          }
       

        <View style={styles.languageOptions}>
          <View style={styles.languageOption}>
            <View style={styles.languageTextContainer}>
              <Text style={styles.languageText}>हिन्दी</Text>
              <Text style={styles.subText}>Hindi</Text>
            </View>
            <Checkbox
              status={selectedLanguage === "Hindi" ? "checked" : "unchecked"}
              onPress={() => handleCheckboxPress("Hindi")}
            />
          </View>

          <View style={styles.languageOption}>
            <View style={styles.languageTextContainer}>
              <Text style={styles.languageText}>English</Text>
              <Text style={styles.subText}>English</Text>
            </View>
            <Checkbox
              status={selectedLanguage === "English" ? "checked" : "unchecked"}
              onPress={() => handleCheckboxPress("English")}
            />
          </View>
        </View>

        {selectedLanguage && <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
        >
           {
            lang == "English" ?  <Text style={styles.continueButtonText}>Continue</Text>:<Text style={styles.continueButtonText}>आगे</Text>
          }
        </TouchableOpacity>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  topPart: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  rectangleImage: {
    width: 450,
    height: 450,
    justifyContent: "center",
    alignItems: "center",
  },
  centerImage: {
    width: 278,
    height: 192,
    resizeMode: "contain",
  },
  bottomPart: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 4,
    color: 'black'
  },
  message: {
    fontSize: 12,
    marginBottom: 20,
    color: "#888",
  },
  languageOptions: {
    flexDirection: "row", // Display language options in the same row
    marginBottom: 20,
  },
  languageOption: {
    flex: 1, // Each language option takes equal space in the row
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderColor: "#ddd",
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    margin:5, // Add margin between language options
  
    elevation: 2,
    backgroundColor: "#fff",
  },
  languageTextContainer: {
    flexDirection: "column",
  },
  languageText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
    letterSpacing: 1
  },
  subText: {
    fontSize: 12,
    color: "#888",
  },
  continueButton: {
    height:45,
     width:"100%",
    backgroundColor: "#021F93",
    justifyContent:"center",
    alignItems:"center",
    borderRadius: 5,
    elevation: 4, // Add elevation for shadow on Android
    position: "absolute", // Position the button at the bottom
    bottom: 20, // Leave some space from the bottom
    alignSelf: "center",
  },
  continueButtonText: {
    fontSize: 18,
    color: "white",
  },
  headingImage: {
    width: 30,
    height: 20,
    marginRight: 10,
    resizeMode: "contain",
    position: "relative",
    left: 10
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center"
  }
});

export default LanguageSelectScreen;
