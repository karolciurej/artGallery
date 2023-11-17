import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Text, View } from "../components/Themed";
import { Button } from "react-native";
import { publish } from '../components/favouriteItems';

export default function ModalScreen() {
  const clearFavoriteItems = async () => {
    try {
      await AsyncStorage.setItem('@favorite_items', JSON.stringify([]));
      publish(); 
    } catch (error) {
      console.error('Error clearing favorite items:', error);
    }
  };
  
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <Button onPress={clearFavoriteItems} title="Clear Favourites" />
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
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
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
