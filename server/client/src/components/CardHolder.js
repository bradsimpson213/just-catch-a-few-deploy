import React from 'react';
import styles from './CardHolder.module.css';
import PokeCard from './PokeCard'
import { Droppable } from 'react-beautiful-dnd';


class CardHolder extends React.Component {
    constructor(props) {
        super(props)
    };

    render() {
        return (
          <div>
            <Droppable
              droppableId={this.props.holder.id}
              direction="horizontal"
            >
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  className={styles.cardHolder}
                  {...provided.droppableProps}
                >
                  {this.props.cards.map((card, index) => (
                    <PokeCard key={card.id} card={card} index={index} />
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        );
    };
}
export default CardHolder;