import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import { VictoryLine, VictoryChart, VictoryTheme, VictoryGroup } from "victory-native";

const ModifyDataBuffer = (buffer, newData) => {
  buffer.shift(); // get rid of the oldest data in the array
  buffer.push(newData); // add the newest data to the array
  return buffer;
}

export default function App() {
  const [data, setData] = useState({x:0, y:0, z:0});
  const [dataBuffer, setDataBuffer] = useState(Array(120).fill(1));
  const [a, setA] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => { _subscribe(); }, []);
  useEffect(() => {
    const timer = setInterval(() => { setSeconds(seconds => seconds + 1); }, 1000);
    return () => clearInterval(timer);
  }, []);

  const _subscribe = () => {
    this._subscription = Accelerometer.addListener(accelerometerData => {
      setData(accelerometerData);
      let { x, y, z } = accelerometerData;
      let b = Math.sqrt((x*x)+(y*y)+(z*z));
      setA(b);   
      setDataBuffer(ModifyDataBuffer(dataBuffer, b));
    });
  };
  
  let { x, y, z } = data;
  x = Math.round(x * 100) / 100;
  y = Math.round(y * 100) / 100;
  z = Math.round(z * 100) / 100;

  return (
    <View style={styles.container}>
      <Text style={{fontSize: 40}}>{seconds}</Text>
      <Text style={{fontSize: 40}}>{(a-1).toFixed(2)}</Text>
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