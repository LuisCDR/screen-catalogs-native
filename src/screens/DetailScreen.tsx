import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Card, Text, Image, Skeleton } from '@rneui/themed';
import { ScrollView, Dimensions, FlatList } from 'react-native';
import React, { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { Response } from './HomeScreen';

const SCREEN_WIDTH = Dimensions.get('screen').width;
const SCREEN_HEIGHT = Dimensions.get('screen').height;

function loadData(id: number) {
  return axios.get(`https://dummyjson.com/products/${id}`)
  .then(response => response.data as Promise<Response>);
}

export default function DetailScreen({ route, navigation }: NativeStackScreenProps<{
  home: undefined,
  detail: { id: number },
}, 'detail'>) {

  const [data, setData] = useState({} as Response);
  const id = route.params?.id;
  const getData = useCallback(async () => {
    try {
      const promise = await loadData(id);
      setData(promise);
    } catch (error) {
      console.error(error);
    }
  },[id]);

  useEffect(() => { getData() }, [id]);
  navigation.setOptions({ headerTitleAlign: 'center' });
  const [image, setImage] = useState(data.thumbnail);

  return (
    <ScrollView style={{ flex: 1 }}>
      <Card containerStyle={{ width: SCREEN_WIDTH, padding:1, margin:0 }}>
        { 
          data.thumbnail 
          ? <Card.Image source={{uri: image ?? data.thumbnail }} borderRadius={5} style={{height:250}}/>
          : <Skeleton width={SCREEN_WIDTH} animation='wave' height={250}/>
        }
        <FlatList horizontal
        data={data.images} 
        style={{ borderRadius:5, padding: 5, backgroundColor:'#333'}}
        renderItem={({ item }) => (
          item ?
          <Image 
          onPress={() => setImage(item)} 
          source={{uri: item}} 
          borderRadius={5} 
          style={{
            height:80, 
            width:80,
            margin: 5,
          }}/>
          : <Skeleton width={80} animation='pulse' height={80}/>
        )}
        />
        <Card.Divider/>
        <Card.Title h4>{data.title}</Card.Title>
      </Card>
      <Text style={{fontSize:20}}>{data.description}</Text>
    </ScrollView>
  );
}