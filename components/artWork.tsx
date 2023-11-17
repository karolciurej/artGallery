import React, { useState, useEffect } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { Image } from "react-native";
import { useColorScheme } from "react-native";
import Colors from "../constants/Colors";
import { Link } from "expo-router";
import { Pressable } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { subscribe } from '../components/favouriteItems';

interface ArtworkItemProps {
  item: {
    id: string;
    imageUrl: string;
    title: string;
    artist_id: number;
  };
}

const ArtworkItem = ({ item }: ArtworkItemProps) => {
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme || "light"];
  const [hasError, setHasError] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const heartIconStyle = isFavorited ? "heart" : "heart-o";
  const fallbackImage = require("../assets/images/photo.png");

  const addToArrayInStorage = async (value: string) => {
    try {
      const existingArrayString = await AsyncStorage.getItem("@favorite_items");
      let existingArray = existingArrayString
        ? JSON.parse(existingArrayString)
        : [];
      existingArray.push(value);
      await AsyncStorage.setItem(
        "@favorite_items",
        JSON.stringify(existingArray)
      );
    } catch (e) {
      console.log(e);
    }
  };

  const removeData = async (value: string) => {
    try {
      const existingArrayString = await AsyncStorage.getItem("@favorite_items");
      let existingArray = existingArrayString
        ? JSON.parse(existingArrayString)
        : [];
      const updatedArray = existingArray.filter(
        (item: string) => item !== value
      );
      await AsyncStorage.setItem(
        "@favorite_items",
        JSON.stringify(updatedArray)
      );
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      const storedArrayString = await AsyncStorage.getItem("@favorite_items");
      const storedArray = storedArrayString ? JSON.parse(storedArrayString) : [];
      setIsFavorited(storedArray.includes(item.id));
    };
    checkFavoriteStatus();
    const unsubscribe = subscribe(checkFavoriteStatus);
    return () => {
      unsubscribe();
    };
  }, [item.id]); 
  

  useEffect(() => {
    setHasError(false);
  }, [item]);

  const handleHeartPress = () => {
    setIsFavorited((prevState) => {
      const newState = !prevState;

      if (newState) {
        addToArrayInStorage(item.id);
      } else {
        removeData(item.id);
      }

      return newState;
    });
  };

  //* Style tu ze względu na uzyce themesColor w arkuszu styli
  const styles = StyleSheet.create({
    itemContainer: {
      marginBottom: 20,
      position: "relative",
    },
    imgWrapper: {
      width: Dimensions.get("window").width - 40,
      height: 200,
      borderRadius: 20,
      position: "relative",
      zIndex: 1,
    },
    image: {
      width: "100%",
      height: "100%",
      borderRadius: 20,
    },
    heartIcon: {
      position: "absolute",
      zIndex: 2,
      top: 207,
      left: 0,
      color: themeColors.text,
    },
    title: {
      fontSize: 22,
      fontWeight: "bold",
      flexWrap: "wrap",
      fontFamily: "OpenSans_400Regular_Italic",
      color: themeColors.text,
      zIndex: 0,
      marginTop: 4,
    },
  });

  return (
    <View style={styles.itemContainer}>
      <Link href={`../(cards)/artInfo?id=${item.id}`}>
        <View style={styles.imgWrapper}>
          <Image
            source={hasError ? fallbackImage : { uri: item.imageUrl }}
            style={styles.image}
            onError={() => setHasError(true)}
            alt="Artwork Image"
          />
        </View>
      </Link>

      <Pressable onPress={handleHeartPress} style={styles.heartIcon}>
        {({ pressed }) => (
          <FontAwesome
            name={heartIconStyle}
            size={26}
            color={Colors[colorScheme ?? "light"].text}
            style={{ opacity: pressed ? 0.5 : 1 }}
          />
        )}
      </Pressable>

      <Text style={styles.title}>{"      " + item.title}</Text>
    </View>
  );
};

export default ArtworkItem;
