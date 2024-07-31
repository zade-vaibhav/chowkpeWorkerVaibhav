import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ImageBackground,
  Image,
  ActivityIndicator,
  ScrollView
} from "react-native";
import Rectangle from "../../assets/images/provider/Rectangle.png";
import Frame from "../../assets/images/provider/OtpFrame.png";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Tts from 'react-native-tts';

const OtpScreen = ({ route, navigation }) => {
  const { mobileNumber } = route.params;
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [isloading, setIsLoading] = useState(false);
  const [lang,setLang] =useState("English")
  // console.log(otp);
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

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

  const handleOtpChange = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 3) {
      otpInputsRefs.current[index + 1].focus();
    }
  };

  const handleVerif = () => {
    if (otp.some((digit) => digit === "")) {
      Alert.alert("Alert", "Please enter the OTP");
    } else {
      navigation.push("ReferralScreen");
    }
  };

  const maskedMobileNumber = mobileNumber
    ? mobileNumber.replace(/(\d{2})(\d{6})(\d{2})/, "$1******$3")
    : "";

  const otpInputsRefs = useRef([]);

  const handleVerify = async () => {
    // console.log("hii");
    const otpString = otp.join("");

    setIsLoading(true);
    try {
      const response = await fetch(
        "https://chowkpe-server.onrender.com/api/v1/auth/verify_otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mobile_number: mobileNumber,
            otp: otpString,
          }),
        }
      );

      const data = await response.json();
      console.log("data", data);
      if (data.message == "login successfully") {
        setIsLoading(false);
        Alert.alert(data.message);
        console.log(data)
        await AsyncStorage.setItem("uid", data.token);
        
        if (data?.user?.profile?.isCompleted == undefined || false) {
          navigation.replace("ReferralScreen");
          return;
        }

        if (data?.user?.documents?.isCompleted == false || undefined) {
          navigation.replace("DocumentUpload");
          return;
        }

        if (data?.user?.bankDetails?.isCompleted == undefined) {
          navigation.replace("BankDetailPage");
          return;
        }
        console.log("here")
        navigation.replace("Home");
        return;
      } else if (data.message == "register successfully") {
        Alert.alert(data.message);
        setIsLoading(false);
        await AsyncStorage.setItem("uid", data.token);
        navigation.replace("ReferralScreen");
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

  // speak
  function handelSpeak(){
    console.log("hello")
    Tts.speak(`
    अपना ओटीपी दर्ज करें`)
  }

  return (
    <View style={styles.container}>
      <ImageBackground source={Rectangle} style={styles.imageBackground}>
        <View style={styles.imageContainer}>
          <Image source={Frame} style={styles.topImage} />
        </View>
      </ImageBackground>
      <ScrollView style={styles.otpContainer}>
      {
            lang == "English" ?   <Text style={styles.title}>Enter verification code</Text>: <Text style={styles.title}>ओटीपी कोड दर्ज करें</Text>
          }
          {
            lang == "English" ?   <Text style={styles.subtitle}>
            Enter the 4-digit verification code sent to your phone number{" "}
            <Text style={styles.dynamicText}>{maskedMobileNumber}</Text>
          </Text>:<Text style={styles.subtitle}>
          आपके फ़ोन नंबर पर भेजा गया 4-अंकीय ओटीपी कोड दर्ज करें{" "}
          <Text style={styles.dynamicText}>{maskedMobileNumber}</Text>
        </Text>
          }
       
        <View style={styles.otpInputs}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (otpInputsRefs.current[index] = ref)}
              style={[
                styles.otpInput,
                index !== 0 && styles.otpInputMarginLeft,
              ]}
              keyboardType="numeric"
              maxLength={1}
              value={digit}
              onChangeText={(value) => handleOtpChange(index, value)}
              placeholder="-"
              placeholderTextColor="gray"
            />
          ))}
        </View>
        {
          lang == "English" ?  <Text style={styles.resendText}>
          Did not receive OTP? <Text style={styles.goBackText}>Go back</Text> in{" "}
          {timer} sec
        </Text>:<Text style={styles.resendText}>
  OTP प्राप्त नहीं हुआ? <Text style={styles.goBackText}>वापस जाएं</Text> {timer} सेकंड में
</Text>


        }
       
        {isloading ? (
          <TouchableOpacity
            style={[
              styles.verifyButton,
              {
                backgroundColor: otp.length === 4 ? "#021F93" : "#ccc",
              },
            ]}
            disabled={otp.length !== 4}
          >
            <ActivityIndicator size="small" color="white" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[
              styles.verifyButton,
              {
                backgroundColor: otp.length === 4 ? "#021F93" : "#ccc",
              },
            ]}
            onPress={() => handleVerify()}
            disabled={otp.length !== 4}
          >
             <TouchableOpacity onPress={() => handelSpeak()}>
              <Image
                source={require("../../assets/images/skill/Vector.png")}
                style={styles.headingImage}
              />
            </TouchableOpacity>
            {
              lang == "English" ? <Text style={styles.verifyButtonText}>Verify</Text>: <Text style={styles.verifyButtonText}> वेरीफाई </Text>
            }
           
          </TouchableOpacity>
        )}
        {/* <TouchableOpacity style={styles.verifyButton} onPress={handleVerify}>
          <Text style={styles.verifyButtonText}>Verify</Text>
        </TouchableOpacity> */}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageBackground: {
    flex: 1,
  },
  imageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  topImage: {
    width: 290,
    height: 250,
    resizeMode: "contain",
  },
  otpContainer: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    fontWeight: "500",
    textAlign: "left",
    color:"black"
  },
  subtitle: {
    fontSize: 14,
    color: "#888",
    marginBottom: 20,
  },
  dynamicText: {
    fontWeight: "bold",
    color: "black",
  },
  otpInputs: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    marginTop: 30,
  },
  otpInput: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#ddd",
    textAlign: "center",
    fontSize: 18,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 4,
    backgroundColor: "#fff",
    color:"black"
  },
  otpInputMarginLeft: {
    marginLeft: 10,
  },
  resendText: {
    fontSize: 14,
    color: "#888",
    marginBottom: 20,
    textAlign: "center",
  },
  goBackText: {
    color: "navy",
    fontWeight: "600",
  },
  verifyButton: {
    backgroundColor: "#9A9DFF",
    paddingVertical: 13,
    paddingHorizontal: 40,
    borderRadius: 5,
    marginTop:60
    

  },
  verifyButtonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    fontWeight:"600"
  },
  headingImage: {
    width: 30,
    height: 20,
    marginRight: 10,
    resizeMode: "contain",
    position: "absolute",
    right: -40,
    bottom: 20
  }
});

export default OtpScreen;
