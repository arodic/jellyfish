Polymer({
  
  __doc__: {
    element: 'input-vector4',
    description: 'Input element for vector4 data type.',
    status: 'alpha',
    url: 'https://github.com/arodic/input-vector4/',
    demo: 'http://arodic.github.com/input-vector4/',
    attributes: [
      { name: 'value', type: 'array', description: 'Input value can be array or vector object.' },
      { name: 'min', type: 'number', description: 'Minimum value of a vector component.' },
      { name: 'max', type: 'number', description: 'Maximum value of a vector component.' },
      { name: 'step', type: 'number', description: 'Value increment when dragging.' },
      { name: 'linked', type: 'boolean', description: 'Links vector components proportionally.' },
      { name: 'toDeg', type: 'boolean', description: 'Converts displayed value to degrees.' },
      { name: 'editable', type: 'boolean', description: 'Determines if the input can be edited.' },
      { name: 'width', type: 'number', description: 'The width of the element in pixels.' }
    ],
    properties: [],
    methods: [],
    events: [
      {
        name: 'input-changed',
        description: 'Fires when value attribute is changed or mutated.'
      }
    ]
  },

  value: [0, 0, 0, 0],
  min: -Infinity,
  max: Infinity,
  step: 0.01,
  linked: false,
  toDeg: false,
  editable: true,
  width: 160,
  ready: function() {
    this.super();
    this.shadowRoot.addEventListener('input-changed', this.handleLinked.bind(this));
  },
  handleLinked: function() {
    // TODO: make better
    if (this.linked) {
      if (event.detail.input !== this.$.a0) this.$.a0.onSiblingValueChanged(event);
      if (event.detail.input !== this.$.a1) this.$.a1.onSiblingValueChanged(event);
      if (event.detail.input !== this.$.a2) this.$.a2.onSiblingValueChanged(event);
      if (event.detail.input !== this.$.a3) this.$.a3.onSiblingValueChanged(event);
    }
  },
  valueChanged: function() {
    if (this.value instanceof Object &&
      this.value.hasOwnProperty('x') &&
      this.value.hasOwnProperty('y') &&
      this.value.hasOwnProperty('z') &&
      this.value.hasOwnProperty('w')) {
        this.$.a0.bindProperty('value', new PathObserver(this.value, 'x'));
        this.$.a1.bindProperty('value', new PathObserver(this.value, 'y'));
        this.$.a2.bindProperty('value', new PathObserver(this.value, 'z'));
        this.$.a3.bindProperty('value', new PathObserver(this.value, 'w'));
    }
    if (this.value instanceof Array || this.value instanceof Float32Array) {
      for (var i = this.value.length; i--;) {
        this.$['a' + i].bindProperty('value', new PathObserver(this.value, '[' + i + ']'));
      }
    }
  }
});
