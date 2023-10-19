drop table if exists mywallets cascade;
drop table if exists badge_vcs cascade;
drop table if exists submissions cascade;
-- ----------------------------------------------------------------------------------------------------

-- マイウォレット
create table mywallets (
    mywallet_id serial primary key,    -- ウォレットID
    orthros_id text not null unique,   -- オルトロスID
    create_time timestamp not null     -- 作成日時
);

-- バッジVCテーブル
create table badge_vcs (
    badge_vc_id serial primary key,                                     -- バッジVC ID
    mywallet_id integer not null references mywallets (mywallet_id),    -- マイウォレットID
    moodle_name varchar(256),                                           -- Moodle名
    badge_category varchar(256),                                        -- バッジ名
    badge_name varchar(256),                                            -- バッジカテゴリ
    badge_email text not null,                                          -- バッジEMail
    badge_class_id text not null,                                       -- バッジクラスID
    badge_issuer_name VARCHAR(256) not null,                            -- バッジ発行者名
    badge_issuedon timestamp not null,                                  -- バッジ発行日時
    vc_data_header text not null,                                       -- VCデータヘッダ
    vc_data_payload text not null,                                      -- VCデータペイロード
    vc_data_signature text not null,                                    -- VCデータ署名
    create_time timestamp not null                                      -- 作成日時
);

-- 提出履歴
create table submissions (
    badge_vc_id integer not null references mywallets (mywallet_id),    -- バッジVC ID
    mywallet_id integer not null,                                       -- マイウォレットID
    submission_time timestamp not null,                                 -- 提出日時
    submission_email text not null,                                     -- 提出EMAILアドレス
    submission_to varchar(256) not null,                                -- 提出先名
    PRIMARY KEY(badge_vc_id,submission_time)
);

