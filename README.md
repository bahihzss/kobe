# PrAha Challenge - Kobe

> ブートキャンプの課題を管理するツールの API

## 機能

* メンバー管理
* 自動チーム編成
* シンプルな課題進捗管理

## インストール

最初に最新の pnpm をインストールしてください

```bash
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

次に以下のコマンドで動作に必要なパッケージをインストールします

```bash
pnpm install
```

## 開発

このプロジェクトはモノレポで構成されています  
開発に関しては、各パッケージの README.md を参照してください

## ディレクトリ構成

### app
コアになる Nest アプリケーションが入っています  
modules と packages を組み合わせて構成されています

### modules
Nest Module を格納しています

### packages
共有して使用するロジック・型・設定ファイルなどを格納しています
