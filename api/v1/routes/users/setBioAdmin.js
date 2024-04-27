module.exports = (app, utils) => {
    app.post('/api/v1/users/setbioadmin', async function (req, res) {
        const packet = req.body;

        const username = packet.username;
        const token = packet.token;

        const target = packet.target;
        const bio = packet.bio;

        if (!await utils.UserManager.loginWithToken(username, token)) {
            utils.error(res, 400, "Reauthenticate");
            return;
        }

        if (!await utils.UserManager.isAdmin(username)) {
            utils.error(res, 400, "Unauthorized");
            return;
        }

        if (typeof bio !== "string") {
            utils.error(res, 400, "InvalidBioInput")
            return;
        }

        if (bio.length > 2048) {
            utils.error(res, 400, "BioLengthMustBeLessThan2048Chars")
            return;
        }

        utils.sendBioUpdatelog(username, user, await utils.UserManager.getBio(user), bio);

        await utils.UserManager.setBio(user, bio);
        
        res.status(200);
        res.header("Content-Type", 'application/json');
        res.send({ "success": true });
    });
}