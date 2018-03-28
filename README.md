# Nearest Station Map

駅の位置をボロノイ分割したポリゴンを表示します。  
駅メモのチェックインの参考にするために作りましたが、駅メモで使われている駅の位置情報と同じ位置に駅が置かれているとは限らないのでご注意ください。

## 使い方

[Github Pages](https://kmr-zoar.github.io/nearest_station_map/) にアクセスすると使えます。  
地図アプリと同じ様な操作で自分のいる位置を中心にできます。GNSS を利用可能な場合は左下の`自己位置`ボタンをタップすると GNSS で取得した位置が中心になるように移動します。

地図上をタップするとタップした位置において最も近い駅の名称が表示されます。  

## データについて

使っている駅のデータは[駅データ.jp](http://www.ekidata.jp/)を次のように加工して母点データにしています。

```sh
$ cat station20171109free.csv | awk -F, '{print $3","$10","$11}' > station.csv
$ csv2geojson -lat "lat" --lon "lon" -delimiter "," station.csv > station.geojson
```

csv2geojson は Mapbox の公開している [csv2geojson](https://github.com/mapbox/csv2geojson) です。

License MIT.
