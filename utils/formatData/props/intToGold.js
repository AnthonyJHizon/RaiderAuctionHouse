module.exports = function intToGold(int) {
	const valueArr = int.toString().split('.');
	const gold = valueArr[0];
	const silver = valueArr[1].substr(0, 2);
	const copper = valueArr[1].substr(2);
	return gold + 'g ' + silver + 's ' + copper + 'c';
};
