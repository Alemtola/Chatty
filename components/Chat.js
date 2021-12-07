import React, { Component } from 'react';
import { 
  GiftedChat,  
  InputToolbar, 
  Bubble } from 'react-native-gifted-chat';

import { 
  View, 
  Text,  
  StyleSheet, 
  Platform, 
  KeyboardAvoidingView, 
  LogBox} from 'react-native';

import firebase from "firebase";
import "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from '@react-native-community/netinfo';

// firebase config for the app
const firebaseConfig = {
  apiKey: "AIzaSyDJDcNXNsCLCXMBTVWIQvXOWKDl0Pj1gcY",
  authDomain: "chatty-7382d.firebaseapp.com",
  projectId: "chatty-7382d",
  storageBucket: "chatty-7382d.appspot.com",
  messagingSenderId: "147096300648",
  appId: "1:147096300648:web:0c298e53b1e2699c0b9fdd",
  measurementId: "G-S4PWL1R1VW"
};

export default class Chat extends Component {

  constructor(props){
    super();
    this.state ={
      messages: [],
      uid: 0,
      user: {
        _id: "",
        name: "",
        avatar: "",
      },
      isConnected: false,
    };

    //initializing firebase
    if (!firebase.apps.length){
      firebase.initializeApp(firebaseConfig);
    }
    // reference to the Firestore message collection
    this.referenceChatMessages = firebase.firestore().collection("messages");
    this.refMsgsUser = null;

     // To remove warning message in the console 
     LogBox.ignoreLogs([
      'Setting a timer',
      'Warning: ...',
      'undefined',
      'Animated.event now requires a second argument for options',
    ]);

  }
  

  componentDidMount() {
    // Set the page title once Chat is loaded
    let { name } = this.props.route.params
    // Adds the name to top of screen
    this.props.navigation.setOptions({ title: name })

    // checks if user is online or offline
    NetInfo.fetch().then(connection => {
      //when user is online...
      if (connection.isConnected) {
        this.setState({ isConnected: true });
        console.log('online');

         // listens for updates in the collection
         this.unsubscribe = this.referenceChatMessages
         .orderBy("createdAt", "desc")
         .onSnapshot(this.onCollectionUpdate)

        // user authentication performed first
        this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
          if (!user) {
            return await firebase.auth().signInAnonymously();
          }
          //update user state with currently active user data
          this.setState({
            uid: user.uid,
            messages: [],
            user: {
              _id: user.uid,
              name: name,
              avatar: "https://placeimg.com/140/140/any",
            },
          });
          //referencing messages of current user
          this.refMsgsUser = firebase
            .firestore()
            .collection("messages")
            .where("uid", "==", this.state.uid);
        });
         //saving messages locally to asyncStorage
         this.saveMessages();
      } else {
        // when user is offline
        console.log('offline');
        this.setState({ isConnected: false });
        //get messages from asyncStorage
        this.getMessages();
      }
    });

  }


  // when updated set the messages state with the current data 
  onCollectionUpdate = (querySnapshot) => { 
    const messages = [];
    // go through each document
    querySnapshot.forEach((doc) => {
      // get the QueryDocumentSnapshot's data
      let data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: {
          _id: data.user._id,
          name: data.user.name,
          avatar: data.user.avatar
        }
      });
    });
    this.setState({
      messages: messages
    });
  };

  componentWillUnmount() {
    //unsubscribe from collection updates
    this.authUnsubscribe();
    this.unsubscribe();

  }

  // to read a messgae from async storage
  async getMessages() {
    let messages = '';
    try {
      messages = await AsyncStorage.getItem('messages') || [];
      this.setState({
        messages: JSON.parse(messages)
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  // to save a messgae on async storage
  async saveMessages() {
    try {
      await AsyncStorage.setItem(
        'messages', 
        JSON.stringify(this.state.messages)
      );
    } catch (error) {
    console.log(error.message);
    }
  }

  // to delete a message from async storage
  async deleteMessages() {
    try {
      await AsyncStorage.removeItem('messages');
      this.setState({
        messages: []
      })
    } catch (error) {
      console.log(error.message);
    }
  }

  // Add messages to database
  addMessages() { 
    const message = this.state.messages[0];
    // add a new messages to the collection
    this.referenceChatMessages.add({
      _id: message._id,
      text: message.text || "",
      createdAt: message.createdAt,
      user: this.state.user
    });
  }


  // calback function for when user sends a message
  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }), () => {
      this.addMessages();
      this.saveMessages();
    })
  }

  // Customize the chat bubble background color
  renderBubble(props) { 
    return (
      <Bubble {...props} 
      wrapperStyle={{ 
        right: {backgroundColor: '#59c3c3'},
       }}
      />
    )
  }

  // renders the chat input field toolbar only when user is online
  renderInputToolbar(props) {
    if (this.state.isConnected == false) {
    } else {
      return(
        <InputToolbar {...props}/>
      );
    }
  }

  render() {
    // Set the background color selected from start screen
    const { bgColor } = this.props.route.params;
    return (
     
      <View style={{
        flex: 1,
        alignItems:'center', 
        justifyContent:'center', 
        backgroundColor: bgColor ? bgColor : "#fff",}}>
        <View style={styles.giftedChat}>
           <GiftedChat
              renderBubble={this.renderBubble.bind(this)}
              renderInputToolbar={this.renderInputToolbar.bind(this)}
              messages={this.state.messages}
              onSend={messages => this.onSend(messages)}
              user={{
                _id: this.state.user._id,
                name: this.state.name,
                avatar: this.state.user.avatar
              }}
            />
            { Platform.OS === 'android' ? (
              <KeyboardAvoidingView behavior="height" />
              ) : null}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems:'center', 
    justifyContent:'center'
  },
  giftedChat: {
    flex: 1,
    width: "88%",
    paddingBottom: 10,
    justifyContent: "center",
  },

});