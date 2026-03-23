import React from 'react';
import { Link } from 'react-router-dom';
import './Style.css';

const Track = (props) => {
  const { track } = props;
  return (
    <div className='col-md-6'>
      <div className='card mb-4 shadow-sm'>
        <div className='card-body'>
          <h5> {track.artist_name} </h5>
          <p className='card-text'>
            <i className='material-icons'>play_circle_filled</i> <strong> Track : </strong>
            {track.track_name}
          </p>
          <p className='card-text'>
            <i className='material-icons'>album</i> <strong> Album : </strong>
            {track.album_name}
          </p>
          <Link to={`/lyrics/track/${track.track_id}`} className='btn btn-dark btn-block'>
            <i className='material-icons'>arrow_forward_ios</i>
            <span>View Lyrics</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Track;
