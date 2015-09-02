(function () {
	var config = {},
		cvs,
		cxt,
		lastX =0,
		lastY=0,
		mousePressed = false,
		canvas = function (obj) {
			init(obj);
		}
	//init
	function init (obj) {
		//线条颜色
		config.linecolor = obj.linecolor;
		//线条宽度
		config.linewidth = obj.linewidth;
		//canvas
		cvs = document.getElementById(obj.canvas);
		//绘制对象
		cxt = cvs.getContext("2d");
		//鼠标按下
		cvs.addEventListener("mousedown", function (e){
			mousePressed = true;
			//draw(e.pageX - e.offsetX, e.pageY - e.offsetY, false);
			a = getOffsetRect(this);

			draw(e.pageX-a.left , e.pageY-a.top , false);
		}, false);
		//鼠标移动
		cvs.addEventListener("mousemove", function (e){
			if (mousePressed) {
				//draw(e.pageX - e.offsetX, e.pageY - e.offsetY, true);
				a = getOffsetRect(this);
				draw(e.pageX-a.left , e.pageY-a.top , true);
			}
		},false);
		cvs.addEventListener("mouseup", function (e){
			mousePressed = false;
		},false);
		cvs.addEventListener("mouseleave", function (e){
			mousePressed = false;
		});
		draw(100, 100, true)
	}
	//颜色
	function setLineColor() {

	}
	//线条宽度
	function setLineWidth() {

	}
	//重置画板
	function clear_draw() {
		 cxt.clearRect(0, 0, cxt.canvas.width, cxt.canvas.height);
	}
	//绘制
	function draw(x, y, isDraw) {
		if (isDraw) {
			cxt.beginPath();
			cxt.strokeStyle = config.linecolor;
			cxt.lineWidth = config.linewidth;
			cxt.lineJoin = "round";
			
			cxt.moveTo(lastX, lastY);
			cxt.lineTo(x, y);
			console.log(lastX);
			console.log(lastY);
			console.log(x);
			console.log(y);
			cxt.closePath();
			cxt.stroke();
		}
		lastX = x;
		lastY = y;
	}

	function getOffsetRect(ele){
      var box=ele.getBoundingClientRect();
      var body=document.body,
        docElem=document.documentElement;
      //获取页面的scrollTop,scrollLeft(兼容性写法)
      var scrollTop=window.pageYOffset||docElem.scrollTop||body.scrollTop,
        scrollLeft=window.pageXOffset||docElem.scrollLeft||body.scrollLeft;
      var clientTop=docElem.clientTop||body.clientTop,
        clientLeft=docElem.clientLeft||body.clientLeft;
      var top=box.top+scrollTop-clientTop,
        left=box.left+scrollLeft-clientLeft;
      return {
        //Math.round 兼容火狐浏览器bug
        top:Math.round(top),
        left:Math.round(left)
      }
    }
	//将canvas对象连接到window上
	window.canvas = canvas;
})();