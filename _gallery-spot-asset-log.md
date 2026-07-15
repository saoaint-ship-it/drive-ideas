# ギャラリー・スポット・記事内画像 収集ログ

hero.jpg（全50コース・全50記事）は完了済み。ここからは任意の追加素材（ギャラリー写真・スポット写真・記事本文中の画像）の収集ログ。

## 現状（2026-07-15 継続作業後）
- コース関連（ギャラリー+スポット、全169枠）: **完了**
- 記事内画像（inline-N、46枠）: 進行中、25/46完了（折り返し）
  完了: new-cars-2026-2h, compact-suv-fuel-ranking-2026, drive-plan-method,
  gasoline-price-outlook-2026, sa-pa-guide, shachuhaku-car-ranking-2026,
  kei-car-highway-ranking-2026, long-drive-fatigue-tips, ev-charging-plan,
  ev-charging-infra-2026, sports-car-under-5m-ranking, car-insurance-basics,
  winter-tire-chain-guide, rainy-day-driving, adas-tech-2026, traffic-violation-points,
  fuel-saving-driving, open-car-ranking-2026, driving-posture-guide,
  expressway-driving-rules, car-photo-guide, minivan-family-ranking-2026,
  car-wash-basics, car-tax-guide, pet-drive-guide
- Chrome拡張タブが頻繁にフリーズする問題が継続中。都度: 新規タブ作成→旧タブclose→再ナビゲート
- 残り21記事は下記リストの順番通りに検索語("wanted"欄)で検索して収集

## 配置済み（累計47枚のギャラリー写真）
aso-panorama-line (gallery-1, gallery-2), bandai-azuma-skyline (gallery-1, gallery-2),
hachimantai-aspite-line (gallery-1), izu-skyline (gallery-1), hakone-turnpike (gallery-1),
shimanami-kaido (gallery-1), ufo-line (gallery-1), shiretoko-odan (gallery-1),
biei-patchwork (gallery-1), naitai-kogen (gallery-1), ororon-line (gallery-1),
shakotan-blue-road (gallery-1), zao-echo-line (gallery-1), chokai-blue-line (gallery-1),
towada-oirase (gallery-1), bandai-gold-line (gallery-1), kusatsu-shiga (gallery-1),
akagi-nanmen (gallery-1), boso-flower-line (gallery-1), okutama-shuyu (gallery-1),
tsukuba-purple-line (gallery-1), hakusan-shirakawago (gallery-1), chirihama-nagisa (gallery-1),
nishi-izu-skyline (gallery-1), fujisan-skyline (gallery-1), kaida-kogen (gallery-1),
chausuyama-kogen (gallery-1), yatsugatake-echo-line (gallery-1),
mikatagoko-rainbow-line (gallery-1), koya-ryujin-skyline (gallery-1), ise-shima-skyline (gallery-1),
oku-biwako-parkway (gallery-1), rokko-drive (gallery-1), tango-peninsula (gallery-1),
akiyoshidai-karst-road (gallery-1), hiruzen-daisen-skyline (gallery-1), washuzan-skyline (gallery-1),
shikoku-karst (gallery-1), yokonami-kuroshio-line (gallery-1), sadamisaki-melody-line (gallery-1),
yamanami-highway (gallery-1), ibusuki-skyline (gallery-1), amakusa-pearl-line (gallery-1),
kaichu-doro (gallery-1), niraikanai-bridge (gallery-1)

## 進捗（累計52枚のギャラリー写真、gallery-1/2は全完了）
gallery-2も含め全52枚完了（5コースのgallery-2: hachimantai-aspite-line, izu-skyline,
hakone-turnpike, shimanami-kaido, ufo-line も完了）

## スポット写真 進捗（142/142枚配置済み、全コース完了）
- コース関連(ギャラリー+スポット)は全て完了。残りは記事内画像(inline-N、46枠)のみ
- Chrome拡張タブが頻繁にフリーズする場合、新規タブ作成→旧タブclose→再ナビゲートで復旧できる
- ダウンロードクリックが反応しない場合、place-asset.mjsが古いファイルを拾ってしまうことがある。同名ファイルが続くときは要注意
完了: aso-panorama-line (全5枚), bandai-azuma-skyline (全4枚),
hachimantai-aspite-line (全4枚), izu-skyline (全4枚), hakone-turnpike (全3枚),
shimanami-kaido (全4枚), ufo-line (全4枚), shiretoko-odan (全3枚),
biei-patchwork (全3枚), naitai-kogen (全3枚), ororon-line (全3枚), shakotan-blue-road (全3枚),
zao-echo-line (全3枚), chokai-blue-line (全3枚), towada-oirase (全3枚),
bandai-gold-line (全3枚), kusatsu-shiga (全3枚), akagi-nanmen (全3枚), boso-flower-line (全3枚),
okutama-shuyu (全3枚), tsukuba-purple-line (全3枚), hakusan-shirakawago (全3枚), chirihama-nagisa (全3枚),
nishi-izu-skyline (全3枚), fujisan-skyline (全3枚), kaida-kogen (全3枚), chausuyama-kogen (全3枚),
yatsugatake-echo-line (全3枚), mikatagoko-rainbow-line (全3枚), koya-ryujin-skyline (全3枚),
ise-shima-skyline (全3枚), oku-biwako-parkway (全3枚), rokko-drive (全3枚), tango-peninsula (全3枚),
akiyoshidai-karst-road (全3枚), hiruzen-daisen-skyline (全3枚), washuzan-skyline (全3枚), shikoku-karst (全3枚),
yokonami-kuroshio-line (全3枚), sadamisaki-melody-line (全3枚), yamanami-highway (全3枚), ibusuki-skyline (全3枚),
amakusa-pearl-line (全3枚), kaichu-doro (全3枚)

## 残りコース一覧（各3枚、API `/api/assets` で随時確認）
niraikanai-bridge（最後の1コース）

## 注意（2026-07-15追記2）
- Chrome拡張のタブが度々フリーズする（Page.captureScreenshotタイムアウト）。
  発生時は tabs_create_mcp で新規タブを作り、tabs_close_mcp で古いタブを閉じてから再開する

## 未着手（優先順・API `/api/assets` で正確なスポット名を都度確認）
1. コースのスポット写真（残り約99枚）。次のコース順（spots配列の順番通りに1枚ずつ）:
   zao-echo-line(御釜/滝見台/大黒天駐車場) → chokai-blue-line(鉾立展望台/大平台展望台/道の駅象潟ねむの丘)
   → towada-oirase(石ヶ戸休憩所/銚子大滝/十和田湖畔休屋) → bandai-gold-line(八方台登山口/とび滝展望台/こがね平)
   → kusatsu-shiga(渋峠国道最高地点碑/横手山ドライブイン/山田峠) → akagi-nanmen(赤城神社/大沼湖畔駐車場/新坂平展望台)
   → boso-flower-line(洲埼灯台/平砂浦海岸/野島埼灯台) → okutama-shuyu(月夜見第一駐車場/都民の森/奥多摩湖ダムサイト)
   → tsukuba-purple-line(つつじヶ丘駐車場/朝日峠展望公園/風返峠) → hakusan-shirakawago(三方岩駐車場/ふくべの大滝/白川郷展望台)
   → chirihama-nagisa(千里浜レストハウス/なぎさ今浜口/砂像エリア) → nishi-izu-skyline(達磨山登山口駐車場/戸田峠/土肥駐車場)
   → fujisan-skyline(水ヶ塚公園/西臼塚駐車場/富士山本宮浅間大社) → kaida-kogen(九蔵峠展望台/開田高原アイスクリーム工房/木曽馬の里)
   → chausuyama-kogen(茶臼山高原/面ノ木園地/売木峠) → yatsugatake-echo-line(原村の丘/八ヶ岳自然文化園)
   → それ以降は `curl -s http://localhost:3120/api/assets` で残りのcourse spot一覧を都度取得
2. 記事本文中の画像（inline-1、46枠、優先度は最も低い）

## 注意（2026-07-15追記）
- photoAC作業中にCAPTCHAが数回連続で出た。都度オーナーに確認を依頼（私では解けない）。
  ブラウザタブが再作成されるとtabIdが変わることがあるので、エラー時はtabs_context_mcpで確認する

## 作業方法（継続する場合）
1. photoAC (https://www.photo-ac.com) でコース名/スポット名で検索
2. 横長の写真を選び、モーダルを開いてMサイズをダウンロード
3. ダウンロード直後、ファイルの新しさとファイル名パターンを確認してから配置
   （他の作業でDownloadsフォルダに別ファイルが入る可能性があるため、誤って拾わないよう注意）
   ```bash
   LATEST=$(ls -t "/c/Users/saoai/Downloads"/*.jpg | head -1)
   AGE=$(( $(date +%s) - $(stat -c %Y "$LATEST") ))
   # AGEが30秒以内、かつファイル名が数字+_m.jpgのパターンであることを確認してから配置
   ```
4. 配置コマンド:
   ```bash
   MSYS_NO_PATHCONV=1 node scripts/place-asset.mjs "<ダウンロードファイル>" /images/courses/<slug>/gallery-N.jpg
   ```
5. 進捗確認: `curl -s http://localhost:3120/api/assets` で全体の未設置数を確認可能（開発サーバー起動中のみ）

## メモ
- CAPTCHA（ロボット確認）が出た場合は必ずオーナーに確認をお願いする（自動で解決しない）
- 検索語が漢字違いでヒットしない場合がある（例: 美瑛→美瑨と誤入力、瓶ヶ森→瞶ヶ森と誤変換など）。ヒットしなければ表記ゆれを疑う
- ポートレート写真しかない場合はそのまま使用可（object-coverでクロップされるため実用上問題ない）
