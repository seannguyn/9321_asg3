import React, { Component } from 'react';
import './Home.scss';
import * as Common from '../../Common';
import Slogon from '../../components/Slogon';
import BasicFilter from '../../components/BasicFilter';
import { Select, Snackbar, MenuItem, Button, } from '@material-ui/core';
import axios from 'axios';

export default class Home extends Component {
  static displayName = 'Home';

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    axios.get(Common.BACKEND_URL + '/suburbs')
      .then((response) => {
        this.setState(
          {
            ...this.state,
            suburbs: response.data.data,
          }
        )
        console.log(response.data.data)
      })
      .catch((e) => {
        let errorMsg;
        if (e.response && e.response.data) {
          console.error(e.response);
          errorMsg = e.response.data['msg'];
        } else {
          console.error(e);
          errorMsg = 'Opps! Unknow error happens...';
        }
        this.setState({
          ...this.state,
          // suburbs: {
          //   "1": {
          //     "suburb": "Abbotsford",
          //     "postcode": "3067"
          //   },
          //   "2": {
          //     "suburb": "Airport West",
          //     "postcode": "3042"
          //   },
          // },
          isSnackBarOpen: true,
          snackBarMsg: errorMsg,
        });
      });
  }

  render() {
    return (
      <div className='home-page'>
        <Slogon
          style={{
            margin: 'auto',
          }}
        />
        <div className='app-desc'>
          Trying to find a property to purchase in Melbourne?<br />
          Let us know what you're looking for and we'll provide predictions and suggestions.<br />
          Here we go!
        </div>
        <div className='predict-filter-container'>
          <Snackbar
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            autoHideDuration={1500}
            open={this.state.isSnackBarOpen}
            message={this.state.snackBarMsg}
            onClose={() => {
              this.setState({
                ...this.state,
                isSnackBarOpen: false,
                snackBarMsg: null,
              });
            }}
          />
          <div className='predict-filters'>
            <BasicFilter />
            {this.state.suburbs ?
              <div className='basic-filter'>
                <div className='basic-filter-title'>
                  Suburb
              </div>
                <Select
                  autoWidth
                  style={{ minWidth: '100px' }}
                  value={this.state.selectedSuburb}
                  onChange={event => this.setState({ [event.target.name]: event.target.value })}
                  inputProps={{ name: 'selectedSuburb' }}
                >
                  {
                    Object.keys(this.state.suburbs).map((key) => {
                      let value = this.state.suburbs[key];
                      return (
                        <MenuItem
                          key={key}
                          value={key}
                        >
                          {value.suburb + ', ' + value.postcode}
                        </MenuItem>
                      );
                    })
                  }
                </Select>
              </div>
              :
              null
            }
          </div>
          <Button
            variant='extendedFab'
            size='large'
            color='primary'
            onClick={() => {
              // TODO call predict API
            }}
          >
            Reveal Prediction
          </Button>
        </div>
      </div>
    );
  }
}