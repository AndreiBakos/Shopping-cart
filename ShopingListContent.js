import React,{useState,useEffect} from 'react';
import { Text, View, StyleSheet, SafeAreaView,TextInput,TouchableOpacity,FlatList,Modal,Keyboard} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ContentList from './components/ContentList';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Picker} from '@react-native-picker/picker';


export default function ShopingListContent({route}) {
  const [dataList,setDataList] = useState([]);
  const [content,setContent] = useState();
  const [contentCount,setContentCount] = useState(1);
  const [isModal,setIsModal] = useState(false);
  const [cashCount,setCashCount] = useState();   
  const [currentValue,setCurrentValue] = useState();
  const [currentItem,setCurrentItem] = useState();
  const [total,setTotal] = useState(0);

  /*
  for getting the image index reference from content               
  alert(route.params.id + 1)
*/
  let quantity = [];
  let [quantityValue,setQuantityValue] = useState('1X');
  for(let i = 1;i <= 50;i++) {
      quantity.push(i + 'X');
    }

  const setItemForModal =  (item,index,cash) => {
        if(cashCount){          
          let multiplierValue = parseInt(item.quantityData.replace('X',''));
          setCashCount();
          let newItem = {id: item.id, contentData: item.contentData, p:parseFloat(cash.replace(',','.') * multiplierValue).toFixed(2), price: `${parseFloat(cash.replace(',','.') * multiplierValue).toFixed(2)} RON\n(${cash} RON/buc)`,quantityData: item.quantityData,checkData: item.checkData};          
            let nr = !item.p ? parseFloat(parseFloat(total) + parseFloat(newItem.p)).toFixed(2) : parseFloat((parseFloat(total) - parseFloat(item.p)) + parseFloat(newItem.p)).toFixed(2);      
            setTotal(t => t = nr);          
          changeDataForModal(index,item.id,newItem,nr)
          dataList[index] = newItem;
          
        } 
          setIsModal(false);
          Keyboard.dismiss();
  }
  const  changeDataForModal =  async(index,val,data,nr) => {
    try{
      await AsyncStorage.setItem(`itemData${route.params.id + 1}-${parseInt(val) + 1}`,JSON.stringify(data))            
      await AsyncStorage.setItem(`Total${route.params.id + 1}`,JSON.stringify(nr));
    }catch(err){
      alert(err);
    }
  }
  const insertData = async() => {
    try{
      let maxListData = await AsyncStorage.getItem(`maxListData${route.params.id + 1}`);
      let value = {id: maxListData ? parseInt(maxListData) : 0,contentData: content,quantityData: quantityValue,checkData: false};    
      setDataList((v) => v = [...v,value]);
      await AsyncStorage.setItem(`itemData${route.params.id + 1}-${contentCount}`,JSON.stringify(value));
      await AsyncStorage.setItem(`maxListData${route.params.id + 1}`,JSON.stringify(contentCount));

    }catch(err){
      alert(err)
    }
  }
  const loadData = async () => {
    try{
      let maxListData = await AsyncStorage.getItem(`maxListData${route.params.id + 1}`);
      maxListData ? setContentCount(c => c = parseInt(maxListData) + 1) : setContentCount(c => c = 1);
      let tVal = await AsyncStorage.getItem(`Total${route.params.id + 1}`);
      if(tVal) {
        setTotal(parseFloat(JSON.parse(tVal)));
      }
      for(let i = 1; i <= parseInt(maxListData);i++){
        let data = await AsyncStorage.getItem(`itemData${route.params.id + 1}-${i}`);
        if(data){
          setDataList(d => [...d,JSON.parse(data)]);
        }
      }      
    }catch(err) {
      alert(err);
    }
  }
  useEffect(()=>{
    loadData();
  },[]);
  const deleteRow = async (item,index) => {    
    if(dataList.length === 1){
            setContentCount(c => c = 1);
            await AsyncStorage.removeItem(`maxListData${route.params.id + 1}`)
            await AsyncStorage.removeItem(`Total${route.params.id + 1}`)            
            setTotal(0);
          }
          const newData = [...dataList];
          const prevIndex = dataList.findIndex(item => item.id === item);
          newData.splice(index,1);    
          setDataList(val => val = newData);
          let deleteValue = parseInt(item.id) + 1;
          await AsyncStorage.removeItem(`itemData${route.params.id + 1}-${deleteValue}`);             
          if(item.p && dataList.length !== 1){
            let nr = parseFloat(total - parseFloat(item.p)).toFixed(2);
            setTotal(t => t = nr)            
            await AsyncStorage.setItem(`Total${route.params.id + 1}`,JSON.stringify(nr));
          }

  };
  const RenderRight = (item,index) => {
    return (      
          <TouchableOpacity style={{width:70,backgroundColor: '#d60000', alignItems: "center", justifyContent: 'center'}} onPress={()=> deleteRow(item,index)}>
                <Ionicons name='trash-outline'size={40} color='white'/>
          </TouchableOpacity>
    );
  };
  const RenderLeft = (item,index) => {
    return (      
          <TouchableOpacity style={{width:70,backgroundColor: '#378e23', alignItems: "center", justifyContent: 'center'}} onPress={()=> {setCurrentValue(index);setCurrentItem(item);setIsModal(true)}}>
                <Ionicons name='cash-outline'size={40} color='white'/>
          </TouchableOpacity>
    );
  };
  const renderItem = ({item,index}) => {
    
      return (
        <Swipeable renderRightActions={()=>RenderRight(item,index)} renderLeftActions={()=>RenderLeft(item,index)} overshootRight={false} overshootLeft={false}>
            <ContentList containerId={route.params.id + 1} id={item.id} contentData={item.contentData} price={item.price} quantityData={item.quantityData} checkbox={item.checkData}/>
        </Swipeable>
      );
    };

  
  
  return (
    <SafeAreaView style={styles.container}>
    <Text style={{fontSize:30,fontWeight:'bold',marginBottom:'15%',textAlign:'center'}}>{route.params.title}</Text>
    <View>
      <TextInput style={styles.textInput} value={content} placeholder="Enter a product" onChangeText={(value) => setContent(v => v = value)} />
      <View style={{flexDirection:'row',justifyContent:'space-evenly'}}>
        <Picker key={quantityValue} style={styles.pickerStyle} itemStyle={{height: 144,fontWeight:'bold'}} selectedValue={quantityValue} 
                onValueChange={(item) => setQuantityValue(v => v = item)} >

          {quantity.map((item,index) => ( <Picker.Item key={index} label={`${item}`} value={`${item}`} onValueChange={item} />))}
        </Picker>
      </View>
    
      <TouchableOpacity style={{backgroundColor:'#1a6174',alignSelf:'center',padding:20,borderRadius:25,marginVertical:10}} onPress={async() => {
        if(!content) {
          alert('Empty field')
          }else { 
            insertData();
            setContent(null);
            setQuantityValue(q => q = '1X');
            setContentCount(c => c += 1);
            Keyboard.dismiss();
            }
          }}>
          <Text style={{color:'white',fontWeight:'bold'}}>Submit</Text>
          </TouchableOpacity>
          { isModal === true ?  
                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={isModal}
                  onRequestClose={() => {
                    setIsModal(!isModal);
                  }}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                      <Text style={{fontWeight:'bold',fontSize: dataList[currentValue].contentData.length > 10 ? 15 : 35}}>{dataList[currentValue].contentData}</Text>
                      <Text style={styles.modalText,{padding:10,fontSize:15,marginVertical:20}}>Enter a price!</Text>
                      <TextInput style={styles.cashTextInput} value={cashCount} onChangeText={(value) => setCashCount(v => v = value)} keyboardType={'numeric'}/>
                      <TouchableOpacity style={{marginTop:30,backgroundColor: '#378e23',borderRadius:25,padding:20}} onPress={async () =>{ setItemForModal(currentItem,currentValue,cashCount) }}>
                        <Text style={{color:'white'}} > DONE </Text>
                      </TouchableOpacity>
                      
                      </View>
                  </View>
                </Modal> 
                              : null }
    </View>
    <Text style={{padding:10,fontWeight:'bold',fontSize:18}}><Text style={{fontSize:22}}>Total: </Text>{total} RON </Text>
    <FlatList data={dataList}renderItem={renderItem} showsVerticalScrollIndicator={false} keyExtractor={(item) => item.id.toString()}/>
    
  </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop:30
  },
  textInput: {
      width: 300,
      borderBottomWidth: 1,
      borderRadius: 120,
      fontSize:20,
      marginBottom:10,
      textAlign:'center',
      alignSelf: "center"
  },
  pickerStyle: {
    width: 200,
    height: 144,
    alignSelf:'center'
  },
   centeredView: {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  marginTop: 10
},
modalView: {
  margin: 20,
  backgroundColor: "white",
  borderRadius: 20,
  padding: 65,
  alignItems: "center",
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 2
  },
  shadowOpacity: 0.25,
  shadowRadius: 4,
  elevation: 5
},
modalText: {
  marginBottom: 10,
  fontSize:26,
  fontWeight:'bold',
  textAlign: "center"
},
cashTextInput: {
  width:150,
  borderBottomWidth: 1,
  fontSize:20,
  textAlign:'center'
},
});