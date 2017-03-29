import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ListView,
  Modal
} from 'react-native';

import firebase from './api/api.js';
export default class testFireBase extends Component {
  constructor(props){
    super(props);
    items=[];
    dung ={
      Username: '',
      Password: ''
    }
    this.state ={
      username: '',
      password: '',
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
      modalVisible: false,
    }

    database = firebase.database();
    user = database.ref('User');

  }
  setModalVisible() {
       if(this.state.modalVisible){
         this.setState({modalVisible: false});
       }else{
         this.setState({modalVisible: true});
       }
     }

  submit(){
    user.push({
      Username: this.state.username,
      Password: this.state.password
    })
  }

  componentWillMount(){
    database.ref('User').on('value', (snap)=>{
      items=[];
      snap.forEach((data)=>{
        items.push({
            key:data.key,
            data:data.val(),
        });
      });
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(items)
      })
    });

  }
  _remove(data){
    user.child(data.key).remove();
  }

  _edit(data){
    this.setModalVisible();
    this.setState({
      username1: data.data.Username,
      password1: data.data.Password,
      key1: data.key
    })
  }
  
  _Ok(){
        dung ={
          Username: this.state.username1,
          Password: this.state.password1
        };
      user.child(this.state.key1).update(dung);
      this.setModalVisible();
  }

  _renderRow(data){
    return(
      <View style={{paddingTop: 20, flexDirection:'row'}}>

        <View style={{flex:2}}>
          <Text>username: {data.data.Username}
          </Text>
          <Text>password: {data.data.Password}
          </Text>
        </View>

        <View style={{paddingLeft: 10, flex:1}}>
          <View >
            <TouchableOpacity onPress={()=>this._remove(data)}>
              <Text> remove
              </Text>
            </TouchableOpacity>
          </View>

          <View >
            <TouchableOpacity onPress={()=>this._edit(data)}>
              <Text> edit
              </Text>
            </TouchableOpacity>
          </View>

        </View>


        <Modal
        animationType="fade"
        transparent={true}
        visible={this.state.modalVisible}
        onRequestClose={()=>{alert("Modal has been closed.")}}
      >
        <TouchableOpacity activeOpacity={1}
              onPress={() => {
                    this.setModalVisible()
                  }}
              style={{backgroundColor: 'rgba(0,0,0,.8)',flex:1,justifyContent:'center',alignItems:'center'}} >

              <TouchableOpacity activeOpacity={1} style={{
          width:300,

          backgroundColor:'white',
        }}>

              <TextInput onChangeText={(val)=> this.setState({username1:val})} placeholder="username" value={this.state.username1} style={{width: null, height: 40}}/>
              <TextInput onChangeText={(val)=> this.setState({password1:val})} placeholder="password" value={this.state.password1} secureTextEntry={true} style={{width: null, height: 40}} />
              <TouchableOpacity onPress={()=>this._Ok()}>
                <Text>ok
                </Text>
              </TouchableOpacity>
        </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      </View>
    )
  }

  render() {
    return (
      <View style={{padding: 10}}>
        <View style={{alignItems:'center',paddingTop: 20, paddingBottom: 30,}}>
          <Text style={{ fontWeight:'bold'}}> TEST REACT NATIVE - FIREBASE
          </Text>
        </View>

        <TextInput onChangeText={(val)=> this.setState({username:val})} placeholder="username" style={{width: null, height: 40}}/>
        <TextInput onChangeText={(val)=> this.setState({password:val})} placeholder="password" secureTextEntry={true} style={{width: null, height: 40}}/>
        <View style={{alignItems:'center',paddingTop: 20, paddingBottom: 30,}}>
          <TouchableOpacity onPress={()=> this.submit()}>
            <Text>submit
            </Text>
          </TouchableOpacity>
        </View>
        <ListView
        style={{paddingTop: 30}}
        dataSource={this.state.dataSource}
        renderRow={this._renderRow.bind(this)}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({

});

AppRegistry.registerComponent('testFireBase', () => testFireBase);
