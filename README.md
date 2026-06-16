# AI HTML Slide Prompt Workflow

HTMLスライド制作プロンプト集の使い方を、実際に使う人向けに案内するLPです。

## 公開ページ

- LP: https://uiharuyuki.github.io/niray-04_html-prompts/
- Prompt: `prompts/`
- LP仕様書: `docs/lp-spec.md`

## 主な構成

- `index.html`: 公開LP
- `assets/css/style.css`: LP用CSS
- `assets/js/main.js`: LP用JavaScript
- `assets/js/data.js`: `data/*.json` から生成される表示用データ
- `data/prompts.json`: promptカードの正本データ
- `data/examples.json`: 成果物プレビューの正本データ
- `tools/build-data-js.js`: JSONから表示用データを生成
- `tools/capture-first-views.js`: 成果物ページのファーストビュー撮影
- `.github/workflows/update-screenshots.yml`: スクリーンショット定期更新

## ローカル作業

```powershell
npm install
npm run build:data
npm run screenshots
```

`screenshots` は `data/examples.json` のURLを開き、`assets/examples/screenshots/` にPNGを保存します。

