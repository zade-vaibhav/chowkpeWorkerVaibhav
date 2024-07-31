import * as React from 'react';
import { View, Text, Button, ToastAndroid, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { TransitionPresets, createStackNavigator } from '@react-navigation/stack';
import SplashScreen from './Screens/splashScreen';
import LanguageSelectScreen from './Screens/auth/Language';
import SignupLoginScreen from './Screens/auth/SignupLoginScreen';
import ReferralScreen from './Screens/Documents/ReferralScreen';
import SkillScreen from './Screens/Profile/SkillScreen';
import CreateProfileScreen from './Screens/Profile/CreateProfileScreen';
import BankDetailsScreen from './Screens/bankdetails/BankDetails';
import Welcome from './Screens/Welcome';
import Home from './Screens/TabNavigation/Home';
import BankAccountDetails from './Screens/TabNavigation/BankAccountDetails';
import EditBankAccountDetailPage from './Screens/TabNavigation/EditBankAccountDetailPage';
import MyDocumentsPage from './Screens/TabNavigation/MyDocumentPage';
import AppSeekhoScreen from './Screens/TabNavigation/AppSeekhoScreen';
// import VideoScreen from './Screens/TabNavigation/VideoScreen';
import OtpScreen from './Screens/auth/OtpScreenn';
import AdharUpload from './Screens/Documents/AdharUpload';
import DocumentUpload from './Screens/Documents/DocumentUpload';
import PanUpload from './Screens/Documents/PanUpload';
import DrivingUpload from './Screens/Documents/DrivingLicence';
import EditAdhar from './Screens/TabNavigation/EditAdhar';
import EditPan from './Screens/TabNavigation/EditPan';
import EditDriving from './Screens/TabNavigation/EditDriving';
import VideoScreen from './Screens/TabNavigation/VideoScreen';
import JobDetailsScreen from './Screens/JobDetails';
import Education from './Screens/Profile/Education';
// import Video from './Screens/TabNavigation/Video';



const Stack = createStackNavigator();

function App() {
  return (

    <NavigationContainer>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#021F93"
        translucent={true}
      />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          ...TransitionPresets.SlideFromRightIOS,
        }}
      >

        <Stack.Screen name="Onbord" component={SplashScreen} options={{ headerShown: false, ...TransitionPresets.DefaultTransition }} />
        <Stack.Screen
          name="LanguageSelect"
          component={LanguageSelectScreen}
          options={{ ...TransitionPresets.DefaultTransition }}
        />
        <Stack.Screen
          name="SignupLoginScreen"
          component={SignupLoginScreen}
          options={{ ...TransitionPresets.DefaultTransition }}
        />
        <Stack.Screen name="OtpNew" component={OtpScreen} />
        <Stack.Screen name="ReferralScreen" component={ReferralScreen} />
        <Stack.Screen name="SkillPage" component={SkillScreen} />
        <Stack.Screen
          name="CreatProileScreen"
          component={CreateProfileScreen}
        />
        <Stack.Screen name="DocumentUpload" component={DocumentUpload} />
        <Stack.Screen name="PanUpload" component={PanUpload} />
          <Stack.Screen name="DrivingLicence" component={DrivingUpload} />
        <Stack.Screen name="BankDetailPage" component={BankDetailsScreen} />
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="BankAccount" component={BankAccountDetails} />
        <Stack.Screen
          name="EditBankAccount"
          component={EditBankAccountDetailPage}
        />
        <Stack.Screen name="Seekho App" component={AppSeekhoScreen} />
        <Stack.Screen name="MyDocumentPage" component={MyDocumentsPage} />
        <Stack.Screen name="AadharUpload" component={AdharUpload} />
        <Stack.Screen name="EditAdhar" component={EditAdhar} />
        <Stack.Screen name="EditPan" component={EditPan} />
        <Stack.Screen name="EditDriving" component={EditDriving} />
        <Stack.Screen name="Vedio" component={VideoScreen} />
        <Stack.Screen name="JobDetail" component={JobDetailsScreen} />
        <Stack.Screen name="Education" component={Education} />
      </Stack.Navigator>

    </NavigationContainer>
  );
}

export default App;