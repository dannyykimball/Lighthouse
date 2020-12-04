/* eslint-disable no-undef */
const e = require('express');
const { getClassById } = require('../data/classes');
const { getUserByToken } = require('../data/users');
const Router = e.Router();

Router.get('/', async (req, res) => {
    const userLookup = await getUserByToken(req.session.token);
    if (userLookup.error)
        return res.status(500).json({ error: 'An error occurred.' });
    const user = userLookup.user;
    const classes = (
        await Promise.all(user.classes.map((classID) => getClassById(classID)))
    ).map((course) => course.class);
    res.render('dashboard', {
        title: 'Dashboard',
        name: `${user.fullName.firstName} ${user.fullName.lastName}`,
        classes,
        instructor: !!req.session.instructor,
    });
});

module.exports = Router;
