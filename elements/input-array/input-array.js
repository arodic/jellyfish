Polymer({

  __doc__: {
    element: 'input-array',
    description: 'Input element for numeric array data type.',
    status: 'alpha',
    url: 'https://github.com/arodic/input-array/',
    demo: 'http://arodic.github.com/input-array/',
    attributes: [
      { name: 'value', type: 'array' },
      { name: 'min', type: 'number' },
      { name: 'max', type: 'number' },
      { name: 'step', type: 'number' },
      { name: 'editable', type: 'boolean' },
      { name: 'width', type: 'number' }
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
      
  value: [0,1,2,3,4,5,6,7,8,9],
  min: -Infinity,
  max: Infinity,
  step: 0.01,
  editable: true,
  width: 0,
  ready: function() {
    this.shadowRoot.addEventListener('input-changed', this.onInputChanged.bind(this));
    // this.addEventListener('show', this.onShow.bind(this));
  },
  onInputChanged: function(event) {
    event.stopPropagation();
    this.fire('input-changed', { input: this });
  },
  // onShow: function() {
  //   console.log( 'SHOW' );
  // },
  domReady: function() {
    this.valueChanged();
    this.widthChanged();
  },
  widthChanged: function() {
    if (this.width === 0)  this.style.width = 'auto';
    else this.style.width = this.width + 'px';
  },
  valueChanged: function() {
  }
});
