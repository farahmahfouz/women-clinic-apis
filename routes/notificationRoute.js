const { Router } = require('express');
const { getMyNotifications, markAsRead } = require('../controllers/notificationController');
const { auth } = require('../middlewares/authMiddlerware');

const router = Router();

router.use(auth); 

router.get('/', getMyNotifications);
router.patch('/:id/read', markAsRead);

module.exports = router;