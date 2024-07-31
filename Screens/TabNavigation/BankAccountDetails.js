import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import { View, Text, StyleSheet, Button } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

const BankAccountDetails = ({ navigation }) => {
  const [isloading, setIsLoading] = useState(false);
  const [bankDetails, setBankDetails] = useState({});
  const [ischange, setIschange] = useState(false);
  const [isRefresh, setIsRefresh] = useState(false);
  const [lang, setLang] = useState("English")

  async function getBankData() {
    console.log("hello");
    setIsLoading(true);
    const token = await AsyncStorage.getItem("uid");
    console.log(token, "hello");
    try {
      const response = await fetch(
        "https://chowkpe-server.onrender.com/api/v1/auth/getAllData",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      console.log(data);

      if (data.success == true) {
        setIsLoading(false);
        setBankDetails(data.user.bankDetails);
      } else {
        setIsLoading(false);
        Alert.alert(data.message);
      }
    } catch (error) {
      setIsLoading(false);
      Alert.alert(data.message);
      console.log(error);
    }
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setIsRefresh(!isRefresh);
    });
    return unsubscribe;
  }, [navigation]);

  useFocusEffect(
    React.useCallback(() => {
      getBankData();
    }, [isRefresh])
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

  const handleEditPress = () => {
    // Logic for handling edit button press, e.g., navigate to an edit page
    navigation.navigate("EditBankAccount", {
      bankDetails,
    });
  };

  const handleaddAccount = () => {
    // Logic for handling edit button press, e.g., navigate to an edit page
    navigation.navigate("EditBankAccount", {
      bankDetails,
      ischange,
      setIschange,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        {lang === 'English' ? 'Bank Account Details' : 'बैंक खाता विवरण'}
      </Text>

      {isloading ? (
        <ActivityIndicator size="small" color="#9A9DFF" />
      ) : bankDetails?.accountNumber == undefined ? (
        <Button
          style={{ backgroundColor: "#9A9DFF" }}
          title={lang === 'English' ? "Add Bank Details +" : "बैंक विवरण जोड़ें +"}
          onPress={handleaddAccount}
        />

      ) : (
        <View style={styles.detailsWrapper}>
          <View style={styles.detailContainer}>
            <Text style={styles.label}>
              {lang === 'English' ? "Account Number:" : "खाता क्रमांक:"}
            </Text>

            <Text style={styles.value}>{bankDetails?.accountNumber}</Text>
          </View>
          <View style={styles.detailContainer}>
            <Text style={styles.label}>
              {lang === 'English' ? "Bank Name:" : "बैंक का नाम:"}
            </Text>

            <Text style={styles.value}>{bankDetails?.bankName}</Text>
          </View>
          <View style={styles.detailContainer}>
            <Text style={styles.label}>
              {lang === 'English' ? "IFSC Code:" : "IFSC कोड:"}
            </Text>

            <Text style={styles.value}>{bankDetails?.ifscCode}</Text>
          </View>
          <Button
  style={{ backgroundColor: "#021F93" }}
  title={lang === 'English' ? "Edit" : "संपादन करें"}
  onPress={handleEditPress}
/>

        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    // marginTop: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: 'gray'
  },
  detailsWrapper: {
    width: "80%",
    padding: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
  },
  detailContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  label: {
    fontWeight: "bold",
    flex: 1,
    color: "black"
  },
  value: {
    flex: 2,
    color: "gray"
  },
});

export default BankAccountDetails;
