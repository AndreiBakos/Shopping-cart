import React,{useState} from 'react';
import { Text, View, StyleSheet, Image,TouchableOpacity,TextInput } from 'react-native';
import images from '../assets/images';
import Animated,{useSharedValue,useAnimatedStyle,withSpring} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ContentCard (props) {
  const opacityAnimation = useSharedValue(1);
  // const opacityAnimation2 = useSharedValue(0);
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);
  const [isRotated,setIsRotated] = useState(false);
  const [imgTitle,setImgTitle] = useState(props.title);
  // const rotate2 = useSharedValue(6.2);
  function impactAsync(style) {
          switch (style) {
            case 'light':
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              break;
            case 'medium':
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              break;
            default:
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
              break;
          }
        }
  const reanimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacityAnimation.value,
      transform: [{scale:scale.value},{rotate:`${rotate.value}deg`}],
    };
  },[]);

  return(
    <View>
      <View style={{flexDirection:'row'}}>
        {isRotated === false ? <Text style={{fontSize:26,fontWeight:'bold',marginVertical:20}}>{imgTitle}</Text>
                             : <TextInput style={{height: 40,width: imgTitle.length > 13 ? 180 : imgTitle.length * 10 + 50,marginVertical:20,borderBottomWidth:1,fontSize:26,fontWeight:'bold'}} value={imgTitle} 
                                          onChangeText={(value) => {value.length > 13 ? alert('Text to big') : setImgTitle(v => v = value) }}/>}
        <View style={{ marginLeft:30}}>
            <TouchableOpacity onPress={async()=> {   
                                        if(isRotated){
                                            await AsyncStorage.removeItem(`imageData${props.id + 1}`);
                                            let data = {id:props.id,imgTitle:`${imgTitle}`,img: props.imgIndex};
                                            await AsyncStorage.setItem(`imageData${props.id + 1}`,JSON.stringify(data));
                                            setImgTitle(v => v = data.imgTitle)
                                        }                                     
                                        setIsRotated((v)=>v === false ? v = true : v = false);
                                        opacityAnimation.value = withSpring(isRotated === false ? 1 : 1),
                                        // scale.value = withSpring(isRotated === false ? 1.8 : 1),
                                        rotate.value = withSpring(isRotated === false ? 360 : 0);
                                        impactAsync('light');
                                        
                                        }
                                  }>
              {isRotated === false ? <Animated.Image style={[{marginTop:'45%',width:35,height:35,opacity:opacityAnimation.value},reanimatedStyle]}                  
                                                source= {require('../images/ListImages/create.png')}/> 
                                   :  <Animated.Image style={[{marginTop:'50%',width:35,height:35,opacity:opacityAnimation.value},reanimatedStyle]}                 
                                                source= {require('../images/ListImages/confirm.png')}/>}
             </TouchableOpacity>
             
        </View>     
      </View>
      <Image source={images[props.imgIndex]} style={styles.container}/>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width:300,
    height:150,
    borderRadius: 30,
    marginBottom:60
  },
});