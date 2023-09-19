drop table if exists user_emails cascade;
drop table if exists submitted_badges cascade;
-- ----------------------------------------------------------------------------------------------------
-- ユーザーEMail
create table user_emails (
    user_email text primary key,    -- ユーザーEmail
    user_name varchar(256),         -- ユーザ名
    create_time timestamp not null  -- 作成日時
);

-- 提出済みバッジ
create table submitted_badges (
    user_email text not null references user_emails (user_email),  -- ユーザーEmail
    submission_time timestamp not null,                            -- 提出日時
    badge_name varchar(256),                                       -- バッジ名
    badge_class_id text not null,                                  -- バッジクラスID
    badge_email text not null,                                     -- バッジEmail
    badge_data bytea not null,                                     -- バッジデータ
    PRIMARY KEY(user_email, submission_time, badge_class_id)       -- 
);
