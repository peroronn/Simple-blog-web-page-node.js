PRAGMA foreign_keys=ON;

BEGIN TRANSACTION;

CREATE TABLE User (
    UserID INTEGER PRIMARY KEY AUTOINCREMENT,
    UserName VARCHAR(100) NOT NULL,
    LoginUserName VARCHAR (100) NOT NULL,
    UserPassword VARCHAR(100) NOT NULL
);

CREATE TABLE Blog (
    BlogID INTEGER PRIMARY KEY AUTOINCREMENT,
    UserID INTEGER NOT NULL,
    BlogTitle VARCHAR(50),
    BlogSubTitle VARCHAR(50),
    DateCreated TEXT,
    FOREIGN KEY (UserID) REFERENCES User(UserID)
);

CREATE TABLE Article (
    ArticleID INTEGER PRIMARY KEY AUTOINCREMENT,
    BlogID INTEGER NOT NULL,
    ArticleTitle VARCHAR(100) NOT NULL,
    ArticleSubtitle VARCHAR(200) NOT NULL,
    ArticleText VARCHAR(300),
    ArticleStatus VARCHAR(10),
    ArticleDateCreated TEXT,
    DatePublished TEXT,
    DateLastEdited TEXT,
    NoOfViews INTEGER DEFAULT 0,
    NoOfLikes INTEGER DEFAULT 0,
    FOREIGN KEY (BlogID) REFERENCES Blog(BlogID)
);

CREATE TABLE Comments (
    CommentsID INTEGER PRIMARY KEY AUTOINCREMENT,
    ArticleID INTEGER NOT NULL,
    CommentsText VARCHAR(300),
    DateCommented TEXT,
    FOREIGN KEY (ArticleID) REFERENCES Article(ArticleID)
);

INSERT INTO User (UserName, LoginUserName, UserPassword) VALUES ('Eve', 'admin', 'admin');
INSERT INTO User (UserName, LoginUserName, UserPassword) VALUES ('Frank', 'frank2024', '1234');
INSERT INTO User (UserName, LoginUserName, UserPassword) VALUES ('Grace', 'grace2024', '1234');

INSERT INTO Blog (UserID, BlogTitle, BlogSubTitle, DateCreated) VALUES (1, 'Eves Blog', 'Life Hacks', '2024-07-06 17:05:33');
INSERT INTO Blog (UserID, BlogTitle, BlogSubTitle, DateCreated) VALUES (1, 'Eves Tech Blog', 'Technology Explained', '2024-07-06 17:05:33');
INSERT INTO Blog (UserID, BlogTitle, BlogSubTitle, DateCreated) VALUES (2, 'Franks Blog', 'Healthy Living', '2024-07-06 17:05:33');
INSERT INTO Blog (UserID, BlogTitle, BlogSubTitle, DateCreated) VALUES (2, 'Franks Fitness Blog', 'Fitness Tips', '2024-07-06 17:05:33');
INSERT INTO Blog (UserID, BlogTitle, BlogSubTitle, DateCreated) VALUES (3, 'Graces Blog', 'Travel Diaries', '2024-07-06 17:05:33');
INSERT INTO Blog (UserID, BlogTitle, BlogSubTitle, DateCreated) VALUES (3, 'Graces Cooking Blog', 'Delicious Recipes', '2024-07-06 17:05:33');

INSERT INTO Article (BlogID, ArticleTitle, ArticleSubtitle, ArticleText, ArticleStatus, ArticleDateCreated, DatePublished, DateLastEdited, NoOfViews, NoOfLikes) VALUES (1, 'Life Hack 1', 'Save Time', 'Tips to save time.', 'published', '2024-07-06 17:05:33', '2024-07-06 17:05:33', '2024-07-06 17:05:33', 50, 10);
INSERT INTO Article (BlogID, ArticleTitle, ArticleSubtitle, ArticleText, ArticleStatus, ArticleDateCreated, DatePublished, DateLastEdited, NoOfViews, NoOfLikes) VALUES (1, 'Life Hack 2', 'Save Money', 'Tips to save money.', 'published', '2024-07-06 17:05:33', '2024-07-06 17:05:33', '2024-07-06 17:05:33', 40, 8);
INSERT INTO Article (BlogID, ArticleTitle, ArticleSubtitle, ArticleText, ArticleStatus, ArticleDateCreated, DatePublished, DateLastEdited, NoOfViews, NoOfLikes) VALUES (2, 'Tech Explained 1', 'Understanding AI', 'Basics of AI.', 'published', '2024-07-06 17:05:33', '2024-07-06 17:05:33', '2024-07-06 17:05:33', 100, 20);
INSERT INTO Article (BlogID, ArticleTitle, ArticleSubtitle, ArticleText, ArticleStatus, ArticleDateCreated, DatePublished, DateLastEdited, NoOfViews, NoOfLikes) VALUES (2, 'Tech Explained 2', 'Understanding ML', 'Basics of Machine Learning.', 'published', '2024-07-06 17:05:33', '2024-07-06 17:05:33', '2024-07-06 17:05:33', 80, 15);
INSERT INTO Article (BlogID, ArticleTitle, ArticleSubtitle, ArticleText, ArticleStatus, ArticleDateCreated, DatePublished, DateLastEdited, NoOfViews, NoOfLikes) VALUES (3, 'Healthy Living Tips 1', 'Healthy Eating', 'Tips for healthy eating.', 'published', '2024-07-06 17:05:33', '2024-07-06 17:05:33', '2024-07-06 17:05:33', 60, 12);
INSERT INTO Article (BlogID, ArticleTitle, ArticleSubtitle, ArticleText, ArticleStatus, ArticleDateCreated, DatePublished, DateLastEdited, NoOfViews, NoOfLikes) VALUES (3, 'Healthy Living Tips 2', 'Regular Exercise', 'Benefits of regular exercise.', 'published', '2024-07-06 17:05:33', '2024-07-06 17:05:33', '2024-07-06 17:05:33', 70, 14);
INSERT INTO Article (BlogID, ArticleTitle, ArticleSubtitle, ArticleText, ArticleStatus, ArticleDateCreated, DatePublished, DateLastEdited, NoOfViews, NoOfLikes) VALUES (4, 'Fitness Tip 1', 'Cardio', 'Importance of cardio exercises.', 'published', '2024-07-06 17:05:33', '2024-07-06 17:05:33', '2024-07-06 17:05:33', 90, 18);
INSERT INTO Article (BlogID, ArticleTitle, ArticleSubtitle, ArticleText, ArticleStatus, ArticleDateCreated, DatePublished, DateLastEdited, NoOfViews, NoOfLikes) VALUES (4, 'Fitness Tip 2', 'Strength Training', 'Benefits of strength training.', 'published', '2024-07-06 17:05:33', '2024-07-06 17:05:33', '2024-07-06 17:05:33', 95, 20);
INSERT INTO Article (BlogID, ArticleTitle, ArticleSubtitle, ArticleText, ArticleStatus, ArticleDateCreated, DatePublished, DateLastEdited, NoOfViews, NoOfLikes) VALUES (5, 'Travel Diary 1', 'Exploring Europe', 'My travel experiences in Europe.', 'published', '2024-07-06 17:05:33', '2024-07-06 17:05:33', '2024-07-06 17:05:33', 110, 25);
INSERT INTO Article (BlogID, ArticleTitle, ArticleSubtitle, ArticleText, ArticleStatus, ArticleDateCreated, DatePublished, DateLastEdited, NoOfViews, NoOfLikes) VALUES (5, 'Travel Diary 2', 'Exploring Asia', 'My travel experiences in Asia.', 'published', '2024-07-06 17:05:33', '2024-07-06 17:05:33', '2024-07-06 17:05:33', 115, 28);
INSERT INTO Article (BlogID, ArticleTitle, ArticleSubtitle, ArticleText, ArticleStatus, ArticleDateCreated, DatePublished, DateLastEdited, NoOfViews, NoOfLikes) VALUES (6, 'Recipe 1', 'Pasta', 'Delicious pasta recipe.', 'published', '2024-07-06 17:05:33', '2024-07-06 17:05:33', '2024-07-06 17:05:33', 75, 16);
INSERT INTO Article (BlogID, ArticleTitle, ArticleSubtitle, ArticleText, ArticleStatus, ArticleDateCreated, DatePublished, DateLastEdited, NoOfViews, NoOfLikes) VALUES (6, 'Recipe 2', 'Salad', 'Healthy salad recipe.', 'published', '2024-07-06 17:05:33', '2024-07-06 17:05:33', '2024-07-06 17:05:33', 85, 19);

INSERT INTO Comments (ArticleID, CommentsText, DateCommented) VALUES (1, 'These tips are great!', '2024-07-06 17:05:33');
INSERT INTO Comments (ArticleID, CommentsText, DateCommented) VALUES (1, 'Very useful information.', '2024-07-06 17:05:33');
INSERT INTO Comments (ArticleID, CommentsText, DateCommented) VALUES (2, 'Interesting read on AI.', '2024-07-06 17:05:33');
INSERT INTO Comments (ArticleID, CommentsText, DateCommented) VALUES (2, 'Loved the explanation.', '2024-07-06 17:05:33');
INSERT INTO Comments (ArticleID, CommentsText, DateCommented) VALUES (3, 'Great tips for healthy living.', '2024-07-06 17:05:33');
INSERT INTO Comments (ArticleID, CommentsText, DateCommented) VALUES (3, 'Helpful advice.', '2024-07-06 17:05:33');
INSERT INTO Comments (ArticleID, CommentsText, DateCommented) VALUES (4, 'Cardio is essential.', '2024-07-06 17:05:33');
INSERT INTO Comments (ArticleID, CommentsText, DateCommented) VALUES (4, 'Strength training tips are spot on.', '2024-07-06 17:05:33');
INSERT INTO Comments (ArticleID, CommentsText, DateCommented) VALUES (5, 'Europe is amazing.', '2024-07-06 17:05:33');
INSERT INTO Comments (ArticleID, CommentsText, DateCommented) VALUES (5, 'Asia is on my bucket list.', '2024-07-06 17:05:33');
INSERT INTO Comments (ArticleID, CommentsText, DateCommented) VALUES (6, 'Delicious pasta recipe!', '2024-07-06 17:05:33');
INSERT INTO Comments (ArticleID, CommentsText, DateCommented) VALUES (6, 'Love the healthy salad.', '2024-07-06 17:05:33');

COMMIT;