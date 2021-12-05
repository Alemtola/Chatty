import React, { Component } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import { View, Text,  StyleSheet, Platform, KeyboardAvoidingView} from 'react-native';
import firebase from "firebase";
import "firebase/firestore";


export default class Chat extends Component {

  constructor(props){
    super();
    this.state ={
      messages: [],
    }
  }
  
  componentDidMount() {
    // display static message
    this.setState({
      messages: [
        {
          _id: 1,
          text: 'Hello developer',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
          },
        },
      ],
    })

    // Set the page title once Chat is loaded
    let { name } = this.props.route.params
    // Adds the name to top of screen
    this.props.navigation.setOptions({ title: name })
    
  }

  // calback function for when user sends a message
  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
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
              messages={this.state.messages}
              onSend={messages => this.onSend(messages)}
              user={{
                _id: 1,
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