import React from 'react';
import styles from './ActiveHolder.module.css'
import PokeCard from "./PokeCard";
import { Droppable } from "react-beautiful-dnd";

class ActiveHolder extends React.Component {
    constructor(props){
    super(props)
    };

    render() {
       return (
          <div>
            <Droppable
              droppableId={this.props.holder.id} isDropDisabled={this.props.cards.length > 0} >
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  className={styles.activeHolder}
                  {...provided.droppableProps} >
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
};

export default ActiveHolder;