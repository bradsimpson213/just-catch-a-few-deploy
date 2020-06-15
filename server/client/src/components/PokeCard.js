import React from "react";
import { connect } from "react-redux";
import styles from "./PokeCard.module.css";
import { Draggable } from 'react-beautiful-dnd'


class PokeCard extends React.Component {
  constructor(props){
    super(props)
  };   

  render() {
    const parsedIndex = parseInt(this.props.card.id.slice(5));
    const pokeCard = this.props.pokemon[parsedIndex].pokemon;
    const damage1 = Math.floor(pokeCard.hp/ 3)
    const damage2 = Math.floor(pokeCard.hp / 2);
    return (
      <Draggable draggableId={this.props.card.id} index={this.props.index}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            className={`${styles.cardBody} ${styles[pokeCard.type]}`}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <header className={styles.pokeHeader}>
              <span className={styles.pokeName}>{pokeCard.name}</span>
              <span className={styles.pokeHp}>{pokeCard.hp}</span>
            </header>
            <div className={styles.imageWrapper}>
              <img
                className={styles.pokeImage}
                src={pokeCard.imageUrl}
                draggable="false"
                alt="pokemon-card"
              />
            </div>
            <div className={styles.pokeType}>{`${pokeCard.type} Type`}</div>
            <div className={styles.pokeMoves}>
              <div className={styles.moveHolder}>
                <span className={styles.moveName}>{pokeCard.move1}</span>
                <span className={styles.moveDamage}>{damage1}</span>
              </div>
              <div className={styles.moveHolder}>
                <span className={styles.moveName}>{pokeCard.move2}</span>
                <span className={styles.moveDamage}>{damage2}</span>
              </div>
            </div>
          </div>
        )}
      </Draggable>
    );
  };
};

const mapStateToProps = (state) => {
  return { pokemon: state.pokeReducer };
};

export default connect(mapStateToProps)(PokeCard);