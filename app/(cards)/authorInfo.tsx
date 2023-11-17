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
    birthDate: number;
    deathDate: number;
    description: string;
  }

  

type ArtInfoRouteProp = RouteProp<RootStackParamList, 'ArtInfo'>;

export default function ArtInfo() {
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ? colorScheme : 'light'];

  const route = useRoute<ArtInfoRouteProp>();
  const { id } = route.params;

  const [data, setData] = useState<Artwork | null>(null);
  const [artworks, setArtworks] = useState<string[]>([]);
  const [hasError, setHasError] = useState(false);

  const requestBody = JSON.stringify({
    query: {
      term: {
        artist_id: id,
      }
    }
  });
  
  
  useEffect(() => {
    fetchArtist();
  }, []);

  useEffect(() => {
    fetchArtworks();
  }, []);
  
  const fetchArtworks = () => {
    fetch('https://api.artic.edu/api/v1/artworks/search?limit=100', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: requestBody
    })
    .then(response => response.json())
    .then(responseJson => {
        const newArtworks = responseJson.data.map((artwork: any) => artwork.title);
        setArtworks(newArtworks);
        console.log(newArtworks); 
    })
    .catch(error => {
      console.error(error);
      setHasError(true);
    });
  };

  
  const fetchArtist = () => {
    fetch(`https://api.artic.edu/api/v1/artists/${id}`)
      .then((response) => response.json())
      .then((responseJson) => {
        const artist = {
          id: `${responseJson.data.id}`,
          title: responseJson.data.title,
          birthDate: responseJson.data.birth_date,
          deathDate: responseJson.data.death_date,
          description: responseJson.data.description,
        };
        setData(artist);
      })
      .catch((error) => {
        console.error(error);
        setHasError(true);
      });
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
          <Text style={styles.title}>{data.title}</Text>
          <View style={styles.tableSeparator} lightColor="#ddd" darkColor="rgba(255,255,255,0.3)" />

          <Text style={styles.author}>Born: {data.birthDate}</Text>
          <Text style={styles.author}>Died: {data.deathDate}</Text>
          <View style={styles.tableSeparator} lightColor="#ddd" darkColor="rgba(255,255,255,0.3)" />

          <Text style={{ fontSize: 20, marginTop: 16}}>Artworks:</Text>
          {artworks.map((element, index) => (
          <Text key={index} style={styles.description}>-{element}</Text>  
        ))}
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
    marginVertical: 10,
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

  },
  description: {
    fontSize: 16,
    marginTop: 20,
    textAlign: 'left',
    width: '80%',
  },
});