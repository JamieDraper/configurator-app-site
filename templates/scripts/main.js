

var settings = {
	numbOfGroups : 0,
	selectedItems : {},
    retainPosition : false
}

var fireClickEvent = function(node, eventName) {
    // Make sure we use the ownerDocument from the provided node to avoid cross-window problems
    var doc;
    if (node.ownerDocument) {
        doc = node.ownerDocument;
    } else if (node.nodeType == 9){
        // the node may be the document itself, nodeType 9 = DOCUMENT_NODE
        doc = node;
    } else {
        throw new Error("Invalid node passed to fireEvent: " + node.id);
    }

     if (node.dispatchEvent) {
        // Gecko-style approach (now the standard) takes more work
        var eventClass = "";

        // Different events have different event classes.
        // If this switch statement can't map an eventName to an eventClass,
        // the event firing is going to fail.
        switch (eventName) {
            case "click": // Dispatching of 'click' appears to not work correctly in Safari. Use 'mousedown' or 'mouseup' instead.
            case "mousedown":
            case "mouseup":
                eventClass = "MouseEvents";
                break;

            case "focus":
            case "change":
            case "blur":
            case "select":
                eventClass = "HTMLEvents";
                break;

            default:
                throw "fireEvent: Couldn't find an event class for event '" + eventName + "'.";
                break;
        }
        var event = doc.createEvent(eventClass);

        var bubbles = eventName == "change" ? false : true;
        event.initEvent(eventName, bubbles, true); // All events created as bubbling and cancelable.

        event.synthetic = true; // allow detection of synthetic events
        node.dispatchEvent(event, true);
    } else  if (node.fireEvent) {
        // IE-old school style
        var event = doc.createEventObject();
        event.synthetic = true; // allow detection of synthetic events
        node.fireEvent("on" + eventName, event);
    }
};

var initSettings = function() {
	settings.numbOfGroups = $('#php-echo-container > .group').length;
  // set background colour
  $('body').css('background-color', ASSET_TREE.backgroundColour);
};

function moveIndicator(item, color) {
        var textPosition = item.getBoundingClientRect();
        var container = pnProductNavContents.getBoundingClientRect().left;
        var distance = textPosition.left - container;
         var scroll = pnProductNavContents.scrollLeft;
        pnIndicator.style.transform = "translateX(" + (distance + scroll) + "px) scaleX(" + textPosition.width * 0.01 + ")";
        // count = count += 100;
        // pnIndicator.style.transform = "translateX(" + count + "px)";
        
        if (color) {
            pnIndicator.style.backgroundColor = color;
        }
    }

function runScrollingMenuJS(){
    var SETTINGS = {
        navBarTravelling: false,
        navBarTravelDirection: "",
         navBarTravelDistance: 150
    }

    var colours = {
        0: "#867100",
        1: "#7F4200",
        2: "#99813D",
        3: "#40FEFF",
        4: "#14CC99",
        5: "#00BAFF",
        6: "#0082B2",
        7: "#B25D7A",
        8: "#00FF17",
        9: "#006B49",
        10: "#00B27A",
        11: "#996B3D",
        12: "#CC7014",
        13: "#40FF8C",
        14: "#FF3400",
        15: "#ECBB5E",
        16: "#ECBB0C",
        17: "#B9D912",
        18: "#253A93",
        19: "#125FB9",
    }
    var colours = {
        0: ASSET_TREE.itemSelectIndicatorColour
    }

    

    document.documentElement.classList.remove("no-js");
    document.documentElement.classList.add("js");

    // Out advancer buttons
    var pnAdvancerLeft = document.getElementById("pnAdvancerLeft");
    var pnAdvancerRight = document.getElementById("pnAdvancerRight");
    // the indicator
    var pnIndicator = document.getElementById("pnIndicator");

    var pnProductNav = document.getElementById("pnProductNav");
    var pnProductNavContents = document.getElementById("pnProductNavContents");

    pnProductNav.setAttribute("data-overflowing", determineOverflow(pnProductNavContents, pnProductNav));

    // Set the indicator
    moveIndicator(pnProductNav.querySelector("[aria-selected=\"true\"]"), colours[0]);

    // Handle the scroll of the horizontal container
    var last_known_scroll_position = 0;
    var ticking = false;

    function doSomething(scroll_pos) {
        pnProductNav.setAttribute("data-overflowing", determineOverflow(pnProductNavContents, pnProductNav));
    }
    
    pnProductNav.addEventListener("scroll", function() {
        last_known_scroll_position = window.scrollY;
        if (!ticking) {
            window.requestAnimationFrame(function() {
                doSomething(last_known_scroll_position);
                ticking = false;
            });
        }
        ticking = true;
    });


    pnAdvancerLeft.addEventListener("click", function() {
        // If in the middle of a move return
        if (SETTINGS.navBarTravelling === true) {
            return;
        }
        // If we have content overflowing both sides or on the left
        if (determineOverflow(pnProductNavContents, pnProductNav) === "left" || determineOverflow(pnProductNavContents, pnProductNav) === "both") {
            // Find how far this panel has been scrolled
            var availableScrollLeft = pnProductNav.scrollLeft;
            // If the space available is less than two lots of our desired distance, just move the whole amount
            // otherwise, move by the amount in the settings
            if (availableScrollLeft < SETTINGS.navBarTravelDistance * 2) {
                pnProductNavContents.style.transform = "translateX(" + availableScrollLeft + "px)";
            } else {
                pnProductNavContents.style.transform = "translateX(" + SETTINGS.navBarTravelDistance + "px)";
            }
            // We do want a transition (this is set in CSS) when moving so remove the class that would prevent that
            pnProductNavContents.classList.remove("pn-ProductNav_Contents-no-transition");
            // Update our settings
            SETTINGS.navBarTravelDirection = "left";
            SETTINGS.navBarTravelling = true;
        }
        // Now update the attribute in the DOM
        pnProductNav.setAttribute("data-overflowing", determineOverflow(pnProductNavContents, pnProductNav));
    });

    pnAdvancerRight.addEventListener("click", function() {
        // If in the middle of a move return
        if (SETTINGS.navBarTravelling === true) {
            return;
        }
        // If we have content overflowing both sides or on the right
        if (determineOverflow(pnProductNavContents, pnProductNav) === "right" || determineOverflow(pnProductNavContents, pnProductNav) === "both") {
            // Get the right edge of the container and content
            var navBarRightEdge = pnProductNavContents.getBoundingClientRect().right;
            var navBarScrollerRightEdge = pnProductNav.getBoundingClientRect().right;
            // Now we know how much space we have available to scroll
            var availableScrollRight = Math.floor(navBarRightEdge - navBarScrollerRightEdge);
            // If the space available is less than two lots of our desired distance, just move the whole amount
            // otherwise, move by the amount in the settings
            if (availableScrollRight < SETTINGS.navBarTravelDistance * 2) {
                pnProductNavContents.style.transform = "translateX(-" + availableScrollRight + "px)";
            } else {
                pnProductNavContents.style.transform = "translateX(-" + SETTINGS.navBarTravelDistance + "px)";
            }
            // We do want a transition (this is set in CSS) when moving so remove the class that would prevent that
            pnProductNavContents.classList.remove("pn-ProductNav_Contents-no-transition");
            // Update our settings
            SETTINGS.navBarTravelDirection = "right";
            SETTINGS.navBarTravelling = true;
        }
        // Now update the attribute in the DOM
        pnProductNav.setAttribute("data-overflowing", determineOverflow(pnProductNavContents, pnProductNav));
    });

    pnProductNavContents.addEventListener(
        "transitionend",
        function() {
            // get the value of the transform, apply that to the current scroll position (so get the scroll pos first) and then remove the transform
            var styleOfTransform = window.getComputedStyle(pnProductNavContents, null);
            var tr = styleOfTransform.getPropertyValue("-webkit-transform") || styleOfTransform.getPropertyValue("transform");
            // If there is no transition we want to default to 0 and not null
            var amount = Math.abs(parseInt(tr.split(",")[4]) || 0);
            pnProductNavContents.style.transform = "none";
            pnProductNavContents.classList.add("pn-ProductNav_Contents-no-transition");
            // Now lets set the scroll position
            if (SETTINGS.navBarTravelDirection === "left") {
                pnProductNav.scrollLeft = pnProductNav.scrollLeft - amount;
            } else {
                pnProductNav.scrollLeft = pnProductNav.scrollLeft + amount;
            }
            SETTINGS.navBarTravelling = false;
        },
        false
    );

    // Handle setting the currently active link
    pnProductNavContents.addEventListener("click", function(e) {
        var links = [].slice.call(document.querySelectorAll(".pn-ProductNav_Link"));
        links.forEach(function(item) {
            item.setAttribute("aria-selected", "false");
        })
        e.target.setAttribute("aria-selected", "true");
        // Pass the clicked item and it's colour to the move indicator function
        //moveIndicator(e.target, colours[links.indexOf(e.target)]);
        moveIndicator(e.target, colours[0]);
    });

    // var count = 0;
    

    function determineOverflow(content, container) {
        var containerMetrics = container.getBoundingClientRect();
        var containerMetricsRight = Math.floor(containerMetrics.right);
        var containerMetricsLeft = Math.floor(containerMetrics.left);
        var contentMetrics = content.getBoundingClientRect();
        var contentMetricsRight = Math.floor(contentMetrics.right);
        var contentMetricsLeft = Math.floor(contentMetrics.left);
         if (containerMetricsLeft > contentMetricsLeft && containerMetricsRight < contentMetricsRight) {
            return "both";
        } else if (contentMetricsLeft < containerMetricsLeft) {
            return "left";
        } else if (contentMetricsRight > containerMetricsRight) {
            return "right";
        } else {
            return "none";
        }
    }

    /**
     * @fileoverview dragscroll - scroll area by dragging
     * @version 0.0.8
     * 
     * @license MIT, see http://github.com/asvd/dragscroll
     * @copyright 2015 asvd <heliosframework@gmail.com> 
     */


    (function (root, factory) {
        if (typeof define === 'function' && define.amd) {
            define(['exports'], factory);
        } else if (typeof exports !== 'undefined') {
            factory(exports);
        } else {
            factory((root.dragscroll = {}));
        }
    }(this, function (exports) {
        var _window = window;
        var _document = document;
        var mousemove = 'mousemove';
        var mouseup = 'mouseup';
        var mousedown = 'mousedown';
        var EventListener = 'EventListener';
        var addEventListener = 'add'+EventListener;
        var removeEventListener = 'remove'+EventListener;
        var newScrollX, newScrollY;

        var dragged = [];
        var reset = function(i, el) {
            for (i = 0; i < dragged.length;) {
                el = dragged[i++];
                el = el.container || el;
                el[removeEventListener](mousedown, el.md, 0);
                _window[removeEventListener](mouseup, el.mu, 0);
                _window[removeEventListener](mousemove, el.mm, 0);
            }

            // cloning into array since HTMLCollection is updated dynamically
            dragged = [].slice.call(_document.getElementsByClassName('dragscroll'));
            for (i = 0; i < dragged.length;) {
                (function(el, lastClientX, lastClientY, pushed, scroller, cont){
                    (cont = el.container || el)[addEventListener](
                        mousedown,
                        cont.md = function(e) {
                            if (!el.hasAttribute('nochilddrag') ||
                                _document.elementFromPoint(
                                    e.pageX, e.pageY
                                ) == cont
                            ) {
                                pushed = 1;
                                lastClientX = e.clientX;
                                lastClientY = e.clientY;

                                e.preventDefault();
                            }
                        }, 0
                    );

                    _window[addEventListener](
                        mouseup, cont.mu = function() {pushed = 0;}, 0
                    );

                    _window[addEventListener](
                        mousemove,
                        cont.mm = function(e) {
                            if (pushed) {
                                (scroller = el.scroller||el).scrollLeft -=
                                    newScrollX = (- lastClientX + (lastClientX=e.clientX));
                                scroller.scrollTop -=
                                    newScrollY = (- lastClientY + (lastClientY=e.clientY));
                                if (el == _document.body) {
                                    (scroller = _document.documentElement).scrollLeft -= newScrollX;
                                    scroller.scrollTop -= newScrollY;
                                }
                            }
                        }, 0
                    );
                 })(dragged[i++]);
            }
        }

          
        if (_document.readyState == 'complete') {
            reset();
        } else {
            _window[addEventListener]('load', reset, 0);
        }

        exports.reset = reset;
    }));
}

var addItemThumbnailsToScrollingMenu = function(group, $itemIcon, itemIndex) {
	console.log('adding item to menu');
	console.log(ASSET_TREE[group].items[ itemIndex  ]);
	var item = ASSET_TREE[group].items[ itemIndex  ];
	if (typeof item !== 'undefined') {
  		var thumbnailSrc = item.thumbNailSrc;
		$itemIcon.css('background-image', 'url('+thumbnailSrc+')');
	}
};

var addItemMarkupToScrollingMenu = function(group, itemIndex) {
	console.log('adding item: ' + group+'-'+itemIndex);
	var $itemMarkup = $('<a href="#" data-id="'+group+'-'+itemIndex+'" class="pn-ProductNav_Link '+group+'"><\/a>');
	$('.item-selection-bar:eq(0) .scrolling-end').before($itemMarkup);
};

var initScrollingItemMenu = function(group) {
	// add markup
	var x = 0,
			items = ASSET_TREE[group].items;
	// for each item in group, add item markup
	console.log(items.length);
  console.log(items);
	for ( var x = 0; x < items.length; x++ ) {
		addItemMarkupToScrollingMenu(group, x);
	}
	// for each item in group, add thumbails

	$('.item-selection-bar:eq(0) .pn-ProductNav_Link.'+group).each(function(i){
		
  		addItemThumbnailsToScrollingMenu(group, $(this), i);
  		console.log($(this));
  	});
  // select first item
  
  
};

var addItemImageLayer = function(group, layerSrc, itemIndex) {
	var $layer = $('<img class="layer" id="'+group+'-'+itemIndex+'" src="'+layerSrc+'">');
	// instead of add to a pre-existing group
    if ($('.group.'+group).length) {
        $('.group.'+group).append($layer);
    } else {
        $('.groups-cont').append($('<div class="group '+group+'">'));
        $('.group.'+group).append($layer);
    }
    

};

var initGroupLayers = function(group) {
	var items = ASSET_TREE[group].items;
	console.log(ASSET_TREE[group].items);
	var $outlineLayer;
	console.log(items);
	for ( var i = 0; i < items.length; i++ ) {
		addItemImageLayer(group, items[i].layerSrc, i);
	}
	// add group outline layer if specified
	console.log(ASSET_TREE[group].groupOutlineSrc);
	if (ASSET_TREE[group].groupOutlineSrc) {
		$outlineLayer =$('<img src="'+ASSET_TREE[group].groupOutlineSrc+'" class="layer outline" data-group="'+group+'">')
		$('.group.'+group).append($outlineLayer);
	}
	
};

var displayItemLayer = function(itemID) {
	// find item layer
	var $itemLayer = $('.group #'+itemID);
	$itemLayer.siblings().hide();
	$itemLayer.show();
};

var handleCategorySelectClick = function($categorySelectIcon, $itemSelectBar, $categoryIcons) {
    
	if ( $categorySelectIcon.hasClass('is-active') ) {
		$categorySelectIcon.removeClass('is-active');
		$itemSelectBar.hide();
		return;
	}
  //resizeItemNavBar();
  $categoryIcons.removeClass('is-active');
  $categorySelectIcon.toggleClass('is-active');
  $itemSelectBar.show();
  var selectedGroup = $categorySelectIcon.attr('data-group');
  $('.item-selection-bar a').show();
  $('.item-selection-bar a:not(".'+selectedGroup+'")').hide();
  $('.layer.outline').hide();
  $('.'+selectedGroup+' .layer.outline').show();

  // if had previously selected item, reselect
  
  if (settings.selectedItems[selectedGroup]) {
  	var previouslySelectedId = settings.selectedItems[selectedGroup];
  	var previouslySelectedIndex = $('a[data-id="'+previouslySelectedId+'"]').index();
  	fireClickEvent(document.getElementsByTagName("a")[previouslySelectedIndex], "click")
  } else {
  	// no previously selected, initialise at first image of group
  	var initIndex = $('a[data-id="'+selectedGroup+'-0"]').index();
  	//fireClickEvent(document.getElementsByTagName("a")[initIndex], "click")
    if (settings.retainPosition) {
        moveIndicator(pnProductNav.querySelector("[aria-selected=\"true\"]"), ASSET_TREE.itemSelectIndicatorColour);
    }
    
  }
  settings.retainPosition = true;
};

var handleCategorySelectOnHover = function($categorySelectIcon) {
	var group = $categorySelectIcon.attr('data-group');
	$('.layer.outline').hide();
	$('.'+group+' .layer.outline').show();
};
var handleCategorySelectOffHover = function($categorySelectIcon) {
	if (! $categorySelectIcon.hasClass('is-active') ) {
		$('.layer.outline').hide();
	}
};

var handleItemSelectClick = function($item) {
	var id = $item.attr('data-id');
  //displayItemLayer(id);
  var group = id.split('-')[0];

 	$('.currently-equipped-bar .icon.'+group).css( 'background-image', $item.css('background-image') );

 	settings.selectedItems[group] = id;
};

var bindItemSelectClicks = function() {
    // for each item in the scrolling menu
    var numbOfItems =  $('.item-selection-bar a').length;
    for (var i = 0; i < numbOfItems; i++) {
        (function(){
            var $allItemLayers = $('.layers-container .group .layer');
            var $menuItems = $('.item-selection-bar a');
            var numbOfItems =  $menuItems.length;
            var thisId = $menuItems.eq(i).attr('data-id');
            var thisGroup = thisId.split('-')[0];
            var $thisImageLayer = $('.layers-container').find('#'+thisId);
            $menuItems.eq(i).on('click', {eq:i}, function(){
                //$allItemLayers.hide();
                $('.layers-container .'+thisGroup+' .layer').hide()
                $thisImageLayer.show();
            });
        }());
    }

};


var handleOutsideScrollingMenuClick = function(e){
	var boundries = $(".item-selection-bar, .category-select-bar .icon");
  // if the target of the click isn't the container nor a descendant of the container
  if (!boundries.is(e.target) && boundries.has(e.target).length === 0) {
    $(".item-selection-bar").hide();
    $(".category-select-bar .icon").removeClass('is-active');
  }
};

var attachEventListeners = function() {
  $categoryIcons = $('.category-select-bar .icon');
	$categoryIcons.on('click', function(e){
    e.preventDefault();        
  	handleCategorySelectClick($(this), $('.item-selection-bar'), $categoryIcons );
    return false;
  });
  
  /*
  $('.category-select-bar .icon').hover(
  	function(){
	  	handleCategorySelectOnHover($(this));
	  },
	  function(){
	  	handleCategorySelectOffHover($(this));
	  }
  );
  */
  
  
  // select an item
  $('.item-selection-bar a').on('click', function(e){
    e.preventDefault();
  	handleItemSelectClick($(this));
  });
  
  $(document).on('mouseup',function(e){
    handleOutsideScrollingMenuClick(e);
	});

};

var loadItems = function(){
	// init base layer
  $('.layers-container .layer.base').attr('src', ASSET_TREE.baseLayerSrc);

	for (var i = 0; i < settings.numbOfGroups; i++) {
		var key = 'group' + (i + 1);
		// init group 1 layers
	  initGroupLayers(key);
	  // init group 1 menu bar
	  initScrollingItemMenu(key);
	  // set group name
	  $('.category-select-bar label').eq(i).html(ASSET_TREE[key].groupName);
	  // set groupthumbnail
	  $('.category-select-bar .icon').eq(i).css('background-image', 'url('+ASSET_TREE[key].groupThumbnail+')');
	}
	// init foreground layer
  $('.layers-container .layer.foreground').attr('src', ASSET_TREE.foregroundLayerSrc);
};

var loadGroups = function() {
	// render category select icons
	var $catagoryBar = $('.category-select-bar');
	var $catagoryIcon;
	var $currentlyEquippedBar = $('.currently-equipped-bar');
	var $currentlyEquippedIcon;
	for (var i = 0; i < settings.numbOfGroups; i++) {
		$catagoryIcon = jQuery('<div class="icon" href="javascript:;" onClick="" data-group="group'+(i+1)+'"><span class="glyphicon glyphicon-play"><\/span><label><\/label><\/div>');
		$catagoryBar.append($catagoryIcon);
		$currentlyEquippedIcon = jQuery('<div class="icon group'+(i+1)+'"><\/div>');
		$currentlyEquippedBar.append($currentlyEquippedIcon);
	}
};

var calculateAspectRatioFit = function(srcWidth, srcHeight, maxWidth, maxHeight) {
  //Conserve aspect ratio of the orignal region. Useful when shrinking/enlarging images to fit into a certain area
  var ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
  return { width: srcWidth*ratio, height: srcHeight*ratio };
};
var rescaleImages = function() {
  var srcWidth = 2048,
      srcHeight = 1536,
      windowWidth = $(window).width(),
      windowHeight = $(window).height(),
      newDimensions = calculateAspectRatioFit(srcWidth, srcHeight, windowWidth, windowHeight);
  
  $('.layers-container img.layer, .layers-container').each(function() {
    $(this).css('height', newDimensions.height);
    $(this).css('width', newDimensions.width);
  });
};

function listenForCompletedAssetLoading() {
  var assetsLoaded = false;
  // Initialize Progress and show LoadingOverlay
  var progress = new LoadingOverlayProgress();
  $.LoadingOverlay("show", {
      custom  : progress.Init()
  });

  // Simulate some action:
  var count     = 0;
  var interval  = setInterval(function(){
      if (assetsLoaded) {
          clearInterval(interval);
          delete progress;
          $('.combinator-container').show();
          $.LoadingOverlay("hide");
          return;
      }
      count++;
      progress.Update(count);
  }, 130);

  $(window).on("load", function() {
      console.log('all assets loaded');
      assetsLoaded = true;
  });

}

var preselectFirstItemOfEachCatagory = function() {
    for (var i = 0; i < settings.numbOfGroups; i++) {
        var dataID = 'group' + (i+1) + '-0';
        $('[data-id="'+dataID+'"]').click();
    }
    // init empty 'currently equipt' icons at bottom to prompt user action
    $('.currently-equipped-bar .icon').css('background-image', 'none');
};

var attachDebugLog = function() {
    $('.combinator-container').prepend($('<div id="debug-log">'));
    $('#debug-log').css({
        'background' : 'rgba(255, 255, 255, 0.5)',
        'height'     : '150px',
        'position'   : 'absolute',
        'top'        : '0',
        'left'       : '0',
        'right'      : '0',
        'z-index'    : '1',
        'max-width'  : '400px',
        'overflow-y' : 'scroll'
    });
};
function debuglog(str) {
    $('#debug-log').append(str);
    $('#debug-log').append('<br/>');
}

$(function(){

  listenForCompletedAssetLoading();
  
  initSettings();
  loadGroups();
  loadItems();
  

  
  

  
  $('img.layer').eq(1).hide();

  bindItemSelectClicks();
  attachEventListeners();

  // run scrolling menu lib code
  $('.item-selection-bar:eq(0) .pn-ProductNav_Link:eq(0)').attr('aria-selected', 'true');
  runScrollingMenuJS();

  preselectFirstItemOfEachCatagory();
  //attachDebugLog();
  $(window).resize(function(){
    rescaleImages();
  });
  $(window).resize();

  
  
  
});