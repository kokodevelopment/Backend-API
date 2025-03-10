module.exports = (app, utils) => {
    app.post("/api/v1/users/passwordLogin", utils.cors(), utils.rateLimiter({
        validate: {
            trustProxy: true,
            xForwardedForHeader: true,
        },
        windowMs: 1000 * 10,  // 1 requests per 10 seconds
        limit: 1,
        standardHeaders: 'draft-7',
        legacyHeaders: false,
    }), async function (req, res) {
        const packet = req.body;

        const username = (String(packet.username)).toLowerCase();
        const password = packet.password;
        const captcha_token = packet.captcha_token;

        // verify token
        const success = await fetch("https://api.hcaptcha.com/siteverify", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: `response=${captcha_token}&secret=${process.env.HCaptchaSecret}`
        }).then(res => res.json()).then(json => {
            return json.success;
        });

        //if (!success) {
        //    utils.error(res, 400, "InvalidCaptcha");
        //    return;
        // }

        if (!username || !password) {
            utils.error(res, 400, "Missing username or password");
            return;
        }

        if (!await utils.UserManager.existsByUsername(username, true)) {
            utils.error(res, 401, "InvalidCredentials");
            return;
        }

        let token = await utils.UserManager.loginWithPassword(username, password, true);
        if (!token) {
            utils.error(res, 401, "InvalidCredentials");
            return;
        }

        await utils.UserManager.addIP(username, req.realIP);

        res.status(200);
        res.header("Content-Type", 'application/json');
        res.json({ "token": token });
    });
}
