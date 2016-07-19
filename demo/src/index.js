import './style.css'

import React from 'react'
import {render} from 'react-dom'

import MaskedInput from '../../src'
import RX from 'incr-regex-package'

const PATTERNS = [
  '1111 1111',
  '111 111',
  '11 11',
  '1 1'
];

window.RX = RX;

const App = React.createClass({
  getInitialState() {
    return {
      card:  '',
      email: '',
      tester: '',
      ccv: '',
      plate: '',
      escaped: '',
      leading: '',
      custom: '',
      changing: '',
      pattern: '1111 1111' 
    }
  },

  _onChange(e) {
    const stateChange = {}
    stateChange[e.target.name] = e.target.value
    this.setState(stateChange)
  },

  _changePattern(e) {
    this.setState({pattern: e.target.value})
  },

  render() {
    var rx = "1111112";  ///123-...456/;
    var rx1 = new RegExp("\\+\\(\\d{3}\\)-\\d{3}-\\d{4}|#\\d{3}\.\\d{3}X?YZ| ?\\d{3}---\\d{4}\\.");
    var rz2 = /aa[a-zA-Z]+@@\d+!!/;
    var email = /[a-zA-Z_0-9][a-zA-Z_.0-9-]*@([a-zA-Z_0-9][a-zA-Z_.0-9-]*)+/
    //console.log("here I am",rx, RX.RXInputMask);
    return (
      <div className="App">
      <h1>
        <code>&lt;<a href="https://github.com/insin/react-maskedinput">MaskedInput</a>/&gt;</code>
      </h1>
      <p></p>
      <p className="lead">A React component which creates a masked <code>&lt;input/&gt;</code></p>
      <div className="form-field" style={ {verticalAlign: 'top'} } >
        <label htmlFor="card">Card Number xxx:</label>
        <MaskedInput mask={rx1} name="card" id="card" size="20" value={this.state.card} onChange={this._onChange}/>
      </div>
      <div className="form-field">
        <label htmlFor="email">Email:</label>
        <MaskedInput mask={email} name="mail" id="mail" size="40" value={this.state.email} onChange={this._onChange}/>
      </div>
      <div className="form-field">
        <label htmlFor="tester">Tester:</label>
        <MaskedInput mask={rz2} name="mail" id="tester" size="40" value={this.state.tester} onChange={this._onChange}/>
      </div>
   
      </div>  
      )
  }
})

const CustomInput = React.createClass({
  render() {
    return <MaskedInput
      mask="1111-WW-11"
      placeholder="1234-WW-12"
      placeholderChar=" "
      size="11"
      {...this.props}
      formatCharacters={{
        'W': {
          validate(char) { return /\w/.test(char) },
          transform(char) { return char.toUpperCase() }
        }
      }
    }/>
  }
})

render(<App/>, document.getElementById('demo'))
/*
<div className="App">
      <h1>
        <code>&lt;<a href="https://github.com/insin/react-maskedinput">MaskedInput</a>/&gt;</code>
      </h1>
      <p className="lead">A React component which creates a masked <code>&lt;input/&gt;</code></p>
      <div className="form-field">
        <label htmlFor="card">Card Number xxx:</label>
        <MaskedInput mask={rx1} name="card" id="card" size="20" value={this.state.card} onChange={this._onChange}/>
      </div>
      <p>You can even externally update the card state like a standard input element:</p>
      <div className="form-field">
        <label htmlFor="card">Externally Update:</label>
        <input onChange={this._onChange} name="card" maxLength="16" style={{borderBottom: '1px solid #999'}} />
      </div>
      <p>Placeholders are automatically generated but can be overridden with your own:</p>
      <div className="form-field">
        <label htmlFor="expiry">Expiry Date:</label>
        <MaskedInput mask="11/1111" name="expiry" id="expiry" placeholder="mm/yyyy" onChange={this._onChange}/>
      </div>
      <div className="form-field">
        <label htmlFor="ccv">CCV:</label>
        <MaskedInput mask="111" name="ccv" id="ccv" onChange={this._onChange}/>
      </div>
      <div className="form-field">
        <label htmlFor="plate">License Plate:</label>
        <MaskedInput mask="AAA 1111" name="plate" id="plate" onChange={this._onChange} placeholder="ABC 1234"/>
      </div>
      <p>Mask placeholder characters can be escaped with a leading <code>\</code> to use them as static contents:</p>
      <div className="form-field">
        <label htmlFor="escaped">Escaped:</label>
        <MaskedInput mask="11 \* 11" name="escaped" id="escaped" onChange={this._onChange}/>
      </div>
      <p>Leading static characters:</p>
      <div className="form-field">
        <label htmlFor="leading">Leading:</label>
        <MaskedInput mask="(0) 111 1111" name="leading" id="leading" onChange={this._onChange}/>
      </div>
      <p>Changing patterns:</p>
      <div className="form-field">
        <label htmlFor="changing">Input:</label>
        <MaskedInput mask={this.state.pattern} name="changing" id="changing" onChange={this._onChange}/>
      </div>
      <div className="form-field">
        <label htmlFor="pattern">Pattern:</label>
        <select onChange={this._changePattern}>
          {PATTERNS.map(pattern => <option value={pattern} key={pattern}>{pattern}</option>)}
        </select>
      </div>
      <p>Custom format character (W=[a-zA-Z0-9_], transformed to uppercase) and placeholder character (en space):</p>
      <div className="form-field">
        <label htmlFor="custom">Custom:</label>
        <CustomInput name="custom" id="custom" onChange={this._onChange}/>
      </div>
      <hr/>
      <pre><code>{JSON.stringify(this.state, null, 2)}</code></pre>
      <hr/>
      <footer><a href="https://github.com/insin/react-maskedinput">Source on GitHub</a></footer>
    </div>
*/