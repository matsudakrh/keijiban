

function login() {
    
}

function sessionCheck(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
}

function isLogined(req, res, next) {
    if (req.session.user) {
        return true;
    } else {
        return false;
    }
}

module.exports.sessionCheck = sessionCheck;