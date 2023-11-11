import React from 'react';
import { StyleSheet } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native'; 
import { Text, View } from '../../components/Themed';

type RootStackParamList = {
  ArtInfo: {
    id: string;
  };
};

type ArtInfoRouteProp = RouteProp<RootStackParamList, 'ArtInfo'>;

export default function ArtInfo() {
  const route = useRoute<ArtInfoRouteProp>();
  const { id } = route.params; 

  console.log(id);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab Two{id}</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
