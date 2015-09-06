(function () {
	var config = {}, //基础配置
		cvs, //dom对象
		cxt, //canvas对象
		lastX, //起始位置x
		lastY, //起始位置y
		Current = 0, //当前步骤
		Stack = [], //栈
		prev, //上一步
		next, //下一步
		mousePressed = false, //鼠标点击状态
		canvas = function (obj) {
			init(obj);
		}
	//init
	function init (obj) {
		//线条颜色
		config.linecolor = obj.linecolor || "blue";
		//线条宽度
		config.linewidth = obj.linewidth || 5;
		//canvas
		cvs = document.getElementById(obj.canvas);
		//绘制对象
		cxt = cvs.getContext("2d");
		prev = document.getElementById("prev");
		next = document.getElementById("next");
		Mouse();
		clear_draw();
		setLineColor();
		setLineWidth();
		SaveDraw();
		_prve();
		_next();
		var data = cxt.getImageData(0, 0, 600, 400);
		Stack.push(data);
	}
	function Mouse() {
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
			_Stack();
			mousePressed = false;
		},false);
		cvs.addEventListener("mouseleave", function (e){
			//_Stack();
			mousePressed = false;
		});
	}
	//颜色
	function setLineColor() {
		document.getElementById("DrawColor").addEventListener("change", function (e){
			config.linecolor = this.value;
		},false);
	}
	//线条宽度
	function setLineWidth() {
		document.getElementById("DrawWidth").addEventListener("change", function (e){
			config.linewidth = this.value;
		},false);
		//
	}
	//重置画板
	function clear_draw() {
		document.getElementById("clearDraw").addEventListener("click", function (){
			cxt.clearRect(0, 0, cxt.canvas.width, cxt.canvas.height);
		},false); 
	}
	//绘制
	function draw(x, y, isDraw) {
		if (isDraw) {
			//绘制开始
			cxt.beginPath();
			//颜色
			cxt.strokeStyle = config.linecolor;
			//宽度
			cxt.lineWidth = config.linewidth;
			//线条
			cxt.lineJoin = "round";
			//起始位置
			cxt.moveTo(lastX, lastY);
			//结束位置
			cxt.lineTo(x, y);
			//结束配置
			cxt.closePath();
			//绘制
			cxt.stroke();
		}
		//将上一次的结束位置作为新的开始
		lastX = x;
		lastY = y;
	}
	//保存图片
	function SaveDraw() {
		document.getElementById("Save").addEventListener("click",function() {
			var url = cxt.canvas.toDataURL('image/png'),
				img = new Image(),
				saveimg = document.getElementById("img");
				img.src = url;
				saveimg.innerHTML = "";
				saveimg.appendChild(img);
		},false);
	}

	//上一步
	function _prve () {
		prev.addEventListener("click", function() {
			//上一步 -1
			Current-=1;
			//判断是否还有上一步可以执行
			if (Current == 0) {
				prev.setAttribute("disabled","disabled");
			} else {
				prev.removeAttribute("disabled");
			}
			//取数据
			var popData = Stack[Current];
			//还原画布
			cxt.putImageData(popData, 0, 0);
			//判断是否有下一步可以执行
			if ((Stack.length - 1) == Current){
				next.setAttribute("disabled","disabled");
			} else {
				next.removeAttribute("disabled");
			}
		}, false);
		
	}
	//下一步
	function _next () {
		next.addEventListener("click", function() {
			//上一步 +1
			Current += 1;
			if ((Stack.length - 1) == Current){
				next.setAttribute("disabled","disabled");
			} else {
				next.removeAttribute("disabled");
			}
			var popData = Stack[Current];
			cxt.putImageData(popData, 0, 0);
			if (Current == 0) {
				prev.setAttribute("disabled","disabled");
			} else {
				prev.removeAttribute("disabled");
			}
		}, false);
	}
	//步骤进栈
	function _Stack () {
		//大于0 可以上一步
		if (Stack.length > 0) {
			prev.removeAttribute("disabled");
		}
		//判断是否可以点击下一步
		if ((Stack.length - 1) >= Current){
			next.setAttribute("disabled","disabled");
		}
		//重新步骤 
		if (Stack.length - 1 > Current) {
			Stack.length = Current + 1;
		}
		Current+=1;
		var data = cxt.getImageData(0, 0, 600, 400);
		Stack.push(data);
	}
	//当前元素相对于浏览器的位置
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