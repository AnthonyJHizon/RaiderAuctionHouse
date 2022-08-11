module.exports = async function Auction(data) {
  let auctionData = {};
  let minPriceHash = {};
  data.auctions && data.auctions.forEach(item => {
  if(!minPriceHash[item.item.id] && item.buyout > 0){
    minPriceHash[item.item.id] = item.buyout/item.quantity/10000;
  }
  else{
    if(minPriceHash[item.item.id] > item.buyout/item.quantity/10000 && item.buyout > 0) //sometimes buyout is = 0
    {
      minPriceHash[item.item.id] = item.buyout/item.quantity/10000;
    }
  }
  })
  auctionData["items"] = minPriceHash;
  auctionData["auctionHouse"] = data.name.en_US;
  return auctionData;
}