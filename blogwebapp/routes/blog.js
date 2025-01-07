const express = require('express');
const router = express.Router();
const { format } = require('date-fns');

router.get('/home', (req, res) => {
    const userID = req.query.userID;
    global.db.all(
        'SELECT b.BlogID, b.BlogTitle, b.BlogSubTitle, b.DateCreated, u.UserID, u.UserName FROM Blog b JOIN User u ON b.UserID = u.UserID WHERE b.UserID = ?', 
        [userID], 
        (err, blogs) => {
            if (err) {
                console.error(err);
                res.status(500).send("Error retrieving blogs");
            } else {
                blogs = blogs.map(blog => ({
                    ...blog,
                    DateCreated: format(new Date(blog.DateCreated), 'yyyy-MM-dd HH:mm:ss')
                }));
                res.render('blog-home', { blogs, userID });
            }
        }
    );
});


router.get('/create', (req, res) => {
    const userID = req.query.userID;
    global.db.get('SELECT * FROM User WHERE UserID = ?', [userID], (err, user) => {
        if (err) {
            console.error("Database error:", err);
            res.status(500).send("Error retrieving User information");
        } else if (!user) {
            console.error("User not found for UserID:", userID);
            res.status(404).send("User not found");
        } else {
            res.render('create-blog', { user });
        }
    });
});

router.post('/create', (req, res) => {
    const { userID, blogTitle, blogSubTitle } = req.body;
    const dateCreated = new Date().toISOString();
    global.db.run(
        'INSERT INTO Blog (UserID, BlogTitle, BlogSubTitle, DateCreated) VALUES (?, ?, ?, ?)',
        [userID, blogTitle, blogSubTitle, dateCreated],
        function (err) {
            if (err) {
                console.error(err);
                res.status(500).send("Error creating blog");
            } else {
                res.redirect(`/blog/home?userID=${userID}`);
            }
        }
    );
});

router.post('/delete', (req, res) => {
    const blogID = req.body.blogID;
    global.db.serialize(() => {
        global.db.run('BEGIN TRANSACTION');
        global.db.run(
            'DELETE FROM Comments WHERE ArticleID IN (SELECT ArticleID FROM Article WHERE BlogID = ?)',
            [blogID],
            function(err) {
                if (err) {
                    console.error("Error deleting comments:", err);
                    global.db.run('ROLLBACK');
                    res.status(500).send("Error deleting comments");
                    return;
                }
                global.db.run(
                    'DELETE FROM Article WHERE BlogID = ?',
                    [blogID],
                    function(err) {
                        if (err) {
                            console.error("Error deleting articles:", err);
                            global.db.run('ROLLBACK');
                            res.status(500).send("Error deleting articles");
                            return;
                        }
                        global.db.run(
                            'DELETE FROM Blog WHERE BlogID = ?',
                            [blogID],
                            function(err) {
                                if (err) {
                                    console.error("Error deleting blog:", err);
                                    global.db.run('ROLLBACK');
                                    res.status(500).send("Error deleting blog");
                                } else {
                                    global.db.run('COMMIT');
                                    res.redirect(`/blog/home?userID=${req.body.userID}`);
                                }
                            }
                        );
                    }
                );
            }
        );
    });
});

module.exports = router;