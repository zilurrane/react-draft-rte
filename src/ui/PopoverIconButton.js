/* @flow */

import React, {Component} from 'react';
import IconButton from './IconButton';
import InputPopover from './InputPopover';
import autobind from 'class-autobind';

type Props = {
  iconName: string;
  showPopover: boolean,
  defaultValue?: string,
  checkOptions?: {
    [key: string]: { label: string, defaultValue: boolean };
  };
  options?: Object;
  onTogglePopover: Function,
  onSubmit: Function;
};

export default class PopoverIconButton extends Component {
  props: Props;

  constructor() {
    super(...arguments);
    autobind(this);
  }

  render() {
    let {onTogglePopover, showPopover, checkOptions, options, ...props} = this.props; // eslint-disable-line no-unused-vars
    return (
      <IconButton {...props} onClick={onTogglePopover}>
        {this._renderPopover()}
      </IconButton>
    );
  }

  _renderPopover() {
    if (!this.props.showPopover) {
      return null;
    }
    return (
      <InputPopover
        defaultValue={this.props.defaultValue}
        checkOptions={this.props.checkOptions}
        options={this.props.options}
        onSubmit={this._onSubmit}
        onCancel={this._hidePopover}
      />
    );
  }

  _onSubmit() {
    this.props.onSubmit(...arguments);
  }

  _hidePopover() {
    if (this.props.showPopover) {
      this.props.onTogglePopover(...arguments);
    }
  }
}
