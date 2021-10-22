const fs = require('fs');

/* List - GET method */
module.exports.getBanners = (req, res) => {
  const banners = getBannerData()
  res.send(banners)
}

/* Get one - GET method */
module.exports.getOneBanner = (req, res) => {
  const bannerId = parseInt(req.params.banner_id)
  //get the existing data
  const existBanners = getBannerData()
  //filter the data to remove it
  const filterBanners = existBanners.filter( ban => ban.id === bannerId )
  if ( existBanners.length === filterBanners.length ) {
    return res.status(409).send({error: true, msg: 'banner does not exist'})
  }
  res.send({...filterBanners[0]})   
}

/* Create - POST method */
module.exports.createBanner = (req, res) => {
  //get the existing user data
  const existBanners = getBannerData()
  
  //get the new user data from post request
  const bannerData = req.body
  //check if the userData fields are missing
  if (
    bannerData.id == null || 
    bannerData.name == null || 
    bannerData.text == null
  ) {
      return res.status(401).send({error: true, msg: 'Banner data missing'})
  }
  
  //check if the username exist already
  const findExist = existBanners.find( ban => ban.id === bannerData.id )
  if (findExist) {
      return res.status(409).send({error: true, msg: 'banner already exist'})
  }
  //append the user data
  existBanners.push(bannerData)
  //save the new user data
  saveBannerData(existBanners);
  res.send({success: true, msg: 'Banner data added successfully'})
}

/* Update - Patch method */
module.exports.changeBanner = (req, res) => {
  //get the id from url
  const bannerId = parseInt(req.params.banner_id)
  //get the update data
  const bannerData = req.body
  //get the existing data
  const existBanners = getBannerData()
  //check if the banner exist or not       
  const findExist = existBanners.find( ban => ban.id === bannerId )
  if (!findExist) {
    return res.status(409).send({error: true, msg: 'banner not exist'})
  }
  //filter the data
  const updateBanner = existBanners.filter( ban => ban.id !== bannerId )
  //push the updated data
  updateBanner.push(bannerData)
  //finally save it
  saveBannerData(updateBanner)
  res.send({success: true, msg: 'Banner data updated successfully'})
}

/* Delete - Delete method */
module.exports.removeBanner = (req, res) => {
  const bannerId = parseInt(req.params.banner_id)
  //get the existing data
  const existBanners = getBannerData()
  //filter the data to remove it
  const filterBanners = existBanners.filter( ban => ban.id !== bannerId )
  if ( existBanners.length === filterBanners.length ) {
      return res.status(409).send({error: true, msg: 'banner does not exist'})
  }
  //save the filtered data
  saveBannerData(filterBanners)
  res.send({success: true, msg: 'Banner removed successfully'})   
}

const saveBannerData = (data) => {
  const stringifyData = JSON.stringify(data)
  fs.writeFileSync('public/banners.json', stringifyData)
}
//get the user data from json file
const getBannerData = () => {
  const jsonData = fs.readFileSync('public/banners.json')
  return JSON.parse(jsonData)    
}