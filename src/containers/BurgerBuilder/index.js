import React, { Component } from 'react'
import Burger from '../../components/Burger'
import Aux from '../../hoc/Aux/Aux';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

const INGREDIENT_PRICE = {
  salad: 0.5,
  cheese: 0.4,
  meat: 1.3,
  bacon: 0.7,
}

class BurgerBuilder extends Component {

  state = {
    ingredients: null,
    totalPrice: 4,
    purchasable: false,
    purchasing: false,
    loading: false,
  }

  uppdatePurchaseState(ingredients) {

    const sum = Object.keys(ingredients)
        .map(igKey => {
          return ingredients[igKey];
        })
        .reduce((sum,el) => {
          return sum + el;
        }, 0);

    this.setState({purchasable: sum > 0});
  }

  addIngredientHandler = (type) => {
    const oldCount = this.state.ingredients[type];
    const updateCount = oldCount + 1 ;
    const updateIngredients = {
      ...this.state.ingredients
    };
    updateIngredients[type] = updateCount;
    const priceAddition = INGREDIENT_PRICE[type];
    const oldPrice = this.state.totalPrice;
    const newPrice = oldPrice + priceAddition;
    this.setState({
      totalPrice: newPrice,
      ingredients: updateIngredients
    });
    this.uppdatePurchaseState(updateIngredients)
  }

  removeIngredientHandler = (type) => {
    const oldCount = this.state.ingredients[type];
    if(oldCount <= 0){
      return;
    }
    const updateCount = oldCount - 1 ;
    const updateIngredients = {
      ...this.state.ingredients
    };
    updateIngredients[type] = updateCount;
    const priceDeduction = INGREDIENT_PRICE[type];
    const oldPrice = this.state.totalPrice;
    const newPrice = oldPrice - priceDeduction;
    this.setState({
      totalPrice: newPrice,
      ingredients: updateIngredients
    });
    this.uppdatePurchaseState(updateIngredients)
  }

  componentDidMount() {

    axios.get('https://burgerapp-7c54e.firebaseio.com/ingredients.json')
      .then(resp => this.setState({ingredients: resp.data}) )
  
  }

  purchaseHandler = () => {
    this.setState({purchasing: true});
  }

  purchaseCancelHandler = () => {
    this.setState({purchasing: false});
  }

  purchaseContinueHandler = () => {
    //alert('You Continue');

    this.setState({loading: true});
    const order = {
      ingredients : this.state.ingredients,
      totalPrice: this.state.totalPrice,
      customer: {
        name: 'Prashant Rajoriya',
        address: {
          street: 'tsst',
          zipCode: '462023',
          country: 'India'
        },
        email: 'test@test.com'
      },
      deliveryMethod: 'fastest'
    }

    axios.post('/order.json', order)
      .then(resp => 
          this.setState({loading: false, purchasing: false})
        )
      .catch(() => this.setState({loading: false, purchasing: false}))
  }

  render() {

    const disabledInfo = {
      ...this.state.ingredients
    };

    for(let key in disabledInfo){
      disabledInfo[key] = disabledInfo[key] <= 0;
    }  

    let orderSummary = null;
    let burger = <Spinner />

    if(this.state.ingredients){
      burger = (
        <Aux>
          <Burger ingredients={this.state.ingredients}/>
          <BuildControls
            ingredientAdded={this.addIngredientHandler}
            ingredientRemoved={this.removeIngredientHandler}
            disable={disabledInfo}
            price={this.state.totalPrice}
            ordered={this.purchaseHandler}
            purchasable={this.state.purchasable}
          />
        </Aux>
        );

      orderSummary = (
        <OrderSummary ingredients={this.state.ingredients}
              purchaseContinue={this.purchaseContinueHandler}
              purchaseCancelled={this.purchaseCancelHandler}
              price={this.state.totalPrice}
            />
      );
    }
    
    if(this.state.loading) {
      orderSummary = <Spinner />;
    }
    
    return (
      <Aux>
        <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
            {orderSummary}
        </Modal> 
          {burger}
      </Aux>
    )
  }
}

export default withErrorHandler( BurgerBuilder, axios );