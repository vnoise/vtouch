canvas.ui
=========

canvas.ui is a HTML5 Canvas UI Framework with Multitouch support.

Features
========

canvas.ui is a light library for

1. hiding different event models: apple touch, firefox touch or stock mouse events.
2. delegating touch events to the right widget in a widget tree.
3. drawing ui widgets on the html5 canvas element.
4. managing layout for child widgets.

Usage
=====

Following simple example assumes a canvas element in a html document:

<pre>

&lt;html&gt;
  &lt;head&gt;
    &lt;script src="/canvas.ui/mootools.js" type="text/javascript"&gt;&lt;/script&gt;
    &lt;script src="/canvas.ui/touch-tracker.js" type="text/javascript"&gt;&lt;/script&gt;
    &lt;script src="/canvas.ui/widget.js" type="text/javascript"&gt;&lt;/script&gt;
    &lt;script src="/canvas.ui/slider.js" type="text/javascript"&gt;&lt;/script&gt;
    &lt;script src="/app.js" type="text/javascript"&gt;&lt;/script&gt;
  &lt;/head&gt;
  &lt;body onLoad="onLoad()" style="background:#000;margin:0"&gt;
    &lt;canvas id="canvas" width="800" height="600"&gt;&lt;/canvas&gt;
  &lt;/body&gt;
&lt;/html&gt;

</pre>

Let's just create a root widget and add a slider with the label 'Pitch'.

The slider fires the change event, so we can pass an event handler to the constructor.

<pre>

function onLoad() {
        var widget = new Widget({
            canvas: document.getElementById('canvas'),
            layout: 'vertical',
            width: 800,
            height: 600
        });

        var slider = widget.add({ 
            type: Slider, 
            label: 'Pitch',
            on: {
                change: function(value) {
                    console.log("value changed to: " + value);
                }
            }
        });
}

</pre> 
