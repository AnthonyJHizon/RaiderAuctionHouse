export default function RelevantItem(
	itemData,
	itemSubclassInfo,
	itemClassInfo,
	itemSubclasses
) {
	itemData.forEach((item) => {
		itemSubclassInfo[item_id] = item.itemSubclass;
		itemClassInfo[item_id] = {
			name: item.name,
			icon: item.iconURL,
		};
		if (!itemSubclasses[item.itemSubclass])
			itemSubclasses[item.itemSubclass] = item.itemClass;
	});
}
