import React, {useState,useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {useNavigation} from '@react-navigation/native';
import {Border, Color, FontFamily, FontSize} from '../Documents/GlobalStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EditDriving = () => {
  const [fileUri, setFileUri] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lang, setLang] = useState("English")
  const navigation = useNavigation();
  console.log('file', fileUri);

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

  const handleChooseFile = async side => {
    Alert.alert(
      'Upload Document',
      'Choose an option',
      [
        {
          text: 'Take Photo',
          onPress: async () => {
            const result = await launchCamera({mediaType: 'photo'});
            if (!result.didCancel && result.assets) {
              setFileUri(prevState => ({
                ...prevState,
                [side]: result.assets[0],
              }));
            }
          },
        },
        {
          text: 'Choose from Library',
          onPress: async () => {
            try {
              const result = await DocumentPicker.pick({
                type: [DocumentPicker.types.images, DocumentPicker.types.pdf],
              });
              setFileUri(prevState => ({
                ...prevState,
                [side]: result[0],
              }));
            } catch (err) {
              if (DocumentPicker.isCancel(err)) {
                console.log('User cancelled the picker');
              } else {
                throw err;
              }
            }
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      {cancelable: true},
    );
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    if (!fileUri?.back?.uri) {
      Alert.alert('Please upload your Driving-License');
      setIsLoading(false);
      return;
    }
    try {
      const token = await AsyncStorage.getItem('uid');
      const formData = new FormData();

      formData.append('drivingLicence', {
        uri: fileUri.back.uri,
        type: fileUri.back.mimeType || fileUri.back.type || 'application/pdf',
        name: fileUri.back.fileName || fileUri.back.name,
      });

      const response = await fetch(
        'https://chowkpe-server.onrender.com/api/v1/auth/upload',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
          body: formData,
        },
      );

      if (!response.ok) {
        setIsLoading(false);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setIsLoading(false);
      const result = await response.json();
      navigation.navigate('MyDocumentPage');
    } catch (error) {
      setIsLoading(false);
      console.error('Error: ', error);
    }
  };
  console.log(fileUri);
  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#6a51ae"
        translucent={true}
      />
      <View style={styles.topSection}>
      <Text style={styles.heading}>
          {lang == "English" ? "Create Your Profile" : "अपनी प्रोफ़ाइल बनाएं"}
        </Text>
        <View style={styles.horizontalLineContainer}>
          <View style={styles.completedLine} />
          <View style={styles.remainingLine} />
          <Image
            source={require('../../assets/images/Layer_1.png')}
            style={[styles.iconImage, styles.iconLeft]}
          />
          <Image
            source={require('../../assets/images/Frame (1).png')}
            style={[styles.iconImage, styles.iconRight]}
          />
        </View>
        <View style={styles.profileImageContainer}>
          <Image
            source={require('../Documents/driving-license.png')}
            style={styles.topImage}
          />
        </View>
      </View>

      <View style={styles.content}>
      <Text style={styles.uploadTitle}>
  {lang === 'English' ? 'Upload your driving license' : 'अपना ड्राइविंग लाइसेंस अपलोड करें'}
</Text>
<Text style={styles.instructions}>
  {lang === 'English' ? 'In the next screen, you need to take a photo of your driving license.' : 'अगले स्क्रीन में, आपको अपने ड्राइविंग लाइसेंस की फोटो लेनी होगी।'}
</Text>
        <View style={styles.textContainer}>
          <View style={styles.textWithIcon}>
            <Image
              source={require('../Documents/document.png')}
              style={styles.icon}
            />
           <Text style={styles.safeText}>
              {lang === 'English' ? 'Name, driving license & DOB should be clearly visible.' : 'नाम, ड्राइविंग लाइसेंस और जन्म तिथि स्पष्ट दिखनी चाहिए।'}
            </Text>
          </View>
          <View style={styles.textWithIcon}>
            <Image
              source={require('../Documents/document.png')}
              style={styles.icon}
            />
            <Text style={styles.safeText}>
              {lang === 'English' ? 'Make sure you’re uploading your driving license. Don’t upload someone else’s driving license.' : 'यह सुनिश्चित करें कि आप अपना ड्राइविंग लाइसेंस अपलोड कर रहे हैं। किसी और का ड्राइविंग लाइसेंस अपलोड न करें।'}
            </Text>
          </View>
          <View style={styles.textWithIcon}>
            <Image
              source={require('../Documents/document.png')}
              style={styles.icon}
            />
            <Text style={styles.safeText}>
              {lang === 'English' ? '100% Safe' : '100% सुरक्षित'}
            </Text>
          </View>
        </View>
        <View style={{width: '100%', alignItems: 'center'}}>
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={() => handleChooseFile('back')}>
            <Text style={styles.uploadButtonText}>
              Click here to{'\n'}Upload driving-license image
            </Text>
            {fileUri?.back?.uri && (
              <Image
                source={{uri: fileUri.back.uri}}
                style={styles.previewImage}
              />
            )}
            <View style={styles.iconContainer}>
              <Image
                style={styles.uploadIcon}
                source={require('../Documents/upload.png')}
              />
            </View>
          </TouchableOpacity>
        </View>
        <Text style={styles.fileTypeText}> {lang === 'English' ? 'File Should be in PDF, JPG' : 'फ़ाइल PDF, JPG में होनी चाहिए'}</Text>
      </View>

      {isLoading ? (
        <TouchableOpacity style={styles.submitButton}>
          <ActivityIndicator size="small" color="white" />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>{lang === 'English' ? 'Submit' : 'सबमिट'}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.colorWhite,
    padding: 16,
  },
  imageBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: Color.black2,
    textAlign: 'center',
    fontFamily: FontFamily.poppinsMedium,
    fontWeight: '700',
    fontSize: 18,
    marginBottom: 0, // Remove the bottom margin
    marginTop: 70,
  },
  upperImage: {
    width: 250,
    resizeMode: 'contain',
    marginBottom: 0, // Remove the bottom margin
    marginTop: -20, // Remove the top margin
  },
  topSection: {
    height: 300,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#EFEFF9',
    paddingTop: 20,
    width: '100%',
  },
  topImage: {
    width: 200,
    height: 250,
    resizeMode: 'contain',
    marginBottom: 0, // Remove the bottom margin
    marginTop: -60, // Remove the top margin
  },
  content: {
    flex: 1,
    alignItems: 'center',
  },
  uploadTitle: {
    color: Color.colorDarkslategray,
    textAlign: 'center',
    fontSize: 16,
    fontFamily: FontFamily.poppinsMedium,
    fontWeight: '800',
    marginVertical: 8,
  },
  instructions: {
    color: '#888',
    fontFamily: FontFamily.robotoRegular,
    lineHeight: 20,
    fontSize: FontSize.size_xs,
    textAlign: 'center',
    marginBottom: 18,
  },
  textContainer: {
    alignItems: 'flex-start',
    width: '100%',
    paddingHorizontal: 20,
  },
  textWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  icon: {
    width: 20,
    height: 20,
    resizeMode: 'contain', // Ensure the icon fits within its bounds
    marginRight: 8,
  },
  safeText: {
    color: Color.colorDarkslategray,
    fontFamily: FontFamily.robotoRegular,
    lineHeight: 20,
    fontSize: 13,
  },
  uploadButton: {
    borderWidth: 1,
    borderColor: '#b6bce8',
    borderRadius: 8,
    padding: 6,
    alignItems: 'center',
    marginVertical: 10, // Adjusted for spacing
    marginHorizontal: 10,
    width: '75%',
  },
  uploadButtonText: {
    color: '#2254e0',
    fontFamily: FontFamily.poppinsRegular,
    fontSize: FontSize.size_sm,
    textAlign: 'center',
    marginTop: 10,
    fontSize: 10,
  },
  iconContainer: {
    width: 48,
    height: 46,
    backgroundColor: '#dee2fc',
    opacity: 0.5,
    borderRadius: Border.br_9xs,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  uploadIcon: {
    width: 19,
    height: 19,
  },
  fileTypeText: {
    color: Color.colorDarkgray,
    fontFamily: FontFamily.robotoRegular,
    fontSize: FontSize.size_3xs,
    textAlign: 'center',
  },
  previewImage: {
    width: 100,
    height: 80,
    marginTop: 5,
    resizeMode: 'contain',
  },
  submitButton: {
    backgroundColor: '#021F93',
    borderRadius: Border.br_9xs,
    padding: 15,
    alignItems: 'center',
    marginTop: 60,
  },
  submitButtonText: {
    color: Color.colorWhite,
    textAlign: 'center',
    fontFamily: FontFamily.poppinsMedium,
    fontWeight: '600',
    fontSize: FontSize.size_base,
  },
  heading: {
    fontSize: 22,
    fontWeight: '400',
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 50,
    color: 'black',
  },
  horizontalLineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '60%',
    marginBottom: 20,
    justifyContent: 'space-between',
    height: 5,
  },
  completedLine: {
    height: 3,
    backgroundColor: '#007BFF',
    width: '65%', // 65% width to represent progress bar at 65%
  },
  remainingLine: {
    position: 'absolute',
    left: '65%',
    height: 3,
    backgroundColor: '#CCCCCC',
    width: '25%', // remaining 25% in gray
  },
  iconImage: {
    width: 40,
    height: 35,
    resizeMode: 'contain',
  },
  iconLeft: {
    position: 'absolute',
    left: '55%', // 65% from left to position it at 65% of the horizontal line
    bottom: 5,
  },
  iconRight: {
    position: 'absolute',
    left: '80%',
    bottom: 0,
  },
  profileImageContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
});

export default EditDriving;