import * as React from 'react';
import { View, StyleSheet, SafeAreaView, Image ,TouchableOpacity } from 'react-native';

export default function Home({navigation}) {
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <TouchableOpacity onPress={() => navigation.navigate('ShoppingList')}>
          <Image source={require('./images/ListImages/shoppingList.png')} style={styles.imageContainer}/>
        </TouchableOpacity>        
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent:'center'
    // marginTop:100
  },
  imageContainer: {
    width:300,
    height:150,
    borderRadius:30,
    marginVertical:40
  },
});
