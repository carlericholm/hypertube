import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Player, BigPlayButton, ReplayControl, ControlBar,
} from 'video-react';

import './index.css';
import '../../../node_modules/video-react/dist/video-react.css';
import Header from '../../components/header';
import playButton from '../../img/playButton.png';
import personIcon from '../../img/personIcon.png';
import InputTextArea from '../../components/forms/InputTextArea';

const HYPERTUBE_ROUTE = 'localhost:3001';

// function getMovie(id) {
//   return fetch(`https://yts.am/api/v2/movie_details.json?movie_id=${id}&with_cast=true`, {
//     method: 'GET',
//   })
//     .then(res => res.json());
// }

function getRelatedMovies(id) {
  return fetch(`https://yts.am/api/v2/movie_suggestions.json?movie_id=${id}`, {
    method: 'GET',
  })
    .then(res => res.json());
}

// function putComment(user) {
//   return fetch(`http://${HYPERTUBE_ROUTE}/comment`, {
//     method: 'POST',
//     headers: {
//       Accept: 'application/json',
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//       userId: user.id,
//       pseudo: user.login,
//     }),
//   });
// }

function getStream(id) {
  return fetch(`http://${HYPERTUBE_ROUTE}/stream`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id }),
  })
    .then(res => res.json());
  // .then(response => response.json());
  // .then(() => {console.log("telechargement")})
}


class MovieStream extends Component {
  constructor(props) {
    super(props);
    this.state = {
      movie: undefined,
      related: undefined,
      trailer: '',
    };
    // const { user } = this.props;
  }

  componentDidMount() {
    const { match } = this.props;
    // getMovie(this.props.match.params.value)
    //   .then(movie => this.setState({ movie }))
    //   .then(() => {getStream(this.state.movie.data)})

    getStream(match.params.value)
      // .then(response => {console.log(response)})
      .then(movie => this.setState({ movie: movie.movie }));
    // .then(() => console.log(this.state.movie.data.movie))
    // .then(() => this.setState({ trailer: 'https://www.youtube.com/embed/' + this.state.movie.data.movie.yt_trailer_code }));
    getRelatedMovies(match.params.value)
      .then(related => this.setState({ related }));
    // .then(() => console.log(this.state.related.data.movies))
  }

  render() {
    // eslint-disable-next-line
    const video = this.state.movie ? require(`../../tmp/${this.state.movie.data.movie.title_long}/The Shawshank Redemption 1994.720p.BRRip.x264.YIFY.mp4`) : undefined;
    const { movie, trailer, related } = this.state;
    // const { user } = this.props;
    return (
      <div>
        <Header />
        <div id="main_div">
          <div id="player_stream">
            {/* {video */}
              && (
            <Player
              playsInline
              poster={movie && movie.data.movie.large_cover_image}
              src={video}
              fluid={false}
              width="100%"
              height={600}
            >
              <BigPlayButton position="center" />
              <ControlBar>
                <ReplayControl seconds={5} order={2.1} />
                <ReplayControl seconds={10} order={2.2} />
                <ReplayControl seconds={30} order={2.3} />
              </ControlBar>
            </Player>
          )
          </div>
          <div id="movie_infos">
            <div className="mini_info">
              <img
                src={movie && movie.data.movie.medium_cover_image}
                alt={movie && movie.data.movie.title}
              />
            </div>
            <div className="infos">
              <div id="infos_title">{movie && movie.data.movie.title_english}</div>
              <div id="rty_infos">
                Rating:
                {movie && movie.data.movie.rating}
                /10
                Time:
                {movie && movie.data.movie.runtime}
                min
                Year:
                {movie && movie.data.movie.year}
              </div>
              <div id="synopsys_title">
                Synopsys
                {movie && movie.data.movie.title_english}
              </div>
              <div id="synopsys">
                {movie && movie.data.movie.description_full}
              </div>
            </div>
          </div>
          <div id="more_infos">
            <div id="genre">
              <span id="span_genre">Genre: </span>
              {movie && movie.data.movie.genres.map(genre => (
                <span key={genre}>
                  {genre}
                </span>
              ))
              }
            </div>
            <div id="cast_div">
              Cast:
              <br />
              {movie && movie.data.movie.cast > 0 && movie.data.movie.cast.map(genre => (
                <span className="cast_name" key={genre}>
                  <img src={personIcon} className="person_icon" alt="person_icon" />
                  {genre.name}
                  <br />
                </span>
              ))}
            </div>
            <div id="trailer_button">
              <a href={trailer} target="_blank" rel="noopener noreferrer">
                <button type="button">
                  <img src={playButton} id="play_button" alt="play_button" />
                  REGARDER LA BANDE ANNONCE
                </button>
              </a>
            </div>
            <div>
              <iframe
                width="560"
                height="315"
                src={trailer}
                frameBorder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="auto"
              />
            </div>
            <p id="title_suggestions">Films associés</p>
            <div className="suggestions_div">
              {related && related.data.movies.map(suggestion => (
                <Link key={suggestion.id} to={`/movie/${suggestion.id}`}>
                  <div
                    className="suggestion_movie"
                  >
                    <img
                      src={suggestion.medium_cover_image}
                      alt={suggestion.title}
                    />
                    <p className="title_movie_suggested">{suggestion.title}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <div id="form_div">
            <p id="title_comment">Leave a comment</p>
            <InputTextArea name="comment" label="comment" id="comment" />
            {/* <button onClick={putComment(user)} id="comment_button" type="button">
              {console.log(user)}
              LEAVE A COMMENT
            </button> */}
          </div>
        </div>
      </div>
    );
  }
}

MovieStream.propTypes = {
  match: PropTypes.object.isRequired,
};

const mapStateToProps = state => state;
const mapDispatchToProps = dispatch => ({ dispatch });

const MovieConnected = connect(mapStateToProps, mapDispatchToProps)(MovieStream);

const exportedComponent = (props) => {
  const { match: { params: { value } } } = props;
  return (<MovieConnected key={value} {...props} />);
};

export default exportedComponent;
