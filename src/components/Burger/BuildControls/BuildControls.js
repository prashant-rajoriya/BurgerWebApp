import React from 'react';

import classes from './BuildControls.css';
import BuiltControl from './BuildControl//BuildControl'

const controls = [
  { label: 'Salad', type: 'salad'},
  { label: 'Bacon', type: 'bacon'},
  { label: 'Cheese', type: 'cheese'},
  { label: 'Meat', type: 'meat'},
]

const BuildControls = (props) => {
    return (
      <div className={classes.BuildControls}>
        <p>Current Price : <strong>{props.price.toFixed(2)}</strong></p>
        {controls.map(ctrl => (
          <BuiltControl
              added={() => props.ingredientAdded(ctrl.type)}
              removed={() => props.ingredientRemoved(ctrl.type)} 
              key={ctrl.label} 
              label={ctrl.label} 
              disable={props.disable[ctrl.type]}    
          />
        ))}
        <button 
            className={classes.OrderButton}
            disabled={!props.purchasable}
            onClick={props.ordered}
          >ORDER NOW</button>
      </div>
    )
  }

export default BuildControls;
