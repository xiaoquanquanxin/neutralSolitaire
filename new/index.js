window.onload = function () {
//  空挡
    var freeCell = document.querySelector('.free-cell');
    freeCell.determineCell = freeCell.querySelectorAll('.determine-cell');
    Core.determineCell.freeCell = freeCell.determineCell;
    compatibility.callFn(compatibility.forEach, freeCell.determineCell, [function (t, i) {
        var left = i * 120;
        t.style.left = left + 'px';
        var placeholder = new CellPlaceholder();
        t.appendChild(placeholder.element);
    }]);

//  得分
    var pointCell = document.querySelector('.point-cell');
    pointCell.determineCell = pointCell.querySelectorAll('.determine-cell');

    Core.determineCell.pointCell = pointCell.determineCell;

    compatibility.callFn(compatibility.forEach, pointCell.determineCell, [function (t, i, arr) {
        var right = (Core.designIndex - i) * 120;
        t.style.right = right + 'px';
        Core.determineCellPos.pointCell.push({
            top: 0,
            left: pointCell.offsetLeft + t.offsetLeft,
            bottom: 173,
            right: 120 + pointCell.offsetLeft + t.offsetLeft
        });
        var placeholder = new CellPlaceholder({classList: [Core.designArray[i]]});
        t.appendChild(placeholder.element);
    }]);

//  牌堆
    var initCell = document.querySelector('.init-cell');
    initCell.determineCell = initCell.querySelectorAll('.determine-cell');

    Core.determineCell.initCell = initCell.determineCell;

    compatibility.callFn(compatibility.forEach, initCell.determineCell, [function (t, i) {
        var left = i * 120 + 10;
        t.style.left = left + 'px';
        Core.determineCellPos.initCell.push({
            top: initCell.offsetTop,
            left: left,
            bottom: initCell.offsetTop + t.offsetHeight,
            right: left + 120,
        });
        var placeholder = new CellPlaceholder();
        t.appendChild(placeholder.element);
    }]);

//  创造牌
    Core.initData.forEach(function (t, i) {
        var design = t.design;
        var color = 'red';
        switch (design) {
            case 'spade':
            case 'club':
                color = 'black';
                break;
        }
        t.color = color;
        var card = new CreateCard({design: t.design, points: t.points, color: color, cardIndex: t.cardIndex}).element;
        card.style.top = parseInt(i / 8) * 50 + 'px';
        initCell.determineCell[i % 8].appendChild(card);
    });


//  注册事件
    function getTargetCore(target) {
        var coreTarget = target.core;                       //  点击DOM元素实例
        if (!coreTarget) {
            return null;
        }
        var card = coreTarget.getParentElement();
        var coreCard = card.core;                           //  牌实例
        if (!coreCard || !coreCard.hasClass('card')) {
            return null;
        }
        return coreCard;
    }

    (function () {
        var container = document;

        //  激活卡牌
        compatibility.eventListener(container, 'click', compatibilityClick);
        function compatibilityClick(e) {
            var event = compatibility.event(e);
            var target = compatibility.target(event);
            var coreCard = getTargetCore(target);
            if (!coreCard) {
                return;
            }
            //  先要把上一次被激活的卡牌置为普通
            compatibility.callFn(compatibility.map, Core.activateList, [function (t) {
                t.removeClass('activate');
            }]);
            Core.activateList = [coreCard];                     //  那些牌需要激活的list
            Core.isActivity = true;
            //  筛选激活卡牌
            var coreActivateCard = coreCard;
            while (1) {
                var next = coreActivateCard.getNextElement();
                if (!next) {
                    break;
                }
                Core.isActivity = true;
                var prevColorIsRed = coreActivateCard.hasClass('red');
                var prevCardIndex = coreActivateCard.cardIndex;
                coreActivateCard = next.core;
                var currentColorIsRed = coreActivateCard.hasClass('red');
                var currentCardIndex = coreActivateCard.cardIndex;
                if (prevColorIsRed === currentColorIsRed) {
                    Core.isActivity = false;
                    continue;
                }
                if (prevCardIndex !== currentCardIndex + 1) {
                    Core.isActivity = false;
                    continue;
                }
                Core.activateList.push(coreActivateCard);
            }
            //  给激活卡牌设置样式
            compatibility.callFn(compatibility.map, Core.activateList, [function (t) {
                t.addClass('activate');
            }]);
//            console.log(Core.activateList);
//            console.log(Core.isActivity);
        }

        //  按住
        compatibility.eventListener(container, 'mousedown', compatibilityMousedown);
        function compatibilityMousedown(e) {
            Core.isMoved = false;                                           //  按住的上一步一定不是移动,至少是鼠标弹起,点击事件等
            if (!Core.isActivity) {
                return;
            }
            var event = compatibility.event(e);
            var target = compatibility.target(event);
            var coreCard = getTargetCore(target);
            if (!coreCard) {
                return;
            }
            Core.isActivity = coreCard.hasClass('activate');
            if (Core.isActivity) {
                (function () {

                    //  第一张牌左上角顶点与鼠标点击的相对位置
                    Core.activateHead.relativeX = e.offsetX;
                    Core.activateHead.relativeY = e.offsetY;
                });

                //  第一张牌左上角顶点的位置
                Core.activateHead.mouseCardAbsX = e.clientX - e.offsetX;
                Core.activateHead.mouseCardAbsY = e.clientY - e.offsetY;


                //  鼠标点击的位置
                Core.activateHead.clientX = e.clientX;
                Core.activateHead.clientY = e.clientY;

                //  卡牌原来的位置
                Core.activateHead.offsetLeft = coreCard.element.offsetLeft;
                Core.activateHead.offsetTop = coreCard.element.offsetTop;
                //console.log('注册mousemove');
                compatibility.eventListener(container, 'mousemove', compatibilityMousemove);
            }
        }

        //  移动卡牌组
        function compatibilityMousemove(e) {
            //console.log('mousemove');
            if (!Core.isActivity) {
                return;
            }
            var event = compatibility.event(e);
            var target = compatibility.target(event);
            var coreCard = getTargetCore(target);
            if (!coreCard) {
                return;
            }
            //console.log(Core.activateHead.relativeX);
            var mouseClientX = e.clientX;
            var mouseClientY = e.clientY;

            compatibility.callFn(compatibility.map, Core.activateList, [function (t) {
                //console.log(t);
                t.addClass('z-index');
                var diffX = mouseClientX - Core.activateHead.clientX;
                var diffY = mouseClientY - Core.activateHead.clientY + Core.activateHead.offsetTop;
                t.css('left', diffX + 'px');
                t.css('top', diffY + 'px');
            }]);
            Core.isMoved = true;
        }

        //  鼠标弹起
        compatibility.eventListener(container, 'mouseup', function (e) {
            Core.isActivity = false;
            //console.log('移除');
            compatibility.removeListener(container, 'mousemove', compatibilityMousemove);
            if (!Core.isMoved) {
                return;
            }
            var event = compatibility.event(e);
            //console.log(event.clientX);

            var clientX = event.clientX;
            var clientY = event.clientY;


            console.log(clientX, clientY);
            var isPlaced = false;
            //  左 , 右 , 下 三个循环
            //  可以扔到哪儿
            if (Core.activateList.length === 1) {
                var target = Core.activateList[0];
                compatibility.callFn(compatibility.forEach, Core.determineCellPos.freeCell, [function (t, i) {
                    if (clientX >= t.left && clientX <= t.right && clientY >= t.top && clientY <= t.bottom) {
                        console.log('鼠标释放位置对了');
                        isPlaced = true;
                        var freecell = Core.determineCell.freeCell[i];
                        //  说明是空位
                        if (!freecell.querySelector('.card')) {
                            target.appendTo(freecell);
                            target.css('top', '0');
                            target.css('left', '0');
                        }

                    }
                }]);
                compatibility.callFn(compatibility.forEach, Core.determineCellPos.pointCell, [function (t, i) {
                    if (clientX >= t.left && clientX <= t.right && clientY >= t.top && clientY <= t.bottom) {
                        console.log('鼠标释放位置对了');
                        var pointCell = Core.determineCell.pointCell[i];
                        /**
                         *
                         * 这个地方的判断有严重的漏洞,这是由于最开始考虑不周造成的
                         *
                         * **/
                        var pointDesign = pointCell.querySelectorAll('.cell')[0].classList[0];
                        var targetDesign = target.element.querySelectorAll('.card-design')[0].classList[2];
                        //  判断花色
                        if (pointDesign !== targetDesign) {
                            return;
                        }
                        //  判断点数
                        var cardList = pointCell.querySelectorAll('.card');
                        //var card

                        //  已经存了 多 张牌
                        if (cardList.length) {
                            if (cardList[cardList.length - 1].core.cardIndex + 1 === target.cardIndex) {
                                isPlaced = true;
                            }
                        } else {
                            if (target.cardIndex === 0) {
                                isPlaced = true;
                            }
                        }
                        if (isPlaced) {
                            target.appendTo(pointCell);
                            target.css('top', '0');
                            target.css('left', '0');
                        }
                    }
                }]);
            }
            compatibility.callFn(compatibility.forEach, Core.determineCellPos.initCell, [function (t, i) {
                if (clientX >= t.left && clientX <= t.right && clientY >= t.top && clientY <= t.bottom) {
                    console.log('鼠标释放位置对了');
                    console.log(Core.determineCell.initCell[i]);
                }
            }]);


            compatibility.callFn(compatibility.map, Core.activateList, [function (t) {
                t.removeClass('z-index');
                t.removeClass('activate');
                if (!isPlaced) {
                    t.css('left', Core.activateHead.offsetLeft + 'px');
                    t.css('top', Core.activateHead.offsetTop + 'px');
                }
            }]);

            Core.activateHead = {};
        });
    }());

    function resetDetermineCellPos() {
        var containerLeft = container.offsetLeft;
        var containerTop = container.offsetTop;
        Core.determineCellPos.freeCell = [];
        compatibility.callFn(compatibility.forEach, freeCell.determineCell, [function (t, i) {
            var left = i * 120 + containerLeft;
            var top = 0 + containerTop;
            Core.determineCellPos.freeCell.push({top: top, left: left, bottom: top + 173, right: 120 + left});
        }]);



    }

    resetDetermineCellPos();
    compatibility.eventListener(window, 'reisze', function () {
        resetDetermineCellPos();
    })
};