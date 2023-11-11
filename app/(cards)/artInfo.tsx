import { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { Text, View } from '../../components/Themed';
import { Image } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useColorScheme } from 'react-native';
import Colors from '../../constants/Colors';


type RootStackParamList = {
  ArtInfo: {
    id: string;
  };
};

interface Artwork {
  id: string;
  title: string;
  imageUrl: string;
  height: number;
  artist: string;
  date_start: number;
  date_end: number;
  dimension: string;
  place_of_origin: string;
  medium: string;
  about: string;
}

type ArtInfoRouteProp = RouteProp<RootStackParamList, 'ArtInfo'>;

export default function ArtInfo() {
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ? colorScheme : 'light'];

  const route = useRoute<ArtInfoRouteProp>();
  const { id } = route.params;

  const [data, setData] = useState<Artwork | null>(null);
  const [hasError, setHasError] = useState(false);

  const fallbackImage = require('../../assets/images/photo.png');

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = () => {
    fetch(`https://api.artic.edu/api/v1/artworks/${id}`)
      .then((response) => response.json())
      .then((responseJson) => {
        const imageUrl = `https://www.artic.edu/iiif/2/${responseJson.data.image_id}/full/300,/0/default.jpg`;
        Image.getSize(imageUrl, (width: number, height: number) => {
          const aspectRatio = height / width;
          const newHeight = 300 * aspectRatio;
          const artwork = {
            id: `${responseJson.data.id}`,
            title: responseJson.data.title,
            imageUrl: imageUrl,
            height: newHeight,
            artist: responseJson.data.artist_title,
            date_start: responseJson.data.date_start,
            date_end: responseJson.data.date_end,
            dimension: responseJson.data.dimensions,
            place_of_origin: responseJson.data.place_of_origin,
            medium: responseJson.data.medium_display,
            about: responseJson.data.thumbnail.alt_text
          };
          setData(artwork);
        }, (error) => {
          console.error(error);
          setHasError(true);
        });
      })
      .catch((error) => {
        console.error(error);
      })
  };

  return (
    <ScrollView
      contentContainerStyle={styles.contentContainer}
      style={{
        flex: 1,
        backgroundColor: themeColors.background
      }}
    >
      {data ? (
        <>
          <Text style={styles.title}>"{data.title}"</Text>
          <Text style={styles.author}>{data.artist}</Text>
          <View style={styles.separator} lightColor="#ddd" darkColor="rgba(255,255,255,0.3)" />
          <Image
            source={hasError ? fallbackImage : { uri: data.imageUrl }}
            style={{ width: 300, height: data.height, marginBottom: 20 }}
            onError={() => setHasError(true)}
            alt='Artwork Image'
          />
          <View style={styles.textContainer}>
            <Text style={styles.tableText}>Date:</Text>
            {data.date_start === data.date_end ? (
              <Text style={styles.tableTextRight}>{data.date_end}</Text>
            ) : (
              <Text style={styles.tableTextRight}>{data.date_start} - {data.date_end}</Text>
            )}
          </View>
          <View style={styles.tableSeparator} lightColor="#ddd" darkColor="rgba(255,255,255,0.3)" />

          <View style={styles.textContainer}>
            <Text style={styles.tableText}>Dismension:</Text>
            <Text style={styles.tableTextRight}>{data.dimension.split("(")[0]}</Text>
          </View>
          <View style={styles.tableSeparator} lightColor="#ddd" darkColor="rgba(255,255,255,0.3)" />

          <View style={styles.textContainer}>
            <Text style={styles.tableText}>Origin:</Text>
            <Text style={styles.tableTextRight}>{data.place_of_origin}</Text>
          </View>
          <View style={styles.tableSeparator} lightColor="#ddd" darkColor="rgba(255,255,255,0.3)" />

          <View style={styles.textContainer}>
            <Text style={styles.tableText}>Meidum:</Text>
            <Text style={styles.tableTextRight}>{data.medium}</Text>
          </View>
          <View style={styles.tableSeparator} lightColor="#ddd" darkColor="rgba(255,255,255,0.3)" />
          <Text style={{ textAlign: "left", fontSize: 18, width: "80%", marginTop: 20 }}>About:</Text>
          <Text style={{ textAlign: "left", fontSize: 16, width: "80%", marginTop: 20 }}>{data.about}</Text>

        </>
      ) : (
        <Text style={{ marginTop: 20 }}>Loading...</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tableText: {
    fontSize: 16,
    marginTop: 10,
    minWidth: 80,
  },
  tableTextRight: {
    fontSize: 16,
    marginTop: 10,
    minWidth: 80,
    textAlign: 'right',
    flexShrink: 1,
  },

  contentContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 120,
  },
  author: {
    fontSize: 16,
    marginTop: 20,
  },
  title: {
    marginTop: 20,
    fontSize: 24,
    fontFamily: 'OpenSans_400Regular_Italic',
    textAlign: 'right',
  },
  separator: {
    marginVertical: 20,
    height: 1,
    width: '80%',
  },
  tableSeparator: {
    marginVertical: 5,
    height: 1,
    width: '80%',
  },
  textContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 30,
    width: "80%",

  }
});