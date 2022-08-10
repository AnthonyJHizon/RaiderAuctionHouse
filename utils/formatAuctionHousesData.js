module.exports = async function formatAuctionHousesData(data) {
  let auctionHouses = {};
  data.auctions.forEach(auctionHouse => {
    auctionHouses[auctionHouse.id] = auctionHouse.name.toLowerCase().replace(/\s+/g, '-');
  })
  return auctionHouses;
}