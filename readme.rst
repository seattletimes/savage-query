Savage Query
============

**Important note**: this is beta software, and the API is subject to change without warning. We will try to maintain semantic versioning when function calls change, so your code should remain functional, but the library itself is expected to rapidly evolve as we improve it. This code is written in ES2015, and you may need Babel or another transpiler to run it in your browser.

Savage Query is a jQuery-like abstraction layer for SVG DOM. It papers over the unfortunate old-school cracks in the API, such as native values for attributes like ``className``. You can use Query mostly the same way you would use jQuery, but the resulting collection object has different methods attached. Unless otherwise noted, all functions are applied to all elements in the collection.

* ``each(fn)`` - Call ``fn`` on every element in the collection.
* ``get(index = 0)`` - Retrieve the element at ``index``.
* ``addClass(c)`` - Add a class to elements. Runs naively--you may end up with duplicates in the className attribute.
* ``removeClass(c)`` - Remove class from elements.
* ``draw()`` - Animates the stroke of selected elements by transitioning the ``stroke-dashoffset`` style. Uses CSS transitions, so will not work in IE.
* ``fade()`` - Fades selected elements into visibility by transitioning the ``opacity`` style. Does work in IE.
* ``on(event, fn)`` - Adds an event listener to selected elements.
* ``style(name, value)`` - Works like jQuery's ``css()`` function. You can either provide a name/value pair, or pass an object as the first argument with multiple name/value pairs. Use the JavaScript style property name, not the CSS value (i.e., ``strokeDashoffset``, not ``stroke-dashoffset``).

Savage
------

Other utilities in the Savage family include:

* `Savage Camera <https://github.com/seattletimes/savage-camera>`_ - a simple viewBox camera system

