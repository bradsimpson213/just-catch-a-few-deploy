
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import { login } from '../store/authorizationStore'
import { loadPokemon } from '../store/pokemonStore'
import styles from './Home.module.css';

const ValidationErrors = ({ errors }) => {
    if (errors === null || errors.length === 0) {
        return null};

    return (
        <div>
            <p>Please correct the following errors:</p>
            <ul>
                {errors.map(error => <li key={error}>{error}</li>)}
            </ul>
        </div>
    );
};

const Home = (props) => {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState([]);

    useEffect( () => {
      // console.log('hopefully loading pokemon...')
      props.loadPokemon()}, []);
    
    const changeUser = (e) => {
        setUserName(e.target.value);
    };

    const changePassword = (e) => {
        setPassword(e.target.value);
    };

    const onSubmit = (e) => {
      e.preventDefault();

      const errorsToSet = [];

      if (!userName) errorsToSet.push('Please provide a username.');
      if (!password) errorsToSet.push('Please provide a password.');
      
      if (errorsToSet.length > 0) {
        setErrors(errorsToSet);
        return;
      }
      
      props.login(userName, password);
      props.updateUsername(userName);
    };

    return (
      <div className={styles.homepage}>
        <div className={styles.navHolder}></div>
        <div className={styles.logowrapper}>
          <img
            src="https://fontmeme.com/permalink/200609/8ce6cb32a1aa9687a0eec06ed9e5d906.png"
            alt="pokemon-font"
          />
        </div>
        <div className={styles.imagewrapper}>
          <img
            className={styles.text1}
            src="https://fontmeme.com/permalink/200609/6fa4a35dd9ec595a7d69635857bf8bb5.png"
            alt="pokemon-font"
          />
          <img
            className={styles.pokeball}
            src="https://pngimg.com/uploads/pokeball/pokeball_PNG21.png"
            alt="pokeball"
          />
          <img
            className={styles.text2}
            src="https://fontmeme.com/permalink/200609/b5a0c7c17fab56eeaae061832ed7850f.png"
            alt="pokemon-font"
          />
        </div>
        <div className={styles.loginbox}>
          <ValidationErrors errors={errors} />
          <form onSubmit={onSubmit}>
            <div>
              <label>User Login:</label>
              <input type="text" value={userName}
                onChange={changeUser} placeholder="User name..."/>
            </div>
            <div>
              <label>Password:</label>
              <input type="password" value={password}
                onChange={changePassword} placeholder="Password..."/>
            </div>
            <button className={styles.loginButton}>Login</button>
          </form>
          <button>Create Account</button>
        </div>
        <div className={styles.footerHolder}></div>
      </div>
    );
}

const mapStateToProps = (state) => {
  return { token: state.token };
};

const mapDispatchToProps = (dispatch) => {
  return {
    login: (userName, password) => dispatch(login(userName, password)),
    loadPokemon: () => dispatch(loadPokemon()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);