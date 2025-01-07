const express = require('express');
const router = express.Router();
const { format } = require('date-fns');

router.get('/home', (req, res) => {
    const blogID = req.query.blogID;
    global.db.all('SELECT a.*, u.UserName, b.* FROM Article a, Blog b, User u WHERE a.BlogID = b.BlogId AND b.UserID = u.UserId AND a.BlogID = ? AND ArticleStatus = "published"', [blogID], (err, publishedArticles) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error retrieving published articles");
        } else {
            global.db.all('SELECT a.*, b.*  FROM Article a, Blog b WHERE b.BlogID = a.BlogID AND a.BlogID = ? AND a.ArticleStatus = "draft"', [blogID], (err, draftArticles) => {
                if (err) {
                    console.error(err);
                    res.status(500).send("Error retrieving draft articles");
                } else {
                    global.db.get('SELECT b.*, u.UserName FROM Blog b, User u WHERE b.UserID = u.UserID AND b.BlogID = ?', [blogID], (err, blog) => {
                        if (err) {
                            console.error(err);
                            res.status(500).send("Error retrieving blog information");
                        } else {
                            publishedArticles = publishedArticles.map(article => ({
                                ...article,
                                ArticleDateCreated: format(new Date(article.ArticleDateCreated), 'yyyy-MM-dd HH:mm:ss'),
                                DatePublished: format(new Date(article.DatePublished), 'yyyy-MM-dd HH:mm:ss')
                            }));
                            draftArticles = draftArticles.map(article => ({
                                ...article,
                                ArticleDateCreated: format(new Date(article.ArticleDateCreated), 'yyyy-MM-dd HH:mm:ss'),
                                DateLastEdited: format(new Date(article.DateLastEdited), 'yyyy-MM-dd HH:mm:ss')
                            }));

                            res.render('author-home', { blog, publishedArticles, draftArticles, userID: blog.UserID });
                        }
                    });
                }
            });
        }
    });
});

router.post('/publish', (req, res) => {
    const { articleID, blogID } = req.body;
    const datePublished = new Date().toISOString();
    
    global.db.run('UPDATE Article SET ArticleStatus = "published", DatePublished = ? WHERE ArticleID = ?', [datePublished, articleID], function(err) {
        if (err) {
            console.error(err);
            res.status(500).send("Error publishing article");
        } else {
            res.redirect(`/author/Home?blogID=${blogID}`);
        }
    });
});

router.post('/delete', (req, res) => {
    const { articleID, blogID } = req.body;
    global.db.run('DELETE FROM Comments WHERE ArticleID = ?', [articleID], function(err) {
        if (err) {
            console.error(err);
            res.status(500).send("Error deleting comments");
        } else {
            global.db.run('DELETE FROM Article WHERE ArticleID = ?', [articleID], function(err) {
                if (err) {
                    console.error(err);
                    res.status(500).send("Error deleting article");
                } else {
                    res.redirect(`/author/Home?blogID=${blogID}`);
                }
            });
        }
    });
});

router.get('/edit', (req, res) => {
    const articleID = req.query.articleID;
    global.db.get('SELECT * FROM Article WHERE ArticleID = ?', [articleID], (err, article) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error retrieving article details");
        } else {
            const blogID = article.BlogID;
            global.db.get('SELECT BlogID, b.BlogTitle, b.BlogSubTitle, u.UserName FROM Blog b, User u WHERE b.UserID = u.UserID AND b.BlogID = ?', [blogID], (err, blog) => {
                if (err) {
                    console.error(err);
                    res.status(500).send("Error retrieving blog information");
                } else {
                    article.ArticleDateCreated = format(new Date(article.ArticleDateCreated), 'yyyy-MM-dd HH:mm:ss');
                    article.DateLastEdited = format(new Date(article.DateLastEdited), 'yyyy-MM-dd HH:mm:ss');

                    res.render('edit-article', { blog, article });
                }
            });
        }
    });
});

router.post('/update-article', (req, res) => {
    const { blogID, articleID, articleTitle, articleSubtitle, articleText } = req.body;
    const dateLastEdited = new Date().toISOString();
    global.db.run('UPDATE Article SET ArticleTitle = ?, ArticleSubtitle = ?, ArticleText = ?, DateLastEdited = ? WHERE ArticleID = ?', [articleTitle, articleSubtitle, articleText, dateLastEdited, articleID], (err) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error updating article");
        } else {
            res.redirect(`/author/Home?blogID=${blogID}`);
        }
    });
});


router.post('/create-draft', (req, res) => {
    const { blogID, articleTitle, articleSubtitle, articleText } = req.body;
    const ArticleDateCreated = new Date().toISOString();
    const DateLastEdited = new Date().toISOString();
    const ArticleStatus = 'draft';
    
    global.db.run('INSERT INTO Article (BlogID, ArticleTitle, ArticleSubtitle, ArticleText, DateLastEdited, ArticleDateCreated, ArticleStatus) VALUES (?, ?, ?, ?, ?, ?, ?)', [blogID, articleTitle, articleSubtitle, articleText, ArticleDateCreated, DateLastEdited, ArticleStatus], (err) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error creating article");
        } else {
            res.redirect(`/author/Home?blogID=${blogID}`);
        }
    });
});


router.get('/create-draft', (req, res) => {
    const blogID = req.query.blogID;
    global.db.get('SELECT b.*, u.UserName FROM Blog b, User u WHERE b.UserID = u.UserID AND b.BlogID = ?', [blogID], (err, blog) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error retrieving blog information");
        } else {
            res.render('create-draft', { blog });
        }
    });
});

router.get('/settings', (req, res) => {
    const blogID = req.query.blogID;
    global.db.get('SELECT b.*, u.UserName FROM Blog b, User u WHERE b.UserID = u.UserID AND b.BlogID = ?', [blogID], (err, blog) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error retrieving blog information");
        } else {
            res.render('author-setting', { blog });
        }
    });
});

router.post('/update-settings', (req, res) => {
    const { blogID, blogTitle, blogSubtitle, userName } = req.body;

    global.db.run('UPDATE Blog SET BlogTitle = ?, BlogSubTitle = ? WHERE BlogID = ?', [blogTitle, blogSubtitle, blogID], (err) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error updating blog settings");
        } else {
            global.db.run('UPDATE User SET UserName = ? WHERE UserID = (SELECT UserID FROM Blog WHERE BlogID = ?)', [userName, blogID], (err) => {
                if (err) {
                    console.error(err);
                    res.status(500).send("Error updating user settings");
                } else {
                    res.redirect(`/author/Home?blogID=${blogID}`);
                }
            });
        }
    });
});

module.exports = router;