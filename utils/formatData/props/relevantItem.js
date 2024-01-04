export default function RelevantItem(
	itemData,
	itemSubclassInfo,
	itemClassInfo,
	itemSubclasses
) {
	itemData.forEach((item) => {
		itemSubclassInfo[item._id] = item.itemSubclass;
		itemClassInfo[item._id] = {
			name: item.name,
			icon: item.iconURL,
		};
		if (!itemSubclasses[item.itemSubclass])
			itemSubclasses[item.itemSubclass] = item.itemClass;
	});
}
