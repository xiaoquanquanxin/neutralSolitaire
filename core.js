//  核心
function CoreInit(tagName, type) {
	this.element = document.createElement(tagName);
	this.setType(type);
}

(function () {
	CoreInit.prototype.setType = function (type) {
		this.element.dataset.type = type;
	};
	CoreInit.prototype.getType = function (type) {
		return this.element.dataset.type;
	};
	CoreInit.prototype.appendTo = function (aim) {
		if (aim instanceof Element && aim !== this.element) {
			aim.appendChild(this.element);
		} else {
			throw new Error('\n错误记录：CoreInit.prototype.appendTo\n错误原因：错误的DOM目标对象或无法添加自身');
		}
	};
	CoreInit.prototype.removeFrom = function (aim) {
		if (aim instanceof Element && aim !== this.element) {
			if (this.element.parentNode === aim) {
				aim.removeChild(this.element);
			} else {
				throw new Error('\n错误记录：CoreInit.prototype.removeFrom\n错误原因：目标对象不为父级元素');
			}
		} else {
			throw new Error('\n错误记录：CoreInit.prototype.removeFrom\n错误原因：错误的DOM目标对象或无法移除自身');
		}
	}

	CoreInit.prototype.addClass = function (cssName) {
		if (typeof cssName === 'string') {
			this.element.classList.add(cssName)
		} else {
			throw new Error('\n错误记录：CoreInit.prototype.addClass\n错误原因：添加css类名必须为字符串');
		}
	};
	CoreInit.prototype.removeClass = function (cssName) {
		if (cssName === undefined) {
			this.element.classList.value = '';
		} else if (typeof cssName === 'string') {
			this.element.classList.remove(cssName)
		} else {
			throw new Error('\n错误记录：CoreInit.prototype.removeClass\n错误原因：删除css类名必须为字符串');
		}
	};
	CoreInit.prototype.hasClass = function (cssName) {
		if (typeof cssName === 'string') {
			return Array.prototype.some.call(this.element.classList, function (t) {
				return t === cssName;
			});
		} else {
			throw new Error('\n错误记录：CoreInit.prototype.hasClass\n错误原因：查询css类名必须为字符串');
		}
	}
}());


//  牌 card
function Card(param) {
	CoreInit.call(this, 'div', 'card');
}

(function () {
	var Inh = function () {
	};
	Inh.prototype = CoreInit.prototype;
	Card.prototype = new Inh();
}());

// Card.prototype.init = function () {
//     this.element.dataset.type = 'card';
// };

// var card = new Card();
// console.log(card);


//  位置
function Seat() {
	CoreInit.call(this, 'div', 'seat');
}

(function () {
	var Inh = function () {
	};
	Inh.prototype = CoreInit.prototype;
	Seat.prototype = new Inh();
}());
