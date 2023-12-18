# 動作環境
- OS: Unix 系（Windows では WSL 等をお使いください）
- Node.js: v16.20.1
- Docker
- Docker Compose (v2)

# setup
git clone実行後、ルートディレクトリで以下のコマンドを実行します。
```
script/setup.sh
```

# 開発
makeコマンドがインストールされていない場合は、適宜インストールしてください。

コンテナのビルド
```
docker compose -f docker-compose.dev-local.yml build
```

コンテナ起動（キャビネットアプリ開始）
```
docker compose -f docker-compose.dev-local.yml up -d
```

コンテナのdown（キャビネットアプリ停止）
```
docker compose -f docker-compose.dev-local.yml down
```

コンテナ起動と同時にキャビネットアプリが自動開始します、自動起動としたくない場合は

docker-compose.dev-local.yml ファイルの command: 行を以下のようにコメントアウトしてください。
```
# command: npm run dev
```

自動起動でない場合、コンテナ起動後にキャビネットアプリ起動する手順

chilocabinetコンテナ内に移動
```
script/inapp.sh
```

chilocabinetコンテナ内でキャビネットアプリ起動
```
npm run dev
```

## prismaの使用方法
詳細に関しては[ドキュメント](https://www.prisma.io/docs/reference/api-reference/command-reference)を参照してください。

1. コンテナ起動後、以下のコマンドでDBのテーブル定義をschema.prismaに反映します。
```
npx prisma db pull
```

2. 立ち上げたDBコンテナへダミーデータを反映する場合は、以下のコマンドを使用してください。
```
npx prisma db seed
```

3. [Prisma Studio](https://www.prisma.io/docs/concepts/components/prisma-studio)を起動します。（localhost:5555が起動する）
```
npx prisma studio
```

# 開発サーバー（または本番サーバー）

1. 下記をインストール
   * Docker
   * Docker Compose (v2)
   * Git  
1. 適当なディレクトリへ移動
   ```
   cd /work
   ```
1. chilocabinet のソースを取得
   ```
   git clone https://github.com/npocccties/chilocabinet.git
   ```
   * 既にディレクトリが存在するならば `sudo rm -rf chilocabinet` にて削除してください
1. chilocabinet へ移動
   ```
   cd chilocabinet
   ```
1. `*.sh` に権限付与
   ```
   sudo chmod 755 *.sh
   ```
1. 環境変数を定義した `.env` をルートディレクトリに配置
    * ルートディレクトリで、`script/setup.sh` を実行する
    * .envの`ALLOWED_HOSTS`に記載されているドメインを、デプロイ先のドメインに設定する
1. BASIC認証ID/パスワードを設定した`.htpasswd`ファイルを`authfile/`ディレクトリに配置
    * `.htpasswd`ファイルは`htpasswd`コマンド等で作成する
    * `htpasswd`コマンドの使用方法、複数回コマンド実行する事により複数ユーザーのパスワード情報がファイルに追加出力される
    ```   
    htpasswd -c パスワードファイル名 ユーザー名
    （パスワードを追加入力）
    ```
1. デプロイ
   ```
   ./app_start.sh
   ```
   * 権限付与後の `app_start.sh` は何度でも実行可能です

1. 備考  
   コンテナ起動  
   ```
   chilocabinet/app_start.sh
   ```

   コンテナ停止  
   ```
   chilocabinet/app_stop.sh
   ```
   * DBが `/var/chilocabinet.dump` にバックアップされます  

   コンテナ再起動  
   ```
   chilocabinet/app_restart.sh
   ```
   * `app_stop.sh` と `app_start.sh` を呼びます

   DBバックアップ  
   ```
   chilocabinet/server_db_backup.sh
   ```
   * DBが `/var/chilocabinet.dump` にダンプ出力されます  
   * 上記ファイルは、環境変数 `DUMP_BACKUP_DIR` のディレクトリへ .tar.gz 形式で圧縮および格納されます
   * 古い圧縮ファイルは削除されます（環境変数 `DUMP_BACKUP_COUNT` で保持する期間を日数で指定）
   
   DBリストア  
   ```
   chilocabinet/server_db_restore.sh
   ```
   * `/var/chilocabinet.dump` にあるバックアップデータをもとにDBをリストア（復元）します  

   全てのコンテナログの確認  
   ```
   docker container logs -f 
   ```
   * -f の後ろにコンテナ名（chilocabinetやdb等）を入れると該当コンテナのみのログが見れます  

## テストデータ作成
コンテナ起動後、chilocabinetに入り、下記を実行
```
npx prisma db seed
```

もしType Error等で失敗する場合は、`npx prisma generate`を実行してから再度上記のコマンドを実行してください。
※ ビルドキャッシュなどの影響で、稀にschema.prismaの中身がローカルのファイルと異なった状態でコピーされていることがあります。その場合はdockerのキャッシュを適宜削除して再度コンテナを起動してください。

`npx prisma generate` コマンド実行にroot権限が必要なためdockerコンテナ内にログインする場合は以下のコマンドを実行して下さい。
    ```
    docker container exec -it u 0 chilocabinet sh
    ```



# 環境変数

## DB, ビルド時用
.env
| 変数名                               | 説明                                        | デフォルト値         | 必須/任意|
| :----------------------------------- | :------------------------------------------ | :------------------- | :---- |
|SSL_CERTS_DIR|サーバー証明書の配置ディレクトリ|・ディレクトリの末尾には `/` は付与しないこと<br>・本番環境では下記の命名でファイルを配置しておくこと<br>　`signed.crt`: サーバー証明書<br>　`domain.key`: サーバー証明書の秘密鍵|必須|
|ALLOWED_HOSTS|公開ホスト名|本番リリースする際は本番サーバーのホスト名を設定してください|必須|
|DB_HOST|DBのホスト名|docker-compose.*.yml に記載されている`db`がホスト名|必須|
|DB_NAME|DB名|-|必須|
|DB_USER|DBのユーザ名|-|必須|
|DB_PASS|DBのパスワード|-|必須|
|DATABASE_URL|接続先データベースのURL|-|必須|
|LOG_LEVEL|ログレベル<br>'fatal', 'error', 'warn', 'info', 'debug', 'trace' or 'silent'|info|必須|
|LOG_MAX_SIZE|ログファイルサイズ<br>単位には k / m / g のいずれか指定|100m|必須|
|LOG_MAX_FILE|ログファイルの世代数|7|必須|
|DUMP_BACKUP_DIR|DBの圧縮ファイルのバックアップディレクトリ（絶対パス指定）<br>DBバックアップを実行すると `/var/chilocabinet.dump` をダンプ出力するが、そのダンプファイルを下記命名で圧縮したうえで左記ディレクトリに格納する<br>`chilocabinet.dump_{yyyyMMdd}.tar.gz`|/var/chilocabinet.dump|必須|
|DUMP_BACKUP_COUNT|DBの圧縮ファイルの保持日数<br>・保持日数を経過したDBの圧縮ファイルは削除される (例)1週間、保持したい場合は `7` を指定する<br>・削除の契機は、DBバックアップの実行時<br>・起点は昨日|7|必須|

## Next.jsアプリケーション用
Next.jsアプリケーションでは、環境毎に以下のパターンで.envファイルを参照します。

| ファイル名 |	読み込まれるタイミング
| :--------- | :--------- | 
|.env.local |	毎回
|.env.development |	next dev 時のみ
|.env.production	| next start 時のみ

https://nextjs.org/docs/pages/building-your-application/configuring/environment-variables

以下の2つの環境変数の値を記述します。

.env.development

.env.production

| 変数名                               | 説明                                        | デフォルト値         |必須/任意|
| :----------------------------------- | :------------------------------------------ | :------------------- | :---- |
|baseURL|アプリケーション起動時のURL|http://localhost:3000|必須|
|clientName|アプリケーションの名称|chilocabinet|必須|
|NEXT_PUBLIC_USERLIST_TITLE|学習者一覧画面に表示されるタイトル文字列|-|必須|
|NEXT_PUBLIC_HELP_LINK|ヘッダの「ヘルプ」をクリックした場合に開かれるURL|-|必須|

## configの設定値
/config/constants.ts に設定されている固定値

基本的に設定の変更は不要です。

```
export const EXPORT_CSV_VER="20231115";
export const OPENBADGE_VERIFIER_URL="https://openbadgesvalidator.imsglobal.org/results";
```

| 変数名                               | 説明                                        | 
| :----------------------------------- | :------------------------------------------ | 
|EXPORT_CSV_VER|バッジ提出者リストCSVを出力する際にCSVバージョンカラムに設定される文字列です|
|OPENBADGE_VERIFIER_URL|ウォレットからバッジ提出時にバッジの妥当性確認のために使用する検証サイトURLです|

## nginxの設定
nginx.conf ファイルの以下箇所を編集します。

```   
server {
    server_name dev-cabinet.oku.cccties.org;    # 本番用に差し替えること
```

| 変数名                               | 説明                                        | 
| :----------------------------------- | :------------------------------------------ | 
|server/server_name|キャビネットWebアプリのドメイン名を指定します。（例）dev-cabinet.oku.cccties.org|

