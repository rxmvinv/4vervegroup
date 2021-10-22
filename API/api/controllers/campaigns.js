const fs = require('fs');

/* List - GET method */
module.exports.getCampaigns = (req, res) => {
  const campaigns = getCampaignData()
  res.send(campaigns)
}

/* Get one - GET method */
module.exports.getOneCampaign = (req, res) => {
  const campaignId = parseInt(req.params.campaign_id)
  //get the existing data
  const existCampaigns = getCampaignData()
  //filter the data to remove it
  const filterCampaigns = existCampaigns.filter( ban => ban.id === campaignId )
  if ( existCampaigns.length === filterCampaigns.length ) {
    return res.status(409).send({error: true, msg: 'campaign does not exist'})
  }
  res.send({...filterCampaigns[0]})   
}

/* Create - POST method */
module.exports.createCampaign = (req, res) => {
  //get the existing user data
  const existCampaigns = getCampaignData()
  
  //get the new user data from post request
  const campaignData = req.body
  //check if the userData fields are missing
  if (
    campaignData.id == null || 
    campaignData.name == null
  ) {
      return res.status(401).send({error: true, msg: 'Campaign data missing'})
  }
  
  //check if the username exist already
  const findExist = existCampaigns.find( ban => ban.id === campaignData.id )
  if (findExist) {
      return res.status(409).send({error: true, msg: 'campaign already exist'})
  }
  //append the user data
  existCampaigns.push(campaignData)
  //save the new user data
  saveCampaignData(existCampaigns);
  res.send({success: true, msg: 'Campaign data added successfully'})
}

/* Update - Patch method */
module.exports.changeCampaign = (req, res) => {
  //get the id from url
  const campaignId = parseInt(req.params.campaign_id)
  //get the update data
  const campaignData = req.body
  //get the existing data
  const existCampaigns = getCampaignData()
  //check if the campaign exist or not       
  const findExist = existCampaigns.find( ban => ban.id === campaignId )
  if (!findExist) {
    return res.status(409).send({error: true, msg: 'campaign not exist'})
  }
  //filter the data
  const updateCampaign = existCampaigns.filter( ban => ban.id !== campaignId )
  //push the updated data
  updateCampaign.push(campaignData)
  //finally save it
  saveCampaignData(updateCampaign)
  res.send({success: true, msg: 'Campaign data updated successfully'})
}

/* Delete - Delete method */
module.exports.removeCampaign = (req, res) => {
  const campaignId = parseInt(req.params.campaign_id)
  //get the existing data
  const existCampaigns = getCampaignData()
  //filter the data to remove it
  const filterCampaigns = existCampaigns.filter( ban => ban.id !== campaignId )
  if ( existCampaigns.length === filterCampaigns.length ) {
      return res.status(409).send({error: true, msg: 'campaign does not exist'})
  }
  //save the filtered data
  saveCampaignData(filterCampaigns)
  res.send({success: true, msg: 'Campaign removed successfully'})   
}

const saveCampaignData = (data) => {
  const stringifyData = JSON.stringify(data)
  fs.writeFileSync('public/campaigns.json', stringifyData)
}
//get the user data from json file
const getCampaignData = () => {
  const jsonData = fs.readFileSync('public/campaigns.json')
  return JSON.parse(jsonData)    
}