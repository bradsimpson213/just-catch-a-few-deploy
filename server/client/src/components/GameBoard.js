import React from 'react';
import styles from './GameBoard.module.css';
import ChatWindow from './ChatWindow';
import CardHolder from './CardHolder';
import ActiveHolder from './ActiveHolder';

import { DragDropContext } from 'react-beautiful-dnd';

import initialData from './initialData';

import myavatar_1 from './avatars/myavatar_1.png'

class GameBoard extends React.Component {
  constructor(props) {
    super(props);
    this.state = initialData;
  }

  onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
  
    if(!destination) {return};

    if ( destination.droppableId === source.droppableId &&
          destination.index === source.index
    ) return;
      
    const cardHolderStart = this.state.cardHolders[source.droppableId];
    const cardHolderFinish = this.state.cardHolders[destination.droppableId];

    if ( cardHolderStart === cardHolderFinish) {
      const newCardIds = Array.from(cardHolderStart.cardIds);
      newCardIds.splice(source.index, 1);
      newCardIds.splice(destination.index, 0, draggableId);

      const newCardHolder = {
        ...cardHolderStart,
        cardIds: newCardIds,
      };

      const newState = {
         ...this.state,
          cardHolders: {
          ...this.state.cardHolders,
          [newCardHolder.id]: newCardHolder,
          },
      };
      this.setState(newState);
      return;
      };

      // MOVING FROM ONE HOLDER TO ANOTHGER
      const startCardIds = Array.from(cardHolderStart.cardIds);
      startCardIds.splice(source.index, 1);
      const startCardHolder = {
        ...cardHolderStart,
        cardIds: startCardIds,
      };

      const finishCardIds = Array.from(cardHolderFinish.cardIds);
      finishCardIds.splice(destination.index, 0, draggableId);
      const finishCardHolder = {
        ...cardHolderFinish,
        cardIds: finishCardIds
      }

      const newState = {
         ...this.state,
          cardHolders: {
          ...this.state.cardHolders,
          [startCardHolder.id]: startCardHolder,
          [finishCardHolder.id]: finishCardHolder,
          },
      };
      this.setState(newState);
   };



  render() {
    const userInfo= JSON.parse(window.localStorage.getItem('USER_INFO'));  
    console.log(userInfo);   
    const holder1 = this.state.cardHolders["holder-1"];
    const cards1 = holder1.cardIds.map((cardId) => this.state.cards[cardId]);
    const holder2 = this.state.cardHolders["holder-2"];
    const cards2 = holder2.cardIds.map((cardId) => this.state.cards[cardId]);
             
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <main className={styles.gameBoard}>
          <nav className={styles.navbar}>
            <button className={styles.newGameButton}>New Game</button>
            <button className={styles.quitButton}>Quit Game</button>
            <img
              className={styles.navLogo}
              src="https://fontmeme.com/permalink/200609/4653f7098e77b540fb3515a454473098.png"
              alt="game-logo"
            />
            <button
              className={styles.infoButton}
            >
              Game Instructions
            </button>
            <div className={styles.chatBox}></div>
          </nav>
          <div className={styles.activeCards}>
            <div className={styles.playerActive}>
              <div className={styles.playerInfo}>
                <div>{userInfo.userName}</div>
                <img
                  className={styles.avatar}
                  src={myavatar_1}
                />
                {/* <img
                  className={styles.avatar}
                  src="/static/media/myavatar_2.5d43da1b.png"
                /> */}

                {/* <div className={styles.avatar1}></div> */}
                <div>
                  <span> Wins: {userInfo.wins}</span>
                  <span> Losses: {userInfo.losses}</span>
                </div>
              </div>
              <ActiveHolder key={holder2.id} holder={holder2} cards={cards2} />
            </div>
            <div className={styles.opponentActive}>
              <div className={styles.opponentInfo}></div>
              <div className={styles.opponentActive__drop}></div>
            </div>
          </div>
          <div className={styles.playerHand}>
            <CardHolder key={holder1.id} holder={holder1} cards={cards1} />
            <ChatWindow
              messages={this.props.messages}
              handleSendMessage={this.props.handleSendMessage}
              handleLeave={this.props.handleLeave}
            />
          </div>
          <footer></footer>
        </main>
      </DragDropContext>
    );
  }
};

export default GameBoard;