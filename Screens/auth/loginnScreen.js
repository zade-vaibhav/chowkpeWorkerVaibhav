import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  BackHandler,
  ScrollView,
  Platform,
  TextInput,
  Alert,
} from "react-native";
import { Colors, Fonts, Sizes, CommonStyles } from "../../constant/styles";
import IntlPhoneInput from "react-native-intl-phone-input";
import { Link, useFocusEffect } from "@react-navigation/native";
import MyStatusBar from "../../components/myStatusBar";
import {
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
} from "expo-location";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginnScreen = ({ navigation }) => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    // Request permission to access location
    (async () => {
      let { status } = await requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setError("Permission to access location was denied");
        return;
      }

      // Fetch the device's current position
      try {
        const position = await getCurrentPositionAsync({ accuracy: 6 });
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
        console.log(position);
      } catch (error) {
        setError(error.message);
      }
    })();
  }, []);

  const backAction = () => {
    if (Platform.OS === "ios") {
      navigation.addListener("beforeRemove", (e) => {
        e.preventDefault();
      });
    } else {
      backClickCount == 1 ? BackHandler.exitApp() : _spring();
      return true;
    }
  };

  useFocusEffect(
    useCallback(() => {
      BackHandler.addEventListener("hardwareBackPress", backAction);
      navigation.addListener("gestureEnd", backAction);
      return () => {
        BackHandler.removeEventListener("hardwareBackPress", backAction);
        navigation.removeListener("gestureEnd", backAction);
      };
    }, [backAction])
  );

  function _spring() {
    setbackClickCount(1);
    setTimeout(() => {
      setbackClickCount(0);
    }, 1000);
  }

  const [backClickCount, setbackClickCount] = useState(0);

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isloading, setIsloding] = useState(false);

  // handel submit
  // async function handelSubmit(){

  //  if( phone=="" || password ==""){
  //     Alert.alert("empty fields!!")
  //     return ;
  //     }
  //     console.log(phone,password)
  //     try {
  //         const res = await axios.post('https://cariger-user-provider.onrender.com/api/v1/auth/laborLogin',{phone,password});
  //         console.log(res.data)
  //         if(res.data.success) {
  //             Alert.alert(res.data.message);
  //             console.log(res.data.token,"from lohgin side")
  //             AsyncStorage.setItem("user_token",res.data.token)
  //             navigation.push('BottomTabBar');

  //         }else {

  //             Alert.alert(res.data.message);
  //         }
  //     } catch (error) {
  //         console.log(error);
  //         Alert.alert('Smothing went wrong or invalid user!!');
  //  }
  // }

  async function handelSubmit() {
    setIsloding(true);
    if (phone === "" || password === "") {
      Alert.alert("Empty fields!!");
      setIsloding(false);
      return;
    }

    try {
      const response = await fetch(
        "https://cariger-user-provider.onrender.com/api/v1/auth/laborLogin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ phone, password }),
        }
      );

      const data = await response.json();
      console.log(data);
      if (data.success) {
        setIsloding(false);
        Alert.alert(data.message);
        console.log(data.token, "from login side");
        AsyncStorage.setItem("user_token", data.token);
        // navigation.push('BottomTabBar');
        // navigation.push("BottomTabBar");
        navigation.push("DocumentUpload");
      } else {
        setIsloding(false);
        Alert.alert(data.message);
      }
    } catch (error) {
      setIsloding(false);
      console.log(error);
      Alert.alert("Something went wrong or invalid user!!");
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <MyStatusBar />
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ScrollView
          automaticallyAdjustKeyboardInsets={true}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            paddingBottom: Sizes.fixPadding * 2.0,
          }}
        >
          {appLogo()}
          {signInText({ text: "Phone" })}
          {mobileNumberTextField()}
          {/* {signInText({text:"Phone"})} */}
          {/* {mobileNumberTextField()} */}
          {signInText({ text: "Password" })}
          {passwordTextField({ text: "password" })}
          {/* {signInText({text:"Designation"})} */}
          {/* {dropDown({text:"designation"})} */}
          {continueButton()}
          {otpInfo()}
        </ScrollView>
      </View>
      {backClickCount == 1 ? (
        <View style={styles.animatedView}>
          <Text style={{ ...Fonts.whiteColor14Medium }}>
            press back again to exit the app
          </Text>
        </View>
      ) : null}
    </View>
  );

  // function nameTextField({text}) {
  //     return (
  //         <View style={styles.textFieldWrapStyle}>
  //             <TextInput
  //                 value={phone}
  //                 onChangeText={(text) => setPhone(text)}
  //                 placeholder={text}
  //                 style={{ ...Fonts.blackColor16Medium}}
  //                 type="Number"
  //                 placeholderTextColor={Colors.blackColor}
  //                 selectionColor={Colors.primaryColor}
  //                 keyboardType="default"
  //             />
  //         </View>
  //     )
  // }

  function mobileNumberTextField() {
    return (
      <IntlPhoneInput
        onChangeText={({ phoneNumber }) => setPhone(`+91${phoneNumber}`)} // Remove the "-" after the country code
        defaultCountry="IN" // Set default country to India
        containerStyle={styles.mobileNumberWrapStyle}
        dialCodeTextStyle={{ ...Fonts.blackColor16Medium }}
        phoneInputStyle={{
          flex: 1,
          marginLeft: Sizes.fixPadding + 5.0,
          ...Fonts.blackColor14Regular,
        }}
        placeholder="Phone Number"
        filterInputStyle={{ ...Fonts.blackColor16Medium }}
        modalCountryItemCountryNameStyle={{ ...Fonts.blackColor16Medium }}
        placeholderTextColor={Colors.grayColor}
        flagStyle={{ fontSize: 20 }}
      />
    );
  }

  function passwordTextField({ text }) {
    return (
      <View style={styles.textFieldWrapStyle}>
        <TextInput
          value={password}
          onChangeText={(text) => setPassword(text)}
          placeholder={text}
          style={{ ...Fonts.blackColor14Medium }}
          placeholderTextColor={Colors.blackColor}
          selectionColor={Colors.primaryColor}
          secureTextEntry={true}
          textContentType="oneTimeCode"
        />
      </View>
    );
  }

  function dropDown({ text }) {
    return (
      <View style={styles.textFieldWrapStyle}>
        <Text>Select a value:</Text>
        <Picker
          selectedValue={designation.designation}
          onValueChange={(itemValue, itemIndex) =>
            setDesignation({ designation: itemValue })
          }
        >
          <Picker.Item label="Labour" value="Labour" />
          <Picker.Item label="Painter" value="Painter" />
          <Picker.Item label="Carpenter" value="Carpenter" />
        </Picker>
      </View>
    );
  }

  function otpInfo() {
    return (
      <Text
        style={{
          ...Fonts.blackColor16Medium,
          textAlign: "center",
          marginBottom: Sizes.fixPadding * 2.0,
          marginTop: Sizes.fixPadding - 5.0,
        }}
      >
        if not registered?
        <Link style={{ textDecorationLine: "underline" }} to={"/Register"}>
          register
        </Link>
      </Text>
    );
  }

  function continueButton() {
    return (
      <>
        {isloading ? (
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.continueButtonStyle}
          >
            <Text style={{ ...Fonts.whiteColor14Bold }}>loading...</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => handelSubmit()}
            style={styles.continueButtonStyle}
          >
            <Text style={{ ...Fonts.whiteColor14Bold }}>login</Text>
          </TouchableOpacity>
        )}
      </>
    );
  }

  function signInText({ text }) {
    return (
      <Text
        style={{
          ...Fonts.grayColor14Bold,
          textAlign: "left",
          marginBottom: Sizes.fixPadding + 5.0,
          fontSize: 15,
          paddingHorizontal: 30,
        }}
      >
        {text}
      </Text>
    );
  }

  function appLogo() {
    return (
      <View>
        <Image
          source={require("../../assets/images/icon.png")}
          style={styles.appLogoStyle}
          resizeMode="cover"
        />
        <Text
          style={{
            ...Fonts.grayColor14Medium,
            textAlign: "center",
            marginTop: Sizes.fixPadding,
            marginBottom: Sizes.fixPadding + 5.0,
          }}
        >
          Provider
        </Text>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  animatedView: {
    backgroundColor: "#333333",
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    borderRadius: Sizes.fixPadding + 5.0,
    paddingHorizontal: Sizes.fixPadding + 5.0,
    paddingVertical: Sizes.fixPadding,
    justifyContent: "center",
    alignItems: "center",
  },
  mobileNumberWrapStyle: {
    backgroundColor: Colors.whiteColor,
    elevation: 2.0,
    borderRadius: Sizes.fixPadding,
    marginHorizontal: Sizes.fixPadding * 2.0,
    height: 55.0,
    marginBottom: Sizes.fixPadding * 2.0,
    borderColor: "rgba(128,128,128,0.12)",
    borderWidth: 1.0,
    ...CommonStyles.shadow,
  },
  loginWithGoogleButtonStyle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.whiteColor,
    borderRadius: Sizes.fixPadding,
    marginHorizontal: Sizes.fixPadding * 2.0,
    paddingVertical: Sizes.fixPadding,
  },
  loginWithFacebookButtonStyle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3B5998",
    borderRadius: Sizes.fixPadding,
    marginHorizontal: Sizes.fixPadding * 2.0,
    paddingVertical: Sizes.fixPadding,
    marginBottom: Sizes.fixPadding * 2.5,
  },
  continueButtonStyle: {
    backgroundColor: Colors.primaryColor,
    paddingVertical: Sizes.fixPadding + 3.0,
    borderRadius: Sizes.fixPadding,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: Sizes.fixPadding * 2.0,
    marginBottom: Sizes.fixPadding - 5.0,
  },
  appLogoStyle: {
    width: 150.0,
    height: 150.0,
    alignSelf: "center",
  },
  textFieldWrapStyle: {
    backgroundColor: Colors.whiteColor,
    borderRadius: Sizes.fixPadding,
    paddingVertical: Sizes.fixPadding + 3.0,
    marginBottom: Sizes.fixPadding * 2.0,
    justifyContent: "center",
    marginHorizontal: Sizes.fixPadding * 2.0,
    elevation: 3.0,
    paddingHorizontal: Sizes.fixPadding + 5.0,
    borderColor: "rgba(128,128,128,0.12)",
    borderWidth: 1.0,
    ...CommonStyles.shadow,
  },
});

export default LoginnScreen;
