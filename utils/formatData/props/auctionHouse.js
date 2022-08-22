module.exports = async function AuctionHouse(data, self) {
  let auctionHouses = {};
  Object.keys(data).forEach(auctionHouse => {
    if(auctionHouse != self) auctionHouses[auctionHouse] = data[auctionHouse].name;
  })
  return auctionHouses;
}