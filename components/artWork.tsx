import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Image } from 'react-native';
import { useColorScheme } from 'react-native';
import Colors from '../constants/Colors';
import { Link } from 'expo-router';

interface ArtworkItemProps {
  item: {
    id: string;
    imageUrl: string;
    title: string;
  };
}

const ArtworkItem = ({ item }: ArtworkItemProps) => {
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme || 'light'];
  const [hasError, setHasError] = useState(false);
  useEffect(() => {
    setHasError(false);
  }, [item]);

  const styles = StyleSheet.create({
    itemContainer: {
      marginBottom: 20,
    },
    image: {
      width: "100%",
      height: '100%',
      borderRadius: 20,
    },
    imgWrapper: {
      width: Dimensions.get('window').width - 40,
      height: 200,
      borderRadius: 20,
    },
    title: {
      fontSize: 22,
      fontWeight: 'bold',
      flexWrap: 'wrap',
      fontFamily: 'OpenSans_400Regular_Italic',
      color: themeColors.text,
    }
  });

  const fallbackImage = require('../assets/images/photo.png');
  return (
    <View style={styles.itemContainer}>
      <Link href={`../(cards)/artInfo?id=${item.id}`}>
        <View style={styles.imgWrapper}>
        <Image
          source={hasError ? fallbackImage : { uri: item.imageUrl }}
          style={styles.image}
          onError={() => setHasError(true)}
          alt='Artwork Image'
        />
        </View>
      </Link>
      <Text style={styles.title}>{item.title}</Text>
    </View>
  );
};

export default ArtworkItem;
