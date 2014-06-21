Polymer({

  __doc__: {
    element: 'input-rgba',
    description: 'Input element for color (rgba) data type.',
    status: 'alpha',
    url: 'https://github.com/arodic/input-rgba/',
    demo: 'http://arodic.github.com/input-rgba/',
    attributes: [
      { name: 'value', type: 'array', description: 'Input value.' },
      { name: 'hexValue', type: 'string', description: 'Hexadecimal value of rgb components.' },
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

  value: [1, 1, 1, 1],
  hexValue: '#ffffff',
  editable: true,
  width: 160,
  ready: function() {
    this.shadowRoot.addEventListener('input-changed', this.onInputChanged.bind(this));
  },
  attached: function() {
    this.widthChanged();
    this.valueChanged();
    this.hexValueChanged();
  },
  onInputChanged: function(event) {
    event.stopPropagation();
    this.fire('input-changed', { input: this });

    var hex;
    if (this.isObject()) {
      hex = (this.value.r * 255) << 16 ^ (this.value.g * 255) << 8 ^ (this.value.b * 255) << 0;
    } else {
      hex = (this.value[0] * 255) << 16 ^ (this.value[1] * 255) << 8 ^ (this.value[2] * 255) << 0;
    }
    var hexString = '#' + ('000000' + hex.toString(16)).slice(- 6);
    this.hexValue = hexString;
  },
  isObject: function() {
    if (this.value instanceof Object &&
      this.value.hasOwnProperty('r') &&
      this.value.hasOwnProperty('g') &&
      this.value.hasOwnProperty('b')) {
      return true;
    }
  },
  valueChanged: function() {
    this.super();
    if (this.isObject()) {
        this.$.a0.bindProperty('value', new PathObserver(this.value, 'r'));
        this.$.a1.bindProperty('value', new PathObserver(this.value, 'g'));
        this.$.a2.bindProperty('value', new PathObserver(this.value, 'b'));
        this.$.a3.bindProperty('value', new PathObserver(this.value, 'a'));
    }
    if (this.value instanceof Array || this.value instanceof Float32Array) {
      for (var i = this.value.length; i--;) {
        this.$['a' + i].bindProperty('value', new PathObserver(this.value, '[' + i + ']'));
      }
    }
  },
  hexValueChanged: function() {
    this.$.swatch.style.background = this.hexValue;

    var hex = parseInt(this.hexValue.replace(/^#/, ''), 16);
    hex = hex.toString();

    hex = Math.floor(hex);

    if (this.isObject()) {
      this.value.r = (hex >> 16 & 255) / 255;
      this.value.g = (hex >> 8 & 255) / 255;
      this.value.b = (hex & 255) / 255;
    } else {
      this.value[0] = (hex >> 16 & 255) / 255;
      this.value[1] = (hex >> 8 & 255) / 255;
      this.value[2] = (hex & 255) / 255;
    }

  },
  widthChanged: function() {
    if (this.width === 0)  this.style.width = 'auto';
    else this.style.width = this.width + 'px';

    var rect = this.$.swatch.getBoundingClientRect();

    this.$.swatch.style.width = rect.height + 'px';

    this.$.picker.style.width = rect.height + 'px';
    this.$.picker.style.height = rect.height + 'px';

    this.sliderWidth = (this.width - rect.height) / 4;

    this.valueChanged();
  },
  editableChanged: function() {
    if (this.editable) this.$.picker.style.display = 'block';
    else this.$.picker.style.display = 'none';
  }
});
