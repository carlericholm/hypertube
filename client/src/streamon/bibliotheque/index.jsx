import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// import { Link } from 'react-router-dom';

import './index.css';
import Header from '../../components/header';
// import down_arrow from '../../img/down_arrow.png';
// import profile_icon from '../../img/profile_icon.png';

// const HYPERTUBE_ROUTE = 'localhost:3001';


function getMovies() {
  return fetch('https://yts.am/api/v2/list_movies.json', {
    method: 'GET',
  })
    .then(res => res.json())
   /* .then((movies) => {
      // console.log(movies.data);
      // this.setState({movies: movies})
      // console.log("ici -> " + this.state.movies.data)s
      return movies;
    });*/
}


class Stream extends Component {

  constructor(props) {
    super(props);
    this.state = {
      movies: undefined,
    }
  }


  componentDidMount() {
    getMovies()
      .then(movies => this.setState({ movies }))
      // .then(() => console.log(this.state.movies.data))
  }

  render() {
    const { user, dispatch } = this.props;
    // fetch('https://yts.am/api/v2/list_movies.json', {
    //   method: 'GET',
    // })
    //   .then(res => res.json())s
    //   .then((movies) => {
    //     console.log(movies.data);
    //     // this.setState({movies: movies})
    //     // console.log("ici -> " + this.state.movies.data)
    //     // return ;
    //   })
    return (

      <div>
        <Header />
        {/* <div id="div_name">Bonjour {user.login}</div>
        <div className="main_banner">
          <div id="div_title">
            <h1>Hypertube</h1>
          </div>
          <div id="div_menu">
            <ul>
              <li>ACCUEIL</li>
              <li>FILMS <img alt="arrow" src={down_arrow} className="down_arrow" /><div id="div_movies">test</div></li>
              <li>SERIES <img alt="arrow" src={down_arrow} className="down_arrow" /><div id="div_series">test</div></li>
              <li>MANGAS <img alt="arrow" src={down_arrow} className="down_arrow" /><div id="div_mangas">test</div></li>
            </ul>
          </div>
          <div id="div_search_disconnect">
            <input type="text" name="search" id="search" placeholder="Rechercher Film, Série, ..." />
            <Link to="/profile">
              <img src={profile_icon} id="profile_icon" alt="profile_icon" />
            </Link>
            <button type="button" onClick={() => dispatch({ type: 'DISCONNECT' })}>
              Log out
            </button>
          </div>
        </div> */}
        <div>
          {this.state.movies && console.log(this.state.movies.data)}
        </div>
      </div>
    );
  }
}
Stream.propTypes = {
  token: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = state => state;
const mapDispatchToProps = dispatch => ({ dispatch });

export default connect(mapStateToProps, mapDispatchToProps)(Stream);
