import React, { useCallback } from "react";
import { View, Text, StyleSheet, BackHandler, Image } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import Logo from "../assets/images/provider/chowkpeLogo.png";

const SplashScreen = ({ navigation }) => {
  const backAction = () => {
    BackHandler.exitApp();
    return true;
  };

  useFocusEffect(
    useCallback(() => {
      BackHandler.addEventListener("hardwareBackPress", backAction);
      return () =>
        BackHandler.removeEventListener("hardwareBackPress", backAction);
    }, [backAction])
  );

  setTimeout(() => {
    navigation.replace("LanguageSelect");
  }, 2000);

  return (
    <View style={styles.container}>
      <Image source={Logo} style={styles.logo} />
      <Text style={styles.versionText}>Version 1.0.0</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#021F93",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 30,
  },
  versionText: {
    color: "white",
    fontSize: 16,
    position: "absolute",
    bottom: 30,
  },
});

export default SplashScreen;
