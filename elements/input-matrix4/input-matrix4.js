Polymer({

  __doc__: {
    element: 'input-matrix4',
    description: 'Input element for matrix4 data type.',
    status: 'alpha',
    url: 'https://github.com/arodic/input-matrix4/',
    demo: 'http://arodic.github.com/input-matrix4/',
    attributes: [
      { name: 'value', type: 'array', description: 'Input matrix value.' },
      { name: 'min', type: 'number', description: 'Minimum value of a matrix component.' },
      { name: 'max', type: 'number', description: 'Maximum value of a matrix component.' },
      { name: 'step', type: 'number', description: 'Value increment when dragging.' },
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

  value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
  min: -Infinity,
  max: Infinity,
  step: 0.01,
  toDeg: false,
  editable: true,
  width: 160,
  valueChanged: function() {
    if (this.value instanceof Array || this.value instanceof Float32Array) {
      for (var i = this.value.length; i--;) {
        this.$['a' + i].bindProperty('value', new PathObserver(this.value, '[' + i + ']'));
      }
    }
  }
});
