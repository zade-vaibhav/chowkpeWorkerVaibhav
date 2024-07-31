import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
  StatusBar
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
// import * as ImagePicker from "expo-image-picker";
// import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Tts from 'react-native-tts';

const { width, height } = Dimensions.get("window");

const CreateProfileScreen = ({ navigation, route }) => {
  const { referralId,education } = route.params;
  console.log(referralId,education);
  // const [profileImage, setProfileImage] = useState("https://www.seekpng.com/png/detail/599-5999102_builder-man2-builder-worker.png");
  const [name, setName] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [address, setAddress] = useState("");
  const [isContinue, setIsContinue] = useState(true);
  const [isloading, setIsLoading] = useState(false);
  const [lang,setLang] =useState("English")

  useEffect(() => {
    if (name && state && pincode && address) {
      setIsContinue(false);
    } else {
      setIsContinue(true);
    }
  }, [name, state, pincode, address]);

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

  // const selectImage = async () => {
  //   const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

  //   if (status !== "granted") {
  //     Alert.alert(
  //       "Permission Denied",
  //       "Sorry, we need camera roll permission to upload images."
  //     );
  //   } else {
  //     const result = await ImagePicker.launchImageLibraryAsync();

  //     if (!result.cancelled) {
  //       setProfileImage(result.uri);
  //     }
  //   }
  // };

  // const captureImage = async () => {
  //   const { status } = await ImagePicker.requestCameraPermissionsAsync();

  //   if (status !== "granted") {
  //     Alert.alert(
  //       "Permission Denied",
  //       "Sorry, we need camera permission to take photos."
  //     );
  //   } else {
  //     const result = await ImagePicker.launchCameraAsync({
  //       mediaTypes: ImagePicker.MediaTypeOptions.Images,
  //       allowsEditing: true,
  //       aspect: [4, 3],
  //       quality: 1,
  //     });

  //     if (!result.cancelled) {
  //       setProfileImage(result.uri);
  //     }
  //   }
  // };

  // const uploadImage = () => {
  //   if (profileImage) {
  //     const data = new FormData();
  //     data.append("file", {
  //       name: profileImage.fileName,
  //       type: profileImage.type,
  //       uri:
  //         Platform.OS === "ios"
  //           ? profileImage.uri.replace("file://", "")
  //           : profileImage.uri,
  //     });

  //     // Add the fetch or any other method to upload the data
  //   }
  // };

  const validateData = ({ name, state, pincode, address }) => {
    if (name !== undefined) {
      const isNameValid = /^[A-Za-z ]{4,16}$/.test(name);
      if (!isNameValid) return "Name is not valid";
    }
    if (state !== undefined) {
      const isStateValid = /^[A-Za-z ]{2,16}$/.test(state);
      if (!isStateValid) return "State is not valid";
    }
    if (pincode !== undefined) {
      const isPincodeValid = /^[0-9]{6}$/.test(pincode);
      if (!isPincodeValid) return "Pincode is not valid";
    }
    if (address !== undefined) {
      const isAddressValid = /^[A-Za-z0-9\s,.'-]{8,100}$/.test(address);
      if (!isAddressValid) return "Address is not valid";
    }
  };

  const handleContinue = async () => {
    const errorMessage = validateData({ name, state, pincode, address });
    setIsLoading(true);
    if (errorMessage) {
      setIsLoading(false);
      Alert.alert(errorMessage);
      return;
    }
    const token = await AsyncStorage.getItem("uid");
    AsyncStorage.setItem("name", name);

    const { skills } = route.params;
    const checkedSkills = skills
      .filter((item) => item.checked === true)
      .map((item) => item.name);
    // console.log(name, state, pincode, address, checkedSkills);
    // navigation.navigate("DocumentUpload");
    try {
      const response = await fetch(
        "https://chowkpe-server.onrender.com/api/v1/profile/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: name,
            state: state,
            pinCode: pincode,
            address: address,
            skills: checkedSkills,
            referralId: referralId.id,
            education
          }),
        }
      );

      const data = await response.json();
      console.log(data);

      if (data.success == true) {
        setIsLoading(false);
        navigation.replace("DocumentUpload");
      } else {
        setIsLoading(false);
        Alert.alert(data.message);
        return;
      }
    } catch (error) {
      setIsLoading(false);
      Alert.alert(data.message);
      console.log(error);
    }
  };

    // speak
    function handelSpeak(){
      console.log("hello")
      Tts.speak(`
      यहां नाम, राज्य और पता देकर अपनी प्रोफ़ाइल बनाएं`)
    }

    
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor="#6a51ae"
        translucent={true}
      />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.topSection}>
          {
            
              lang == "English"?<Text style={styles.heading}>Create Your Profile</Text>:<Text style={styles.heading}>अपना प्रोफ़ाइल बनाए</Text>
          }
          
          <View style={styles.horizontalLineContainer}>
            <Image
              source={require("../../assets/images/Layer_1.png")}
              style={[styles.iconImage, styles.iconLeft]}
            />
            <View style={styles.horizontalLine} />
            <Image
              source={require("../../assets/images/Frame (1).png")}
              style={[styles.iconImage, styles.iconRight]}
            />
          </View>
          <View style={styles.imageContainer}>
            <TouchableOpacity 
            // onPress={selectImage}
            >
              <View style={styles.profileImageContainer}>
                <Image
                  source={require("../../assets/images/user/user_1.jpg")}

                  style={styles.profileImage}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              // onPress={uploadImage}
              style={styles.addPhotoContainer}
            >
              {
                lang == "English"?<Text style={styles.addPhotoText}>Add Profile Photo</Text>:<Text style={styles.addPhotoText}>प्रोफ़ाइल फ़ोटो जोड़ें</Text>
              }

            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cameraButton}
              // onPress={captureImage}
            >
              <Icon name="photo-camera" size={25} color="black" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.bottomSection}
          showsVerticalScrollIndicator={false}
        >
           {
                lang == "English"? <Text style={styles.label}>What's your Name</Text>: <Text style={styles.label}>आपका नाम</Text>
              }
         
          <TextInput
            style={styles.input}
            placeholder={lang== "English"?"Enter Your Name":"अपना नाम दर्ज करें"}
            placeholderTextColor="gray"
            value={name}
            onChangeText={setName}
          />
          {(name.length < 4 || name.length > 16) && (
            
              lang == "English"? <Text style={{ color: "red", marginBottom: 10 }}>
              *Name should be between 4-16 characters
            </Text>: <Text style={{ color: "red", marginBottom: 10 }}>
            *नाम 4-16 अक्षरों के बीच होना चाहिए
            </Text>
            
           
          )}
          <View style={styles.row}>
            <View style={styles.inputGroup}>
            {
                lang == "English"?<Text style={styles.label}>State</Text>:<Text style={styles.label}>राज्य</Text>
              }
              
              <TextInput
                style={styles.input}
                placeholder={lang== "English"?"State":"राज्य"}
                placeholderTextColor="gray"
                value={state}
                onChangeText={setState}
              />
            </View>
            <View style={styles.inputGroup}>
               {
                lang == "English"? <Text style={styles.label}>Pincode</Text>: <Text style={styles.label}>पिन-कोड</Text>
              }
             
              <TextInput
                style={styles.input}
                placeholder={lang== "English"?"Pincode":"पिन-कोड"}
                placeholderTextColor="gray"
                value={pincode}
                onChangeText={setPincode}
                keyboardType="numeric"
              />
              {pincode.length > 6 && (
                
                  lang == "English"? <Text style={{ color: "red", marginBottom: 10 }}>
                  *length of pin should be 6
                </Text>: <Text style={{ color: "red", marginBottom: 10 }}>
                *पिन की लंबाई 6 होनी चाहिए
                </Text>
              
              )}
            </View>
          </View>
          {
            lang == "English"? <Text style={styles.label}>Address</Text>: <Text style={styles.label}>पता</Text>
          }
         
          <TextInput
            style={styles.input}
            placeholder={lang== "English"?"Address":"पता"}
            placeholderTextColor="gray"
            value={address}
            onChangeText={setAddress}
          />
        </ScrollView>
      </ScrollView>
      <View style={styles.buttonContainer}>
        {isloading ? (
          <TouchableOpacity style={styles.button}>
            <ActivityIndicator size="small" color="white" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.button, isContinue && styles.disabledButton]}
            disabled={isContinue}
            onPress={handleContinue}
          >
             <TouchableOpacity onPress={() => handelSpeak()}>
              <Image
                source={require("../../assets/images/skill/Vector.png")}
                style={styles.headingImage}
              />
            </TouchableOpacity>
            {
                lang == "English"? <Text style={styles.buttonText}>Continue</Text>: <Text style={styles.buttonText}>आगे</Text>
              }
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    justifyContent: "space-between",
  },

  topSection: {
    height: 300,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#EFEFF9",
    marginTop: 30,
    marginBottom: 90,
    width: "100%",
  },
  heading: {
    fontSize: 24,
    textAlign: "center",
    marginTop: 20,
    marginBottom: 15,
    color:"black"
  },
  horizontalLineContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "60%",
    marginBottom: 20,
    justifyContent: "space-between",
    position: "relative",
  },
  horizontalLine: {
    position: "absolute",
    bottom: 0,
    left: 25,
    right: 25,
    height: 5,
    backgroundColor: "#ccc",
  },
  iconImage: {
    width: 40,
    height: 30,
    resizeMode: "contain",
  },
  iconLeft: {
    marginBottom: 1,
  },
  iconRight: {
    marginBottom: -10,
  },
  imageContainer: {
    position: "absolute",
    bottom: 10,
    alignItems: "center",
    width: "100%",
  },
  profileImageContainer: {
    position: "relative",
    top: 40,
    alignItems: "center",
    margin: 20,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 100,
    
  },
  addPhotoContainer: {
    position: "absolute",
    bottom: -5,
    alignItems: "center",
    width: "100%",
  },
  addPhotoText: {
    position: "relative",
    top: 40,
    alignItems: "center",
    color:"black"
  },
  cameraButton: {
    position: "absolute",
    right: "33%",
    top: "90%",
    backgroundColor: "#fff",
    borderRadius: 50,
    padding: 8,
  },
  bottomSection: {
    width: "100%",
    paddingHorizontal: 16,
    alignItems: "start",
    flexGrow: 1,
    justifyContent: "center",
    position: "relative",
  },
  label: {
    marginBottom: 8,
    fontWeight: "bold",
    color:"black"
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 8,
    marginBottom: 16,
    width: "100%",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
    color:"black"
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  inputGroup: {
    flex: 1,
    marginRight: 8,
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: "#fff",
    width: "100%",
  },
  button: {
    backgroundColor: "#021F93",
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
  disabledButton: {
    backgroundColor: "#CCCCCC",
  },
  headingImage: {
    width: 30,
    height: 20,
    marginRight: 10,
    resizeMode: "contain",
    position: "absolute",
    right: -30,
    bottom: 20
  }
});

export default CreateProfileScreen;
