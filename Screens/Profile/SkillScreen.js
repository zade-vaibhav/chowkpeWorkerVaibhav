import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Image,
} from "react-native";
import CheckBox from "react-native-check-box";
import Tts from 'react-native-tts';

const { width, height } = Dimensions.get("window");

const SkillScreen = ({ navigation, route }) => {
  const {referralId,education}= route?.params
  const [lang,setLang] =useState("English")

  console.log(referralId,education)
  const [skills, setSkills] = useState([
    {
      id: 1,
      image: require("../../assets/images/skill/EstatesCard.png"),
      name: "Shipping",
      hindiName: "शिपिंग वाला",
      checked: false,
    },
    {
      id: 2,
      image: require("../../assets/images/skill/Vertical-Full.png"),
      name: "Cleaner",
      hindiName: "सफाई वाला",
      checked: false,
    },
    {
      id: 3,
      image: require("../../assets/images/skill/Vertical-Full1.png"),
      name: "Picker",
      hindiName: "कुदाल",
      checked: false,
    },
    {
      id: 4,
      image: require("../../assets/images/skill/Vertical-Full3.png"),
      name: "Forklift Operator",
      hindiName: "फोर्कलिफ्ट संचालक",
      checked: false,
    },
    {
      id: 5,
      image: require("../../assets/images/skill/EstatesCard.png"),
      name: "Shipping",
      hindiName: "शिपिंग वाला",
      checked: false,
    },
    {
      id: 6,
      image: require("../../assets/images/skill/Vertical-Full.png"),
      name: "Cleaner",
      hindiName: "सफाई वाला",
      checked: false,
    },
    {
      id: 7,
      image: require("../../assets/images/skill/Vertical-Full1.png"),
      name: "Picker",
      hindiName: "कुदाल",
      checked: false,
    },
    {
      id: 8,
      image: require("../../assets/images/skill/Vertical-Full3.png"),
      name: "Forklift Operator",
      hindiName: "फोर्कलिफ्ट संचालक",
      checked: false,
    },
  ]);

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


  const [isContinueDisabled, setIsContinueDisabled] = useState(true);

  useEffect(() => {
    const anyChecked = skills.some((skill) => skill.checked);
    setIsContinueDisabled(!anyChecked);
  }, [skills]);

  const handleCheckBoxClick = (id) => {
    const updatedSkills = skills.map((skill) =>
      skill.id === id ? { ...skill, checked: !skill.checked } : skill
    );
    setSkills(updatedSkills);
  };

  const handleContinuePress = () => {
    if (!isContinueDisabled) {
      navigation.navigate("CreatProileScreen", { skills, referralId,education });
    }
  };
  // console.log(skills);

   // handel speek
   function handelSpeak(){
    Tts.speak(`अपने इच्छित कौशल का चयन करें जिसमें आप अच्छे हैं`)
  }


  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/skill/headerImage.png")}
        style={styles.headerImage}
      />
      <View style={styles.headingContainer}>
      {
             lang == "English"?<Text style={styles.heading}>Select Your Skill</Text>:<Text style={styles.heading}>अपना कौशल चुनें</Text>
          }
        
        <TouchableOpacity onPress={()=>handelSpeak()}>
          <Image
            source={require("../../assets/images/skill/Vector.png")}
            style={styles.microphoneImage}
          />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.grid}>
          {skills.map((skill) => (
            <TouchableOpacity
              key={skill.id}
              style={[
                styles.gridItem,
                skill.checked && styles.gridItemSelected,
              ]}
              onPress={() => handleCheckBoxClick(skill.id)}
            >
              <Image source={skill.image} style={styles.image} />
              <View style={styles.checkboxContainer}>
                <CheckBox
                  value={skill.checked}
                  onClick={() => handleCheckBoxClick(skill.id)}
                  isChecked={skill.checked}
                  checkBoxColor={skill.checked ? "green" : undefined}
                  style={{
                    backgroundColor: skill.checked ? "white" : "transparent",
                  }}
                />
              </View>
              <Text style={styles.gridText}>{ lang == "English"?skill.name:skill.hindiName}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <TouchableOpacity
        style={[styles.button, isContinueDisabled && styles.disabledButton]}
        disabled={isContinueDisabled}
        onPress={handleContinuePress}
      >
        {
           lang == "English"?<Text style={styles.buttonText}>Continue</Text>:<Text style={styles.buttonText}>आगे</Text>
        }
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: "#EFEFF9",
  },
  headerImage: {
    width: "100%",
    height: 200,
    resizeMode: "contain",
  },
  headingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 15,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 16,
    padding: 10,
    color:"black"
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 5,
  },
  gridItem: {
    width: width * 0.45,
    height: height * 0.2,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#D3D3D3",
    
  },
  gridItemSelected: {
    borderColor: "green",
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: "60%",
    resizeMode: "contain",
  },
  gridText: {
    paddingTop: 2,
    fontSize: 15,
    textAlign: "center",
    color:"black"
  },
  checkboxContainer: {
    position: "absolute",
    top: 5,
    right: 5,
  },
  button: {
    backgroundColor: "#021F93",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    margin: 16,
    marginBottom: 32,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  disabledButton: {
    backgroundColor: "#CCCCCC",
  },
  microphoneImage: {
    width: 20,
    height: 20,
    marginLeft: 10,
    resizeMode: "contain",
  },
});

export default SkillScreen;
