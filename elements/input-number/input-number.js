(function() {

  var style = document.createElement('style');
  style.type = 'text/css';
  var css = 'body.ew-resize {cursor: ew-resize}\n';
  css += 'body.ew-resize * {cursor: ew-resize}';
  css += 'body.ew-resize * {user-select: none; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none;}';
  style.appendChild(document.createTextNode(css));
  document.getElementsByTagName('head')[0].appendChild(style);

  var delta = 0;
  var deltaStep = 5;
  var x = 0;
  var y = 0;
  var xOld = 0;
  var rect;

  Polymer({

    __doc__: {
      element: 'input-number',
      description: 'Input element for numeric data type.',
      status: 'alpha',
      url: 'https://github.com/arodic/input-number/',
      demo: 'http://arodic.github.com/input-number/',
      attributes: [
        { name: 'value', type: 'number', description: 'Input value.' },
        { name: 'min', type: 'number', description: 'Minimum value.' },
        { name: 'max', type: 'number', description: 'Maximum value.' },
        { name: 'step', type: 'number', description: 'Value increment when dragging.' },
        { name: 'toDeg', type: 'boolean', description: 'Converts displayed value to degrees.' },
        { name: 'editable', type: 'boolean', description: 'Determines if the input can be edited.' },
        { name: 'width', type: 'number'}
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
    min: -Infinity,
    max: Infinity,
    step: 0.01,
    toDeg: false,
    editable: true,
    displayValue: 0,
    width: 0,
    ready: function() {
      this.setAttribute('tabindex', 1);
      this.setAttribute('touch-action', 'none');
      this.$.blocker.setAttribute('touch-action', 'none');
      this.addEventListener('keydown', this.onKeydown.bind(this));
      this.addEventListener('focus', this.onFocus.bind(this));
      this.addEventListener('blur', this.onBlur.bind(this));

      // TODO: make better on mobile
      this.$.blocker.addEventListener('dblclick', this.focus.bind(this));
      this.$.blocker.addEventListener('contextmenu', this.focus.bind(this));

      this.$.value.addEventListener('keydown', this.onKeydown.bind(this));
      this.$.blocker.addEventListener('mousedown', this.onStartDrag.bind(this));

      this.$.blocker.addEventListener('touchstart', this.onStartDrag.bind(this));

    },
    domReady: function() {
      this.displayValueChanged();
      this.updateBlocker();
    },
    focus: function() {
      if (!this.editable) return;
      this.$.value.textContent = this.displayValue;
      this.$.value.focus();
      this.onFocus();
    },
    onStartDrag: function(event) {
      event.stopPropagation();
      event = event.changedTouches ? event.changedTouches[0] : event;

      document.body.classList.add('ew-resize');
      xOld = event.clientX;
      delta = 0;
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
      event.stopPropagation();
      // TODO: add acceleration
      if (!this.editable) return;
      if (event.type == 'mousemove' && event.which === 0) {
        this._onEndDrag(event);
        return;
      }

      event = event.changedTouches ? event.changedTouches[0] : event;

      x = event.clientX;
      y = event.clientY;
      delta += x - xOld;
      xOld = event.clientX;

      while (Math.abs(delta) > deltaStep) {
        if (delta > deltaStep) {
          if (this.toDeg) this.value += this.step / 180 * Math.PI;
          else this.value += 1 * this.step;
          delta -= deltaStep;
        }
        if (delta < -deltaStep) {
          if (this.toDeg) this.value -= this.step / 180 * Math.PI;
          else this.value -= 1 * this.step;
          delta += deltaStep;
        }
      }
      this.value = Math.max(this.value, this.min);
      this.value = Math.min(this.value, this.max);

      Platform.flush();
    },

    onKeydown: function(event) {
      // TODO: number keyboard on mobile
      event.stopPropagation();
      // console.log(event.which);
      if(event.which == 13) {
        var selection = window.getSelection();
        selection.removeAllRanges();
        this.$.value.blur();
        return;
      }
      var validKeys = [46, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 189, 190, 37, 38, 39, 40, 8, 9];
      if (!this.editable || validKeys.indexOf(event.which) == -1) {
        event.preventDefault();
        return;
      }
      setTimeout(this.updateValue.bind(this), 1);
    },
    onFocus: function() {
      var selection = window.getSelection();
      selection.removeAllRanges();
      var range = document.createRange();
      range.selectNodeContents(this.$.value);
      selection.addRange(range);
    },
    onBlur: function() {
      this.updateValue();
      var selection = window.getSelection();
      selection.removeAllRanges();
      this.valueChanged();//?
    },
    updateValue: function() {
      if (!isNaN(this.$.value.textContent) && (this.$.value.textContent.slice(-1) != '.')) {
        if (this.toDeg)
          this.value = parseFloat(this.$.value.textContent) / 180 * Math.PI;
        else
          this.value = parseFloat(this.$.value.textContent);
      }
    },
    updateBlocker: function() {
      rect = this.$.value.getBoundingClientRect();
      this.$.blocker.style.width = rect.width + 'px';
      this.$.blocker.style.height = rect.height + 'px';
    },
    valueChanged: function(oldValue) {
      if (this.value < this.min) this.min = this.value;
      if (this.value > this.max) this.max = this.value;

      if (this.toDeg)
        this.displayValue = this.value / Math.PI * 180;
      else
        this.displayValue = this.value;

      if (oldValue) {
        this.fire('input-changed', { input: this, delta: this.value / oldValue });
      }
    },
    displayValueChanged: function() {
      this.$.value.textContent = Math.round(this.displayValue * 10 / this.step) / (10 / this.step);
      this.updateBlocker();
    },
    toDegChanged: function() {
      this.valueChanged();
    },
    minChanged: function() {
      this.value = Math.max(this.value, this.min);
    },
    maxChanged: function() {
      this.value = Math.min(this.value, this.max);
    },
    widthChanged: function() {
      if (this.width === 0)  this.style.width = 'auto';
      else this.style.width = this.width + 'px';
    }
  });

})();
