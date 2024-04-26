module.exports = (app, utils) => {
    app.get('/api/v1/projects/getProjectsByAuthor', async (req, res) => {
        const packet = req.query;

        const page = packet.page || 0;

        const projects = await utils.UserManager.getFeaturedProjects(page, utils.env.PageSize);

        return res.send(projects);
    });
}