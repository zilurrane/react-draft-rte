/* @flow */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import IconButton from './IconButton';
import ButtonGroup from './ButtonGroup';
import autobind from 'class-autobind';
import cx from 'classnames';

import styles from './InputPopover.css';

type CheckOptionValues = {
  [key: string]: boolean;
};

type Props = {
  className?: string;
  defaultValue?: string;
  checkOptions?: {
    [key: string]: { label: string, defaultValue: boolean };
  };
  options?: Object;
  onCancel: () => any;
  onSubmit: (value: string, checkOptionValues: CheckOptionValues, options: Object) => any;
};

type State = {
  checkOptionValues: CheckOptionValues
};

export default class InputPopover extends Component {
  props: Props;
  state: State;
  _inputRef: ?Object;
  _altRef: ?Object;

  constructor() {
    super(...arguments);
    autobind(this);
    let { checkOptions } = this.props;
    let checkOptionValues: CheckOptionValues = {};
    if (checkOptions) {
      for (let key of Object.keys(checkOptions)) {
        let { defaultValue } = checkOptions[key];
        checkOptionValues[key] = defaultValue;
      }
    }
    this.state = {
      checkOptionValues,
    };
  }

  componentDidMount() {
    document.addEventListener('click', this._onDocumentClick, true);
    document.addEventListener('keydown', this._onDocumentKeydown);
    if (this._inputRef) {
      this._inputRef.focus();
    }
  }

  componentWillUnmount() {
    document.removeEventListener('click', this._onDocumentClick, true);
    document.removeEventListener('keydown', this._onDocumentKeydown);
  }

  render() {
    let { props } = this;
    let className = cx(props.className, styles.root);
    return (
      <div className={className}>
        <div className={styles.inner}>
          <div>
            <input
              ref={this._setInputRef}
              defaultValue={props.defaultValue}
              type="text"
              placeholder="https://example.com/"
              className={styles.input}
              onKeyPress={this._onInputKeyPress}
            />
           {
           props.options && props.options.altValue && <input
              ref={this._setAltRef}
              defaultValue={props.defaultValue}
              type="text"
              placeholder="Image Alternative Text"
              className={styles.input}
              onKeyPress={this._onInputKeyPress}
            />
            }
          </div>
          <ButtonGroup className={styles.buttonGroup}>
            <IconButton
              label="Cancel"
              iconName="cancel"
              onClick={props.onCancel}
            />
            <IconButton
              label="Submit"
              iconName="accept"
              onClick={this._onSubmit}
            />
          </ButtonGroup>
        </div>
        {this._renderCheckOptions()}
      </div>
    );
  }

  _renderCheckOptions() {
    if (!this.props.checkOptions) {
      return null;
    }
    let { checkOptions } = this.props;
    return Object.keys(checkOptions).map((key) => {
      let label = checkOptions && checkOptions[key] ? checkOptions[key].label : '';
      return (
        <div key={key} className={styles.checkOption}>
          <label>
            <input
              type="checkbox"
              checked={this.state.checkOptionValues[key]}
              onChange={() => this._onCheckOptionPress(key)}
            />
            <span>{label}</span>
          </label>
        </div>
      );
    });
  }

  _setInputRef(inputElement: Object) {
    this._inputRef = inputElement;
  }

  _setAltRef(inputElement: Object) {
    this._altRef = inputElement;
  }

  _onCheckOptionPress(key: string) {
    let { checkOptionValues } = this.state;
    let oldValue = Boolean(checkOptionValues[key]);
    let newCheckOptionValues = { ...checkOptionValues, [key]: !oldValue };
    this.setState({
      checkOptionValues: newCheckOptionValues,
    });
  }

  _onInputKeyPress(event: Object) {
    if (event.which === 13) {
      // Avoid submitting a <form> somewhere up the element tree.
      event.preventDefault();
      this._onSubmit();
    }
  }

  _onSubmit() {
    let value = this._inputRef ? this._inputRef.value : '';
    let altValue = this._altRef ? this._altRef.value : undefined;
    this.props.onSubmit(value, this.state.checkOptionValues, { altValue });
  }

  _onDocumentClick(event: Object) {
    let rootNode = ReactDOM.findDOMNode(this);
    if (!rootNode.contains(event.target)) {
      // Here we pass the event so the parent can manage focus.
      this.props.onCancel(event);
    }
  }

  _onDocumentKeydown(event: Object) {
    if (event.keyCode === 27) {
      this.props.onCancel();
    }
  }
}
