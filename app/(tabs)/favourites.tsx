import React, { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ArtworkItem from "../../components/artWork";

interface Item {
  id: string;
  imageUrl: string;
  title: string;
  artist_id: number;

}

export default function TabThreeScreen() {
  const [favoriteItems, setFavoriteItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  //* Sprawdzanie za każdym razem stanu asyn storage
  useEffect(() => {
    fetchFavoriteItems();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchFavoriteItems();
    }, [])
  );

  const fetchFavoriteItems = async () => {
    try {
      setIsLoading(true);
      const storedIdsString = await AsyncStorage.getItem("@favorite_items");
      if (!storedIdsString) {
        setIsLoading(false);
        return;
      }
      const storedIds = JSON.parse(storedIdsString);
      const fetchPromises = storedIds.map((id: string) =>
        fetch(`https://api.artic.edu/api/v1/artworks/${id}`)
          .then((res) => res.json())
          .catch((err) =>
            console.error(`Error fetching item with ID ${id}:`, err)
          )
      );

      const results = await Promise.all(fetchPromises);
      const items = results.reduce((acc, result, index) => {
        if (result.data && result.data.image_id) {
          acc.push({
            id: storedIds[index],
            imageUrl: `https://www.artic.edu/iiif/2/${result.data.image_id}/full/843,/0/default.jpg`,
            title: result.data.title,
          });
        }
        return acc;
      }, []);

      setFavoriteItems(items);
    } catch (error) {
      console.error("Error fetching favorite items:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFavoriteItems();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchFavoriteItems();
    }, [])
  );

  const renderItem = ({ item }: { item: Item }) => {
    return <ArtworkItem item={item} />;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ulubione Obrazy</Text>
      {isLoading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={favoriteItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    marginVertical: 10,
    fontSize: 20,
    fontWeight: "bold",
  },
});
