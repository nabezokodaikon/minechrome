# メモ
## WebViewタグ
### デフォルトの挙動
右クリックメニューが無い。

ミドルクリックが反応しない。

## Mode
### Browse mode
普通にWebを見るモード。

### Find text mode
現在のページ内の文字列を検索するモード。

* 通常のGoogle Chromeと同様に、画面右上に検索ボックスが表示される。

### Search mode
アドレスバーにURLまたはGoogle検索するキーワードを入力するモード。

### List mode
履歴一覧やブックマーク一覧を表示、操作するモード。

denite.nvimを参考にする。


## Shourt cut key
### Shell like operation
* `Ctrl + m`で`Enter`キーと同じ操作を行う。
* `Ctrl + h`で`Backspace`キーと同じ操作を行う。
* `Ctrl + i`で`Tab`キーと同じ操作を行う。
* `Ctrl + [`で`Escape`キーと同じ操作を行う。

>日本語入力が絡むとうまく動作しないケースがあるが、このアプリケーションはあくまで開発時のGoogle検索アプリケーションと割り切っておき、深追いはしない。

### Operation by common
* `Ctrl + p`で`前へ戻る`動作を行う。
* `Ctrl + n`で`次へ進む`動作を行う。

### Operation by mode
#### Browse mode
* `Ctrl + p`で前に表示したページへ遷移する。
* `Ctrl + n`で次に表示したページへ遷移する。
* `Ctrl + f`で`Find text mode`に移行する。
* `Ctrl + g`で`Search mode`に移行する。
* `Space`キー押下後、数秒以内に以下のキーを入力することで、`List mode`の各機能に移行する。(VimのLeaderのような動作を再現する。)
    * `h`キーで履歴一覧を表示する。
    * `b`キーでブックマーク一覧を表示する。

#### Find text mode
* `Ctrl + p`で現在マッチしている箇所の前にマッチしている箇所へ遷移する。
* `Ctrl + n`で現在マッチしている箇所の次にマッチしている箇所へ遷移する。
* `Escape`で`Browse mode`へ遷移する。

#### Search mode
* `Ctrl + p`で前にアドレスバーに入力した文字列を表示する。
* `Ctrl + n`で次にアドレスバーに入力した文字列を表示する。
* `Escape`で`Browse mode`へ遷移する。

#### List mode
* `Ctrl + p`で一覧の次の前の行に移動する。
* `Ctrl + n`で一覧の次の行に移動する。
* `Ctrl + d`で選択している行を削除する。
* `Escape`で`Browse mode`へ遷移する。
