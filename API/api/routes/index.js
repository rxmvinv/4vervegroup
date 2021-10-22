const express = require('express');
const router = express.Router();
const ctrlBanner = require('../controllers/banners');
const ctrlCampaign = require('../controllers/campaigns');

//banner
router.get('/banners/', ctrlBanner.getBanners);
router.get('/banners/:banner_id', ctrlBanner.getOneBanner);
router.post('/banners/', ctrlBanner.createBanner);
router.put('/banners/:banner_id', ctrlBanner.changeBanner);
router.delete('/banners/:banner_id', ctrlBanner.removeBanner);

//campaign
router.get('/campaigns/', ctrlCampaign.getCampaigns);
router.get('/campaigns/:campaign_id', ctrlCampaign.getOneCampaign);
router.post('/campaigns/', ctrlCampaign.createCampaign);
router.put('/campaigns/:campaign_id', ctrlCampaign.changeCampaign);
router.delete('/campaigns/:campaign_id', ctrlCampaign.removeCampaign);

module.exports = router;
