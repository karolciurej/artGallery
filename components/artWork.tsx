import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Image } from 'expo-image';
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

  const styles = StyleSheet.create({
    itemContainer: {
      marginBottom: 20,
    },
    image: {
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

  const fallbackImage = require('../assets/images/photo.png'); // Ensure this path is correct
  return (
    <View style={styles.itemContainer}>
      <Link href={`../(cards)/artInfo?id=${item.id}`}>
        <Image
          source={hasError ? fallbackImage : { uri: item.imageUrl }}
          style={styles.image}
          onError={() => setHasError(true)}
          alt='Artwork Image'
        />
      </Link>
      <Text style={styles.title}>{item.title}</Text>
    </View>
  );
};

export default ArtworkItem;
