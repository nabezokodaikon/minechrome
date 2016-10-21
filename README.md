# 初めてのElectron
## 参考
* [初めてのElectron](https://ics.media/entry/7298)
* [デザインについて](http://jgthms.com/web-design-in-4-minutes/#share)


## Electronでデスクトップアプリを作成する
### Electronのインストール
```
$ npm install -g electron-prebuilt
```

### アプリケーション実行用のファイルの用意
以下のようなファイル構成を作成する。
```
firstapp
└── src
    ├── index.html
    ├── main.js
    └── package.json
```

#### package.json
エントリーポイントとなるJavaScriptのファイル名を指定する。

#### main.js
エントリーポイントとなるJavaScriptファイル。


## アプリケーションの実行
```
# Case of Windows.
$ electron.exe src

# Case of Linux and other.
$ electron src
```


## パッケージング
### パッケージングツールをインストール
```
$ npm install -g electron-packager
```

### パッケージングの実行
以下のようにelectron-packagerを実行する。
```
# srcディレクトリ内のソースコードを、
# FirstAppというアプリ名で、
# WindowsとmacOSの、
# 64bit向けに、
# 1.1.3バージョンとしてパッケージングし、
# 2回目以降は上書きを行う。
$ electron-packager src FirstApp --platform=darwin,win32 --arch=64 --version=1.1.3 --overwrite
```
