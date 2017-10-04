var ASSET_TREE = {
	'group1' : {
		'groupName' : '',
		'groupThumbnail' : '',
		'groupOutlineSrc' : 'assets/layers/outlines/Doors_Outline_All.png',
		'items' : []
	},
	'group2' : {
		'groupName' : '',
		'groupThumbnail' : '',
		'groupOutlineSrc' : 'assets/layers/outlines/Worktops_Outline.png',
		'items' : [
			
		]
	},
	'group3' : {
		'groupName' : '',
		'groupThumbnail' : '',
		'items' : [
			
		]
	}
};

$(function(){
	
	var $data = $('#php-echo-container');
	// get base layer
	ASSET_TREE.baseLayerSrc = $data.find('.base-layer-image').html();
	// get forground layer
	ASSET_TREE.foregroundLayerSrc = $data.find('.foreground-layer-image').html();
	// get background colour
	ASSET_TREE.backgroundColour = $data.find('.background-colour').html();
	// get item select indicator colour
	ASSET_TREE.itemSelectIndicatorColour = $data.find('.item-select-indicator-colour').html();
	$data.find('.group').each(function(i) {
	// for each group
		// save group name
		var thisGroup = 'group' + (i+1);
		
		console.log(thisGroup);
		// init this group obj
		ASSET_TREE['group' + (i+1)] = {};
		ASSET_TREE['group' + (i+1)].groupName = $(this).find('.group-name').html();
		// save group thumbnail to tree
		ASSET_TREE['group' + (i+1)].groupThumbnail = $(this).find('.group-thumbnail-image').html();
		// save fields for each item
		ASSET_TREE['group' + (i+1)].items = [];
		$(this).find('.item').each(function() {
			var $this = $(this);
			console.log($this);
			var groupItem = {
				layerSrc : $this.find('.layer-image').html(),
				thumbNailSrc : $this.find('.thumbnail-image').html()
			};
			ASSET_TREE['group' + (i+1)].items.push(groupItem);
		});
	});
});