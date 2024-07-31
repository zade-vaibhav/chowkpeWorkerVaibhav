import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ScrollView,
  Pressable,
  Alert
} from "react-native";
import { format, addDays, isSameDay } from "date-fns";
import Frame from "../../assets/images/skill/Vertical-Full.png";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Tts from 'react-native-tts';
import { useFocusEffect } from "@react-navigation/native";

const JobScreen = ({ navigation }) => {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today);
  const dates = Array.from({ length: 30 }, (_, i) => addDays(today, i));
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [error, setError] = useState(null); // State for error handling
  const [isRefresh, setIsRefresh] = useState(false);
  const [applyingTaskId, setApplyingTaskId] = useState(null); // State for button loading indicator
  const [myId, setMyId] = useState("")
  const [isChange, setIsChange] = useState(false)
  const [lang, setLang] = useState("English")


  async function fetchData() {
    setLoading(true);

    try {
      const response = await fetch('https://chowkpe-server.onrender.com/api/v1/admin/tasks');

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      if (data.success === true) {
        const filtredTask = data?.data.filter((ele) => {
          return ele.task.workingPeriod == "Full Time"
        })
        setTasks(filtredTask); // Assuming your tasks data is in data.data
      } else {
        throw new Error('Failed to fetch tasks');
      }

    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
      setError(error.message);
    } finally {
      setLoading(false); // Set loading to false regardless of success or failure
    }
  }


  async function gettingToken() {
    const token = await AsyncStorage.getItem("uid");
    try {
      const requestOptions = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        }
      };
      const response = await fetch('https://chowkpe-server.onrender.com/api/v1/auth/token', requestOptions);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      if (data.success === true) {
        setMyId(data.workerId) // Assuming your tasks data is in data.data
      } else {
        Alert.alert(data.message)
      }

    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      gettingToken();
      fetchData();
    }, [isChange])
  );

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setIsChange(!isChange)
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    gettingToken();
    fetchData();
  }, [isRefresh])

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

  // Handle speak
  function handleSpeak(name, earning, location) {
    const earningRange = earning.split("-")
    Tts.stop();
    Tts.speak(`यह कार्य विक्रेता द्वारा प्रस्तुत किया गया है और इस कार्य से कमाई की सीमा ${earningRange[0]} से ${earningRange[1]} है और इस कार्य का पता ${location} है`);
  }

  // Join a task
  async function addWorkerToTask(taskId) {
    const token = await AsyncStorage.getItem("uid");

    const bodyData = {
      taskId: taskId
    };

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify(bodyData)
    };

    try {
      setApplyingTaskId(taskId);
      const response = await fetch(`https://chowkpe-server.onrender.com/api/v1/auth/task/addWorker`, requestOptions);
      const data = await response.json();
      // Handle success scenario here
      if (data.success == true) {
        setIsRefresh(!isRefresh);
        Alert.alert(data.message)
        return;
      }
      if (data.success == false) {
        Alert.alert(data.message)
      }

    } catch (error) {
      console.error('Error:', error);
      // Handle error scenario here
    } finally {
      setApplyingTaskId(null);
    }
  }

  function isjoined(list) {
    return list.some((worker) => worker._id === myId);
  }

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <View style={styles.captainContainer}>
          <Image
            source={require('../../assets/images/pa_work_workflow.png')}
            style={styles.captainImage}
          />
          <View style={styles.captainInfo}>
            <Text style={styles.sectionTitle}>{lang === 'English' ? 'Your Captain' : 'आपका कैप्टन'}</Text>
            <Text style={styles.captainName}>{lang === 'English' ? 'Vishal' : 'विशाल'}</Text>
            <Text style={styles.captainDetails}>{lang === 'English' ? 'Call available 9am to 5pm' : '9 बजे से 5 बजे तक कॉल उपलब्ध है'}</Text>
          </View>
          <Image
            source={require('../../assets/images/whatsapp.png')}
            style={styles.captainIcons}
          />
          <Image
            source={require('../../assets/images/phone.png')}
            style={styles.captainIcons}
          />
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#9A9DFF" />
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <ScrollView style={{ marginBottom: 10 }}>
          {tasks.map((ele, index) => (
            <Pressable key={index} style={styles.infoContainer} onPress={() => navigation.navigate("JobDetail", { data: ele, screenName: "Jobs" })}>
              <View style={styles.infoTop}>
                <View style={styles.infoLeft}>
                  <Text style={{ color: "black", paddingVertical: 4 }}><Text style={{ color: "black", fontSize: 15, fontWeight: "600" }}>Vendor ID</Text> :  {ele.task.vendorId}</Text>
                  <Text style={{ color: "black", paddingVertical: 4 }}><Text style={{ color: "black", fontSize: 15, fontWeight: "600" }}>Work Starting Period</Text> :  {ele.task.workStartingPeriod}</Text>
                  <Text style={{ color: "black", paddingVertical: 4 }}><Text style={{ color: "black", fontSize: 15, fontWeight: "600" }}>Address</Text> :  {ele.task.addressLocation}</Text>
                  <Text style={{ color: "black", paddingVertical: 4 }}><Text style={{ color: "black", fontSize: 15, fontWeight: "600" }}>Earning/month</Text> :  {ele.task.salaryRange}</Text>
                </View>
                <Image source={Frame} style={styles.infoRight} />
              </View>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                {isjoined(ele.workersJoined) ? (
                  <TouchableOpacity style={styles.appliedInfoButton}>
                    <Text style={styles.buttonText}>Applied</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.infoBottom}
                    onPress={() => addWorkerToTask(ele._id)}
                    disabled={applyingTaskId === ele._id}
                  >
                    {applyingTaskId === ele._id ? (
                      <ActivityIndicator color="#FFF" />
                    ) : (
                      <Text style={styles.buttonText}>Apply</Text>
                    )}
                  </TouchableOpacity>
                )}
                <TouchableOpacity onPress={() => handleSpeak(ele.task.jobDescription, ele.task.salaryRange, ele.task.addressLocation)}>
                  <Image
                    source={require("../../assets/images/skill/Vector.png")}
                    style={styles.headingImage}
                  />
                </TouchableOpacity>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: "#f5f5f5",
  },
  dateStrip: {
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "left",
    color: "black"
  },
  heading: {
    fontSize: 20,
    fontWeight: "500",
    marginBottom: 10,
    textAlign: "left",
    color: "black"
  },
  section: {
    marginVertical: 10
  },
  flatListContentContainer: {
    alignItems: "flex-start",
  },
  dateContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingVertical: 1,
    paddingHorizontal: 10,
    alignItems: "center",
    marginHorizontal: 10,
    width: 60,
    height: 55,
    justifyContent: "center",
    color: "black"
  },
  day: {
    fontSize: 18,
    fontWeight: "300",
    color: "#888",
  },
  date: {
    fontSize: 16,
    fontWeight: "500",
    color: "#888",
  },
  selectedContainer: {
    backgroundColor: "#9A9DFF",
    borderColor: "#9A9DFF",
  },
  selectedText: {
    color: "white",
  },
  infoContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginVertical: 10,
  },
  infoTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  infoLeft: {
    flex: 1,
    color: "black"
  },
  infoRight: {
    width: 80,
    height: 80,
    resizeMode: "contain",
  },
  infoBottom: {
    backgroundColor: "#021F93",
    height: 50,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
  },
  appliedInfoButton: {
    backgroundColor: "#58C34F",
    height: 50,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  captainContainer: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "#eff0fb",
    borderRadius: 10,
    color: "black"
  },
  captainImage: {
    width: 75,
    height: 75,
    borderRadius: 25,
    marginRight: 10,
  },
  captainIcons: {
    width: 40,
    height: 40,
    borderRadius: 25,
    marginRight: 10,
  },
  captainInfo: {
    flex: 1,
    justifyContent: 'center',
    color: "black"
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 5,
    color: "black"
  },
  captainName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: "black"
  },
  captainDetails: {
    fontSize: 12,
    color: '#666',
  },
  headingImage: {
    width: 30,
    height: 20,
    marginRight: 10,
    resizeMode: "contain",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
});

export default JobScreen;
