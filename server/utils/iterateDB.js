const Item = require('../models/item')

module.exports = async () => {
  try{
    startTime = Date.now();
    const results = await Item.find({itemClass: "Gem"});
    // console.log(results);
    const endTime = Date.now();
    console.log(`Elapsed time ${endTime - startTime}`)
  }
  catch (error) {
    console.log('Error getting data', error);
  }
}