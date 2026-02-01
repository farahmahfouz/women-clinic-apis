const express = require('express');
const subServiceController = require('../controllers/subServiceController');
const serviceOptionRouter = require('./serviceOptionRoute');

const router = express.Router();

// router.use('/:subServiceId/services', serviceOptionRouter);
router.use('/:slug/services', serviceOptionRouter);

router
  .route('/')
  .get(subServiceController.getAllSubServices)
  .post(subServiceController.createSubService);

  router.get('/slug/:slug', subServiceController.getSubServiceBySlug);
  
router
  .route('/:id')
  .get(subServiceController.getSubService)
  .patch(subServiceController.updateSubService)
  .delete(subServiceController.deleteSubService);

module.exports = router;
