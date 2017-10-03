<!DOCTYPE html>
<html lang="en">
	<head>
		<meta http-equiv="content-type" content="text/html; charset=utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<title><?php echo $page->title; ?></title>
		<link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css" rel="stylesheet">
		<link rel="stylesheet" type="text/css" href="<?php echo $config->urls->templates?>styles/main.css?v=2" />
		<link rel="stylesheet" type="text/css" href="<?php echo $config->urls->templates?>styles/main-nav.css?v=1" />
		<link rel="stylesheet" type="text/css" href="<?php echo $config->urls->templates?>styles/scrolling-nav.css?v=8" />
	</head>
	<body class="noselect">

		<div class="combinator-container">

			<div class="layers-container">
				<!-- BASE LAYER --> 
				<img class="layer base">

				<!-- GROUP 1 LAYERS -->
				<div class="group1 group"></div>
				<!-- GROUP 2 LAYERS -->
				<div class="group2 group"></div>
				<!-- GROUP 3 LAYERS -->
				<div class="group3 group"></div>

				<!-- FOREGROUND LAYER -->
				<img class="layer foreground">
			</div>

			<!-- ITEM SELECTION MENU -->
			<div class="item-selection-bar">
				<div class="pn-ProductNav_Wrapper">
					<nav id="pnProductNav" class="pn-ProductNav dragscroll">
						<div id="pnProductNavContents" class="pn-ProductNav_Contents">
							
							<span class="scrolling-end"></span>
							<span id="pnIndicator" class="pn-ProductNav_Indicator"></span>
						</div>
					</nav>
					<button id="pnAdvancerLeft" class="pn-Advancer pn-Advancer_Left" type="button">
						<svg class="pn-Advancer_Icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 551 1024"><path d="M445.44 38.183L-2.53 512l447.97 473.817 85.857-81.173-409.6-433.23v81.172l409.6-433.23L445.44 38.18z"/></svg>
					</button>
					<button id="pnAdvancerRight" class="pn-Advancer pn-Advancer_Right" type="button">
						<svg class="pn-Advancer_Icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 551 1024"><path d="M105.56 985.817L553.53 512 105.56 38.183l-85.857 81.173 409.6 433.23v-81.172l-409.6 433.23 85.856 81.174z"/></svg>
					</button>
				</div>
			</div>

			<!-- GROUP SELECTION MENU -->
			<div class="category-select-bar noselect">
			</div>

			<!-- CURRENTLY SELECTED MENU -->
			<div class="currently-equipped-bar noselect">
				<!--
			  <div class="icon group1"></div>
			  <div class="icon group2"></div>
			  <div class="icon group3"></div>
			  <div class="icon group4"></div>
			  <div class="icon group5"></div>
			-->
			</div>

		</div> <!-- end of combinator container -->
		
	</body>


	<div id="php-echo-container">
		<?php
		echo '<div class="background-colour">#'.$page->background_colour.'</div>';
		echo '<div class="item-select-indicator-colour">#'.$page->item_select_indicator_colour.'</div>';
		# echo nav indicator colour
		echo '<div class="base-layer-image">'.$page->base_layer_image->url.'</div>';
		echo '<div class="foreground-layer-image">'.$page->foreground_layer_image->url.'</div>';

		$groups = $page->find('template=item-group');
		foreach($groups as $group) {

			echo '<div class="group">';
				echo '<div class="group-name">'.$group->title.'</div>';
				echo '<div class="group-thumbnail-image">'.$group->group_thumbnail->url.'</div>';

				foreach($group->group as $item) {

					echo "<div class='item'>";
						# echo item title
						echo '<div class="layer-image">'.$item->layer_image->url.'</div>';
						echo '<div class="thumbnail-image">'.$item->thumbnail_image->url.'</div>';

				   	echo "</div>";

				}

			echo '</div>';

		}			 	
		?>
	</div>


	<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
	<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>
	<script src="https://cdn.jsdelivr.net/npm/gasparesganga-jquery-loading-overlay@1.5.3/src/loadingoverlay.min.js"></script>
	<script src="https://cdn.jsdelivr.net/npm/gasparesganga-jquery-loading-overlay@1.5.3/extras/loadingoverlay_progress/loadingoverlay_progress.min.js"></script>
	<script src="<?php echo $config->urls->templates?>scripts/scrolling-nav.js"></script>
	<script src="<?php echo $config->urls->templates?>scripts/data-tree.js"></script>
	<script src="<?php echo $config->urls->templates?>scripts/main.js?v=45"></script>



</html>
