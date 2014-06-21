(function() {

  function linToLog(value) {
    var minv = Math.log(1);
    var maxv = Math.log(101);
    var scale = (maxv - minv);
    return (Math.exp(minv + scale * (value)) - 1) / 100;
  }

  function logToLin(value) {
    var minv = Math.log(1);
    var maxv = Math.log(101);
    var scale = (maxv - minv);
    return (Math.log(value * 100 + 1) - minv) / scale;
  }

  var rect;

  Polymer({

    __doc__: {
      element: 'input-slider',
      description: 'Input element for numeric data type.',
      status: 'alpha',
      url: 'https://github.com/arodic/input-slider/',
      demo: 'http://arodic.github.com/input-slider/',
      attributes: [
        { name: 'value', type: 'number', description: 'Input value.' },
        { name: 'min', type: 'number', description: 'Minimum value.' },
        { name: 'max', type: 'number', description: 'Maximum value.' },
        { name: 'step', type: 'number', description: 'Value increment when dragging.' },
        { name: 'log', type: 'boolean', description: 'Enables logarithmic scale.' },
        { name: 'editable', type: 'boolean', description: 'Determines if the input can be edited.' },
        { name: 'width', type: 'number', description: 'The width of the element in pixels.' }
      ],
      properties: [],
      methods: [],
      events: [
        {
          name: 'input-changed',
          description: 'Fires when value attribute is changed.'
        }
      ]
    },

    value: 0,
    min: 0,
    max: 1,
    step: null,
    log: false,
    editable: true,
    width: 160,
    ready: function() {
      // TODO: add log

      this.addEventListener('mousedown', this.onStartDrag.bind(this));
      this.addEventListener('touchstart', this.onStartDrag.bind(this));

      this.widthChanged();
      this.valueChanged();
    },
    onStartDrag: function(event) {
      event.preventDefault();
      event.stopPropagation();

      rect = this.getBoundingClientRect();
      this.onDrag(event);

      event = event.changedTouches ? event.changedTouches[0] : event;

      if (!this.editable) return;

      document.body.classList.add('ew-resize');
      document.activeElement.blur();

      this._onDrag = this.onDrag.bind(this);
      this._onEndDrag = this.onEndDrag.bind(this);
      document.addEventListener('mousemove', this._onDrag, false);
      document.addEventListener('mouseup', this._onEndDrag, false);
      this.addEventListener('touchmove', this._onDrag, false);
      this.addEventListener('touchend', this._onEndDrag, false);
      this.addEventListener('touchcancel', this._onEndDrag, false);
      this.addEventListener('touchleave', this._onEndDrag, false);
    },
    onEndDrag: function(event) {
      event.preventDefault();
      event.stopPropagation();
      event = event.changedTouches ? event.changedTouches[0] : event;

      document.body.classList.remove('ew-resize');
      document.removeEventListener('mousemove', this._onDrag, false);
      document.removeEventListener('mouseup', this._onEndDrag, false);
      this.removeEventListener('touchmove', this._onDrag, false);
      this.removeEventListener('touchend', this._onEndDrag, false);
      this.removeEventListener('touchcancel', this._onEndDrag, false);
      this.removeEventListener('touchleave', this._onEndDrag, false);
    },
    onDrag: function(event) {
      event.preventDefault();
      event.stopPropagation();

      if (!this.editable) return;
      if (event.type == 'mousemove' && event.which === 0) {
        this._onEndDrag(event);
        return;
      }

      event = event.changedTouches ? event.changedTouches[0] : event;

      var val = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
      if (this.log) val = linToLog(val);
      this.value = this.min + (this.max - this.min) * val;
      if (this.step) this.value = this.value - (this.value % this.step);

      Platform.flush();
    },

    valueChanged: function(oldValue) {
      if (this.value < this.min) this.min = this.value;
      if (this.value > this.max) this.max = this.value;

      var displayValue = (this.value - this.min) / (this.max - this.min);
      if (this.log) this.$.value.style.width = logToLin(displayValue) * 100 + '%';
      else this.$.value.style.width = displayValue * 100 + '%';

      if (oldValue) {
        this.fire('input-changed', { input: this, delta: this.value / oldValue });
      }
    },
    minChanged: function() {
      this.valueChanged();
    },
    maxChanged: function() {
      this.valueChanged();
    },
    logChanged: function() {
      this.valueChanged();
    },
    widthChanged: function() {
      if (this.width == 'auto' || isNaN(this.width)) {
        this.style.width = this.width;
      } else {
        this.style.width = this.width + 'px';
      }
      this.valueChanged();
    }
  });

})();
