// Copyright (c) ppy Pty Ltd <contact@ppy.sh>. Licensed under the GNU Affero General Public License v3.0.
// See the LICENCE file in the repository root for full licence text.

import Ruleset from 'interfaces/ruleset';
import UserJson from 'interfaces/user-json';
import { route } from 'laroute';
import * as React from 'react';

interface Props {
  children?: React.ReactNode;
  className?: string;
  mode?: Ruleset;
  tooltipPosition?: string;
  user: Partial<Pick<UserJson, 'id' | 'username'>>;
}

export default class UserLink extends React.PureComponent<Props> {
  render() {
    let className = 'js-usercard';
    if (this.props.className != null) {
      className += ` ${this.props.className}`;
    }

    const href = (this.props.user.id ?? -1) > 0
      ? route('users.show', { mode: this.props.mode, user: this.props.user.id })
      : undefined;

    return (
      <a
        className={className}
        data-tooltip-position={this.props.tooltipPosition}
        data-user-id={this.props.user.id}
        href={href}
      >
        {this.props.children ?? this.props.user.username}
      </a>
    );
  }
}
