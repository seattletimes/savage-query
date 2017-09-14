//simple clone
//necessary because SVG bounding box objects are read-only in IE

var clone = function(obj) {
  var o = {};
  for (var key in obj) {
    o[key] = obj[key];
  }
  return o;
};

var NS = "http://www.w3.org/2000/svg";

var Savage = function(selector) {
  if (!(this instanceof Savage)) return new Savage(selector);
  if (typeof selector == "string") {
    this.elements = Array.prototype.slice.call(document.querySelectorAll(selector));
  } else if (selector instanceof Array) {
    this.elements = selector;
  } else {
    this.elements = [selector];
  }
  this.length = this.elements.length;
};

Savage.dom = function(tagName, attrs, children) {
  var element = document.createElementNS(NS, tagName);
  if (attrs instanceof Array) {
    children = attrs;
    attrs = {};
  }
  if (attrs) for (var a in attrs) {
    element.setAttribute(a, attrs[a]);
  }
  if (children) children.forEach(function(c) {
    element.appendChild(c);
  });
  return element;
};

Savage.prototype = {
  elements: null,
  
  toArray() {
    return this.elements;
  },

  each(fn) {
    this.elements.forEach(fn);
  },

  get(index) {
    return this.elements[index || 0];
  },
  
  find(selector) {
    var found = [];
    this.each(function(element) {
      var q = element.querySelectorAll(selector);
      for (var i = 0; i < q.length; i++) found.push(q[i]);
    });
    return new Savage(found);
  },

  getBBox(padding = 0) {
    var bounds = clone(this.elements[0].getBBox());
    var right = bounds.x + bounds.width;
    var bottom = bounds.y + bounds.height;
    for (var i = 0; i < this.elements.length; i++) {
      var b = this.elements[i].getBBox();
      bounds.x = bounds.x > b.x ? b.x : bounds.x;
      bounds.y = bounds.y > b.y ? b.y : bounds.y;
      var w = b.x + b.width;
      var h = b.y + b.height;
      right = right < w ? w : right;
      bottom = bottom < h ? h : bottom;
    }
    bounds.width = right - bounds.x + padding * 2;
    bounds.height = bottom - bounds.y + padding * 2;
    bounds.x -= padding;
    bounds.y -= padding;
    return bounds;
  }
}

var mixin = {
  addClass(c) {
    var className = this.getAttribute("class") || "";
    if (className.indexOf(c) > -1) return;
    this.setAttribute("class", className += " " + c);
  },

  removeClass(c) {
    var className = this.getAttribute("class") || "";
    var remove = new RegExp(`\\s*?${c}\\s*?`);
    this.setAttribute("class", className.replace(remove, ""));
  },

  draw(duration) {
    var length = 999;
    //get the real length
    if (this.tagName.toLowerCase() == "path") {
      length = this.getTotalLength();
    } else if (this.tagName.toLowerCase() == "line") {
      var coords = { x1: "", x2: "", y1: "", y2: "" };
      for (var key in coords) {
        coords[key] = this.getAttribute(key) * 1;
      }
      var dx = coords.x2 - coords.x1;
      var dy = coords.y2 - coords.y1;
      length = Math.sqrt(dx * dx + dy * dy);
    }
    //set the starting position
    this.style.transitionProperty = "none";
    this.style.strokeDashoffset = `${length}px`;
    this.style.strokeDasharray = `${length}px ${length}px`;
    //trigger layout
    var _ = document.body.offsetWidth;
    //create animation
    this.style.transitionProperty = "stroke-dashoffset"
    this.style.transitionDuration = `${duration||400}ms`
    this.style.transitionTimingFunction = "ease-in-out";
    this.style.strokeDashoffset = "0px";
  },

  fade(duration) {
    this.style.opacity = 0.01;
    //trigger layout
    var _ = document.body.offsetWidth;
    //fade in
    this.style.transitionProperty = "opacity";
    this.style.transitionDuration = `${duration||400}ms`;
    this.style.transitionTimingFunction = "linear";
    this.style.opacity = 1;
  },

  on(event, fn) {
    this.addEventListener(event, fn);
  },

  style(name, value) {
    var styles = name;
    if (typeof styles != "object") {
      styles = {}
      styles[name] = value;
    }
    for (var key in styles) {
      this.style[key] = styles[key];
    }
  }
};

Object.keys(mixin).forEach(function(f) {
  var fn = mixin[f];
  Savage.prototype[f] = function(...args) {
    this.each(function(el) {
      fn.apply(el, args);
    });
    return this;
  }
});

window.Savage = module.exports = Savage;