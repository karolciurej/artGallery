import { useState, useEffect } from "react";
import { StyleSheet, ScrollView, Image, Text } from "react-native";
import { View } from "../../components/Themed";
import { useRoute, RouteProp } from "@react-navigation/native";
import { useColorScheme } from "react-native";
import Colors from "../../constants/Colors";
import { Link } from "expo-router";

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
  artist_id: number;
  isZoomable: boolean;
}

type ArtInfoRouteProp = RouteProp<RootStackParamList, "ArtInfo">;

export default function ArtInfo() {
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme || "light"];
  const route = useRoute<ArtInfoRouteProp>();
  const { id } = route.params;
  const [data, setData] = useState<Artwork | null>(null);
  const [hasError, setHasError] = useState(false);
  const fallbackImage = require("../../assets/images/photo.png");

  useEffect(() => {
    fetchImages();
  }, []);

  //* Fetching Art Data
  const fetchImages = () => {
    fetch(`https://api.artic.edu/api/v1/artworks/${id}`)
      .then((response) => response.json())
      .then((responseJson) => {
        const imageId = responseJson.data.image_id;
        let imageUrl;
        let newHeight = 300;

        if (imageId) {
          imageUrl = `https://www.artic.edu/iiif/2/${imageId}/full/300,/0/default.jpg`;
        } else {
          imageUrl = fallbackImage;
        }

        const artwork = {
          id: responseJson.data.id,
          title: responseJson.data.title,
          imageUrl: imageUrl,
          height: newHeight,
          artist: responseJson.data.artist_title,
          date_start: responseJson.data.date_start,
          date_end: responseJson.data.date_end,
          dimension: responseJson.data.dimensions,
          place_of_origin: responseJson.data.place_of_origin,
          medium: responseJson.data.medium_display,
          artist_id: responseJson.data.artist_id,
          isZoomable: responseJson.data.isZoomable,
        };

        setData(artwork);
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
        backgroundColor: themeColors.background,
      }}
    >
      {data ? (
        <>
          <Text style={styles.title}>"{data.title}"</Text>
          <Link href={`./authorInfo?id=${data.artist_id}`}>
            <Text style={styles.author}>{data.artist}</Text>
          </Link>
          <View
            style={styles.separator}
            lightColor="#ddd"
            darkColor="rgba(255,255,255,0.3)"
          />
    {data.isZoomable ? (
      <ScrollView 
        maximumZoomScale={3.0} 
        minimumZoomScale={1.0} 
        pinchGestureEnabled={true} 
        style={{ width: 300, height: data.height }}
      >
        <Image
          source={
            typeof data.imageUrl === "string"
              ? { uri: data.imageUrl }
              : data.imageUrl
          }
          style={{ width: 300, height: data.height, marginBottom: 20 }}
          onError={() => setHasError(true)}
          alt="Artwork Image"
        />
      </ScrollView>
    ) : (
      <Image
        source={
          typeof data.imageUrl === "string"
            ? { uri: data.imageUrl }
            : data.imageUrl
        }
        style={{ width: 300, height: data.height, marginBottom: 20 }}
        onError={() => setHasError(true)}
        alt="Artwork Image"
      />
    )}

          <View style={styles.textContainer}>
            <Text style={styles.tableText}>Date:</Text>
            {data.date_start === data.date_end ? (
              <Text style={styles.tableTextRight}>
                {data.date_end ? data.date_end : "Unknown"}
              </Text>
            ) : (
              <Text style={styles.tableTextRight}>
                {data.date_start ? data.date_start : "Unknown"} -{" "}
                {data.date_end ? data.date_end : "Unknown"}
              </Text>
            )}
          </View>
          <View
            style={styles.tableSeparator}
            lightColor="#ddd"
            darkColor="rgba(255,255,255,0.3)"
          />

          <View style={styles.textContainer}>
            <Text style={styles.tableText}>Dismension:</Text>
            <Text style={styles.tableTextRight}>
              {data.dimension ? data.dimension.split("(")[0] : "Unknown"}
            </Text>
          </View>
          <View
            style={styles.tableSeparator}
            lightColor="#ddd"
            darkColor="rgba(255,255,255,0.3)"
          />

          <View style={styles.textContainer}>
            <Text style={styles.tableText}>Origin:</Text>
            <Text style={styles.tableTextRight}>
              {data.place_of_origin ? data.place_of_origin : "Unknown"}
            </Text>
          </View>
          <View
            style={styles.tableSeparator}
            lightColor="#ddd"
            darkColor="rgba(255,255,255,0.3)"
          />

          <View style={styles.textContainer}>
            <Text style={styles.tableText}>Medium:</Text>
            <Text style={styles.tableTextRight}>
              {data.medium ? data.medium : "Unknown"}
            </Text>
          </View>
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
    textAlign: "right",
    flexShrink: 1,
  },

  contentContainer: {
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: 120,
  },
  author: {
    fontSize: 16,
    marginTop: 20,
  },
  title: {
    marginTop: 20,
    fontSize: 24,
    fontFamily: "OpenSans_400Regular_Italic",
    textAlign: "right",
  },
  separator: {
    marginVertical: 20,
    height: 1,
    width: "80%",
  },
  tableSeparator: {
    marginVertical: 5,
    height: 1,
    width: "80%",
  },
  textContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 30,
    width: "80%",
  },
});
