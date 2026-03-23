import React, { Component } from 'react';
import axios from 'axios';
import { Consumer } from '../../context';

class Search extends Component {
  state = {
    trackTitle: '',
  };

  findTrack = (dispatch, e) => {
    e.preventDefault();
    axios
      .get(
        `https://cors-anywhere.herokuapp.com/https://api.musixmatch.com/ws/1.1/track.search?q_track_artist=${this.state.trackTitle}&page_size=10&page=1&s_track_rating=desc&apikey=a50b286ff1812356a7a1ecfd3f307931	`
      )
      .then((res) => {
        dispatch({
          type: 'SEARCH_TRACKS',
          payload: res.data.message.body.track_list,
        });
        this.setState({
          trackTitle: '',
        });
      })
      .catch((error) => console.log(error));
  };

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  render() {
    return (
      <Consumer>
        {(value) => {
          const { dispatch } = value;
          console.log({ value });
          console.log({ dispatch });
          return (
            <div className='card card-body mb-4 p-4'>
              <div className='display-4 text-center heading'>
                <i className='material-icons music'>music_note</i>Search for a song / artist
              </div>
              <div className='lead text-center'>Get the lyrics for any song</div>
              <form onSubmit={this.findTrack.bind(this, dispatch)}>
                <div className='form-group'>
                  <input
                    value={this.state.trackTitle}
                    name='trackTitle'
                    placeholder='Search by song title or artist '
                    type='text'
                    onChange={this.onChange}
                    className='form-control form-control-lg mt-4'
                  />
                </div>
                <button type='submit' className='btn btn-primary btn-lg btn-block mb-4'>
                  Get track lyrics
                </button>
              </form>
            </div>
          );
        }}
      </Consumer>
    );
  }
}

export default Search;
