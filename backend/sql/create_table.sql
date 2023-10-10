drop table if exists user_emails cascade;
drop table if exists submitted_badges cascade;
-- -----------------------------------------------------------------------------
-- ユーザーEMail
create table user_emails (
    user_email text not null,                -- ユーザーEmail
    user_name varchar(256) null,             -- ユーザ名
    created_at timestamp not null,           -- 作成日時
    primary key(user_email)       
);

-- 提出済みバッジ
create table submitted_badges (
    user_email text not null,              -- ユーザーEmail
    submittede_at timestamp not null,      -- 提出日時
    badge_name varchar(256) null,          -- バッジ名
    badge_class_id text not null,          -- バッジクラスID
    badge_email text not null,             -- バッジEmail
    badge_issure_name varchar(256) null,   -- バッジ発行者名
    badge_data bytea not null,             -- バッジデータ
    downloaded_at timestamp null,          -- ダウンロード日時
    primary key(user_email, submittede_at, badge_class_id),
    foreign key (user_email) references user_emails (user_email)
);

create index on submitted_badges (
    badge_name
);

create index on submitted_badges (
    downloaded_at
);

