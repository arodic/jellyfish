Polymer({

  __doc__: {
    element: 'input-boolean',
    description: 'Input element for boolean data type.',
    status: 'alpha',
    url: 'https://github.com/arodic/input-boolean/',
    demo: 'http://arodic.github.com/input-boolean/',
    attributes: [
      { name: 'value', type: 'boolean', description: 'Input value.' },
      { name: 'editable', type: 'boolean', description: 'Determines if the input can be edited.' },
      { name: 'width', type: 'number'}
    ],
    properties: [],
    methods: [],
    events: [
      {
        name: 'input-changed',
        description: 'Fires when value is changed.'
      }
    ]
  },

  value: false,
  editable: true,
  ready: function() {
    this.setAttribute('tabindex', 1);
    this.addEventListener('keydown', this.onKeydown.bind(this));
    this.addEventListener( 'click', this.toggle.bind(this) );
  },
  onKeydown: function(event) {
    event.stopPropagation();
    if (!this.editable) return;
    if( event.which == 13) this.toggle();
  },
  toggle: function() {
    if (!this.editable) return;
    this.value = !this.value;
  },
  valueChanged: function () {
    this.fire('input-changed', { input: this });
  },
  widthChanged: function() {
    if (this.width === 0)  this.style.width = 'auto';
    else this.style.width = this.width + 'px';
  }
});