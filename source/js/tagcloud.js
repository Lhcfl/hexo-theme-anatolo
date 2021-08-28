

function addLoadEvent(func) {
     var oldonload = window.onload;
     if (typeof window.onload != 'function') {
         window.onload = func;
     } else {
         window.onload = function() {
             oldonload();
             func();
         }
     }
 }


 addLoadEvent(function() {
     console.log('tag cloud plugin rock and roll!');
     try {
        var wid = document.body.clientWidth
        var textHeight = wid / 18
        if(textHeight>40){
           textHeight = 40
        }
        var wid2 = parseInt(document.body.clientWidth * 0.45)
        if(wid2<320){
            wid2 = 320
         }
         document.getElementById("resCanvas").width=wid2;
         document.getElementById("resCanvas").height=wid2;

         TagCanvas.textFont = 'PingHei, PingFang SC, Helvetica Neue, Microsoft YaHei';
         TagCanvas.textColour = '#333';
         TagCanvas.textHeight = textHeight;
         TagCanvas.outlineColour = '#E2E1D1';
         TagCanvas.maxSpeed = 0.07;
         TagCanvas.freezeActive = true;
         TagCanvas.outlineMethod = 'block';
         TagCanvas.minBrightness = 0.2;
         TagCanvas.depth = 0.92;
         TagCanvas.pulsateTo = 0.6;
         TagCanvas.initial = [0.1,-0.1];
         TagCanvas.decel = 0.98;
         TagCanvas.reverse = true;
         TagCanvas.hideTags = false;
         TagCanvas.shadow = '#ccf';
         TagCanvas.shadowBlur = 3;
         TagCanvas.weight = false;
         TagCanvas.imageScale = null;
         TagCanvas.fadeIn = 1000;
         TagCanvas.clickToFront = 600;
         TagCanvas.lock = false;
         TagCanvas.Start('resCanvas');
         TagCanvas.tc['resCanvas'].Wheel(true)
     } catch(e) {
         console.log(e);
         document.getElementById('myCanvasContainer').style.display = 'none';
     }
 });


