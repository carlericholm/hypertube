import React, { Component } from 'react';
import { connect } from 'react-redux';
import Movie from '../movie';
import './index.css';
import Header from '../../components/header';

function getMovies() {
  return fetch('https://yts.am/api/v2/list_movies.json?sort_by=rating&limit=30', {
    method: 'GET',
  })
    // .then(() => console.log('hey'))
    .then(res => res.json())
    .then(res => res.data.movies)
    // .then(res => console.log(res));
}

class Stream extends Component {
  constructor(props) {
    super(props);
    this.state = {
      movies: [],
    };
  }

  componentDidMount() {
    getMovies()
      .then(movies => this.setState({ movies }));
    // .then(() => console.log(this.state.movies.data))
  }

  render() {
    const { movies } = this.state;
    return (
      <div>
        <Header />
        <div id="mini_container">
          {movies && console.log(movies)}
          {movies && movies.map(movie => (
            <Movie key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => state;
const mapDispatchToProps = dispatch => ({ dispatch });

export default connect(mapStateToProps, mapDispatchToProps)(Stream);
