module.exports = async function AuctionHouse(data) {
  let auctionHouses = {};
  Object.keys(data).forEach(auctionHouse => {
    auctionHouses[auctionHouse] = data[auctionHouse].name;
  })
  return auctionHouses;
}