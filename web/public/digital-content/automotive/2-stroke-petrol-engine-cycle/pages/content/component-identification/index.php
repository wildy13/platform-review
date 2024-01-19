<!-- begin -->
<!-- 2 Stroke Petrol Engine Cycle v2.0 -->
<html lang="en-us">
  <head>
    <meta charset="utf-8">
	
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <title>2 Stroke Petrol Engine Cycle v2.0</title>
    <link rel="shortcut icon" href="TemplateData/img/favicon.ico">
    <link rel="stylesheet" href="TemplateData/css/style.css">
    <script src="Build/3544178c924aac8c5129f2d974d60dd7.js"></script>
	<script>
		function ToggleFullScreen() {
			var isInFullScreen = (document.fullscreenElement && document.fullscreenElement !== null) ||
			(document.webkitFullscreenElement && document.webkitFullscreenElement !== null) ||
			(document.mozFullScreenElement && document.mozFullScreenElement !== null) ||
			(document.msFullscreenElement && document.msFullscreenElement !== null);
			
			var element = document.body.getElementsByClassName("webgl-content")[0];
			
			if (!isInFullScreen) {
				document.getElementById("fullScreenButton").style.backgroundImage="url('TemplateData/img/fullScreen_off.png')";
				return (element.requestFullscreen ||
				element.webkitRequestFullscreen ||
				element.mozRequestFullScreen ||
				element.msRequestFullscreen).call(element);
			}
			else {
				document.getElementById("fullScreenButton").style.backgroundImage="url('TemplateData/img/fullScreen_on.png')";
				if (document.exitFullscreen) {
					document.exitFullscreen();
				} else if (document.webkitExitFullscreen) {
					document.webkitExitFullscreen();
				} else if (document.mozCancelFullScreen) {
					document.mozCancelFullScreen();
				} else if (document.msExitFullscreen) {
					document.msExitFullscreen();
				}
			}
		}
		
		function UnityProgress(gameInstance, progress) {
			if (!gameInstance.Module)
			return;
			document.getElementById("loadingBlock").style.display = "inherit";	 	
			document.getElementById("fullBar").style.width = (100 * progress) + "%";
			document.getElementById("emptyBar").style.width = (100 * (1 - progress)) + "%";
			if (progress == 1)
			{
				setTimeout(function(){ document.getElementById("loadingBlock").style.display = "none"; }, 3000);
				
				setTimeout(function(){ document.getElementById("fullScreenButton").style.display="block"; }, 3000);

				myFunction();
			}	
		}
		
		var gameInstance = UnityLoader.instantiate("gameContainer", "Build/22e139c4a9c432c39f57f52d7384727d.json", {
			onProgress: UnityProgress});
		
		function myFunction() 
		{
        gameInstance.SendMessage('Canvas BG', 'set_Time', 'http://192.168.1.10');
		}
		//window.addEventListener("beforeunload", function(e){
			//console.log("Calling OnClose from Browser!");
			//gameInstance.SendMessage("Pak Pos", "DeleteUserState");
	 
			//var dialogText = "Would you like to continue unloading the page?";
			//e.returnValue = dialogText;
			//return dialogText;
		//});
    </script>
  </head>
  <body>
  
  		<div class="webgl-content">
			<button style="display:none;" id="fullScreenButton" onclick="ToggleFullScreen()"></button>
			<div id="gameContainer" style="width: 1920px; height: 1080px"></div>
		</div>

		<div id="loadingBlock">
			<img class="logo" src="TemplateData/img/Logo.png"></img>

			<div id="progressBar">
				<!-- <div>LOADING ...</div> -->
				<div class="centered">
					<div id="emptyBar"></div>
					<div id="fullBar"></div>
				</div>
				<div style="color: #fff;">Content Uses Gaming Technology so LOADING May Take More than 1 MINUTE. Please Wait...</div>
			</div>
		</div>

	<script src="TemplateData/responsive.javascript"></script>
  </body>
</html>