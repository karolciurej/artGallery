import React, { useState, useEffect } from 'react';
import { TextInput, FlatList, View, ActivityIndicator, StyleSheet } from 'react-native';
import ArtworkItem from "../../components/artWork";
import { useColorScheme } from 'react-native';
import Colors from '../../constants/Colors';

interface Artwork {
  id: string;
  title: string;
  imageUrl: string;
  artist_id: number;
}

interface ArtworkApi {
  id: string;
  title: string;
  image_id: string;
  artist_id: number;
}

const generateUniqueId = (item: Artwork, index: number) => {
  return item.id + '-' + index;
};

const App = () => {
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme || 'light'];
  const [searchQuery, setSearchQuery] = useState('');
  const [data, setData] = useState<Artwork[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const baseUrl = 'https://api.artic.edu/api/v1/artworks';
  const itemsPerPage = 15;

  useEffect(() => {
    fetchArtworks();
  }, [searchQuery, page]);

  const fetchArtworks = () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    const body = JSON.stringify({
      q: searchQuery,
      limit: itemsPerPage,
      page: page,
      fields: ["id", "title", "image_id", "artist_id"]
    });

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body
    };

    fetch(`${baseUrl}/search`, requestOptions)
      .then((response) => response.json())
      .then((responseJson) => {
        const newArtworks = responseJson.data.map((item: ArtworkApi) => ({
          id: item.id,
          title: item.title,
          imageUrl: `https://www.artic.edu/iiif/2/${item.image_id}/full/843,/0/default.jpg`,
          artist_id: item.artist_id,
        }));
        setData(prevData => [...prevData, ...newArtworks]);
        setHasMore(newArtworks.length === itemsPerPage);
      })
      .catch((error) => console.error(error))
      .finally(() => setIsLoading(false));
  };

  const handleSearch = (text: string) => {
    setPage(1);
    setHasMore(true);
    setData([]);
    setSearchQuery(text);
  };

  const handleLoadMore = () => {
    if (hasMore) {
      setPage(prevPage => prevPage + 1);
    }
  };

  const renderItem = ({ item }: { item: Artwork }) => <ArtworkItem item={item} />;

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search by title or author"
        onChangeText={handleSearch}
        value={searchQuery}
      />
      <FlatList
        contentContainerStyle={styles.listContentContainer} 
        data={data}
        renderItem={renderItem}
        keyExtractor={generateUniqueId}
        ListFooterComponent={isLoading ? <ActivityIndicator size="large" /> : null}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    justifyContent: "center",
    alignItems: "center"
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: '90%', 
  },
  listContentContainer: {
    flexGrow: 1, 
    justifyContent: 'center', 
    width: "100%",
    marginLeft: 20
  },
});

export default App;
