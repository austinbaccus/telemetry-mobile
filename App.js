import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import { VictoryLine, VictoryChart, VictoryTheme, VictoryGroup } from "victory-native";

export default function App() {
  const [data, setData] = useState({x:0, y:1, z:2});
  const [dataBuffer, setDataBuffer] = useState([0]);

  useEffect(() => {
    _subscribe();
  }, []);

  const _subscribe = () => {
    this._subscription = Accelerometer.addListener(accelerometerData => {
      setData(accelerometerData);
    });
    // update telemetry buffer
    let a = Math.sqrt((x*x)+(y*y)+(z*z)); // 'a' represents the total magnitude of the phone's acceleration on all three axis
    // add 'a' to the front of the buffer
    dataBuffer.push(a);
    // if the buffer has more than N things in it, remove the items at the front of the list (the oldest items) until we have only N items in the buffer
    if (dataBuffer.length > 60)
    {
      let b = 0;
      // test
    }
  };
  
  let { x, y, z } = data;

  x = Math.round(x * 100) / 100;
  y = Math.round(y * 100) / 100;
  z = Math.round(z * 100) / 100;

  const accelData = [
    { x: 1, y: 13000 },
    { x: 2, y: 16500 },
    { x: 3, y: 14250 },
    { x: 4, y: 19000 }
  ];

  return (
    <View style={styles.container}>
      <Text>x: {x}</Text>
      <Text>y: {y}</Text>
      <Text>z: {z}</Text>

      <VictoryGroup>
        <VictoryLine data={accelData}/>
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