$(function() {
	// 被拖动的对象及其相关属性
	var draggingBlock = {};
	// 被覆盖的对象及其相关属性
	var overlayBlock = {};
	// 记录每次移动block时有无发生覆盖情况
	var overlayOccur = false;
	// 一开始就获取，不必每次都获取
	var blockList = $('.block');
	$('.block').on('mousedown', function(evt) {
		var mouseStartX = evt.screenX,
			mouseStartY = evt.screenY;

		draggingBlock.obj = $(this);
		draggingBlock.oriLeft = draggingBlock.obj.position().left;
		draggingBlock.oriTop = draggingBlock.obj.position().top;
		$(document).on('mousemove', function(evt) {
			  
			draggingBlock.obj.css({
				'left': draggingBlock.oriLeft + evt.screenX - mouseStartX,
				'top': draggingBlock.oriTop + evt.screenY - mouseStartY
			});

			// 是否有发生block覆盖情况？
			if (hasOverlay()) {
				overlayOccur = true;
				overlayBlock.obj.css({
					'left': draggingBlock.oriLeft,
					'top': draggingBlock.oriTop
				});
			} else if (overlayBlock.obj) {
				overlayOccur = false;
				overlayBlock.obj.css({
					'left': overlayBlock.oriLeft,
					'top': overlayBlock.oriTop
				});
			}
		});

	}).on('mouseup', function(evt) {
		$(document).off('mousemove');
		draggingBlock.obj.css({
			'left': overlayOccur ? overlayBlock.oriLeft : draggingBlock.oriLeft,
			'top': overlayOccur ? overlayBlock.oriTop : draggingBlock.oriTop
		});
		overlayOccur = false;
		if (!$.isEmptyObject(overlayBlock)) {
			overlayBlock.oriLeft = draggingBlock.left;
			overlayBlock.oriTop = draggingBlock.top;
		}
	});

	// 判断当前拖动的block是否与其余某个block有覆盖情况，如果有，返回被覆盖的block
	function hasOverlay() {
		var found = false;
		var draggingBlockMid = {
			x: draggingBlock.obj.position().left + 40,
			y: draggingBlock.obj.position().top + 40
		}
		$.each(blockList, function(i, block) {
			var $block = $(block), blockCoor = {
				left: $block.position().left,
				top: $block.position().top,
				right: $block.position().left + 80,
				bottom: $block.position().top + 80
			}
			// 与其他的block比较
			if (draggingBlock.obj.attr('id') !== $(block).attr('id')) {
				if (draggingBlockMid.x >= blockCoor.left && draggingBlockMid.y >= blockCoor.top
						&& draggingBlockMid.x <= blockCoor.right && draggingBlockMid.y <= blockCoor.bottom) {
					overlayBlock.obj = $(block);
					overlayBlock.oriLeft = $(block).position().left;
					overlayBlock.oriTop = $(block).position().top;
					found = true;
					return false;
				} 

			}

			// 与被挤走的block原先所在的位置比较，否则会造成死循环
			if (overlayBlock.obj) {
				if( draggingBlockMid.x >= overlayBlock.oriLeft && draggingBlockMid.y >= overlayBlock.oriTop
						&& draggingBlockMid.x <= (overlayBlock.oriLeft+80) && draggingBlockMid.y <= (overlayBlock.oriTop+80)) {
					found = true;
					return false;
				}
			} 
		})
		return found;
	}
});