# mineChrome
It is a mine Google Chrome for me only.
... and getting started for JavaScript.

## 参考
* [Electron入門サイト](https://ics.media/tutorial-electron)
* [デザインについて](http://jgthms.com/web-design-in-4-minutes/#share)


## Electronでデスクトップアプリを作成する
### Electronのインストール
```
$ npm install -g electron-prebuilt
```

### アプリケーション実行用のファイルの用意
以下のようなファイル構成を作成する。
```
src
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
$ electron-packager src mineChrome --platform=darwin,win32 --arch=64 --version=1.1.3 --overwrite
```
