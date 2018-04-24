import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableHighlight, ScrollView} from 'react-native';
import t from 'tcomb-form-native'; 
import CameraRollCopy from './components/CameraRollCopy';

const Form = t.form.Form;

var form_options = {
  fields: {
    residence: {
      label: "Address", 
      placeholder: "Please be precise.",
    }
  }
};

const User = t.struct({
  firstName: t.String,
  lastName: t.String,
  residence: t.String,
  phone: t.String,
  email: t.String,
});

export default class App extends Component {
  
  handleSubmit = () => {
  const value = this._form.getValue(); 
  console.log('value: ', value);
  }
  
  render() {
    
    return (

   <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.paragraph}>
          Sign up!
        </Text>
      </View>
      
      <View style={styles.imagepicker}>
        <CameraRollCopy /> 
      </View>

      <View style={styles.form}>
      
        <Form type= {User} options={form_options} style={styles.form} ref={c => this._form = c} /> 
        
        <TouchableHighlight style={styles.button} onPress={this.handleSubmit} underlayColor='#99d9f4'>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableHighlight>
        
      </View>
    </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
  },
  
  imagepicker: {
    padding: 50,
    flex: 1,
    
  },
  
  header: {
    backgroundColor: '#48BBEC',
    height: 120,
    fontWeight: 'bold',
    alignItems: 'center',
    justifyContent: 'left',
  },
  
    form: {
    justifyContent: 'center',
    marginTop: 0,
    padding: 30,
    backgroundColor: '#ffffff',
  },
  
  paragraph: {
    margin: 52,
    fontSize: 25,
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FBFBFB',
  },
  
    buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
  },
  
  button: {
    height: 36,
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  }
  
});
