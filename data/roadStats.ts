// このファイルは scripts/compute-road-stats.mjs が自動生成したものです。
// ルート形状(paths.ts)と標高プロファイルから計算した道のデータ。手で編集しないこと。
// hairpins: ヘアピンカーブ数(累積回転150°以上) / corners: カーブ数(60°以上、ヘアピン含む)
// maxGradientPct: 最大勾配の目安(%)。標高サンプル間の平均勾配のため実際の瞬間勾配より小さめに出る。

export type RoadStats = {
  hairpins: number;
  corners: number;
  maxGradientPct: number | null;
};

export const roadStats: Record<string, RoadStats> = {
 "sky-road-shari": {
  "hairpins": 0,
  "corners": 2,
  "maxGradientPct": 1.7
 },
 "irohazaka": {
  "hairpins": 37,
  "corners": 81,
  "maxGradientPct": 10.2
 },
 "venus-line": {
  "hairpins": 5,
  "corners": 65,
  "maxGradientPct": 2.8
 },
 "metasequoia-namiki": {
  "hairpins": 0,
  "corners": 1,
  "maxGradientPct": 1.5
 },
 "tsunoshima-ohashi": {
  "hairpins": 0,
  "corners": 18,
  "maxGradientPct": 3.4
 },
 "aso-panorama-line": {
  "hairpins": 3,
  "corners": 37,
  "maxGradientPct": 3.2
 },
 "bandai-azuma-skyline": {
  "hairpins": 10,
  "corners": 83,
  "maxGradientPct": 8.9
 },
 "hachimantai-aspite-line": {
  "hairpins": 3,
  "corners": 60,
  "maxGradientPct": 8.1
 },
 "izu-skyline": {
  "hairpins": 4,
  "corners": 70,
  "maxGradientPct": 3.1
 },
 "hakone-turnpike": {
  "hairpins": 0,
  "corners": 16,
  "maxGradientPct": 12.2
 },
 "shimanami-kaido": {
  "hairpins": 2,
  "corners": 17,
  "maxGradientPct": 0.8
 },
 "ufo-line": {
  "hairpins": 4,
  "corners": 41,
  "maxGradientPct": 6.1
 },
 "shiretoko-odan": {
  "hairpins": 3,
  "corners": 46,
  "maxGradientPct": 7.8
 },
 "biei-patchwork": {
  "hairpins": 0,
  "corners": 15,
  "maxGradientPct": 1.3
 },
 "naitai-kogen": {
  "hairpins": 3,
  "corners": 30,
  "maxGradientPct": 4.9
 },
 "ororon-line": {
  "hairpins": 0,
  "corners": 30,
  "maxGradientPct": 2.2
 },
 "shakotan-blue-road": {
  "hairpins": 1,
  "corners": 33,
  "maxGradientPct": 2.1
 },
 "zao-echo-line": {
  "hairpins": 9,
  "corners": 70,
  "maxGradientPct": 5.8
 },
 "chokai-blue-line": {
  "hairpins": 12,
  "corners": 74,
  "maxGradientPct": 9.8
 },
 "towada-oirase": {
  "hairpins": 0,
  "corners": 6,
  "maxGradientPct": 3.8
 },
 "bandai-gold-line": {
  "hairpins": 5,
  "corners": 55,
  "maxGradientPct": 6.9
 },
 "kusatsu-shiga": {
  "hairpins": 7,
  "corners": 77,
  "maxGradientPct": 6.1
 },
 "akagi-nanmen": {
  "hairpins": 8,
  "corners": 37,
  "maxGradientPct": 7.9
 },
 "boso-flower-line": {
  "hairpins": 1,
  "corners": 17,
  "maxGradientPct": 0.2
 },
 "okutama-shuyu": {
  "hairpins": 1,
  "corners": 60,
  "maxGradientPct": 11.3
 },
 "tsukuba-purple-line": {
  "hairpins": 0,
  "corners": 38,
  "maxGradientPct": 6.4
 },
 "hakusan-shirakawago": {
  "hairpins": 4,
  "corners": 45,
  "maxGradientPct": 7.5
 },
 "chirihama-nagisa": {
  "hairpins": 0,
  "corners": 0,
  "maxGradientPct": 0.1
 },
 "nishi-izu-skyline": {
  "hairpins": 2,
  "corners": 36,
  "maxGradientPct": 11.8
 },
 "fujisan-skyline": {
  "hairpins": 8,
  "corners": 40,
  "maxGradientPct": 10.1
 },
 "kaida-kogen": {
  "hairpins": 0,
  "corners": 22,
  "maxGradientPct": 4.6
 },
 "chausuyama-kogen": {
  "hairpins": 2,
  "corners": 24,
  "maxGradientPct": 7
 },
 "yatsugatake-echo-line": {
  "hairpins": 0,
  "corners": 6,
  "maxGradientPct": 4.2
 },
 "mikatagoko-rainbow-line": {
  "hairpins": 0,
  "corners": 12,
  "maxGradientPct": 10.2
 },
 "koya-ryujin-skyline": {
  "hairpins": 5,
  "corners": 54,
  "maxGradientPct": 7.4
 },
 "ise-shima-skyline": {
  "hairpins": 1,
  "corners": 45,
  "maxGradientPct": 10.1
 },
 "oku-biwako-parkway": {
  "hairpins": 1,
  "corners": 30,
  "maxGradientPct": 2.1
 },
 "rokko-drive": {
  "hairpins": 2,
  "corners": 48,
  "maxGradientPct": 6.2
 },
 "tango-peninsula": {
  "hairpins": 1,
  "corners": 30,
  "maxGradientPct": 1
 },
 "akiyoshidai-karst-road": {
  "hairpins": 0,
  "corners": 25,
  "maxGradientPct": 2.1
 },
 "hiruzen-daisen-skyline": {
  "hairpins": 3,
  "corners": 47,
  "maxGradientPct": 2.9
 },
 "washuzan-skyline": {
  "hairpins": 4,
  "corners": 35,
  "maxGradientPct": 6.5
 },
 "shikoku-karst": {
  "hairpins": 6,
  "corners": 49,
  "maxGradientPct": 2.3
 },
 "yokonami-kuroshio-line": {
  "hairpins": 1,
  "corners": 43,
  "maxGradientPct": 0.6
 },
 "sadamisaki-melody-line": {
  "hairpins": 0,
  "corners": 8,
  "maxGradientPct": 1.9
 },
 "yamanami-highway": {
  "hairpins": 1,
  "corners": 28,
  "maxGradientPct": 4
 },
 "ibusuki-skyline": {
  "hairpins": 0,
  "corners": 43,
  "maxGradientPct": 1.7
 },
 "amakusa-pearl-line": {
  "hairpins": 0,
  "corners": 11,
  "maxGradientPct": 0.7
 },
 "kaichu-doro": {
  "hairpins": 1,
  "corners": 18,
  "maxGradientPct": 0.2
 },
 "niraikanai-bridge": {
  "hairpins": 2,
  "corners": 12,
  "maxGradientPct": 9.5
 },
 "irabu-bridge": {
  "hairpins": 0,
  "corners": 6,
  "maxGradientPct": 1.4
 },
 "ibukiyama-driveway": {
  "hairpins": 2,
  "corners": 43,
  "maxGradientPct": 10.6
 },
 "aso-milk-road": {
  "hairpins": 0,
  "corners": 23,
  "maxGradientPct": 3.7
 },
 "nichinan-phoenix-road": {
  "hairpins": 0,
  "corners": 21,
  "maxGradientPct": 2.3
 },
 "bihoro-pass": {
  "hairpins": 0,
  "corners": 16,
  "maxGradientPct": 8.4
 },
 "merhen-kaido": {
  "hairpins": 6,
  "corners": 60,
  "maxGradientPct": 7.6
 },
 "ororon-line-sarobetsu": {
  "hairpins": 0,
  "corners": 6,
  "maxGradientPct": 0.3
 },
 "soya-white-road": {
  "hairpins": 0,
  "corners": 1,
  "maxGradientPct": 7.3
 },
 "esanuka-line": {
  "hairpins": 1,
  "corners": 5,
  "maxGradientPct": 0.9
 },
 "notsuke-peninsula": {
  "hairpins": 0,
  "corners": 0,
  "maxGradientPct": 0.1
 },
 "north-pacific-seaside": {
  "hairpins": 0,
  "corners": 38,
  "maxGradientPct": 0.7
 },
 "mikuni-pass": {
  "hairpins": 0,
  "corners": 38,
  "maxGradientPct": 7
 },
 "niseko-panorama-line": {
  "hairpins": 0,
  "corners": 40,
  "maxGradientPct": 6.2
 },
 "erimo-cape": {
  "hairpins": 0,
  "corners": 3,
  "maxGradientPct": 2.7
 },
 "tatsudomari-line": {
  "hairpins": 5,
  "corners": 45,
  "maxGradientPct": 10.8
 },
 "shiriyazaki": {
  "hairpins": 0,
  "corners": 7,
  "maxGradientPct": 2.6
 },
 "kanpuzan-panorama": {
  "hairpins": 0,
  "corners": 9,
  "maxGradientPct": 1.2
 },
 "oshika-cobalt-line": {
  "hairpins": 1,
  "corners": 20,
  "maxGradientPct": 4.5
 },
 "tagokura-lake": {
  "hairpins": 4,
  "corners": 52,
  "maxGradientPct": 4.3
 },
 "oma-goe-kaido": {
  "hairpins": 0,
  "corners": 4,
  "maxGradientPct": 6.8
 },
 "nyudozaki": {
  "hairpins": 0,
  "corners": 2,
  "maxGradientPct": 5.3
 },
 "myogisan-road": {
  "hairpins": 5,
  "corners": 29,
  "maxGradientPct": 5
 },
 "nishio-momiji-line": {
  "hairpins": 4,
  "corners": 35,
  "maxGradientPct": 7.4
 },
 "sasagawa-nagare": {
  "hairpins": 0,
  "corners": 3,
  "maxGradientPct": 3.8
 },
 "yahikoyama-skyline": {
  "hairpins": 8,
  "corners": 35,
  "maxGradientPct": 10.1
 },
 "kumanogawa-route": {
  "hairpins": 2,
  "corners": 17,
  "maxGradientPct": 5.2
 },
 "hieizan-driveway": {
  "hairpins": 1,
  "corners": 26,
  "maxGradientPct": 10.7
 },
 "motosuko-loop": {
  "hairpins": 1,
  "corners": 29,
  "maxGradientPct": 2.2
 },
 "jet-coaster-road": {
  "hairpins": 0,
  "corners": 0,
  "maxGradientPct": 5.4
 },
 "biei-panorama-road": {
  "hairpins": 0,
  "corners": 4,
  "maxGradientPct": 3.4
 },
 "sakura-nanohana-road": {
  "hairpins": 0,
  "corners": 2,
  "maxGradientPct": 0.3
 },
 "bandai-azuma-lakeline": {
  "hairpins": 5,
  "corners": 46,
  "maxGradientPct": 6
 },
 "utsukushigahara-highland": {
  "hairpins": 9,
  "corners": 51,
  "maxGradientPct": 17.6
 },
 "ontake-skyline": {
  "hairpins": 0,
  "corners": 9,
  "maxGradientPct": 7.1
 },
 "fuji-subaru-line": {
  "hairpins": 1,
  "corners": 29,
  "maxGradientPct": 9.6
 },
 "ashinoko-hakone-skyline": {
  "hairpins": 5,
  "corners": 38,
  "maxGradientPct": 10
 },
 "haruna-melody-line": {
  "hairpins": 1,
  "corners": 13,
  "maxGradientPct": 8.5
 },
 "osado-skyline": {
  "hairpins": 4,
  "corners": 36,
  "maxGradientPct": 11.6
 },
 "shirasaki-coast": {
  "hairpins": 0,
  "corners": 14,
  "maxGradientPct": 4.5
 },
 "kaizu-osaki": {
  "hairpins": 0,
  "corners": 0,
  "maxGradientPct": 2.7
 },
 "awaji-sunset-line": {
  "hairpins": 0,
  "corners": 10,
  "maxGradientPct": 1.2
 },
 "akan-crossing-road": {
  "hairpins": 0,
  "corners": 13,
  "maxGradientPct": 5.3
 },
 "hakkoda-towada-gold-line": {
  "hairpins": 0,
  "corners": 10,
  "maxGradientPct": 5.9
 },
 "ikitsuki-sunset-way": {
  "hairpins": 1,
  "corners": 12,
  "maxGradientPct": 11
 },
 "toimisaki-line": {
  "hairpins": 1,
  "corners": 7,
  "maxGradientPct": 10.7
 },
 "sakurajima-view-road": {
  "hairpins": 4,
  "corners": 29,
  "maxGradientPct": 14.1
 },
 "isahaya-bay-levee": {
  "hairpins": 0,
  "corners": 3,
  "maxGradientPct": 0.7
 },
 "kouri-bridge": {
  "hairpins": 0,
  "corners": 1,
  "maxGradientPct": 2.7
 },
 "okuoi-sesso": {
  "hairpins": 3,
  "corners": 26,
  "maxGradientPct": 8.7
 },
 "seseragi-kaido": {
  "hairpins": 0,
  "corners": 10,
  "maxGradientPct": 3.7
 },
 "noto-kongo": {
  "hairpins": 0,
  "corners": 18,
  "maxGradientPct": 1.3
 },
 "echizen-coast-305": {
  "hairpins": 2,
  "corners": 16,
  "maxGradientPct": 6
 },
 "pearl-road": {
  "hairpins": 1,
  "corners": 37,
  "maxGradientPct": 4.5
 },
 "notojima-loop": {
  "hairpins": 1,
  "corners": 22,
  "maxGradientPct": 1
 },
 "nishiizu-kendo17": {
  "hairpins": 3,
  "corners": 61,
  "maxGradientPct": 6.3
 },
 "r249-okunoto": {
  "hairpins": 0,
  "corners": 15,
  "maxGradientPct": 1.9
 }
};
