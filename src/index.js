import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
var classNames = require( 'classnames' );

function Square(props) {
	var winnerSquare = false;
	if(props.winner && (props.winner[1] === props.val || props.winner[2] === props.val || props.winner[3] === props.val)){
		winnerSquare = true;
	}
	var className = classNames({
		'square' : true,
		'winSquare': winnerSquare});
  return (
    <button className={className} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
		key={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
		winner = {this.props.winnerFromGame}
		val={i}
      />
    );
  }
	
  render() {
	  var boardRow = [];
	  var board = [];
	  for (var i = 0; i < 3; i++){
		  for (var j = 0; j < 3; j++){
			  boardRow.push(this.renderSquare(j + i * 3));
		  };
		  board.push(<div className="board-row" key={i}>{boardRow}</div>);
		  boardRow = [];
	  }
	  
    return (
      <div>
			{board}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null)
      }],
		stepNumber: 0,
		xIsNext: true,
		squarePosition: null,
		arrayOfSquarePositions: Array(9),
		active: null,
		buttonReverse: false
    };
  }

  handleClick(i) {
	const arrayOfSquarePositions = this.state.arrayOfSquarePositions;
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
		return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares
      }]),
		stepNumber: history.length,
		xIsNext: !this.state.xIsNext,
		active: null
    });
	  this.squarePosition = calculatePosition(i);
	  arrayOfSquarePositions[history.length] = this.squarePosition;
  }
	
	jumpTo(step) {
		this.setState({
			stepNumber: step,
			xIsNext: (step % 2) ===	0,
			active: step
		});
	}
	changeButtonReverse(){
		this.setState(prevState => ({
      buttonReverse: !prevState.buttonReverse
    }));
	}

  render() {
	let classToBold = classNames('selected');
	const arrayOfSquarePositions = this.state.arrayOfSquarePositions;
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const moves = history.map((step, move) => {
    const desc = move ?
        'Go to move #' + move + ' (' + arrayOfSquarePositions[move] + ')':
        'Go to game start';
      return (
        <li key={move}>
          <button  key={move} active= {this.state.active} className={ this.state.active === move ? classToBold : null} onClick={() => this.jumpTo(move) }>{desc}</button>
        </li>
      );
    });
	  
  if(this.state.buttonReverse){
	  moves.reverse();
  }

    let status;
	  
    if (winner) {
      status = 'Winner: ' + winner[0];
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
	  if (this.state.stepNumber === 9 && !winner){
		  status = 'Draw!';
	  }
	  
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
			winnerFromGame = {winner}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
		  <button onClick={() => this.changeButtonReverse()}> Reverse moves </button>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
		let winLine = [squares[a], a, b, c];
      	return winLine;
    }
  }
  return null;
}

function calculatePosition(i) {
	switch (i) {
		case 0:
			return '1, 1';
		case 1:
			return '2, 1';
		case 2:
			return '3, 1';
		case 3:
			return '1, 2';
		case 4:
			return '2, 2';
		case 5:
			return '3, 2';
		case 6:
			return '1, 3';
		case 7:
			return '2, 3';
		case 8:
			return '3, 3';
		default:
			return null;
	}
}
