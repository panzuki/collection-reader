# コレクションニュースリーダー - セットアップガイド

## ファイル構成
```
your-repo/
├── index.html      ← メインアプリ (PWA)
├── sw.js           ← Service Worker
├── manifest.json   ← PWAマニフェスト
└── README.md       ← このファイル
```

---

## 🚀 GitHub Pages デプロイ手順

### 1. GitHubリポジトリ作成
1. https://github.com でサインイン
2. 「New repository」→ リポジトリ名を入力（例: `collection-reader`）
3. **Public** に設定（GitHub Pages 無料利用のため）
4. 「Create repository」

### 2. ファイルをアップロード
**方法A: ブラウザから直接アップロード（スマホ対応）**
1. リポジトリページで「Add file」→「Upload files」
2. `index.html`, `sw.js`, `manifest.json` をドラッグ or 選択
3. 「Commit changes」

**方法B: GitHub.dev（スマホ対応 Web版VSCode）**
1. リポジトリURLの `github.com` を `github.dev` に変更
2. ブラウザ上でVSCodeが起動
3. ファイルを作成・編集・保存

**方法C: Termux (Android)**
```bash
# Termux のセットアップ
pkg update && pkg install git openssh nodejs

# SSH鍵生成
ssh-keygen -t ed25519 -C "your@email.com"
cat ~/.ssh/id_ed25519.pub  # GitHubに登録

# リポジトリをクローン
git clone git@github.com:YOUR_USERNAME/collection-reader.git
cd collection-reader

# ファイルを配置後
git add .
git commit -m "初回デプロイ"
git push origin main
```

### 3. GitHub Pages を有効化
1. リポジトリ → 「Settings」→「Pages」
2. Source: 「Deploy from a branch」
3. Branch: `main` / `/ (root)`
4. 「Save」
5. 数分後に `https://YOUR_USERNAME.github.io/collection-reader/` で公開！

---

## 📱 スマホ開発環境の選択肢

### 🥇 GitHub.dev（推奨・最も簡単）
- URL: `github.dev/YOUR_USERNAME/collection-reader`
- ブラウザだけで完結
- コード補完あり
- コミット/プッシュが可能
- **iOS Safari / Android Chrome 対応**

### 🥈 Termux + git (Android)
```bash
# 必要なパッケージ
pkg install git nodejs python

# ローカルサーバー起動（チューニング時）
cd collection-reader
python -m http.server 8080
# → ブラウザで http://localhost:8080 にアクセス

# 変更をGitHubへプッシュ
git add . && git commit -m "update" && git push
```

### 🥉 Stackblitz / CodeSandbox（オンラインIDE）
- https://stackblitz.com または https://codesandbox.io
- GitHubと連携してリポジトリを開く
- スマホブラウザで動作
- リアルタイムプレビュー付き

---

## ⚙️ サイト設定のチューニング方法

### 設定画面から直接編集
1. アプリ → 「⚙️設定」タブ
2. 「サイト設定 (config.json)」セクション
3. JSONを編集して「💾 保存・適用」

### RSSフィードURLの種類

**1. 直接RSSフィード（最も安定）**
```json
{
  "rssUrl": "https://example.com/rss.xml",
  "type": "rss"
}
```

**2. Google News RSS検索（RSSがないサイト向け）**
```json
{
  "rssUrl": "https://news.google.com/rss/search?q=site:panews.jp&hl=ja&gl=JP&ceid=JP:ja",
  "type": "gnews"
}
```

**3. Google News キーワード検索**
```json
{
  "rssUrl": "https://news.google.com/rss/search?q=米粉+新製品&hl=ja&gl=JP&ceid=JP:ja",
  "type": "gnews"
}
```

### テスト手順
1. アプリ → 「🧪テスト」タブ
2. 試したいRSS URLを入力
3. プロキシを選択（rss2json推奨）
4. 「▶ テスト実行」で記事が取得できるか確認
5. 問題なければ設定に追加

### 各サイトのRSS URL調べ方
- サイトの `<head>` タグに `<link type="application/rss+xml">` があれば直接RSSあり
- URLに `/rss`, `/feed`, `/atom.xml` を試す
- `テスト` タブの「Google News RSSジェネレーター」でドメインから自動生成

---

## 🔧 CORSプロキシの使い分け

| プロキシ | 無料枠 | 安定性 | 備考 |
|---------|--------|--------|------|
| rss2json.com | 10,000回/日 | ★★★ | RSS専用、推奨 |
| allorigins.win | 無制限 | ★★☆ | 汎用、時々不安定 |
| corsproxy.io | 制限あり | ★★☆ | バックアップ用 |

---

## 📂 config.json サンプル（拡張版）

```json
{
  "version": "1.0",
  "collections": [
    {
      "id": "pan-news",
      "name": "🍞 パンニュース",
      "sites": [
        {
          "id": "site001",
          "name": "パンニュース",
          "domain": "pan-news.jp",
          "rssUrl": "https://news.google.com/rss/search?q=site:pan-news.jp&hl=ja&gl=JP&ceid=JP:ja",
          "type": "gnews",
          "enabled": true,
          "fetchCount": 5
        }
      ]
    }
  ]
}
```

---

## 🔄 更新フロー（Termux）

```bash
# 1. ローカルで編集
nano index.html  # または code-server, neovim等

# 2. ローカルプレビュー
python -m http.server 8080

# 3. 動作確認後、GitHubへプッシュ
git add .
git commit -m "フィード設定更新"
git push origin main
# → GitHub Pages に自動デプロイ（1-2分後）
```
