import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Card, Text, Image } from '@rneui/themed';
import { ScrollView, Dimensions, FlatList } from 'react-native';
import React, { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { Response } from './HomeScreen';

const SCREEN_WIDTH = Dimensions.get("screen").width;
const SCREEN_HEIGHT = Dimensions.get("screen").height;

export default function DetailScreen({ route, navigation }: NativeStackScreenProps<{
  home: undefined,
  detail: { id: number },
}, 'detail'>) {

  const [data, setData] = useState({} as Response);
  const id = route.params?.id;
  const getData = useCallback(async () => {
    try {
      if (!!id) {
        const response = await axios.get(`https://dummyjson.com/products/${id}`);
        setData(response.data);
      }
    } catch (error) {
     console.error(error);
    }
  },[id]);

  useEffect(() => { getData() }, [id]);
  navigation.setOptions({ headerTitleAlign: "center" });
  const [image, setImage] = useState(data.thumbnail);

  return (
    <ScrollView style={{ flex: 1 }}>
      <Card containerStyle={{ width: SCREEN_WIDTH, padding:1, margin:0 }}>
        <Card.Image source={{uri: image ?? data.thumbnail }} borderRadius={5} style={{height:250}}/>
        <FlatList horizontal
        data={data.images} 
        style={{ borderRadius:5, padding: 5, backgroundColor:'#333'}}
        renderItem={({ item }) => (
          <Image 
          onPress={() => setImage(item)} 
          source={{uri: item}} 
          borderRadius={5} 
          style={{
            height:80, 
            width:80,
            margin: 5,
          }}/>
        )}
        />
        <Card.Divider/>
        <Card.Title h4>{data.title}</Card.Title>
      </Card>
      <Text style={{fontSize:20}}>{data.description}</Text>
    </ScrollView>
  );
}