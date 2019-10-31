# Android 打包 APK

Android 把包成一个APK主要需要幾個步骤

1.產生金鑰
2.將金鑰設定到這個專案的 /android/app 下的build.gradle 文件
3.產生Apk檔

## 產生金鑰

> keytool -genkey -v -keystore FactoryKey.keystore -alias FactoryKey-alias -keyalg RSA -keysize 2048 -validity 10000

## 將金鑰設定到這個專案的 /android/app 下的build.gradle 文件

```
輸入金鑰儲存庫密碼:  
重新輸入新密碼: 
您的名字與姓氏為何？
  [Unknown]:  honor
您的組織單位名稱為何？
  [Unknown]:  honor.poker
您的組織名稱為何？
  [Unknown]:  poker
您所在的城市或地區名稱為何？
  [Unknown]:  TW.Taichuang
您所在的州及省份名稱為何？
  [Unknown]:  Taichuang
此單位的兩個字母國別代碼為何？
  [Unknown]:  TW
CN=honor, OU=honor.poker, O=poker, L=TW.Taichuang, ST=Taichuang, C=TW 正確嗎？
  [否]:  Y

針對 CN=honor, OU=honor.poker, O=poker, L=TW.Taichuang, ST=Taichuang, C=TW 產生有效期 10,000 天的 2,048 位元 RSA 金鑰組以及自我簽署憑證 (SHA256withRSA)

輸入 <my-key-alias> 的金鑰密碼
    (RETURN 如果和金鑰儲存庫密碼相同):  
重新輸入新密碼: 
[儲存 FactoryKey.keystore]
```

### java keytool用法

>Java 中的 keytool.exe 可以用來建立數位憑證，再將該憑證，綁到你的apk中。
-keystore 指定金鑰庫的名稱,我指定了FactoryKey.keystore
-alias 產生別名我指定了FactoryKey-alias

### Android\app\build.gradle

```bash
signingConfigs {
    release {
        storeFile file("FactoryKey.keystore")
        storePassword "123456"
        keyAlias "FactoryKey-alias"
        keyPassword "123456"
    }
}
```

在build.gradle的設定中，要把剛剛的產生的金鑰放入

```bash
buildTypes {
    release {
        minifyEnabled enableProguardInReleaseBuilds
        proguardFiles getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro"
        signingConfig signingConfigs.release
    }
}
```

## 產生Apk檔

該專案的目錄下，執行

```bash
cd android
./gradlew assembleRelease
```