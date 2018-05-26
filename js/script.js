$(document).ready(function () {
	svg = d3.select("#drawing_open").append("svg")
		.attr("height", $("#drawing_open").height())
		.attr("class", "svg");

	d3.select('#rectangle').on('click', function () { new Rectangle(); });

});

function Rectangle() {
	var self = this,
		rect,
		rectData = [],	/*Rectangle data*/
		isDown = false,	/*Is Mouse down flag*/
		m1,				/*Mouse start position*/
		m2,				/*Mouse end position*/
		isDrag = false, /*Is Mouse dragging flag*/
		clickCount = 0,	/*No of clicks at the time of first drawing*/
		lastDbUpdateTime = new Date(0),			/*Last Time for storing the shape*/
		storingTimeIntervalInMilSeconds = 1000;	/*Interval between 2 ajax call for the shape*/

	svg.on('mousedown', function () {
		m1 = d3.mouse(this);
		if (!isDown && !isDrag) {
			self.rectData = [{ x: m1[0], y: m1[1] }, { x: m1[0], y: m1[1] }];
			self.rectangleElement = svg.append('rect').attr('class', 'rectangle').call(dragR);
			self.pointElement1 = svg.append('circle').attr('class', 'pointC').call(dragC1);
			self.pointElement2 = svg.append('circle').attr('class', 'pointC').call(dragC2);
			self.pointElement3 = svg.append('circle').attr('class', 'pointC').call(dragC3);
			self.pointElement4 = svg.append('circle').attr('class', 'pointC').call(dragC4);
			updateRect();
			isDrag = false;
		} else {
			isDrag = true;
		}
		//isDown = !isDown;
	}).on('mousemove', function () {
		m2 = d3.mouse(this);
		if (isDown && !isDrag) {
			self.rectData[1] = { x: m2[0], y: m2[1] };
			updateRect();
		}
	}).on('click', function () {
		isDown = !isDown;

		if(++clickCount%2==0) {
			svg.on('mousedown',null)
				.on('mousemove',null)
				.on('click',null);
			updateRectToDatabase("DrawEnd");
		}
	});

	function updateRectToDatabase(rectModel=null) {
		if(new Date()-lastDbUpdateTime>storingTimeIntervalInMilSeconds) {
			lastDbUpdateTime = new Date();
			console.log(rectModel + " Ajax - " + new Date());
			console.log(rect);
		}
	}

	function updateRect() {
		rect = self.rectangleElement;

		rect.attr("x", self.rectData[1].x - self.rectData[0].x > 0 ? self.rectData[0].x : self.rectData[1].x)
			.attr("y", self.rectData[1].y - self.rectData[0].y > 0 ? self.rectData[0].y : self.rectData[1].y)
			.attr("height", Math.abs(self.rectData[1].y - self.rectData[0].y))
			.attr("width", Math.abs(self.rectData[1].x - self.rectData[0].x))
			.attr("class", "rect-draw");

		var point1 = self.pointElement1;
		point1.attr('r', 5)
			.attr('cx', self.rectData[0].x)
			.attr('cy', self.rectData[0].y);
		var point2 = self.pointElement2;
		point2.attr('r', 5)
			.attr('cx', self.rectData[1].x)
			.attr('cy', self.rectData[1].y);
		var point3 = self.pointElement3;
		point3.attr('r', 5)
			.attr('cx', self.rectData[1].x)
			.attr('cy', self.rectData[0].y);
		var point4 = self.pointElement4;
		point4.attr('r', 5)
			.attr('cx', self.rectData[0].x)
			.attr('cy', self.rectData[1].y);
	}

	var dragR = d3.drag().on('drag', dragRect);

	function dragRect() {
		var e = d3.event;
		for (var i = 0; i < self.rectData.length; i++) {
			self.rectangleElement
				.attr('x', self.rectData[i].x += e.dx)
				.attr('y', self.rectData[i].y += e.dy);
		}
		rect.style('cursor', 'move');
		updateRect();
		updateRectToDatabase("dragRect");
	}

	var dragC1 = d3.drag().on('drag', dragPoint1);
	var dragC2 = d3.drag().on('drag', dragPoint2);
	var dragC3 = d3.drag().on('drag', dragPoint3);
	var dragC4 = d3.drag().on('drag', dragPoint4);

	function dragPoint1() {
		var e = d3.event;
		self.pointElement1
			.attr('cx', self.rectData[0].x += e.dx)
			.attr('cy', self.rectData[0].y += e.dy);
		updateRect();
		updateRectToDatabase("dragPoint1");
	}

	function dragPoint2() {
		var e = d3.event;
		self.pointElement2
			.attr('cx', self.rectData[1].x += e.dx)
			.attr('cy', self.rectData[1].y += e.dy);
		updateRect();
		updateRectToDatabase("dragPoint2");
	}

	function dragPoint3() {
		var e = d3.event;
		self.pointElement3
			.attr('cx', self.rectData[1].x += e.dx)
			.attr('cy', self.rectData[0].y += e.dy);
		updateRect();
		updateRectToDatabase("dragPoint3");
	}

	function dragPoint4() {
		var e = d3.event;
		self.pointElement4
			.attr('cx', self.rectData[0].x += e.dx)
			.attr('cy', self.rectData[1].y += e.dy);
		updateRect();
		updateRectToDatabase("dragPoint4");
	}
}//end Rectangle