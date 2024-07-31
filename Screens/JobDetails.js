import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Dimensions,ActivityIndicator,Alert } from 'react-native';
import Group from '../assets/images/skill/Vertical-Full.png';
import Sound from '../assets/images/skill/Vector.png';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const JobDetailsScreen = ({ navigation, route }) => {
    const { data,screenName} = route.params;
    const [taskDatail, setTaskDetail] = useState(data);
    const [applyingTaskId, setApplyingTaskId] = useState(null);
    const [myId,setMyId]= useState("")

    useEffect(() => {
        navigation.setOptions({
            headerTitle: ' ',
            headerShown: false,
        });
        gettingToken()
    }, [navigation]);


    async function gettingToken(){
        const token = await AsyncStorage.getItem("uid");
        try {
          const requestOptions = {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + token
            }
          };
          const response = await fetch('https://chowkpe-server.onrender.com/api/v1/auth/token',requestOptions);
    
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
      if(data.success == true){
        Alert.alert(data.message)
        navigation.navigate(screenName)
        return;
      }
      if(data.success == false){
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
      console.log(list)
        return list.some((worker) => worker._id === myId);
      }
    
    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.innerContainer}>
                    <View style={styles.headerContainer}>
                        <Image source={Group} style={styles.headerImage} />
                    </View>
                    <View style={styles.detailsContainer}>
                        <Text style={styles.title}>Job Detail</Text>
                        <View style={styles.detailRow}>
                            <View style={styles.detailColumn}>
                                <Text style={styles.label}>Vendor Id</Text>
                                <Text style={styles.value}>{taskDatail.task.vendorId}</Text>
                            </View>
                            <View style={styles.detailColumn}>
                                <Text style={styles.label}>Work Starting Period</Text>
                                <Text style={styles.value}>{taskDatail.task.workStartingPeriod} & {taskDatail.task.workingPeriod}</Text>
                            </View>
                        </View>
                        <View style={styles.detailRow}>
                            <View style={styles.detailColumn}>
                                <Text style={styles.label}>Earning/Hr</Text>
                                <Text style={styles.value}>{taskDatail.task.salaryRange}</Text>
                            </View>
                            <View style={styles.detailColumn}>
                                <Text style={styles.label}>Category</Text>
                                {taskDatail.task.hireCategory.map((ele, id) => (
                                    <Text key={id} style={styles.value}>
                                        {ele}{taskDatail.task.hireCategory.length - 1 === id ? "" : ","}
                                    </Text>
                                ))}
                            </View>
                        </View>
                        <View style={styles.detailRow}>
                            <View style={styles.detailColumn}>
                                <Text style={styles.label}>Address</Text>
                                <Text style={styles.value}>{taskDatail.task.addressLocation}</Text>
                            </View>
                            <View style={styles.detailColumn}>
                                <Text style={styles.label}>Documentation Required</Text>
                                {taskDatail.task.documentsRequired.map((ele, id) => (
                                    <Text key={id} style={styles.value}>
                                        {ele}{taskDatail.task.documentsRequired.length - 1 === id ? "" : ","}
                                    </Text>
                                ))}
                            </View>
                        </View>
                        <View style={styles.detailRow}>
                            <View style={styles.detailColumn}>
                                <Text style={styles.label}>Job Description</Text>
                                <Text style={styles.value}>{taskDatail.task.jobDescription}</Text>
                            </View>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.label}>What additional things we provide?</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <View style={styles.detailColumn}>
                                <Text style={styles.label}>Accommodation?</Text>
                                <Text style={styles.value}>{taskDatail.task.accommodation ? "Yes" : "No"}</Text>
                            </View>
                            <View style={styles.detailColumn}>
                                <Text style={styles.label}>Food?</Text>
                                <Text style={styles.value}>{taskDatail.task.food ? "Yes" : "No"}</Text>
                            </View>
                        </View>
                        <View style={styles.detailRow}>
                            <View style={styles.detailColumn}>
                                <Text style={styles.label}>ESI?</Text>
                                <Text style={styles.value}>{taskDatail.task.esi ? "Yes" : "No"}</Text>
                            </View>
                            <View style={styles.detailColumn}>
                                <Text style={styles.label}>PF?</Text>
                                <Text style={styles.value}>{taskDatail.task.pf ? "Yes" : "No"}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
            <View style={styles.footerContainer}>
            {isjoined(taskDatail.workersJoined) ? (
                  <TouchableOpacity style={styles.appliedInfoButton}>
                    <Text style={styles.buttonText}>Applied</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.infoBottom}
                    onPress={() => addWorkerToTask(taskDatail._id)}
                    disabled={applyingTaskId === taskDatail._id}
                  >
                    {applyingTaskId === taskDatail._id ? (
                      <ActivityIndicator color="#FFF" />
                    ) : (
                      <Text style={styles.buttonText}>Apply</Text>
                    )}
                  </TouchableOpacity>
                )}
                <Image source={Sound} style={styles.smallImage} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContainer: {
        backgroundColor: "#F5F5F5",
        alignItems: 'center',
        paddingVertical:10
    },
    innerContainer: {
        alignItems: 'center',
        width: '100%',
    },
    smallImage: {
        width: 30,
        height: 20,
        marginRight: 20,
        resizeMode: "contain",
    },
    headerContainer: {
        width: width * 0.8,
        marginTop: 0,
        height: height * 0.4,
        aspectRatio: 16 / 9,
        backgroundColor: '#EFEFF9',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerImage: {
        marginTop: 65,
        width: '80%',
        height: '70%',
        resizeMode: 'contain',
    },
    detailsContainer: {
        backgroundColor: '#FFFFFF',
        width: '90%',
        borderRadius: 10,
        padding: 20,
        marginTop: -19,
        elevation: 7,
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        marginBottom: 40,
        textAlign: 'center',
        color: "black"
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    detailColumn: {
        width: '45%',
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: "black",
        marginBottom: 5,
    },
    value: {
        fontSize: 14,
        marginBottom: 2,
        color: "gray"
    },
    footerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#EFEFF9',
    },
    applyButton: {
        backgroundColor: '#021f93',
        padding: 13,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 20
    },
    applyButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
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
});

export default JobDetailsScreen;

