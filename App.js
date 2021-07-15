import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import { VictoryLine, VictoryGroup } from "victory-native";
import axios from "axios";

const ModifyDataBuffer = (buffer, newData) => {
  buffer.shift(); // get rid of the oldest data in the array
  buffer.push(newData); // add the newest data to the array
  return buffer;
}

const SendDataBufferToDatabase = async (buffer, destination) => {
  var payload = {
    name:'Austin',
    data: buffer
  };
  axios.post(destination, payload)
}

export default function App() {
  const [dataBuffer, setDataBuffer] = useState(Array(120).fill(1));
  const [totalAcceleration, setTotalAcceleration] = useState(0);

  useEffect(() => {
    // send the current buffer to the database every 30 seconds
    const timer = setInterval(() => { SendDataBufferToDatabase(dataBuffer, 'someConnectionString'); }, 30000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => { _subscribe(); }, []);

  const _subscribe = () => {
    this._subscription = Accelerometer.addListener(accelerometerData => {
      let { x, y, z } = accelerometerData;
      let totalG = Math.sqrt((x*x)+(y*y)+(z*z));
      setTotalAcceleration(totalG);   
      setDataBuffer(ModifyDataBuffer(dataBuffer, totalG));
    });
  };

  return (
    <View style={styles.container}>
      <Text style={{fontSize: 40}}>{(totalAcceleration-1).toFixed(2)}</Text>
      <Text style={{fontSize: 30}}>acceleration (g)</Text>
      <VictoryGroup>
        <VictoryLine data={dataBuffer}/>
      </VictoryGroup>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffd404',
    alignItems: 'center',
    justifyContent: 'center',
  },
});