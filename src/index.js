var React = require('react')
var {getSelection, setSelection} = require('react/lib/ReactInputSelection')
var RX = require('incr-regex-package').default;

var InputMask = require('inputmask-core')


var KEYCODE_Z = 90
var KEYCODE_Y = 89

function isUndo(e) {
  return (e.ctrlKey || e.metaKey) && e.keyCode === (e.shiftKey ? KEYCODE_Y : KEYCODE_Z)
}

function isRedo(e) {
  return (e.ctrlKey || e.metaKey) && e.keyCode === (e.shiftKey ? KEYCODE_Z : KEYCODE_Y)
}

function supportArrowNavigation(mask) {
   return (RX.contract.isFunc(mask.arrowAction));  
}

function asStr(anObj) {
  return JSON.stringify(anObj);
}

function eqSel(sel1,sel2) {
  if( sel1 === sel2 ) return true;
  if( sel1 === undefined || sel2 === undefined) return false;
  return sel1.start === sel2.start && sel1.end === sel2.end;
}

var MaskedInput = React.createClass({
  propTypes: {
    mask: React.PropTypes.object.isRequired,

    formatCharacters: React.PropTypes.object,
    placeholderChar: React.PropTypes.string
  },

  getDefaultProps() {
    return {
      value: ''
    }
  },

  getInitialState() {
     return { focus: false};
  },

  componentWillMount() {
    var options = {
      pattern: this.props.mask,
      value: this.props.value,
      formatCharacters: this.props.formatCharacters
    }
    if (this.props.placeholderChar) {
      options.placeholderChar = this.props.placeholderChar
    }
    //var rx = new RX.RXInputMask(options);
    
    this.mask = (typeof options.mask === "string") ?  new InputMask(options) : new RX.RXInputMask(options);
    console.log("MASK HAS BEEN SET", options, this.mask);
  },

  componentWillReceiveProps(nextProps) {
    console.log("HERE I AAM - componentWillReceiveProps", nextProps);
    if (this.props.value !== nextProps.value) {
      this.mask.setValue(nextProps.value)
    }
    if (this.props.mask !== nextProps.mask) {
      this.mask.setPattern(nextProps.mask, {value: this.mask.getRawValue()})
    }
  },

  _updateMaskSelection() {
     console.log("HERE I AAM - _updateMaskSelection", getSelection(this.input));
    this.mask.selection = getSelection(this.input);
     console.log("HERE I AAM - _updateMaskSelection done", this.mask.selection);
  },

  _updateInputSelection() {
    console.log("HERE I AAM - _updateInputSelection", this.mask.selection, this.mask.getValue());
    if( !eqSel(getSelection(this.input),this.mask.selection)) setSelection(this.input, this.mask.selection);
    console.log("HERE I AAM - _updateInputSelection DONE", getSelection(this.input));
  },

  _onFocus(e) {

  },

  _onBlurr() {

  },

  _onChange(e) {
     console.log('onChange', asStr(getSelection(this.input)), e.target.value)

    var maskValue = this.mask.getValue()
    if (e.target.value !== maskValue) {
      // Cut or delete operations will have shortened the value
      if (e.target.value.length < maskValue.length) {
        var sizeDiff = maskValue.length - e.target.value.length
        this._updateMaskSelection()
        this.mask.selection.end = this.mask.selection.start + sizeDiff
        this.mask.backspace();
        console.log("Fix maskValue", maskValue, "diff:", sizeDiff, "target value: ", e.target.value);
      }
      var value = this._getDisplayValue();
      e.target.value = value
      if (value) {
        this._updateInputSelection()
      }
    }
    if (this.props.onChange) {
      this.props.onChange(e)
    }
  },

  _onKeyDown(e) {
     console.log('onKeyDown',this.mask, asStr(getSelection(this.input))+"/"+asStr(this.mask.selection), e.key, e.keyCode, e.target.value)

    if (isUndo(e)) {
      e.preventDefault()
      if (this.mask.undo()) {
        e.target.value = this._getDisplayValue();
        console.log("undo:getDisplayValue", this._getDisplayValue());
        this._updateInputSelection();
        this.props.onChange(e)
      }
      return
    }
    else if (isRedo(e)) {
      e.preventDefault()
      if (this.mask.redo()) {
        e.target.value = this._getDisplayValue();
        console.log("redo:getDisplayValue", this._getDisplayValue());
        this._updateInputSelection()
        this.props.onChange(e)
      }
      return
    }

    if( e.key === 'ArrowLeft' || e.key == 'ArrowRight') {
      // Check if mask supports arrow support
      let sel = getSelection(this.input);
      this.mask.selection = sel;
      if( sel.start === sel.end && this.mask.left !== undefined) {
        e.preventDefault();
        if( e.key === 'ArrowLeft' ) this.mask.left(sel);
        else this.mask.right(sel);
        this._updateInputSelection();
    }
/*
      if(this.mask.selection.start == this.mask.selection.end){
        if(e.key === "ArrowLeft") {
          let ix = this.mask.pattern.getFirstEditableBefore(this.mask.selection.start-1);
          if(ix === undefined || ix !== this.mask.selection.start-1) {
            e.preventDefault();
            this.mask.selection.start=this.mask.selection.end = ix;
            this._updateInputSelection();
          } 
        }
        else if(e.key === "ArrowRight") {
          let ix = this.mask.pattern.getFirstEditableAfter(this.mask.selection.start+1);
          if(ix === undefined || ix !== this.mask.selection.start+1) {
            e.preventDefault();
            this.mask.selection.start=this.mask.selection.end = ix;
            this._updateInputSelection();
          } 
        } 
      } 
*/
      console.log("Arrow Action support:", supportArrowNavigation(this.mask), " value:",this._getDisplayValue(), " selection: ", asStr(getSelection(this.input)), asStr(this.mask.selection));
    }
    else if (e.key === 'Backspace') {
      e.preventDefault()
      this._updateMaskSelection()
      if (this.mask.backspace()) {
        var value = this._getDisplayValue()
        e.target.value = value;
        console.log("backspace:getDisplayValue", this._getDisplayValue());
        if (value) {
          this._updateInputSelection()
        }
        this.props.onChange(e)
      }
    }
  },

  _onKeyPress(e) {
     console.log('onKeyPress', asStr(getSelection(this.input)),asStr(this.mask.selection), e.key, e.target.value)

    // Ignore modified key presses
    // Ignore enter key to allow form submission
    if (e.metaKey || e.altKey || e.ctrlKey || e.key === 'Enter') { return }
    let selX = getSelection(this.input);
    let oldMaskX = this.mask.getSelection();
    e.preventDefault();
    this._updateMaskSelection();
    if (this.mask.input(e.key)) {
      e.target.value = this.mask.getValue();
      console.log("keyPress:getDisplayValue", this._getDisplayValue(),  " selection: ", asStr(selX)+"/"+asStr(this.mask.selection)+"<"+asStr(oldMaskX));
      this._updateInputSelection();
      this.props.onChange(e);
    }
  },

  _onPaste(e) {
     console.log('onPaste', asStr(getSelection(this.input)), e.clipboardData.getData('Text'), e.target.value)

    e.preventDefault()
    this._updateMaskSelection()
    // getData value needed for IE also works in FF & Chrome
    if (this.mask.paste(e.clipboardData.getData('Text'))) {
      e.target.value = this.mask.getValue();
      console.log("undo:getDisplayValue", this._getDisplayValue());
      // Timeout needed for IE
      setTimeout(this._updateInputSelection, 0)
      this.props.onChange(e)
    }
  },

  _getDisplayValue() {
    var value = this.mask.getValue()
    return value === this.mask.emptyValue ? '' : value
  },

  render() {
    var {mask, formatCharacters, size, placeholder, ...props} = this.props
    var patternLength = this.mask.pattern.length;
    console.log("about to render");
    return <input {...props}
      ref={r => this.input = r }
      maxLength={patternLength}
      onChange={this._onChange}
      onKeyDown={this._onKeyDown}
      onKeyPress={this._onKeyPress}
      onPaste={this._onPaste}
      placeholder={placeholder || this.mask.emptyValue}
      size={size || patternLength}
      value={this._getDisplayValue()}
      style={{padding: "3px 0px 3px 0px"}}
    />
  }
})

module.exports = MaskedInput
