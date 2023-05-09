import { Avatar, Button, Image, ListItem, Text } from '@rneui/themed';
import { SafeAreaView, FlatList } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
// import { ListItemContent } from '@rneui/base/dist/ListItem/ListItem.Content';
// import { ListItemTitle } from '@rneui/base/dist/ListItem/ListItem.Title';
// import { ListItemSubtitle } from '@rneui/base/dist/ListItem/ListItem.Subtitle';
import { RefreshControl } from 'react-native-gesture-handler';

export interface Response {
  id: number,
  title: string,
  description: string,
  price: number,
  discountPercentage: number,
  rating: number,
  stock: number,
  brand: string,
  category: string, 
  thumbnail: string, 
  images: string[]
}

export default function HomeScreen({ navigation }: NativeStackScreenProps<{
  home: undefined,
  detail: { id: number },
}, 'home'>) {

  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState([] as Response[]);
  const getData = useCallback(async () => {
    try {
      setRefreshing(true);
      const response = await axios.get('https://dummyjson.com/products?limit=100&select=brand,id,title,thumbnail');
      setData(response.data.products);
    } catch (error) {
      console.error(error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { getData() }, []);

  return (
    <SafeAreaView style={{flex:1}}>
      <FlatList data={data} renderItem={({ item }) => (
        <ListItem bottomDivider onPress={() => navigation.navigate("detail", { id: item.id })}>
          <Avatar rounded source={{ uri: item.thumbnail }}/>
          <ListItem.Content>
            <ListItem.Title>{item.title}</ListItem.Title>
            <ListItem.Subtitle>{item.brand}</ListItem.Subtitle>
          </ListItem.Content>
        </ListItem>
      )}
      keyExtractor={item => String(item.id)}
      refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={getData}/>
      }/>
    </SafeAreaView>
  );
}