// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

// Place any jQuery/helper plugins in here.
jQuery.fn.color = function(color) {
    this.css("background", color)
}
jQuery.fn.red = function() {
    this.color("red")
}

var colors = ['red','blue','green','yellow','cyan','orange'];
function rColor() {
return colors[Math.floor(Math.random()*colors.length)]
}

jQuery.fn.snvkCarousel = function (options) {
    var opts = jQuery.extend({animationDuration: 1.5}, jQuery.fn.snvkCarousel.defaults, options)
    this.css({
        position: "relative",
    })
    var containerWidth = this.width()
    var marginLeftRight = 20;
    var numberOfItemsInRow = 3;
    var itemTWidth =  (containerWidth / numberOfItemsInRow);
    var itemWidth = itemTWidth - (marginLeftRight * 2)
    var itemHeight = 400;
    var offset = 200;
    var containerHeight = itemHeight + marginLeftRight;
    var items = this.children();
    var itemLength = items.length;

    var topItemWrapper = jQuery("<div class='snvk-carousel-wrapper'>  </div>");
    topItemWrapper.appendTo(this);

    var first_row = [];
    var last_row = [];
    items.each(function(index) {
        $(this).color(rColor())
        var item = $(this);
        item.appendTo(topItemWrapper);
        item.addClass("item")
        item.css({
           width: itemWidth,
           height: itemHeight,
            display: "block",
            marginTop: marginLeftRight,
            marginLeft: marginLeftRight,
        });
        var _f1 = item.clone(true).addClass("cloned")
        first_row.push(_f1)
        last_row.push(_f1.clone(true))
    });

    first_row.forEach(function (it) {
        topItemWrapper.append(it)
    })
    last_row.reverse().forEach(function (it) {
        topItemWrapper.prepend(it)
    })
    var wrapperCss = {
        position: 'relative',
        height: containerHeight,
        clear: "both",
        width: itemTWidth * topItemWrapper.children().length,
        overflow: "hidden"
    };
    topItemWrapper.css(wrapperCss)

    var first_ref = jQuery(".snvk-carousel-wrapper .item:not(.cloned)").first();
    var xTransTopReset = -first_ref.position().left - marginLeftRight;
    var prevButtonXposition = (containerWidth - offset)
    var xTransBottomReset = xTransTopReset - (2.5 * (itemWidth + marginLeftRight))
    var xTransTop = xTransTopReset;
    var  xTransBottom = xTransBottomReset;
    topItemWrapper.css({"transform": "translate3d("+ xTransTop +"px, 0px, 0px)"});

    var bottomItemWrapper = topItemWrapper.clone(true);
    bottomItemWrapper.appendTo(this);
    bottomItemWrapper.css({"transform": "translate3d("+ xTransBottom +"px, 0px, 0px)"});

    var nextButton = jQuery("<div class='snvk-carousel-button next-'> > </div>").appendTo(this)
    var prevButton = jQuery("<div class='snvk-carousel-button prev'> < </div>").appendTo(this)

    nextButton.css({
        width: offset,
        height: itemHeight,
        // float: "left",
        top: marginLeftRight,
        left: 0,
        position:'absolute',
        zIndex: 9999
    });

    prevButton.css({
        width: offset,
        height: itemHeight,
        top: itemHeight + 2*marginLeftRight,
        left: prevButtonXposition,
        position:'absolute',
        zIndex: 9999
    });
    var counter = 0;

    var isAnimating = false;

    function sub(op1, op2) {
        return op1 - op2
    }
    function sum(op1, op2) {
        return op1 + op2
    }
    function calc(op1, op2, fn) {
        return fn(op1, op2)
    }
    function inc(counter) {
        return counter + 1;
    }
    function dec(counter) {
        return counter - 1;
    }
    function prev() {
        return slide(sum, inc)
    }
    function next() {
        return slide(sub, dec)
    }
    function slide(operandOperation, incrementOrDecrement) {
        if (isAnimating)return;
        isAnimating = true;
        var slideOffset = (itemWidth + marginLeftRight);
        xTransTop = operandOperation(xTransTop, slideOffset);
        xTransBottom = operandOperation(xTransBottom, slideOffset);
        counter = incrementOrDecrement(counter);
        topItemWrapper.css({transition: "transform "+ opts.animationDuration +"s","transform": "translate3d("+ xTransTop +"px, 0px, 0px)"})
        bottomItemWrapper.css({transition: "transform "+ opts.animationDuration +"s","transform": "translate3d("+ xTransBottom  +"px, 0px, 0px)"})

        setTimeout(() => {
            if (Math.abs(counter) > itemLength - 1 ){
                counter = 0;
                xTransTop = xTransTopReset;
                xTransBottom = xTransBottomReset;

                topItemWrapper.css({transition: "none", "transform": "translate3d("+ xTransTop +"px, 0px, 0px)"});
                bottomItemWrapper.css({transition: "none", "transform": "translate3d("+ xTransBottom  +"px, 0px, 0px)"});
            }
            isAnimating = false;
        }, opts.animationDuration * 1000)
    }
    nextButton.on('click', next)
    prevButton.on('click', prev)

    return {
        itemTWidth,
        itemLength,
        counter
    }
}

jQuery.fn.snvkCarousel.defaults = {
    animationDuration: 4 //seconds
}