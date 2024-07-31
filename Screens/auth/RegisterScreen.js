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
import { Picker } from "@react-native-picker/picker";
import axios from "axios";

const RegisterScreen = ({ navigation }) => {
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

  const [phone, setphone] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [designation, setDesignation] = useState("");
  const [isSubmitting, setIssubmitting] = useState(false);
  const [address, setAddress] = useState("");

  //     const handelSubmit = async () => {
  //         setIssubmitting(true)

  //         if(phone=="" || name=="" || password =="" || designation=="" || designation=="Select" || address==""){
  //                 Alert.alert("empty fields!!")
  //                 setIssubmitting(false)
  //                 return ;
  //                 }
  //        try {

  //            const res = await axios.post('https://cariger-user-provider.onrender.com/api/v1/auth/laborRegister',{
  //             phone,name,password,designation,location,address
  //            });
  //            console.log(res.data);
  //            if(res && res.data.success) {
  //                Alert.alert(res.data.message)
  //                // toast.success(res.data && res.data.message);
  //                setIssubmitting(true)

  //                 navigation.push('Login');
  //            }else {
  //                // toast.error(res.data.message);
  //                setIssubmitting(true)
  //                Alert.alert(res.data.message)
  //            }
  //        } catch (error) {
  //            console.log(error);
  //            // toast.error('Smothing went wrong');
  //            setIssubmitting(true)
  //            Alert.alert('somthing went wrong od user exist')
  //        }
  //    }

  const handelSubmit = async () => {
    setIssubmitting(true);

    if (
      phone === "" ||
      name === "" ||
      password === "" ||
      designation === "" ||
      designation === "Select" ||
      address === ""
    ) {
      Alert.alert("Empty fields!!");
      setIssubmitting(false);
      return;
    }

    try {
      const response = await fetch(
        "https://cariger-user-provider.onrender.com/api/v1/auth/laborRegister",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phone,
            name,
            password,
            designation,
            location,
            address,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        Alert.alert(data.message);
        navigation.push("Login");
      } else {
        Alert.alert(data.message);
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Something went wrong or user exists");
    } finally {
      setIssubmitting(false);
    }
  };

  console.log(phone);
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
          {signInText({ text: "Username" })}
          {nameTextField({ text: "name" })}
          {signInText({ text: "Phone" })}
          {mobileNumberTextField()}
          {signInText({ text: "Password" })}
          {passwordTextField({ text: "password" })}
          {signInText({ text: "Address" })}
          {addressTextField({ text: "address" })}
          {signInText({ text: "Designation" })}
          {dropDown({ text: "designation" })}
          {isSubmitting ? continuingButton() : continueButton()}
          {otpInfo()}
          {loginInfo()}
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

  function nameTextField({ text }) {
    return (
      <View style={styles.textFieldWrapStyle}>
        <TextInput
          value={name}
          onChangeText={(text) => setName(text)}
          placeholder={text}
          style={{ ...Fonts.blackColor16Medium }}
          placeholderTextColor={Colors.blackColor}
          selectionColor={Colors.primaryColor}
          keyboardType="default"
        />
      </View>
    );
  }

  function addressTextField({ text }) {
    return (
      <View style={styles.textFieldWrapStyle}>
        <TextInput
          value={address}
          onChangeText={(text) => setAddress(text)}
          placeholder={text}
          style={{ ...Fonts.blackColor16Medium }}
          placeholderTextColor={Colors.blackColor}
          selectionColor={Colors.primaryColor}
          keyboardType="default"
        />
      </View>
    );
  }

  function mobileNumberTextField() {
    return (
      <IntlPhoneInput
        onChangeText={({ phoneNumber }) => setphone(`+91${phoneNumber}`)} // Remove the "-" after the country code
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
          selectedValue={designation}
          onValueChange={(itemValue, itemIndex) => setDesignation(itemValue)}
        >
          <Picker.Item label="Select 🔻" value="Select" />
          <Picker.Item label="General (Labour)" value="General" />
          <Picker.Item label="Dismantling (Labour)" value="Dismantling" />
          <Picker.Item
            label="Material shifting (Labour)"
            value="Material shifting"
          />
          <Picker.Item label="Excavation (Labour)" value="Excavation" />
          <Picker.Item label="Casting (Mason)" value="Casting" />
          <Picker.Item label="Brick work (Mason)" value="Brick work" />
          <Picker.Item label="Plaster (Mason)" value="Plaster" />
          <Picker.Item label="Tile (Mason)" value="Tile" />
          <Picker.Item label="Marble (Mason)" value="Marble" />
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
        }}
      >
        We’ll send otp for verification
      </Text>
    );
  }

  function loginInfo() {
    return (
      <Text
        style={{
          ...Fonts.blackColor16Medium,
          textAlign: "center",
          marginBottom: Sizes.fixPadding * 2.0,
          marginTop: Sizes.fixPadding - 5.0,
        }}
      >
        already registered?
        <Link style={{ textDecorationLine: "underline" }} to={"/Login"}>
          login
        </Link>
      </Text>
    );
  }

  function continueButton() {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => handelSubmit()}
        style={styles.continueButtonStyle}
      >
        <Text style={{ ...Fonts.whiteColor14Bold }}>Continue</Text>
      </TouchableOpacity>
    );
  }

  function continuingButton() {
    return (
      <TouchableOpacity activeOpacity={0.9} style={styles.continueButtonStyle}>
        <Text style={{ ...Fonts.whiteColor14Bold }}>Submitting...</Text>
      </TouchableOpacity>
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
    width: 100.0,
    height: 100.0,
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

export default RegisterScreen;
