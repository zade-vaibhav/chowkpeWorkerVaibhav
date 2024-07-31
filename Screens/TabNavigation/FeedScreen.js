import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
  Pressable,
  Alert,
  ActivityIndicator
} from "react-native";
import { format, addDays, isSameDay } from "date-fns";
import Frame from "../../assets/images/skill/Vertical-Full.png";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Tts from 'react-native-tts';
import { BaseToast } from "react-native-toast-message";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { useFocusEffect } from "@react-navigation/native";

const FeedScreen = ({ navigation }) => {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today);
  const [name, setName] = useState("");
  const [tasks, setTasks] = useState([]);
  const [isRefresh, setIsRefresh] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const dates = Array.from({ length: 30 }, (_, i) => addDays(today, i));
  const [myId, setMyId] = useState("")
  const [applyingTaskId, setApplyingTaskId] = useState(null);
  const [isChange, setIsChange] = useState(false);

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
        setMyId(data.workerId);
      } else {
        Alert.alert(data.message)
      }
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  }

  async function fetchData() {
    const name = await AsyncStorage.getItem("name");
    setName(name);
    setLoading(true);
    try {
      const response = await fetch('https://chowkpe-server.onrender.com/api/v1/admin/tasks');

      if (!response.ok) {
        Alert.alert('Network response was not ok');
      }

      const data = await response.json();
      console.log(myId)
      if (data.success === true) {
        // const filtredTask = data?.data.filter((ele) => {
        //   return ele.workersJoined.some(worker => worker._id === myId);
        // });
        setTasks(data.data);
      } else {
        Alert.alert('Failed to fetch tasks');
      }
    } catch (error) {
      Alert.alert('There was a problem with the fetch operation:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      const fetchDataAsync = async () => {
        await gettingToken();
        await fetchData();
      };

      fetchDataAsync();
    }, [isRefresh])
  );

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setIsRefresh(!isRefresh);
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(()=>{
     gettingToken();
     fetchData();
  },[isChange])

  function isjoined(list) {
    return list.some((worker) => worker._id === myId);
  }

  function isSelected(list) {
    return list.some((worker) => worker._id === myId);
  }

  function isApproved(list) {
    return list.some((worker) => worker._id === myId);
  }

  function handleSpeak(name, earning, location) {
    const earningRange = earning.split("-")
    Tts.stop();
    Tts.speak(`यह कार्य विक्रेता द्वारा प्रस्तुत किया गया है और इस कार्य से कमाई की सीमा ${earningRange[0]} से ${earningRange[1]} है और इस कार्य का पता ${location} है`);
  }


  const confirmRemoveWorker = (taskId) => {
    Alert.alert(
      "Confirm Removal",
      "Are you sure you want to remove?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "OK", 
          onPress: () => removeWorker(taskId) 
        }
      ],
      { cancelable: false }
    );
  };

    // Join a task
    async function removeWorker(taskId) {
      const token = await AsyncStorage.getItem("uid");
      console.log(token)
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
      console.log(bodyData)
      try {
        setApplyingTaskId(taskId);
        const response = await fetch(`https://chowkpe-server.onrender.com/api/v1/auth/task/removeWorker`, requestOptions);
        const data = await response.json();
        // Handle success scenario here
        console.log(data)
        if (response.ok) {
          setIsChange(!isChange)
          Alert.alert(data.message)
          return;
        }
        if (data.success == false) {
          Alert.alert(data.message)
        }
  
      } catch (error) {
        console.error('Error:', error);
        // Handle error scenario here
      }finally {
        setApplyingTaskId(null);
      }
    }

  const renderItem = ({ item }) => {
    const dayOfWeek = format(item, "EEE");
    const dayOfMonth = format(item, "dd");
    const isSelected = isSameDay(item, selectedDate);

    return (
      <TouchableOpacity onPress={() => setSelectedDate(item)}>
        <View
          style={[styles.dateContainer, isSelected && styles.selectedContainer]}
        >
          <Text style={[styles.day, isSelected && styles.selectedText]}>
            {dayOfWeek}
          </Text>
          <Text style={[styles.date, isSelected && styles.selectedText]}>
            {dayOfMonth}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.dateStrip}>
        <Text style={styles.title}>Hello {name}</Text>
        <Text style={styles.heading}>Date</Text>
        <FlatList
          data={dates}
          renderItem={renderItem}
          keyExtractor={(item) => item.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          initialNumToRender={5}
          maxToRenderPerBatch={5}
          windowSize={10}
          contentContainerStyle={styles.flatListContentContainer}
        />
      </View>
      {/* <View style={{ alignItems: 'flex-end' }}>
        <TouchableOpacity onPress={() => setIsRefresh(!isRefresh)}>
          <Image
            source={require("../../assets/images/skill/refresh.png")}
            style={styles.refreshImage}
          />
        </TouchableOpacity>
      </View> */}
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
          {tasks.map((ele, index) =>
            isjoined(ele.workersJoined) ? (
              <Pressable key={index} style={styles.infoContainer} onPress={() => navigation.navigate("JobDetail", { data: ele, screenName: "Feed" })} >
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
                  {
                    isApproved(ele.workerApproved) ? (<TouchableOpacity style={styles.selectedAppliedInfoButton}>
                      <Text style={styles.buttonText}>Approved</Text>
                    </TouchableOpacity>) : isSelected(ele.workersSelected) ? (<TouchableOpacity style={styles.selectedAppliedInfoButton}>
                      <Text style={styles.buttonText}>In-Review</Text>
                    </TouchableOpacity>) : (
                      <TouchableOpacity style={styles.appliedInfoButton}>
                        <Text style={styles.buttonText}>Pending...</Text>
                      </TouchableOpacity>
                    )
                  }
                  <TouchableOpacity onPress={() => handleSpeak(ele.task.jobDescription, ele.task.salaryRange, ele.task.addressLocation)}>
                    <Image
                      source={require("../../assets/images/skill/Vector.png")}
                      style={styles.headingImage}
                    />
                  </TouchableOpacity>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                  
                  {
                    isSelected(ele.workersSelected) ? (<></>) : (
                      <TouchableOpacity style={styles.removeInfoButton} onPress={()=>confirmRemoveWorker(ele._id)}>
                        {applyingTaskId === ele._id ? (
                      <ActivityIndicator color="#FFF" />
                    ) :(<Text style={styles.buttonText}>Remove</Text>)}
                      </TouchableOpacity>)
                  }

                </View>
              </Pressable>) : ""
          )}
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
    fontSize: 15,
    fontWeight: "400",
    color: "#000",
  },
  date: {
    fontSize: 15,
    fontWeight: "400",
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
    backgroundColor: "#9A9DFF",
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
  refreshImage: {
    width: 30,
    height: 20,
    marginRight: 10,
    padding: 15,
    resizeMode: "contain",
  },removeInfoButton:{
    backgroundColor: "red",
    height: 50,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
    marginTop:5
  },
  appliedInfoButton: {
    backgroundColor: "#ff9900",
    height: 50,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
  },
  selectedAppliedInfoButton: {
    backgroundColor: "#58C34F",
    height: 50,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
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

export default FeedScreen;

