# 全国災害伝承情報MAP

有史以来、全国で発生した災害は各地に多大な被害をもたらし、それらの災害の教訓は各地域において記録としてあるもの、図画として残されているもの、あるいは物語、ことわざとして伝承されているものなどがあります。
そのような災害にまつわる資料や情報が[全国災害伝承情報：総務省消防庁](http://www.fdma.go.jp/html/life/saigai_densyo/) として公開されており、本作はそれを元に
日本各地に伝わる災害に関する言い伝えを地図上にマッピングしています。

[防災に関わる「言い伝え」MAP](https://gensaiinfo.github.io/bousai_densyo_map/)

## 出典
本作は [全国災害伝承情報：総務省消防庁](http://www.fdma.go.jp/html/life/saigai_densyo/) で公開されている次の資料を利用しています。
- [防災に関わる「言い伝え」](http://www.fdma.go.jp/html/life/saigai_densyo/02.pdf)
- [添付資料](http://www.fdma.go.jp/html/life/saigai_densyo/06.pdf)

## ローカル環境での実行

ローカル環境で動作させるにはまず、次をインストールしてください。

− node.js バージョン6.0.0以上

上記をインストールしたら最初に次のコマンドを実行してください。

```bash
$ clone
$ cd saigai_densyo_map
$ npm install
```

次のコマンドを実行すると、webpack-dev-serverが起動し、ブラウザで http://localhost:9000 が表示されます。

```bash
$ npm start
```

## ライセンス

本作で利用している伝承情報についての著作権は消防庁にあります。また、個々の掲載情報については出典元にあります。
ソースコードについては Aapache license 2.0 において公開します。
