const AddressesController = require('../controlers/addressesController');
const passport = require('passport');

module.exports = (app, upload) => {
    app.get('/api/address/findByUser/:id_user', passport.authenticate('jwt', {session: false}), AddressesController.findByUser);
    app.post('/api/address/create', passport.authenticate('jwt', {session: false}), AddressesController.create);
}