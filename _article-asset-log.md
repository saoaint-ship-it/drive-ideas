# 記事メイン写真 収集ログ（photoAC → hero.jpg配置）

方式C適用: 新規記事38本のメイン写真を1本1枚ずつ収集・配置。本文内写真(inline-1)は対象外（任意）。

## 配置済み（38/38・完了）
新規記事38本すべてのメイン写真配置が完了しました。

## 全50記事・メイン写真配置完了（2026-07-14）
旧12記事のうち残っていた8本も追加で収集・配置完了:
car-insurance-basics, compact-suv-fuel-ranking-2026, driving-posture-guide, ev-charging-plan,
new-cars-2026-2h, shachuhaku-car-ranking-2026, traffic-violation-points, winter-tire-chain-guide
→ これで全50記事にメイン写真設置済み。本文内写真(inline-1)のみ今後の任意対応。

## メモ
- 配置先: /images/journal/<slug>/hero.jpg
- 配置コマンド: MSYS_NO_PATHCONV=1 node scripts/place-asset.mjs <DLファイル> /images/journal/<slug>/hero.jpg
- 検索語は各記事frontmatterのphotoQueryを使用
