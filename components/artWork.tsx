import { useState } from 'react';
import { FlatList, View, Text, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import { Image } from 'expo-image';

interface ArtworkItemProps {
  item: {
    imageUrl: string;
    title: string;
  };
}

const ArtworkItem = ({ item }: ArtworkItemProps) => {


    const [hasError, setHasError] = useState(false);
    const fallbackImage = require('../assets/images/photo.png');
  
    return (
      <View style={styles.itemContainer}>
        <Image 
          source={hasError ? fallbackImage : { uri: item.imageUrl }} 
          style={styles.image} 
          onError={() => setHasError(true)} // Set the error state to true if the image fails to load
          alt='Brak zdjęcia w bazie danych'
        />
        <Text style={styles.title}>{item.title}</Text>
      </View>
    );
  };

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
      color: 'white',
    }
  });
  

  export default ArtworkItem