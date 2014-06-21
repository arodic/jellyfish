Polymer({

  __doc__: {
    element: 'input-string',
    description: 'Input element for string data type.',
    status: 'alpha',
    url: 'https://github.com/arodic/input-string/',
    demo: 'http://arodic.github.com/input-string/',
    attributes: [
      { name: 'value', type: 'string', description: 'Input value.' },
      { name: 'editable', type: 'boolean', description: 'Determines if the input can be edited.' },
      { name: 'spellcheck', type: 'boolean', description: 'Checks spelling. (not working in all browers)' },
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

  value: '',
  editable: true,
  spellcheck: false,
  width: 0,
  ready: function() {
    this.setAttribute('tabindex', 1);
    this.addEventListener('keydown', this.onKeydown.bind(this));
    this.addEventListener('focus', this.onFocus.bind(this));
    this.addEventListener('blur', this.onBlur.bind(this));
  },
  onKeydown: function(event) {
    event.stopPropagation();
    if (!this.editable) {
      event.preventDefault();
      return;
    }
    setTimeout(this.updateValue.bind(this),1);// TODO: fix range on canary and FF
  },
  onFocus: function() {
    var selection = window.getSelection();
    selection.removeAllRanges();
    var range = document.createRange();
    range.selectNodeContents(this.$.value);
    selection.addRange(range);
    this.focused = true;
  },
  onBlur: function() {
    this.value = this.$.value.textContent;
    var selection = window.getSelection();
    selection.removeAllRanges();
    this.focused = false;
  },
  updateValue: function() {
    this.value = this.$.value.textContent;
  },
  valueChanged: function () {
    if (!this.focused) this.$.value.textContent = this.value;
    this.fire('input-changed', { input: this });
  },
  spellcheckChanged: function() {
    this.$.value.setAttribute('spellcheck', this.spellcheck);
    this.updateValue();
  },
  widthChanged: function() {
    if (this.width === 0)  this.style.width = 'auto';
    else this.style.width = this.width + 'px';
  }
});