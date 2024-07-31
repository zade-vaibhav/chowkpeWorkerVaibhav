import React, {useState,useEffect}from "react";
import { Dimensions, StyleSheet, View, Image } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FeedScreen from "./FeedScreen";
import TaskScreen from "./TaskScreen";
import JobsScreen from "./JobsScreen";
import ProfileScreen from "./ProfileScreen";
import SeekhoScreen from "../Profile/SeekhoScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import SeekhoScreen from "../auth/SeekhoScreen";

const { height, width } = Dimensions.get("window");

const Tab = createBottomTabNavigator();

const TabNavigation = () => {
  const [lang, setLang] = useState("English")


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

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          let iconSource;

          switch (route.name) {
              case lang === 'English' ? 'Feed' : 'फ़ीड':
                iconSource = require('../../assets/images/Feed.png');
                break;
              case lang === 'English' ? 'Task' : 'कार्य':
                iconSource = require('../../assets/images/Task.png');
                break;
              case lang === 'English' ? 'Jobs' : 'नौकरियां':
                iconSource = require('../../assets/images/Jobs.png');
                break;
              case lang === 'English' ? 'Seekho' : 'सीखो':
                iconSource = require('../../assets/images/Seekho.png');
                break;
              case lang === 'English' ? 'Profile' : 'प्रोफ़ाइल':
                iconSource = require('../../assets/images/Profile.png');
                break;
              default:
                break;
            
          }

          return (
            <Image
              source={iconSource}
              style={[styles.icon, { tintColor: focused ? "#007BFF" : "#888" }]}
            />
          );
        },
        tabBarLabelStyle: {
          fontSize: width * 0.035,
        },
        tabBarStyle: {
          height: height * 0.09,
          paddingBottom: height * 0.01,
        },
        tabBarItemStyle: {
          paddingTop: height * 0.01,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name={lang === 'English' ? 'Feed' : 'फ़ीड'} component={FeedScreen} />
<Tab.Screen name={lang === 'English' ? 'Task' : 'कार्य'} component={TaskScreen} />
<Tab.Screen name={lang === 'English' ? 'Jobs' : 'नौकरियां'} component={JobsScreen} />
<Tab.Screen name={lang === 'English' ? 'Seekho' : 'सीखो'} component={SeekhoScreen} />
<Tab.Screen name={lang === 'English' ? 'Profile' : 'प्रोफ़ाइल'} component={ProfileScreen} />

    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: width * 0.07,
    height: height * 0.035,
    resizeMode: "contain",
  },
});

export default TabNavigation;
