import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {WebView} from 'react-native-webview';

const Video = ({route}) => {
  const {text, vedioUrl} = route.params;

  console.log('Text:', text);
  console.log('Video URL:', vedioUrl);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{text}</Text>
      <WebView
        style={styles.video}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        mediaPlaybackRequiresUserAction={false} // Allow autoplay
        source={{
          html: `
            <html>
              <body style="margin: 0; padding: 0; overflow: hidden;">
                <video id="video" width="100%" height="100%" controls autoplay>
                  <source src="${vedioUrl}" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <script>
                  document.getElementById('video').play().catch((error) => {
                    console.log('Video playback error:', error);
                  });
                </script>
              </body>
            </html>
          `,
        }}
        onError={event => {
          console.log('WebView error: ', event.nativeEvent);
        }}
        onLoad={() => {
          console.log('WebView loaded');
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  title: {
    color: '#fff',
    fontSize: 20,
    marginBottom: 20,
  },
  video: {
    width: '100%',
    height: '70%', // Adjust the height as needed
  },
});

export default Video;