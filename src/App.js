import { useReducer } from 'react';
import './App.css';
import { Card, Input } from 'semantic-ui-react';

import { INITIAL_DATA } from './constants';

function reducer(cards, action) {
  const newCards = [...cards];
  switch (action.type) {
    case 'rename':
      newCards[action.index].name = action.newName;
      return newCards;
    case 'moveUp':
      if (action.index !== 0) {
        [newCards[action.index], newCards[action.index - 1]] = [cards[action.index - 1], cards[action.index]];
      }
      return newCards;
    case 'moveDown':
      if (action.index !== cards.length - 1) {
        [newCards[action.index], newCards[action.index + 1]] = [cards[action.index + 1], cards[action.index]];
      }
      return newCards;
    case 'delete':
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
      {cards.map(({ name, id }, index) =>
        <Card
          key={id}
          onClick={() => clickHandler(index)}
          onDoubleClick={() => doubleClickHandler(index)}
          onContextMenu={e => rightClickHandler(e, index)}
          header={`${name} ID: ${id}`}
          extra={
            <Input value={name}
              onClick={e => e.stopPropagation()}
              onChange={e => dispatch({ type: 'rename', newName: e.target.value, index })}
            />}
        />)}
    </div>
  );
}

export default App;
