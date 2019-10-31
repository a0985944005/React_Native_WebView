import React, {Component, Fragment} from 'react';
import {StatusBar,
        Text,
        StyleSheet,
        View,
        Alert,
        ImageBackground,
        AsyncStorage,
        PermissionsAndroid,
        } from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import {WebView} from 'react-native-webview';
import Orientation from 'react-native-orientation';
import { Cache } from "react-native-cache";
import * as CacheManager from 'react-native-http-cache';
import DeviceInfo from 'react-native-device-info';

var URI = require('urijs');
var cache = new Cache({
  namespace: "sixsz_test",
  policy: {
      maxEntries: 50000
  },
  backend: AsyncStorage
});

// Android一些設備請求
async function requestPermission() {
  try {
    const grantedmic = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      {
        title: 'Cool Photo App mic Permission',
        message:
          'Cool Photo App needs access to your mic ' +
          'so you can take awesome pictures.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );

    const grantedcamera = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: 'Cool Photo App Camera Permission',
        message:
          'Cool Photo App needs access to your camera ' +
          'so you can take awesome pictures.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );

    if (grantedmic === PermissionsAndroid.RESULTS.GRANTED && grantedcamera===grantedmic) {
      alert('You can use the mic,camrea');
      alert(grantedmic);
    } else {
      alert('permission denied');
      alert(grantedmic);
    }
  } catch (err) {
    alert(err);
  }
}


class App extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      url :('http://210.71.166.7/H5Bowan/'),
      // url :('https://www.shouhou123.com/Test2/H5Bowan/'),
      count: 0,
      internet: true,
      version:'',
    };
    this.checkInternet();
    this.checkVersion();
  }
  

  // 安裝後就開始監聽網路變化
  componentWillMount(){
    
    // requestPermission(); //Android一些設備請求

    //取得mac
    DeviceInfo.getMacAddress().then(mac => {
      alert(mac);
      // "E5:12:D8:E5:69:97"
    });

    //開啟網路監聽
    NetInfo.addEventListener(state => {
      this.checkInternet();
    });
  }

  // 確認網路是否有連線 {{boolen}}}
  checkInternet(){
    NetInfo.isConnected.fetch().then(state => {
      if(state){
        this.setState({internet:true});
      }
      else{
        this.setState({internet:false});
      }
    });
  }

  // 版本判斷是否清理快取
  checkVersion(){
    let host = this.state.url+'/varsionYA.json';
    self = this;
    fetch(host,{
      headers: {
        'Cache-Control': 'no-cache'
      }
    })  .then((res)=> res.json())
        .then((json)=>{
          alert("fetch到的版本為:"+json['version'])
          cache.getItem("version", function(err, value) {
            if(err){alert("cache.getItem.version"+err);}
            if(value==undefined){
              cache.setItem("version",json['version'], function(err) {
                if(err){alert("cache.setItem.version"+err);}
                Alert.alert(
                  "版本檢查",
                  "首次儲存版本!",
                  [
                    { text: 'OK'},
                  ],
                  { cancelable: false });
            });
            }
            else{
              if(value==json['version']){
                Alert.alert(
                  "版本檢查",
                  "最新版本!",
                  [
                    { text: 'OK'},
                  ],
                  { cancelable: false });
              }
              else{
                Alert.alert(
                  "版本檢查",
                  "版本有勿清除快取",
                  [
                    { text: 'OK' ,onPress: () => this.props.navigation.goBack() },
                  ],
                  { cancelable: false });
                //setState會重新執行render()
                cache.clearAll(function(err) {
                  if(err){alert("cache.clearAll(err)"+err);}
                });
                self.clearCache();
   
      
              }
            }
          });
            
            // this.setState({version:json['version']});//setState會重新執行render()
            
        })
        .catch((e)=>{
          //error
            alert('Request Failed: ', e);
        });
  }



  //當webView載入錯誤時跳出提醒返回主畫面
  displayError(errorCode) {
    Alert.alert(
      "no_internet",
      "require_internet_connection\n\nerror code : "+errorCode,
      [
        { text: 'OK', onPress: () => this.props.navigation.goBack() },
      ],
      { cancelable: false });
  }

  // 當WebView內容的url變更時
  _onNavigationStateChange(webViewState){
    // 若是客服鎖直屏
    url_status = webViewState.url.search("pop800.com");
    if(url_status!="-1")
    {
      if(this.state.count==2){
        this._orientation('Portrait');
        this.state.count=0;
      }else{
        this.state.count+=1;
      }
    }
    else
    {
      this._orientation('UnlockAll');
    }
    // StatusBar.setHidden(true);
    // alert(webViewState);
  }

  // 方向鎖定
  _orientation(now_orientation){
    switch(now_orientation)
    {
      case 'Portrait':  // 鎖直屏
        Orientation.lockToPortrait();
        break;
      case 'Landscape': // 鎖橫屏
        Orientation.lockToLandscape();
        break
      case 'UnlockAll': // 解鎖全
        Orientation.unlockAllOrientations();
        break
      default:
        alert('error:orientation');
        break;
    }
  }


  //獲取快取
  getCache(){

    CacheManager.getCacheSize().then(res=>{
        let cacheSize = Math.round((res / 1024 / 1024) * 100) / 100 + 'M';
        alert("cacheSize: "+cacheSize)
        // this.setState({
        //     cacheSize
        // })
    },err=>{
        alert("getCache Error: "+err)
    })
    // this.setState({version:json_version});//setState會重新執行render()
  }


  //清除快取
  clearCache(){
      CacheManager.clearCache();

      alert("clearCache")

  }


  // 顯示畫面
  renderview(){
      if(this.state.internet == true ){
        if(this.state.version!=''){alert("version:"+this.state.version);}
        this._orientation('UnlockAll');
        return (
          <WebView ref="webview"
          source={{uri:this.state.url}} 
          onNavigationStateChange={this._onNavigationStateChange.bind(this)} 
          javaScriptEnabled = {true} 
          domStorageEnabled = {true} 
          injectedJavaScript ={this.state.cookie} 
          startInLoadingState={false} 
          useWebKit = {true} 
          onError={(e) =>  this.displayError(e.nativeEvent.code)}
          cacheEnabled = {true} 
          cacheMode = {"LOAD_DEFAULT"}/>)
      }else{
        this._orientation('Landscape');
        return <ImageBackground  source={require('./img/noInternet.png')} style={{width:'100%', height: '100%'}}/>
      }
      
  }

  // 畫面畫圖
  render() {
      return (
      <Fragment>

        <StatusBar hidden={true} />
          {this.renderview()}

          {/* <View style={styles.center}> */}
              {/* <Text style={styles.text}>renderError回调了，出现错误</Text> */}
          {/* </View> */}
      </Fragment>
      );
  }
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'powderblue',
  },
  text: {
    color: '#fff', fontSize: 30
  }
});

export default App;


