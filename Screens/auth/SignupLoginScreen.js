import Rectangle from "../../assets/images/provider/Rectangle.png";
import Frame from "../../assets/images/provider/LoginFrame.png";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  BackHandler,
  ImageBackground,
  Image,
  Linking,
  Alert,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView
} from "react-native";
import { CountryPicker } from "react-native-country-codes-picker";
import { useFocusEffect } from "@react-navigation/native";
import Tts from 'react-native-tts';
import AsyncStorage from "@react-native-async-storage/async-storage";

const SignupLoginScreen = ({ navigation }) => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [countryCode, setCountryCode] = useState("+91"); // Default calling code for India
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const [isloading, setIsLoading] = useState(false);
  const [lang,setLang] =useState("English")

  // Handle back button press
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (isPickerVisible) {
          setIsPickerVisible(false);
          return true; // Prevent default behavior (going back to previous screen)
        }
        return false; // Default behavior (going back to previous screen)
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [isPickerVisible])
  );


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

  const handleContinue = async () => {

    setIsLoading(true);
    try {
      const response = await fetch(
        "https://chowkpe-server.onrender.com/api/v1/auth/send_otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mobile_number: mobileNumber,
          }),
        }
      );

      const data = await response.json();
      console.log("data", data);
      if (data.success == true) {
        setIsLoading(false);
        Alert.alert(data.message);
        navigation.navigate("OtpNew", { mobileNumber });
      } else {
        setIsLoading(false);
        Alert.alert(data.message);
      }
    } catch (error) {
      setIsLoading(false);
      Alert.alert(error);
    }
    // navigation.push("OtpNew", { mobileNumber });
  };

  const handleCountrySelect = (country) => {
    setCountryCode(`${country.dial_code}`);
    setIsPickerVisible(false);
  };


   // speak
   function handelSpeak(){
    Tts.speak(`
    कृपया अपना फ़ोन क्रमांक दर्ज करें`)
  }

  
  return (
    <KeyboardAvoidingView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.topPart}>
        <ImageBackground source={Rectangle} style={styles.backgroundImage}>
          <Image source={Frame} style={styles.logo} />
        </ImageBackground>
      </View>
      <View style={styles.bottomPart}>
        <View style={styles.titleContainer}>
        {
            lang == "English" ?   <Text style={styles.title}>
            Signup/Login to start working with Chowkpe
          </Text>: <Text style={styles.title}>
          चौकपे के साथ काम करने के लिए साइनअप/लॉगिन करें
          </Text>
          }
         
        </View>
        {
            lang == "English" ? <Text style={styles.subtitle}>Mobile number</Text>: <Text style={styles.subtitle}>मोबाइल नंबर</Text>
          }

        <View style={styles.inputContainer}>
          <TouchableOpacity
            onPress={() => setIsPickerVisible(true)}
            style={styles.countryCodeContainer}
          >
            <Text style={styles.countryCodeText}>{countryCode}</Text>
          </TouchableOpacity>
          <Text style={styles.divider}>|</Text>
          <TextInput
            style={styles.input}
            placeholder={lang === 'English' ? 'Enter your mobile number' : 'अपना मोबाइल नंबर दर्ज करें'}
            placeholderTextColor="gray"
            keyboardType="numeric"
            value={mobileNumber}
            onChangeText={setMobileNumber}
          />
        </View>

        {isloading ? (
          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor:
                  mobileNumber.length === 10 ? "#021F93" : "#ccc",
              },
            ]}
            disabled={mobileNumber.length !== 10}
          >
            <ActivityIndicator size="small" color="white" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor:
                  mobileNumber.length === 10 ? "#021F93" : "#ccc",
              },
            ]}
            onPress={() => handleContinue()}
            disabled={mobileNumber.length !== 10}
          >
            {
            lang == "English" ?  <Text style={styles.buttonText}>Continue</Text>:<Text style={styles.buttonText}>आगे</Text>
          }
            <TouchableOpacity onPress={() => handelSpeak()}>
              <Image
                source={require("../../assets/images/skill/Vector.png")}
                style={styles.headingImage}
              />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
         {
            lang == "English" ? <Text style={styles.disclaimer}>
            By continuing, I accept{" "}
            <Text
              style={styles.link}
              onPress={() => Linking.openURL("https://example.com/terms")}
            >
              Terms of Service
            </Text>{" "}
            and{" "}
            <Text
              style={styles.link}
              onPress={() => Linking.openURL("https://example.com/privacy")}
            >
              Privacy Policy
            </Text>
          </Text>:<Text style={styles.disclaimer}>
  जारी रखते हुए, मैं स्वीकार करता हूँ{" "}
  <Text
    style={styles.link}
    onPress={() => Linking.openURL("https://example.com/terms")}
  >
    सेवा की शर्तें
  </Text>{" "}
  और{" "}
  <Text
    style={styles.link}
    onPress={() => Linking.openURL("https://example.com/privacy")}
  >
    गोपनीयता नीति
  </Text>
</Text>

          }
        
        <CountryPicker
          show={isPickerVisible}
          pickerButtonOnPress={handleCountrySelect}
          onBackdropPress={() => setIsPickerVisible(false)} // Close the picker when tapping outside
          style={styles.countryPicker}
        />
      </View>
      </ScrollView>
      
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position:'relative',
    top:30
  },scrollContainer: {
        flexGrow: 1,
      },
  topPart: {
    flex: 1,
  },
  bottomPart: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "center",
    // backgroundColor: "red",
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 250,
    height: 250,
  },
  title: {
    fontSize: 22,
    fontWeight: "500",
    color: "black",
    textAlign:"center"
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 2,
    color: "#888",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 80,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 3,
    // marginTop: 20,
    // backgroundColor: "red",
  },
  countryCodeContainer: {
    marginRight: 10,
  },
  countryCodeText: {
    fontSize: 16,
    color: "gray"
  },
  divider: {
    fontSize: 16,
    color: "#ccc",
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "black",
    marginTop:1
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 13,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  disclaimer: {
    textAlign: "center",
    fontSize: 12,
    color: "#888",
    marginTop: 10,
  },
  link: {
    color: "#007bff",
    textDecorationLine: "underline",
  },
  countryPicker: {
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  headingImage: {
    width: 30,
    height: 20,
    marginRight: 10,
    resizeMode: "contain",
    position: "absolute",
    right: -20,
    bottom: 40
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent:"center",
    marginBottom: 30,
  }
});

export default SignupLoginScreen;


// import Rectangle from "../../assets/images/provider/Rectangle.png";
// import Frame from "../../assets/images/provider/LoginFrame.png";
// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   BackHandler,
//   ImageBackground,
//   Image,
//   Linking,
//   Alert,
//   ActivityIndicator,
//   ScrollView,
//   KeyboardAvoidingView,
//   Platform
// } from "react-native";
// import { CountryPicker } from "react-native-country-codes-picker";
// import { useFocusEffect } from "@react-navigation/native";
// import Tts from 'react-native-tts';

// const SignupLoginScreen = ({ navigation }) => {
//   const [mobileNumber, setMobileNumber] = useState("");
//   const [password, setPassword] = useState("");
//   const [countryCode, setCountryCode] = useState("+91"); // Default calling code for India
//   const [isPickerVisible, setIsPickerVisible] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   // Handle back button press
//   useFocusEffect(
//     React.useCallback(() => {
//       const onBackPress = () => {
//         if (isPickerVisible) {
//           setIsPickerVisible(false);
//           return true; // Prevent default behavior (going back to previous screen)
//         }
//         return false; // Default behavior (going back to previous screen)
//       };

//       BackHandler.addEventListener("hardwareBackPress", onBackPress);

//       return () =>
//         BackHandler.removeEventListener("hardwareBackPress", onBackPress);
//     }, [isPickerVisible])
//   );

//   const handleContinue = async () => {
//     setIsLoading(true);
//     try {
//       const response = await fetch(
//         "https://chowkpe-server.onrender.com/api/v1/auth/send_otp",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             mobile_number: mobileNumber,
//           }),
//         }
//       );

//       const data = await response.json();
//       console.log("data", data);
//       if (data.success === true) {
//         setIsLoading(false);
//         Alert.alert(data.message);
//         navigation.navigate("OtpNew", { mobileNumber });
//       } else {
//         setIsLoading(false);
//         Alert.alert(data.message);
//       }
//     } catch (error) {
//       setIsLoading(false);
//       Alert.alert(error);
//     }
//   };

//   const handleCountrySelect = (country) => {
//     setCountryCode(`${country.dial_code}`);
//     setIsPickerVisible(false);
//   };

//   // Speak
//   const handleSpeak = () => {
//     Tts.speak("कृपया अपना फ़ोन क्रमांक दर्ज करें");
//   };

//   return (
//     <KeyboardAvoidingView
//       style={styles.container}
//       behavior={Platform.OS === "ios" ? "padding" : "height"}
//     >
//       <ScrollView contentContainerStyle={styles.scrollContainer}>
//         <View style={styles.topPart}>
//           <ImageBackground source={Rectangle} style={styles.backgroundImage}>
//             <Image source={Frame} style={styles.logo} />
//           </ImageBackground>
//         </View>
//         <View style={styles.bottomPart}>
//           <View style={styles.titleContainer}>
//             <Text style={styles.title}>
//               Signup/Login to start working with Chowkpe
//             </Text>
//           </View>

//           <Text style={styles.subtitle}>Mobile Number</Text>

//           <View style={styles.inputContainer}>
//             <TouchableOpacity
//               onPress={() => setIsPickerVisible(true)}
//               style={styles.countryCodeContainer}
//             >
//               <Text style={styles.countryCodeText}>{countryCode}</Text>
//             </TouchableOpacity>
//             <Text style={styles.divider}>|</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="Enter your mobile number"
//               placeholderTextColor="gray"
//               keyboardType="numeric"
//               value={mobileNumber}
//               onChangeText={setMobileNumber}
//             />
//           </View>

//           {isLoading ? (
//             <TouchableOpacity
//               style={[
//                 styles.button,
//                 {
//                   backgroundColor:
//                     mobileNumber.length === 10 ? "#021F93" : "#ccc",
//                 },
//               ]}
//               disabled={mobileNumber.length !== 10}
//             >
//               <ActivityIndicator size="small" color="white" />
//             </TouchableOpacity>
//           ) : (
//             <TouchableOpacity
//               style={[
//                 styles.button,
//                 {
//                   backgroundColor:
//                     mobileNumber.length === 10 ? "#021F93" : "#ccc",
//                 },
//               ]}
//               onPress={() => handleContinue()}
//               disabled={mobileNumber.length !== 10}
//             >
//               <Text style={styles.buttonText}>Continue</Text>
//             </TouchableOpacity>
//           )}
//           <TouchableOpacity onPress={handleSpeak} style={styles.speakButton}>
//             <Image
//               source={require("../../assets/images/skill/Vector.png")}
//               style={styles.speakImage}
//             />
//           </TouchableOpacity>
//           <Text style={styles.disclaimer}>
//             By continuing, I accept{" "}
//             <Text
//               style={styles.link}
//               onPress={() => Linking.openURL("https://example.com/terms")}
//             >
//               Terms of Service
//             </Text>{" "}
//             and{" "}
//             <Text
//               style={styles.link}
//               onPress={() => Linking.openURL("https://example.com/privacy")}
//             >
//               Privacy Policy
//             </Text>
//           </Text>
//           <CountryPicker
//             show={isPickerVisible}
//             pickerButtonOnPress={handleCountrySelect}
//             onBackdropPress={() => setIsPickerVisible(false)} // Close the picker when tapping outside
//             style={styles.countryPicker}
//           />
//         </View>
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   scrollContainer: {
//     flexGrow: 1,
//   },
//   topPart: {
//     flex: 1,
//   },
//   bottomPart: {
//     flex: 2,
//     paddingHorizontal: 20,
//     justifyContent: "center",
//   },
//   backgroundImage: {
//     flex: 1,
//     resizeMode: "cover",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   logo: {
//     width: 250,
//     height: 250,
//   },
//   titleContainer: {
//     alignItems: "center",
//     marginBottom: 30,
//   },
//   title: {
//     fontSize: 22,
//     fontWeight: "500",
//     color: "black",
//     textAlign: "center",
//   },
//   subtitle: {
//     fontSize: 14,
//     marginBottom: 10,
//     color: "#888",
//   },
//   inputContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 30,
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 5,
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//   },
//   countryCodeContainer: {
//     marginRight: 10,
//   },
//   countryCodeText: {
//     fontSize: 16,
//     color: "black",
//   },
//   divider: {
//     fontSize: 16,
//     color: "#ccc",
//   },
//   input: {
//     flex: 1,
//     fontSize: 16,
//     height: 40,
//     color: "black",
//   },
//   button: {
//     backgroundColor: "#007bff",
//     paddingVertical: 13,
//     paddingHorizontal: 20,
//     borderRadius: 5,
//     marginBottom: 10,
//   },
//   buttonText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "bold",
//     textAlign: "center",
//   },
//   speakButton: {
//     alignItems: "center",
//     marginVertical: 10,
//   },
//   speakImage: {
//     width: 30,
//     height: 20,
//     resizeMode: "contain",
//     position:"absolute",
//     top:10
//   },
//   disclaimer: {
//     textAlign: "center",
//     fontSize: 12,
//     color: "#888",
//     marginTop: 10,
//   },
//   link: {
//     color: "#007bff",
//     textDecorationLine: "underline",
//   },
//   countryPicker: {
//     position: "absolute",
//     bottom: 0,
//     width: "100%",
//   },
// });

// export default SignupLoginScreen;
