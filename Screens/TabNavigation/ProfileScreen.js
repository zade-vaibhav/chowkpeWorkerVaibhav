
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Modal,Pressable, FlatList, Alert, ActivityIndicator,Linking} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const categoryOptions = [
  { id: 1, name: 'Cleaner' },
  { id: 2, name: 'Picker' },
  { id: 3, name: 'Shipping' },
  { id: 4, name: 'Forklift Operator' },
];

const ProfileScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userProfile, setUserProfile] = useState({});
  const [lang, setLang] = useState("English")
  const [isDeleting,setISDeleting] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState("+917387732902");
  const [whatsappNumber, setWhatsappNumber] = useState("+917387732902");

  const openWhatsApp = () => {
    const formattedNumber = whatsappNumber.startsWith('+') ? whatsappNumber : `+${whatsappNumber}`;
    const url = `whatsapp://send?phone=${formattedNumber}`;
  
    Linking.openURL(url)
      .then((supported) => {
        if (!supported) {
          Alert.alert("Error", "WhatsApp is not installed on your device or the provided phone number is incorrect");
        }
      })
      .catch((err) => console.error("An error occurred", err));
  };

  const dialCall = () => {
    let phoneNumberURL = `tel:${phoneNumber}`;
    Linking.canOpenURL(phoneNumberURL)
      .then((supported) => {
        if (!supported) {
          Alert.alert("Error", "Dial pad cannot be opened on this device");
        } else {
          return Linking.openURL(phoneNumberURL);
        }
      })
      .catch((err) => console.error("An error occurred", err));
  };


  useEffect(() => {
    async function getUserData() {
      setIsLoading(true);
      const token = await AsyncStorage.getItem('uid');
      try {
        const response = await fetch(
          'https://chowkpe-server.onrender.com/api/v1/auth/getAllData',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (data.success) {
          setIsLoading(false);
          setUserProfile(data.user);
          setSelectedCategories(data.user.profile.skills.map(skill => ({ name: skill })));
        } else {
          setIsLoading(false);
          Alert.alert(data.message);
        }
      } catch (error) {
        setIsLoading(false);
        Alert.alert('Error', 'Failed to fetch user data.');
        console.log(error);
      }
    }
    getUserData();
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


  // Function to toggle selection of a category
  const toggleCategory = (category) => {
    const isSelected = selectedCategories.some((item) => item.name === category.name);
    if (isSelected) {
      setSelectedCategories(selectedCategories.filter((item) => item.name !== category.name));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const renderCategoryOption = ({ item }) => {
    const isSelected = selectedCategories.some((selected) => selected.name === item.name);
    return (
      <TouchableOpacity
        style={[styles.categoryOptionItem, isSelected && styles.selectedCategoryOptionItem]}
        onPress={() => toggleCategory(item)}
      >
        <Text style={styles.categoryOptionText}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  const saveSelectedCategories = () => {
    setModalVisible(false);
    // Additional logic to save selected categories if needed
  };

  const getRandomLightColor = () => {
    const getLightColorComponent = () => Math.floor(Math.random() * 156) + 100; // ensures the value is between 100 and 255
    const r = getLightColorComponent();
    const g = getLightColorComponent();
    const b = getLightColorComponent();
    return `rgb(${r}, ${g}, ${b})`;
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Are you sure?',
      'Do you really want to delete your account?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            setISDeleting(true)
            const token = await AsyncStorage.getItem("uid")
            console.log(token)
            try {
              const responce = await fetch("https://chowkpe-server.onrender.com/api/v1/auth/deleteUser", {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + token
                }
              })

              const data =await responce.json();
              console.log(data)
              if(data.success === true){
                  await AsyncStorage.removeItem("uid");
                  await AsyncStorage.removeItem("name");
                  setISDeleting(false)
                  Alert.alert(data.message);
                  navigation.replace("SignupLoginScreen")
              }else{
                setISDeleting(false)
                Alert.alert(data.message);
              }

            } catch (err) {
              setISDeleting(false)
              console.log(err.message)
            }
          },
          style: 'destructive',
        },
      ],
      { cancelable: false }
    );
  };

  const renderSelectedCategories = () => {
    return (
      <View style={styles.selectedCategoriesContainer}>
        {selectedCategories.map((category, index) => (
          <View key={index} style={[styles.selectedCategory, { backgroundColor: `${getRandomLightColor()}` }]}>
            <Text style={styles.selectedCategoryText}>{category.name}</Text>
            <TouchableOpacity
              style={styles.deleteCategoryButton}
              onPress={() => setSelectedCategories(selectedCategories.filter((item) => item.name !== category.name))}
            >
              <Icon name="times-circle" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileHeader}>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{userProfile?.profile?.name}</Text>
          <Text style={styles.profileDetails}>{userProfile?.mobile_number}</Text>
          <View style={styles.detailsRow}>
            <View style={styles.detailItem}>
              {lang === 'English' ? (
                <Text style={styles.detailTitle}>Code</Text>
              ) : (
                <Text style={styles.detailTitle}>कोड</Text>
              )}

              <Text style={styles.detailValues}>{userProfile?.profile?.uniqueCode}</Text>
            </View>
            <View style={styles.detailItem}>
              {lang === 'English' ? (
                <Text style={styles.detailTitle}>Skill Level</Text>
              ) : (
                <Text style={styles.detailTitle}>कौशल स्तर</Text>
              )}

              <Text style={styles.detailValues}>Beginner</Text>
            </View>
            <View style={styles.detailItem}>
              {lang === 'English' ? (
                <Text style={styles.detailTitle}>Rating</Text>
              ) : (
                <Text style={styles.detailTitle}>रेटिंग</Text>
              )}

              <View style={styles.rating}>
                <Icon name="star" size={20} color="#FFD700" />
                <Icon name="star" size={20} color="#FFD700" />
                <Icon name="star" size={20} color="#FFD700" />
                <Icon name="star" size={20} color="#FFD700" />
                <Icon name="star-o" size={20} color="#FFD700" />
              </View>
            </View>
          </View>
        </View>
        <View style={styles.profileImageContainer}>
          <Image
            source={require("../../assets/images/user/user_1.jpg")}
            style={styles.profileImage}
          />
          <Text style={styles.verified}>✔ Verified</Text>
        </View>
      </View>
     
      <View style={styles.section2}>
        <TouchableOpacity style={styles.option} onPress={() => navigation.navigate("BankAccount")}>
          <Icon name="bank" size={30} color="#2254e0" />
          {lang === 'English' ? (
            <Text style={styles.optionText}>Bank Details</Text>
          ) : (
            <Text style={styles.optionText}>बैंक विवरण</Text>
          )}

        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={() => navigation.navigate("MyDocumentPage")}>
          <Icon name="user" size={30} color="#2254e0" />
          {lang === 'English' ? (
            <Text style={styles.optionText}>Account</Text>
          ) : (
            <Text style={styles.optionText}>खाता</Text>
          )}

        </TouchableOpacity>
        <TouchableOpacity style={styles.option}>
          <Icon name="credit-card" size={30} color="#2254e0" />
          {lang === 'English' ? (
            <Text style={styles.optionText}>Payment</Text>
          ) : (
            <Text style={styles.optionText}>भुगतान</Text>
          )}

        </TouchableOpacity>
      </View>

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
          <Pressable
          onPress={openWhatsApp}>
          <Image
            source={require('../../assets/images/whatsapp.png')}
            style={styles.captainIcons}
            
          />
          </Pressable>
          <Pressable  onPress={dialCall}>
          <Image
            source={require('../../assets/images/phone.png')}
            style={styles.captainIcons}
           
          />
          </Pressable>
        </View>
        <View>

        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.jobHistory}>
          <Text style={styles.jobTitle}>
            {lang === 'English' ? 'Job History' : 'नौकरी का इतिहास'}
          </Text>

          <View style={styles.totalJobsContainer}>
            <Text style={styles.totalJobsText}>
              {lang === 'English' ? 'Total Numbers Of Jobs' : 'कुल नौकरियों की संख्या'}
            </Text>

            <Text style={styles.totalJobsValue}>0</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.categoryHeader}>
          {lang === 'English' ? (
            <Text style={styles.jobTitle}>Category</Text>
          ) : (
            <Text style={styles.jobTitle}>श्रेणी</Text>
          )}
          <TouchableOpacity style={styles.editButton} onPress={() => setModalVisible(true)}>
            {lang === 'English' ? (
              <Text style={styles.editButtonText}>Add+</Text>
            ) : (
              <Text style={styles.editButtonText}>जोड़ें+</Text>
            )}

          </TouchableOpacity>
        </View>
        <View style={styles.categoryImages}>
          {renderSelectedCategories()}
        </View>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {lang === 'English' ? 'Select Categories' : 'श्रेणियाँ चुनें'}
            </Text>

            <FlatList
              data={categoryOptions}
              renderItem={renderCategoryOption}
              keyExtractor={(item) => item.id.toString()}
              extraData={selectedCategories}
            />
            <TouchableOpacity style={styles.saveButton} onPress={saveSelectedCategories}>
              <Text style={styles.saveButtonText}>
                {lang === 'English' ? 'Save Changes' : 'बदलाव सहेजें'}
              </Text>

            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <View style={styles.section4}>
      {lang === 'English' ?  <Text style={{color:"black",textAlign:"center",fontSize:16,marginBottom:10}}>Delete your account</Text>: <Text style={{color:"black",textAlign:"center",fontSize:16,marginBottom:10}}>अपने खाते को नष्ट करो</Text>}
       
      {
          isDeleting?<TouchableOpacity style={styles.deleteButton} >
         <ActivityIndicator size="small" color="#fff" />
        </TouchableOpacity>:<TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
          {
            lang === 'English' ?<Text style={styles.deleteButtonText}>Delete Account</Text>:<Text style={styles.deleteButtonText}>अपना खाता हटाएं</Text>
          } 
        </TouchableOpacity>
        }
      </View>
      
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#efeff9',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#efeff9',
    marginBottom: 10,
    marginTop: 30,
  },
  profileInfo: {
    flex: 1,
    marginRight: 10,
  },
  profileImageContainer: {
    alignItems: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: "black"
  },
  profileDetails: {
    fontSize: 16,
    color: '#666',
    marginTop: 2,
    marginBottom: 10,
    color: "black"
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  detailItem: {
    flex: 1,
    alignItems: 'flex-start',
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: "black"
  },
  detailValue: {
    fontSize: 13,
    color: '#666',
  },
  detailValues: {
    fontSize: 14,
    color: '#666',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  verified: {
    fontSize: 16,
    color: 'green',
    marginTop: 10,
  },
  section: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 10,
  },
  section4:{
    backgroundColor: '#fff',
    padding: 20,
  },
  section2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 25,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  option: {
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#f7f8fd', // Example background color
    paddingVertical: 20,
    paddingHorizontal: 6,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 5, // Space between each option box
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  optionText: {
    fontSize: 16,
    marginTop: 20,
    fontWeight: "700",
    textAlign: 'center',
    color: "black",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: "black"
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
  jobTitle: {
    fontSize: 19,
    fontWeight: '600',
    marginBottom: 10,
    color: "black"
  },
  jobHistory: {
    marginBottom: 10,
  },
  totalJobsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginTop: 5,
    borderWidth: 0.5,  // Adding border width
    borderColor: '#ddd',
  },
  totalJobsText: {
    fontSize: 16,
    fontWeight: '400',
    marginRight: 10,
    color: "black"
  },
  totalJobsValue: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'right',
    flex: 1,
    color: "black"
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  categoryImages: {
    marginBottom: 10,
  },
  imageContainer: {
    flexDirection: 'row',
  },
  categoryImage: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  editButton: {
    padding: 3,
    paddingHorizontal: 10,
    backgroundColor: "#9A9DFF",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,

  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 14,
    color: '#000',
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: "black"
  },
  categoryOptionItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    color: "black"
  },
  selectedCategoryOptionItem: {
    backgroundColor: '#f0f0f0',
  },
  categoryOptionText: {
    fontSize: 18,
    textAlign: 'center',
    color: "gray"
  },
  saveButton: {
    backgroundColor: '#9A9DFF',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  // Selected categories styles
  selectedCategoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  selectedCategory: {
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: '#2254e0',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  selectedCategoryText: {
    marginRight: 8,
    fontSize: 16,
    fontWeight: "600",
    color: '#000',

  },
  deleteCategoryButton: {
    marginLeft: 8,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal:20
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
