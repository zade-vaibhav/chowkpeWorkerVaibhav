import React from "react";
import {
  StyleSheet,
  View,
  Image,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";

const { width, height } = Dimensions.get("window");

const data = [
  {
    text: "Skill bandana kaise seekhe?",
    imageSource: require("../../assets/images/Play.png"),
    vedioUrl:
      "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  },
  // {
  //   text: "⁠Payment kaise check krlein?",
  //   imageSource: require("../../assets/images/Play.png"),
  //   vedioUrl:
  //     "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  // },
  // {
  //   text: "⁠Bank account kaise add krein?",
  //   imageSource: require("../../assets/images/Play.png"),
  //   vedioUrl:
  //     "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  // },
  // {
  //   text: "Category add kaise karein?",
  //   imageSource: require("../../assets/images/Play.png"),
  //   vedioUrl:
  //     "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  // },
  // {
  //   text: "⁠Leader board kya hai?",
  //   imageSource: require("../../assets/images/Play.png"),
  //   vedioUrl:
  //     "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  // },
];

const AppSeekhoScreen = ({ navigation }) => {
  const handlePress = (text, vedioUrl) => {
    console.log(text, vedioUrl);
    navigation.navigate("Vedio",{ text, vedioUrl});
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.imageView}>
        <Image
          source={require("../../assets/images/Skill-1.png")}
          style={styles.image}
        />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {data.map((item, index) => (
          <TouchableOpacity
            style={styles.textImageRow}
            key={index}
            onPress={() => handlePress(item.text, item.vedioUrl)}
          >
            <Text style={styles.text}>{item.text}</Text>
            <Image source={item.imageSource} style={styles.rowImage} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    marginTop:30
  },
  imageView: {
    width: "100%",
    height: height * 0.3,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#EFEFF9",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 10,
  },
  textImageRow: {
    width: "100%",
    height: height * 0.08,
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    elevation: 2,
    marginVertical: 8,
    borderRadius:7
  },
  text: {
    fontSize: 16,
    flex: 1,
    color:"black"
  },
  rowImage: {
    width: 50,
    height: 50,
    marginLeft: 20,
  },
});

export default AppSeekhoScreen;