/**
 * Flatlogic Dashboards (https://flatlogic.com/admin-dashboards)
 *
 * Copyright © 2015-present Flatlogic, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import { connect } from 'react-redux';
import cx from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import {
  Navbar,
  Nav,
  NavItem,
  Button,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Input,
  InputGroup,
  InputGroupAddon,
} from 'reactstrap';
import { NavLink } from 'react-router-dom';

import Icon from '../Icon';

import photo from '../../images/photo.jpg';
import { logoutUser } from '../../actions/user';
import s from './Header.module.scss';

class Header extends React.Component {
  static propTypes = {
    sidebarToggle: PropTypes.func,
    dispatch: PropTypes.func.isRequired,
  };

  static defaultProps = {
    sidebarToggle: () => {},
  };

  state = { isOpen: false };

  toggleDropdown = () => {
    this.setState(prevState => ({
      isOpen: !prevState.isOpen,
    }));
  }

  doLogout = () => {
    this.props.dispatch(logoutUser());
  }

  render() {
    const {isOpen} = this.state;
    return (
      <Navbar className={s.root}>
        <Nav>
          <NavItem
            className={cx('visible-xs mr-4 d-sm-up-none', s.headerIcon, s.sidebarToggler)}
            href="#"
            onClick={this.props.sidebarToggle}
          >
            <i className="fa fa-bars fa-2x text-muted" />
          </NavItem>

        </Nav>
        <Nav className="ml-auto">
          <Dropdown isOpen={isOpen} toggle={this.toggleDropdown}>
            <DropdownToggle nav>
              <img className={cx('rounded-circle mr-sm', s.adminPhoto)} src={photo} alt="administrator" />
              <span className="text-body">{localStorage.getItem('userName')}</span>
              <i className={cx('fa fa-angle-down ml-sm', s.arrow, {[s.arrowActive]: isOpen})} />
            </DropdownToggle>
            <DropdownMenu style={{width: '100%'}}>
              <DropdownItem onClick={this.doLogout}>
                Logout
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </Nav>
      </Navbar>
    );
  }
}

function mapStateToProps(state) {
  return {
    init: state.runtime.initialNow,
  };
}
export default connect(mapStateToProps)(Header);
