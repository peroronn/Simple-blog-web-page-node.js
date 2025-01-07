
const express = require('express');
const router = express.Router();

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    global.db.get(
        'SELECT UserID FROM User WHERE LoginUserName = ? AND UserPassword = ?', 
        [username, password], 
        (err, user) => {
            if (err) {
                console.error(err);
                res.status(500).send("Error logging in");
            } else if (!user) {
              res.send(`
                <script>
                    alert("Invalid username or password");
                    window.location.href = "http://localhost:3000/";
                </script>
              `);
            } else {
                const userID = user.UserID;
                res.redirect(`/blog/home?userID=${userID}`);
            }
        }
    );
});

router.get('/register', (req, res) => {
    res.render('add-user', { errors: [] });
});

router.post('/register', (req, res) => {
    const { username, LoginUserName, password } = req.body;
    let errors = [];
    if (!username || username.length < 3) {
        errors.push('Author Name must be at least 3 characters long');
    }
    if (!LoginUserName || LoginUserName.length < 3) {
        errors.push('Username must be at least 3 characters long');
    }
    if (!password || password.length < 4) {
        errors.push('Password must be at least 4 characters long');
    }
    if (errors.length > 0) {
        return res.render('add-user', { errors });
    }
    global.db.get('SELECT UserID FROM User WHERE LoginUserName = ?', [LoginUserName], (err, user) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error checking username");
        } else if (user) {
            errors.push('Username already exists');
            return res.render('add-user', { errors });
        } else {
            global.db.run(
                'INSERT INTO User (UserName, LoginUserName, UserPassword) VALUES (?, ?, ?)', 
                [username, LoginUserName, password], 
                (err) => {
                    if (err) {
                        console.error(err);
                        res.status(500).send("Error registering user");
                    } else {
                        res.redirect('/');
                    }
                }
            );
        }
    });
});

module.exports = router;