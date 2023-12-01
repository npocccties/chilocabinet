drop table if exists users cascade;
drop table if exists submitted_badges cascade;
-- -----------------------------------------------------------------------------
-- ユーザーID
create table users (
    user_id varchar(256) not null,               -- ユーザーID(外部連携ID)
    user_name varchar(256) not null,             -- ユーザー氏名
    created_at timestamp not null,               -- 作成日時
    primary key(user_id)
);

-- 提出済みバッジ
create table submitted_badges (
    user_id varchar(256) not null,              -- ユーザーID(外部連携ID)
    user_email varchar(256) not null,           -- ユーザーEmail
    submitted_at timestamp not null,            -- 提出日時
    badge_name varchar(256) not null,           -- バッジ名
    badge_class_id text not null,               -- バッジクラスID
    badge_email varchar(256) not null,          -- バッジ所有者Email
    badge_issuer_name varchar(256) not null,    -- バッジ発行者名
    badge_description text,                     -- バッジ説明
    badge_data bytea not null,                  -- バッジデータ
    badge_issued_on timestamp,                  -- バッジ発行日時
    downloaded_at timestamp,                    -- ダウンロード日時
    primary key(user_id, submitted_at, badge_class_id)
);

create index on submitted_badges (
    badge_name
);

create index on submitted_badges (
    downloaded_at
);
