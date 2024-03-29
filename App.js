import React, { Component } from 'react';

// import react native gesture handler
import 'react-native-gesture-handler';
// import react Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
// import the components
import Start from './components/Start';
import Chat from './components/Chat';


const Stack = createStackNavigator();
export default class App extends Component {

  render () {
    const Stack = createStackNavigator();
    return (

      <NavigationContainer>
         <Stack.Navigator initialRouteName="Start">
           
            <Stack.Screen
              name="Start"
              component={Start}
            />
            <Stack.Screen
              name="Chat"
              component={Chat}
            />
         </Stack.Navigator>
      </NavigationContainer>
    );
  }
}


