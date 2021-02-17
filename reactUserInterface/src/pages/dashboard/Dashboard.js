import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Row,
  Col,
  Button,
  ButtonGroup,
  Breadcrumb,
  BreadcrumbItem,
  Progress,
} from 'reactstrap';
import s from './Dashboard.module.scss';

import withStyles from "@material-ui/core/styles/withStyles";

import dashboardStyle from "../../assets/jss/material-dashboard-react/views/dashboardStyle";

class Dashboard extends Component {
  /* eslint-disable */
  static propTypes = {

    isFetching: PropTypes.bool,
    dispatch: PropTypes.func.isRequired,

  };
  /* eslint-enable */

  static defaultProps = {

    isFetching: false,

  };

  state = {
    isDropdownOpened: false
  };

  componentDidMount() {
    if(process.env.NODE_ENV === "development") {

    }
  }

  formatDate = (str) => {
    return str.replace(/,.*$/,"");
  }

  toggleDropdown = () => {
    this.setState(prevState => ({
      isDropdownOpened: !prevState.isDropdownOpened,
    }));
  }

  render() {
    return (
      <div className={s.root}>
        <Breadcrumb>
          <BreadcrumbItem>YOU ARE HERE</BreadcrumbItem>
          <BreadcrumbItem active>First Page</BreadcrumbItem>
        </Breadcrumb>
        <h1 className="mb-lg">Dashboard</h1>

        <Row>
              <p className="mb-0">
                You are logged in as - {localStorage.getItem('userName')}
               </p>
           </Row>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {

   };
}

export default connect(mapStateToProps)(withStyles(dashboardStyle)(Dashboard));
