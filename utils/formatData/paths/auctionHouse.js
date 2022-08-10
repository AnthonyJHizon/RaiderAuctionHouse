module.exports = async function AuctionHouse(data) {
  let auctionHouses = [];
  data.auctions.forEach(auctionHouse => {
  auctionHouses.push(auctionHouse.id.toString())
  })
  return auctionHouses;
}