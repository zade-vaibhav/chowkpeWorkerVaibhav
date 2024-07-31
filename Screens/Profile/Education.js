import AsyncStorage from '@react-native-async-storage/async-storage';
import React,{useState,useEffect}from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { Checkbox } from "react-native-paper";
import Tts from 'react-native-tts';

export default function Education({ navigation,route }) {
    const referralId = route?.params || 0;
    const [education, setEducation] =useState();
    const [isDisplay,setIsDisplay] = useState(false)
    const [lang,setLang] =useState("English")

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

      function handelSpeak(){
        Tts.speak(`कृपया अपनी शिक्षा का चयन करें`)
      }

    return (
        <View style={styles.container}>
            {/* <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Icon name="arrow-back" size={24} color="black" />
            </TouchableOpacity> */}

            <View style={styles.imageContainer}>
                {
                    lang == "English" ?<Text style={styles.topheading}>Create Your Profile</Text>:<Text style={styles.topheading}>अपना प्रोफ़ाइल बनाए</Text>
                }
            
                <Image
                    source={require('../../assets/images/education.png')} // Add your image to the assets folder
                    style={styles.image}
                />
            </View>
            {
                lang == "English" ?<Text style={styles.heading}>Select Education</Text>:<Text style={styles.heading}>शिक्षा का चयन करें</Text>
            }
            
            <ScrollView contentContainerStyle={styles.scrollView}>
                <View style={styles.optionsContainer}>
                    <View style={styles.optionRow}>
                        <View style={styles.option}>
                            <Checkbox
                                status={education === "<10th" ? "checked" : "unchecked"}
                                onPress={() =>{ setEducation("<10th")
                                setIsDisplay(true)}}
                            />
                            <Text style={styles.optionText}>{"<10th"}</Text>
                        </View>
                        <View style={styles.option}>
                            <Checkbox
                                status={education === "10th" ? "checked" : "unchecked"}
                                onPress={() => {setEducation("10th")
                                setIsDisplay(true)}}
                            />
                            <Text style={styles.optionText}>10th</Text>
                        </View>
                    </View>
                    <View style={styles.optionRow}>
                        <View style={styles.option}>
                            <Checkbox
                                status={education === "12th" ? "checked" : "unchecked"}
                                onPress={() => {setEducation("12th")
                                setIsDisplay(true)}}
                            />
                            <Text style={styles.optionText}>12th</Text>
                        </View>
                        <View style={styles.option}>
                            <Checkbox
                                status={education === "Certificate" ? "checked" : "unchecked"}
                                onPress={() => {setEducation("Certificate")
                                setIsDisplay(true)}}
                            />
                            {
                                 lang == "English"?<Text style={styles.optionText}>Certificate</Text>:<Text style={styles.optionText}>प्रमाणपत्र</Text>
                            }
                            
                        </View>
                    </View>

                </View>
            </ScrollView>
            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.continueButton, !isDisplay && styles.disabledButton]}
                    disabled={!isDisplay}
                  onPress={()=>navigation.navigate("SkillPage",{education,referralId})}
                >
                     <TouchableOpacity onPress={() => handelSpeak()}>
              <Image
                source={require("../../assets/images/skill/Vector.png")}
                style={styles.headingImage}
              />
            </TouchableOpacity>
                    {
                lang == "English"? <Text style={styles.continueButtonText}>Continue</Text>: <Text style={styles.continueButtonText}>आगे</Text>
              }
                    
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F8F8',
        padding: 20,
    },
    footer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    backButton: {
        position: 'absolute',
        top: 50,
        left: 20,
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 4,
        zIndex: 1,
    },
    imageContainer: {
        marginBottom: 20,
        backgroundColor: '#efeff9',
        width: '120%',
        height: '50%',
        alignContent: 'center',
        justifyContent: 'center',
        marginTop: '0%',
        marginLeft: '-10%',
    },
    image: {
        marginTop: '25%',
        width: '100%',
        height: '70%',
        resizeMode: 'contain',
    },
    topheading: {
        fontSize: 24,
        alignItems: 'center',
        textAlign: 'center',
        color:"black",
        backgroundColor: '#efeff9',
        position:"relative",
        top:30
    }
    ,
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        alignItems: 'center',
        textAlign: 'center',
        color:"black",
        marginBottom:30
    },
    scrollView: {
        width: '100%',
    },
    optionsContainer: {
        display: 'flex',
        width: '100%',
    },
    optionRow: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    option: {
        borderColor: 'grey',
        borderWidth: 0.3,
        borderRadius: 8,
        height:70,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:"flex-start",
        width: '48%',
        backgroundColor: 'white',
        marginRight: 10,
        paddingLeft:5
    },
    optionText: {
        fontSize: 18,
        marginLeft: 10,
        color:"black"
    },
    continueButton: {
        backgroundColor: '#021F93',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 10,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    disabledButton: {
        backgroundColor: "#CCCCCC",
    },
    continueButtonText: {
        fontSize: 18,
        color: '#FFFFFF',
    },
    headingImage: {
      width: 30,
      height: 20,
      marginRight: 10,
      resizeMode: "contain",
      position: "absolute",
      right: -170,
      bottom: 20
    }
});
