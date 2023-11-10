import React, { useState, useEffect } from 'react';
import { Image } from 'expo-image';
import { FlatList, View, Text, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import ArtworkItem from "../../components/artWork.jsx"
import {
  useFonts,
  OpenSans_400Regular_Italic,
} from '@expo-google-fonts/open-sans';


const baseUrl = 'https://api.artic.edu/api/v1/artworks';
const itemsPerPage = 15;

export default function App() {

  let [fontsLoaded] = useFonts({ OpenSans_400Regular_Italic })
  const fallbackImage = require('../../assets/images/photo.png');
  
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isEndReached, setIsEndReached] = useState(false);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = () => {
    if (isLoading) return;

    setIsLoading(true);
    fetch(`${baseUrl}?limit=${itemsPerPage}&page=${page}`)
      .then((response) => response.json())
      .then((responseJson) => {
        const newArtworks = responseJson.data.map((artwork) => {
          return {
            id: `${artwork.id}`,
            title: artwork.title,
            imageUrl: `https://www.artic.edu/iiif/2/${artwork.image_id}/full/200,/0/default.jpg`
          };
        });

        setData([...data, ...newArtworks]);
        setIsEndReached(newArtworks.length < itemsPerPage);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const loadMoreItems = () => {
    if (!isEndReached) {
      setPage(page + 1);
      fetchImages();
    }
  };

  const renderItem = ({ item }) => {
    return <ArtworkItem item={item} />;
  };

  const generateUniqueId = (item, index) => {
    return item.id + '-' + index; // Combines the artwork ID with its index
  };
  return (
    <>
      <FlatList
        data={data}
        renderItem={renderItem}
        // Random key
        keyExtractor={generateUniqueId}
        onEndReached={loadMoreItems}
        onEndReachedThreshold={0.5}
        ListFooterComponent={isLoading && <ActivityIndicator size="large" />}
        contentContainerStyle={styles.listContainer}
      />
</>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    padding: 20,
    backgroundColor: '#000',
  },

});
