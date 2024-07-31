import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
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
  StatusBar,
  Alert,
  ActivityIndicator,
} from "react-native";
import Tts from 'react-native-tts';

const { width } = Dimensions.get("window");

const BankDetailsScreen = ({ navigation }) => {
  const [bankAccount, setBankAccount] = useState("");
  const [reenterBankAccount, setReenterBankAccount] = useState("");
  const [bankName, setBankName] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [isContinue, setIsContinue] = useState(true);
  const [isFocused, setIsFocused] = useState(true);
  const [isloading,setIsLoading] = useState(false)
const [lang,setLang] =useState("English")

  useEffect(() => {
    if (bankAccount && reenterBankAccount && bankName && ifscCode) {
      setIsContinue(false);
    } else {
      setIsContinue(true);
    }
  }, [bankAccount, reenterBankAccount, bankName, ifscCode]);

  
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

  // const validateData = ({
  //   bankAccount,
  //   reenterBankAccount,
  //   bankName,
  //   ifscCode,
  // }) => {
  //   if (bankAccount !== undefined) {
  //     const isBankAccountValid = /^[0-9]{9,18}$/.test(bankAccount);
  //     if (!isBankAccountValid) return "Bank Account Number is not valid";
  //   }
  //   if (
  //     reenterBankAccount !== undefined &&
  //     reenterBankAccount !== bankAccount
  //   ) {
  //     return "Bank Account Numbers do not match";
  //   }
  //   if (bankName !== undefined) {
  //     const isBankNameValid = /^[A-Za-z ]{2,30}$/.test(bankName);
  //     if (!isBankNameValid) return "Bank Name is not valid";
  //   }
  //   if (ifscCode !== undefined) {
  //     const isIfscCodeValid = /^[A-Za-z]{4}[0][A-Za-z0-9]{6}$/.test(ifscCode);
  //     if (!isIfscCodeValid) return "IFSC Code is not valid";
  //   }
  // };

  const handleSkip = async () => {
    navigation.replace("Welcome");
  }

  const handleContinue = async () => {
    setIsLoading(true)
    const token = await AsyncStorage.getItem("uid");
    if (bankAccount !== reenterBankAccount) {
      setIsLoading(false)
      Alert.alert("Bank Account didn't match");
      return;
    }
    try {
      const response = await fetch(
        "https://chowkpe-server.onrender.com/api/v1/user/bankDatails",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            accountNumber: bankAccount,
            bankName: bankName,
            ifscCode: ifscCode,
          }),
        }
      );

      const data = await response.json();
      console.log(data);

      if (data.success == true) {
        setIsLoading(false)
        navigation.replace("Welcome");
      } else {
        setIsLoading(false)
        Alert.alert(data.message);
      }
    } catch (error) {
      setIsLoading(false)
      Alert.alert(data.message);
      console.log(error);
    }
    // navigation.navigate("Welcome");
  };

   // speak
   function handelSpeak(){
    Tts.speak(`
    बैंक विवरण पंजीकृत करने के लिए कृपया क्रमशः अपना बैंक खाता नंबर और बैंक का नाम और आईएफएससी कोड दर्ज करें`)
  }

  return (
    <KeyboardAvoidingView
      // behavior={Platform.OS === "ios" ? "padding" : "height"}
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
            <View style={styles.completedLine} />
            <View style={styles.remainingLine} />
            <Image
              source={require("../../assets/images/Layer_1.png")}
              style={[styles.iconImage, styles.iconLeft]}
            />
            <Image
              source={require("../../assets/images/Frame (1).png")}
              style={[styles.iconImage, styles.iconRight]}
            />
          </View>
          <View style={styles.profileImageContainer}>
            <Image
              source={require("../../assets/images/Bankdetail/Bank.png")}
              style={styles.profileImage}
            />
          </View>
        </View>

        <View style={styles.bottomSection}>
          <View style={styles.headingContainer}>
            <View style={styles.textContainer}>
            {
             lang == "English"?<Text style={styles.sectionHeading}>
             Provide Your Bank Details
           </Text>:<Text style={styles.sectionHeading}>
           अपना बैंक विवरण प्रदान करें
              </Text>
          }
              
              {
                lang == "English"?<Text style={styles.sectionSubHeading}>
                Your earnings will be transferred to this bank account
              </Text>:<Text style={styles.sectionSubHeading}>
              आपकी कमाई इस बैंक खाते में स्थानांतरित कर दी जाएगी
              </Text>
             }
              
            </View>
              <TouchableOpacity onPress={() => handelSpeak()}>
              <Image
                source={require("../../assets/images/skill/Vector.png")}
                style={styles.headingImage}
              />
            </TouchableOpacity>
          </View>
          {
            lang == "English"?<Text style={styles.label}>Account Number</Text>:<Text style={styles.label}>खाता संख्या</Text>
         }
          
          <TextInput
            style={styles.input}
            placeholder={lang == "English"?"Enter Account Number":"खाता संख्या दर्ज करें"}
            placeholderTextColor="gray"
            value={bankAccount}
            onChangeText={setBankAccount}
            keyboardType="numeric"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          {
            lang == "English"?<Text style={styles.label}>Re-enter Account Number</Text>:<Text style={styles.label}>खाता संख्या फिर से एंटर करें</Text>
         }
          
          <TextInput
            style={styles.input}
            placeholder={lang== "English"?"Re-enter Account Number":"खाता संख्या फिर से एंटर करें"}
            placeholderTextColor="gray"
            value={reenterBankAccount}
            onChangeText={setReenterBankAccount}
            keyboardType="numeric"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          {bankAccount !== reenterBankAccount && (
            
              lang == "English"?<Text style={{ color: "red", marginBottom: 10 }}>
              Bank Account didn't match
            </Text>:<Text style={{ color: "red", marginBottom: 10 }}>
            बैंक खाता मेल नहीं खाता
            </Text>
          
            
          )}
          {
            lang == "English"? <Text style={styles.label}>Bank Name</Text>: <Text style={styles.label}>बैंक का नाम</Text>
         }
         
          <TextInput
            style={styles.input}
            placeholder={lang== "English"?"Enter bank name":"बैंक का नाम"}
            placeholderTextColor="gray"
            value={bankName}
            onChangeText={setBankName}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          {
            lang == "English"?<Text style={styles.label}>IFSC Code</Text>:<Text style={styles.label}>IFSC कोड</Text>
         }
          
          <TextInput
            style={styles.input}
            placeholder={lang== "English"?"Enter IFSC Code":"IFSC कोड दर्ज करें"}
            placeholderTextColor="gray"
            value={ifscCode}
            onChangeText={setIfscCode}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
      {isloading? <TouchableOpacity
          style={styles.button}
        >
          <ActivityIndicator size="small" color="white" />
        </TouchableOpacity>:<TouchableOpacity
          style={[styles.button, isContinue && styles.disabledButton]}
          disabled={isContinue}
          onPress={() => handleContinue()}
        >
          {
            lang == "English"?<Text style={styles.buttonText}>Verify bank details</Text>:<Text style={styles.buttonText}>वेरीफाई करें</Text>
          }
          
        </TouchableOpacity>}
        
      </View>
      <View  styles={{}}>
      <TouchableOpacity
          style={[styles.skipButton]}
          onPress={() => handleSkip()}
        >
          {
            lang == "English"?<Text style={styles.buttonTextt}>Skip</Text>:<Text style={styles.buttonTextt}>हटाए</Text>
          }
          
        </TouchableOpacity>
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
    flexGrow: 1,
  },
  topSection: {
    height: 300,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#EFEFF9",
    paddingTop: 30,
    width: "100%",
  },
  heading: {
    fontSize: 22,
    fontWeight: "400",
    textAlign: "center",
    marginTop: 15,
    marginBottom: 50,
    color:"black"
  },
  horizontalLineContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "60%",
    marginBottom: 20,
    justifyContent: "space-between",
    height: 5,
  },
  completedLine: {
    position: "absolute",
    left: "10%",
    height: 3,
    backgroundColor: "#007BFF",
    width: "65%", // 65% width to represent progress bar at 65%
  },
  remainingLine: {
    position: "absolute",
    left: "75%",
    height: 3,
    backgroundColor: "#CCCCCC",
    width: "25%", // remaining 25% in gray
  },
  iconImage: {
    width: 40,
    height: 35,
    resizeMode: "contain",
  },
  iconLeft: {
    position: "absolute",
    left: "65%", // 65% from left to position it at 65% of the horizontal line
    bottom: 5,
  },
  iconRight: {
    position: "absolute",
    right: 0,
    bottom: 0,
  },
  profileImageContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  profileImage: {
    width: 200,
    height: 120,
    resizeMode: "cover",
  },
  bottomSection: {
    marginTop: 20,
    width: "100%",
    paddingHorizontal: 16,
  },
  headingContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  textContainer: {
    flex: 1,
    alignItems: "center",
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color:"black"
  },
  headingImage: {
    width: 30,
    height: 20,
    marginRight: 10,
   
    resizeMode: "contain",
  },
  sectionSubHeading: {
    fontSize: 14,
    textAlign: "center",
    color: "#666",
  },
  label: {
    marginBottom: 8,
    fontWeight: "bold",
    color:"black"
  },
  input: {
    height: 50,
    borderWidth: 0,
    borderRadius: 4,
    paddingHorizontal: 8,
    marginBottom: 10,
    width: "100%",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
    color:"black"
  },
  buttonContainer: {
    width: "100%",
    height: 70,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 5,
  },
  button: {
    backgroundColor: "#021F93",
    height:50,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    width: "95%",
  },
  skipButton:{
    // backgroundColor: "#9A9DFF",
    height:40,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    width: "95%",
    marginHorizontal:"auto",
    marginLeft:10,
    color:"black"
  },

  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonTextt: {
    color: "gray",
    fontSize: 18,
    fontWeight: "bold",
  },
  disabledButton: {
    backgroundColor: "#CCCCCC",
  },
});

export default BankDetailsScreen;