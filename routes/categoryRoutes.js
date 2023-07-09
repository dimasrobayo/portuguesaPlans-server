const categoryController = require('../controlers/categoriesController');
const passport = require('passport');

module.exports = (app, upload) => {
    app.get('/api/categories/getAll', passport.authenticate('jwt', {session: false}), categoryController.getAll);
    app.post('/api/categories/create', passport.authenticate('jwt', {session: false}), upload.array('image', 1), categoryController.create);
    app.put('/api/categories/updateWithImage', passport.authenticate('jwt', {session: false}) , upload.array('image', 1), categoryController.updateWithImage);
    app.put('/api/categories/update', passport.authenticate('jwt', {session: false}) , categoryController.update);
    app.delete('/api/categories/delete/:id', passport.authenticate('jwt', {session: false}), categoryController.delete);
}