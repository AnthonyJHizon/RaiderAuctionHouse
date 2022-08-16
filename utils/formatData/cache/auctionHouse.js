module.exports = async function AuctionHouse(data) {
  let auctionHouses = {};
  data.auctions.forEach(auctionHouse => {
    auctionHouses[auctionHouse.name.toLowerCase().replace(/\s+/g, '-')] = {
      id: auctionHouse.id,
      name: auctionHouse.name,
    }
  })
  return auctionHouses;
}