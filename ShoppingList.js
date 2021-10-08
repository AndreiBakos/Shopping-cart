import React, {useState,useEffect} from 'react';
import { Text, View, StyleSheet, Image,TouchableOpacity,FlatList,KeyboardAvoidingView} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Platform } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import ContentCard from './components/ContentCard';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import images from './assets/images';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function ShoppingList({navigation}) {
    const [contentData,setContentData] = useState([]);
    const [contentCount,setContentCount] = useState(0);
    
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
    const insertData = async () => {
      try {      
        let data = {id: contentCount,imgTitle: `Title ${contentCount + 1}` ,img:Math.floor(Math.random() * images.length)};
        await AsyncStorage.setItem(`imageData${parseInt(contentCount) + 1}`,JSON.stringify(data));
        setContentCount(c => c += 1);
        setContentData(v => [data,...v]);
        await AsyncStorage.setItem('maxData',JSON.stringify(contentCount));       
      }catch(err){
         alert(err)
        }
    }
    const loadData = async() => {
      try {      
        let maxData = await AsyncStorage.getItem('maxData');             
        if(maxData){
          setContentCount(parseInt(maxData) + 1)
          for(let i = 1; i <= parseInt(maxData) + 1;i++){          
            let data = await AsyncStorage.getItem(`imageData${i}`)
            if(data){
                setContentData(v => [JSON.parse(data),...v]);            
            }
          }
        }
      }catch(err){
        alert(err)
      }
    }
    useEffect(() => {
      loadData();
    },[]);
    const deleteRow = async (item, index) => {
         try { 
            const newData = [...contentData];
            newData.splice(index,1);    
            setContentData(val => val = newData);
            await AsyncStorage.removeItem(`imageData${item.id + 1}`)
            let maxListData = await AsyncStorage.getItem(`maxListData${item.id + 1}`);
            
            for(let i = 1; i <= parseInt(maxListData);i++){
              await AsyncStorage.removeItem(`itemData${item.id + 1}-${i}`)
            }
            await AsyncStorage.removeItem(`maxListData${item.id + 1}`); 
            await AsyncStorage.removeItem(`Total${item.id + 1}`)            
  
            if(contentData.length === 1){
              await AsyncStorage.removeItem('maxData');
              setContentCount(0);
            }
          } catch (err) {
              alert(err) 
            }
      };
    const RenderRight = (item,index) => {
      // console.log(index)
      return (      
            <TouchableOpacity style={{marginTop:'26%',width: 80,height:140,borderRadius:30,backgroundColor: 'red', alignItems: "center", justifyContent: 'center'}} onPress={()=> deleteRow(item,index)}>
                  <Ionicons name='trash-outline'size={40} color='white'/>
            </TouchableOpacity>
      );
    }
    const RenderLeft = (item,index) => {    
      return (      
            <TouchableOpacity style={{marginTop:'26%',width: 80,height:140,borderRadius:30,backgroundColor: 'purple', alignItems: "center", justifyContent: 'center'}} onPress={ async ()=> {
              let data = await AsyncStorage.getItem(`imageData${item.id + 1}`)
              data = JSON.parse(data)
              navigation.navigate('ShopingListContent',{id: data.id,title:data.imgTitle,img:data.img})
              }
            }>
                  <Ionicons name='map-outline'size={40} color='white'/>
            </TouchableOpacity>
      );
    }
    const renderItem = ({item,index}) => {
      return (
          <Swipeable renderRightActions={()=>RenderRight(item,index)} renderLeftActions={()=>RenderLeft(item,index)} overshootRight={false} overshootLeft={false}>
            <ContentCard id={item.id} imgIndex={item.img} title={item.imgTitle} checkbox={false} />
          </Swipeable>
       );
    }
    return (
      <KeyboardAvoidingView behavior="position" keyboardVerticalOffset={-80}>
        { Platform.OS === 'android' ? <TouchableOpacity style={styles.addItemContainer} onPress={() => {insertData();impactAsync('light')}}>
                                    <Icon name="plus-circle" size={40}/>
                                  </TouchableOpacity>
                                    : <TouchableOpacity style={styles.addItemContainer} onPress={() => {insertData();impactAsync('light')}}>
                                        <Ionicons name='add-circle'size={40}/>
                                      </TouchableOpacity>
        }
        <View style={{alignItems:'center'}}>
          <Text style={{fontSize:30,fontWeight:'bold',marginVertical:20}}>Your Shopping List</Text>
          {contentData.length === 0 ? <Image source={require('./images/ListImages/noContent.png')} style={styles.imageContainer}/> 
          :<FlatList style={{height:'75%',marginTop:20}} data={contentData}  renderItem={renderItem} showsVerticalScrollIndicator={false} keyExtractor={(item) => item.id.toString()}/>}
        </View>
      </KeyboardAvoidingView>
    );
  }
  /**<ScrollView style={{height:'75%',marginTop:20}} showsVerticalScrollIndicator={false}>{images.map((item,index) => <ContentCard index={index} key={index}/>)}</ScrollView> */
  const styles = StyleSheet.create({
    addItemContainer: {
      alignSelf:'flex-end',
      padding:10
    },
    imageContainer: {
      width:'90%',
      height:'55%',
      borderRadius:30,
      marginVertical:20
    },
  });
  