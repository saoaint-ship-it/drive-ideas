<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# コースを追加・変更したときは必ずルートを点検する

過去に「ルートの線が別の道の上に乗っている」誤りが3件見つかっている。
サイトの信頼性に直結するため、コースの追加・ルート変更のたびに
下記のダブルチェックを必ず行うこと。

```bash
node scripts/audit-routes.mjs <slug>   # 追加・変更したコースだけを点検
node scripts/audit-routes.mjs          # 全コースを一括点検
```

点検は「保存済みのルートライン上の点が、実際にどの道路の上にあるか」を
OSRMに問い合わせて確かめる。あわせて標高(ASTER GDEM)と距離を登録値と突き合わせる。

## 見つかった誤りのパターン（同じ罠を踏まないこと）

| コース | 何が起きたか | 対策 |
| --- | --- | --- |
| 伊勢志摩スカイライン | 有料道路を避けて並行する無料の谷道に逃げていた | 尾根・山頂を経由地に明示する |
| 千里浜なぎさドライブウェイ | 砂浜ではなく内陸の一般道を走っていた | 砂浜上の点を経由地に並べ、全点のスナップ先を確認する |
| 富士山スカイライン | 周遊区間だけで、山頂へ登る区間が入っていなかった | その道の代表的な最高地点に到達しているか標高で確かめる |

## 追加時の手順

1. Nominatimで起終点・経由地の座標を特定する
2. OSRMを `steps=true` で走らせ、**通過する道路名が実在の国道・県道番号と一致するか**を確認する
3. 標高(ASTER GDEM)を実測し、その道の性格と矛盾しないか確かめる
   （峠なら高い、海岸線なら低い、有料の山岳路なら山を越えている）
4. `node scripts/audit-routes.mjs <slug>` で点検する
5. 空撮動画を書き出し、フレームを抜き出して地形と一致するか目視確認する
