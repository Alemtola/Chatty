import React, { Component } from 'react';
import { View, Text,  StyleSheet} from 'react-native';



export default class Chat extends Component {

  constructor(props){
    super()
  }
  // Set the page title once Chat is loaded
  componentDidMount() {
    let { name } = this.props.route.params
    // Adds the name to top of screen
    this.props.navigation.setOptions({ title: name })
  }

  render() {
    const { bgColor } = this.props.route.params;
    return (
      <View style={{
        flex: 1,
        alignItems:'center', 
        justifyContent:'center', 
        backgroundColor: bgColor ? bgColor : "#fff",}}>
        <Text style={styles.chatText}>Welcome to Chat Zone</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  chatText: {
    fontSize:24,
    fontWeight: '600',
    color: '#ffffff'
  },

});