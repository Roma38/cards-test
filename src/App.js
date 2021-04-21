import { useReducer } from 'react';
import './App.css';
import { Card, Input } from 'semantic-ui-react';

import { INITIAL_DATA } from './constants';

function reducer(cards, action) {
  let newCards;
  switch (action.type) {
    case 'rename':
      newCards = [...cards];
      newCards[action.index].name = action.newName;
      return newCards;
    case 'moveUp':
      newCards = [...cards];
      newCards.splice(action.index, 1);
      newCards.unshift(cards[action.index]);
      return newCards;
    case 'moveDown':
      newCards = [...cards];
      newCards.splice(action.index, 1);
      newCards.push(cards[action.index]);
      return newCards;
    case 'delete':
      newCards = [...cards];
      newCards.splice(action.index, 1);
      return newCards;
    default:
      throw new Error();
  }
}

function App() {
  const [cards, dispatch] = useReducer(reducer, INITIAL_DATA);
  let moveUpTimeout;

  const clickHandler = index => {
    clearTimeout(moveUpTimeout);
    moveUpTimeout = setTimeout(() => {
      dispatch({ type: 'moveUp', index });
    }, 300);
  }

  const doubleClickHandler = index => {
    clearTimeout(moveUpTimeout);
    dispatch({ type: 'moveDown', index });
  }

  const rightClickHandler = (e, index) => {
    e.preventDefault();
    dispatch({ type: 'delete', index });
  }

  return (
    <div className="App">
      {cards.map(({ name, id }, index) => <Card
        key={id}
        onClick={() => clickHandler(index)}
        onDoubleClick={() => doubleClickHandler(index)}
        onContextMenu={e => rightClickHandler(e, index)}
        header={name}
        extra={<Input value={name}
          onClick={e => e.stopPropagation()}
          onChange={e => dispatch({ type: 'rename', newName: e.target.value, index })}
        />}
      />)}
    </div>
  );
}

export default App;
