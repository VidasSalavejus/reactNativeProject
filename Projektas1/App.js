import React, { Component } from 'react';
import { Text, View, Linking, TouchableHighlight, PermissionsAndroid, Platform, StyleSheet} from 'react-native';
import { CameraKitCameraScreen, } from 'react-native-camera-kit';
import firebase from 'firebase';

export default class App extends Component {

    componentWillMount(){
    var firebaseConfig = {
        apiKey: "AIzaSyDdd0-26qxOjKu_MUKtg6iiSmTf8k4GVYA",
        authDomain: "projektas1-7bd1a.firebaseapp.com",
        databaseURL: "https://projektas1-7bd1a.firebaseio.com",
        projectId: "projektas1-7bd1a",
        storageBucket: "projektas1-7bd1a.appspot.com",
        messagingSenderId: "537232051006",
        appId: "1:537232051006:web:5c875824eced25ea717a6f"
      };
      // Initialize Firebase
      firebase.initializeApp(firebaseConfig);
    }

  constructor() {
    super();
    this.state = {
      qrvalue: '',
      openScanner: false,
    };
  }
  onOpenlink() {

    firebase.database().ref('links').push({
        linkName: "" + this.state.qrvalue
    });
    Linking.openURL(this.state.qrvalue);

  }
  onBarcodeScan(qrvalue) {
    this.setState({ qrvalue: qrvalue });
    this.setState({ openScanner: false });
  }
  onOpenScanner() {
    var that = this;
    if(Platform.OS === 'android'){
      async function requestCameraPermission() {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,{
              'title': 'CameraExample App Camera Permission',
              'message': 'CameraExample App needs access to your camera '
            }
          )
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            that.setState({ qrvalue: '' });
            that.setState({ openScanner: true });
          } else {
            alert("CAMERA permission denied");
          }
        } catch (err) {
          alert("Camera permission err",err);
          console.warn(err);
        }
      }

      requestCameraPermission();
    }else{
      that.setState({ qrvalue: '' });
      that.setState({ openScanner: true });
    }
  }
  render() {
    let displayModal;
    if (!this.state.openScanner) {
      return (
        <View style={styles.container}>
            <Text style={styles.heading}>React Native QR Code Skaitytuvas</Text>
            <Text style={styles.simpleText}>{this.state.qrvalue ? 'Nuskenuotas QR kodas: '+this.state.qrvalue : ''}</Text>
            {this.state.qrvalue.includes("http") ?
              <TouchableHighlight
                onPress={() => this.onOpenlink()}
                style={styles.button}>
                  <Text style={{ color: '#FFFFFF', fontSize: 12 }}>Atidaryti nuoroda</Text>
              </TouchableHighlight>
              : null
            }
            <TouchableHighlight
              onPress={() => this.onOpenScanner()}
              style={styles.button}>
                <Text style={{ color: '#FFFFFF', fontSize: 12 }}>
                Atidaryti QR skaitytuva
                </Text>
            </TouchableHighlight>
        </View>
      );
    }
    return (
      <View style={{ flex: 1 }}>
        <CameraKitCameraScreen
          showFrame={true}
          scanBarcode={true}
          laserColor={'blue'}
          frameColor={'yellow'}
          colorForScannerFrame={'black'}
          onReadCode={event =>
            this.onBarcodeScan(event.nativeEvent.codeStringValue)
          }
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e2fbff'
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#005eae',
    padding: 10,
    width: 300,
    marginTop: 16
  },
  heading: {
    color: 'black',
    fontSize: 24,
    alignSelf: 'center',
    padding: 10,
    marginTop: 30
  },
  simpleText: {
    color: 'black',
    fontSize: 20,
    alignSelf: 'center',
    padding: 10,
    marginTop: 16
  }
});