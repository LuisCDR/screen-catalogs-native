import { Avatar, Icon, ListItem, SearchBar, Skeleton } from '@rneui/themed';
import { SafeAreaView, FlatList, Dimensions, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { RefreshControl } from 'react-native-gesture-handler';

const SCREEN_WIDTH = Dimensions.get('screen').width;

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

function loadData() {
  return axios.get('https://dummyjson.com/products?limit=100&select=brand,id,title,thumbnail')
  .then(response => response.data.products as Response[]);
}

function loadSearchData(value: string) {
  return axios.get(`https://dummyjson.com/products/search?q=${value}`)
  .then(response => response.data.products as Response[]);
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
      const promise = await loadData();
      setData(promise);
    } catch (error) {
      console.error(error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { getData() }, []);

  const [searchValue, setSearchValue] = useState('');
  const getSearchData = useCallback(async () => {
    try {
      setRefreshing(true);
      const promise = await loadSearchData(searchValue);
      setData(promise);
    } catch (error) {
      console.error(error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <SearchBar
      placeholder='Search product...'
      searchIcon={false}
      platform='android'
      value={searchValue}
      onChangeText={value => setSearchValue(value)}
      onSubmitEditing={getSearchData}
      />
      <FlatList data={data} renderItem={({ item }) => (
        item ?
        <ListItem bottomDivider onPress={() => navigation.navigate('detail', { id: item.id })}>
          <Avatar rounded source={{ uri: item.thumbnail }}/>
          <ListItem.Content>
            <ListItem.Title>{item.title}</ListItem.Title>
            <ListItem.Subtitle>{item.brand}</ListItem.Subtitle>
          </ListItem.Content>
        </ListItem>
        : <Skeleton width={SCREEN_WIDTH} animation='wave' height={20}/>
      )}
      keyExtractor={item => String(item.id)}
      refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={getData}/>
      }/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, },
});