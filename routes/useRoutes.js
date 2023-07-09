const usersController = require("../controlers/usersController");
const passport = require('passport');

module.exports = (app, upload) => {
    app.post('/api/users/login', usersController.login);
    app.post('/api/users/create', usersController.register);
    app.post('/api/users/createWithImage', upload.array('image', 1), usersController.registerWithImage);
    
    // 401 UNAUTHORIZED
    app.put('/api/users/updateWithImage', passport.authenticate('jwt', {session: false}), upload.array('image', 1), usersController.updateWithImage);
    app.put('/api/users/updateWithoutImage', passport.authenticate('jwt', {session: false}), usersController.updateWithoutImage);
    
    app.get('/api/users/findDeliveryMen', passport.authenticate('jwt', {session: false}), usersController.findDeliveryMen);
}