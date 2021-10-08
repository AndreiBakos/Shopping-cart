import React,{useState} from 'react';
import { Text, View, StyleSheet,TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ContentList (props) {
    const [isChecked,setIsChecked] = useState(props.checkbox);
    // alert(`itemData${props.containerId}-${props.id}`)
    //checkbox-outline
    const setData = async () => {
        try{
            let newValue = await AsyncStorage.getItem(`itemData${props.containerId}-${props.id + 1}`);
            newValue = JSON.parse(newValue);
            newValue.checkData = !isChecked;
            await AsyncStorage.setItem(`itemData${props.containerId}-${props.id + 1}`,JSON.stringify(newValue));
        }catch(err) {
            alert(err);
        }
    }
  return (
    <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',padding:20,backgroundColor:'#1a6174',borderWidth:.2}} key={props.id}>
                        <View style={{width:130}}>
                            <Text style={{fontWeight:'bold', color: 'white',fontSize: props.contentData.length > 16 ? Math.abs(18 - props.contentData.length/10%10 ) : 26}}>{props.contentData}</Text>
                        </View>
                        <Text style={[styles.miniTextStyle,{fontSize:15,fontWeight:'normal'}]}>{props.price}</Text>
                        <Text style={styles.miniTextStyle}>{props.quantityData}</Text>                        
                        <TouchableOpacity style={{marginHorizontal: 1}} onPress={() => {setIsChecked(c => c === false ? c = true : c = false);setData();}}>
                            <Ionicons name={isChecked ? 'checkbox-outline' : 'square-outline'} size={40} color='white'/>
                        </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
    miniTextStyle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: 'white',
      textAlignVertical:'center'
    },
});