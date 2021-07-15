import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import { VictoryLine, VictoryChart, VictoryTheme, VictoryGroup } from "victory-native";

const ModifyDataBuffer = (buffer, newData) => {
  buffer.shift(); // get rid of the oldest data in the array
  buffer.push(newData); // add the newest data to the array
  return buffer;
}

const mongoose = require('mongoose');
var client = mongoose.connect(
  'mongodb://dbadmin:jenkins123@jenkins-database-sandbox.cluster-cvt6y767htpf.us-east-1.docdb.amazonaws.com:27031/?ssl=true&ssl_ca_certs=rds-combined-ca-bundle.pem&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false',
  {
    tlsCAFile: `rds-combined-ca-bundle.pem` // Specify the DocDB; cert
  },
  function(err, client) {
    if (err) throw err;

    // Specify the database to be used
    db = client.db('sample-database');

    // Specify the collection to be used
    col = db.collection('sample-collection');

    // Insert a single document
    col.insertOne({'hello':'Amazon DocumentDB'}, function(err, result){
      //Find the document that was previously written
      col.findOne({'hello':'DocDB;'}, function(err, result){
        //Print the result to the screen
        console.log(result);

        //Close the connection
        client.close()
      });
    });
});

export default function App() {
  const [data, setData] = useState({x:0, y:0, z:0});
  const [dataBuffer, setDataBuffer] = useState(Array(120).fill(1));
  const [a, setA] = useState(0);
  const [count, setCount] = useState(0);

  function counter() {
    const incrementClock = () => {
      setCount(count+3);
    };
    setInterval(incrementClock, 1000);
    incrementClock();
  }

  useEffect(() => { _subscribe(); }, []);
  useEffect(() => { counter(); }, []);

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
      <Text style={{fontSize: 40}}>{count}</Text>
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