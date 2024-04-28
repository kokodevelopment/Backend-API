module.exports = (app, utils) => {
    app.get('/api/v1/users/getmyfeed', async function (req, res) {
        const packet = req.query;

        const username = packet.username;
        const token = packet.token;

        if (!username || !token) {
            utils.error(res, 400, "InvalidData");
            return;
        }

        if (!await utils.UserManager.loginWithToken(token, username)) {
            utils.error(res, 401, "InvalidToken");
            return;
        }

        const feed = await utils.UserManager.getUserFeed(username, utils.env.FeedSize);

        res.status(200);
        res.header("Content-Type", 'application/json');
        res.send({ feed: feed });
    });
}