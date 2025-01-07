const express = require('express');
const router = express.Router();
const { format } = require('date-fns');

const safeFormatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date) ? 'Invalid Date' : format(date, 'yyyy-MM-dd HH:mm:ss');
};

router.get('/home', (req, res) => {
    global.db.all(
        'SELECT a.ArticleTitle, a.ArticleSubtitle, a.ArticleID, a.DatePublished, a.NoOfViews, a.NoOfLikes, u.UserName FROM Article a, Blog b, User u where b.BlogID=a.BlogID AND b.UserID=u.UserID AND a.ArticleStatus="published"',
        (err, publishedArticles) => {
            if (err) {
                console.error(err);
                res.status(500).send("Error retrieving published articles");
            } else {
                publishedArticles = publishedArticles.map(article => ({
                    ...article,
                    DatePublished: safeFormatDate(article.DatePublished)
                }));

                res.render('reader-home', { publishedArticles });
            }
        }
    );
});

router.get('/view', (req, res) => {
    const articleID = req.query.articleID;
    global.db.run(
        'UPDATE Article SET NoOfViews = NoOfViews + 1 WHERE ArticleID = ?', 
        [articleID], 
        function(err) {
            if (err) {
                console.error(err);
                res.status(500).send("Error updating views");
            } else {
                global.db.get(
                    'SELECT a.*, u.UserName, b.BlogTitle, b.BlogSubTitle FROM Article a, User u, Blog b WHERE a.BlogID = b.BlogID AND b.UserID = u.UserID AND a.ArticleID = ?', 
                    [articleID], 
                    (err, article) => {
                        if (err) {
                            console.error(err);
                            res.status(500).send("Error retrieving article details");
                        } else {
                            global.db.all(
                                'SELECT c.*, u.UserName FROM Comments c, User u, Blog b, Article a WHERE c.ArticleID = a.ArticleID AND a.BlogID = b.BlogID AND b.UserID = u.UserID AND c.ArticleID = ?', 
                                [articleID], 
                                (err, comments) => {
                                    if (err) {
                                        console.error(err);
                                        res.status(500).send("Error retrieving comments");
                                    } else {
                                        article.DateCreated = safeFormatDate(article.DateCreated);
                                        article.DateLastEdited = safeFormatDate(article.DateLastEdited);
                                        comments = comments.map(comment => ({
                                            ...comment,
                                            DateCommented: safeFormatDate(comment.DateCommented)
                                        }));
                                        res.render('reader-article', { article, comments });
                                    }
                                }
                            );
                        }
                    }
                );
            }
        }
    );
});

router.post('/like-article', (req, res) => {
    const articleID = req.body.articleID;
    global.db.run('UPDATE Article SET NoOfLikes = NoOfLikes + 1 WHERE ArticleID = ?', [articleID], (err) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error updating likes");
        } else {
            res.redirect(`/reader/view?articleID=${articleID}`);
        }
    });
});

router.post('/update-comment', (req, res) => {
    const { articleID, CommentsText } = req.body;
    const DateCommented = new Date().toISOString();
    global.db.run('INSERT INTO Comments (CommentsText, DateCommented, ArticleID) VALUES (?, ?, ?)', [CommentsText, DateCommented, articleID], (err) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error creating comment");
        } else {
            res.redirect(`/reader/view?articleID=${articleID}`);
        }
    });
});

module.exports = router;