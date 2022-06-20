import React from 'react';
import ReactDOM from 'react-dom';
import { nativeTouchData } from 'react-dom/cjs/react-dom-test-utils.production.min';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      choosePiece: true,
      chosenPiece: -1
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares))
      return;
    if (this.state.stepNumber < 6) {
      if (squares[i]) {
        return;
      }
      squares[i] = this.state.xIsNext ? "X" : "O";
      this.setState({
        history: history.concat([
          {
            squares: squares
          }
        ]),
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext
      });
    }
    else {
      if (this.state.choosePiece) {
        if ((this.state.xIsNext && squares[i] === "O") || (!this.state.xIsNext && squares[i] === "X")) {
          squares[i] = "*";
          this.setState({
            history: history.concat([
              {
                squares: squares
              }
            ]),
            stepNumber: history.length,
            xIsNext: this.state.xIsNext,
            choosePiece: !this.state.choosePiece,
            chosenPiece: i
          });
        }
      }
      else {
        if (squares[i] != null) { //perhaps allow for reselection instead
          if ((this.state.xIsNext && squares[i] === "O") || (!this.state.xIsNext && squares[i] === "X")) {
            squares[i] = "*";
            squares[this.state.chosenPiece] = this.state.xIsNext ? "O" : "X";
            this.setState({
              history: history.concat([
                {
                  squares: squares
                }
              ]),
              stepNumber: history.length,
              xIsNext: this.state.xIsNext,
              chosenPiece: i
            }); 
            return;
          }
          else
            return;
        }
        if (
          (Math.floor(i/3) - Math.floor(this.state.chosenPiece/3) == 1 || 
           Math.floor(this.state.chosenPiece/3) - Math.floor(i/3) == 1 ||
           Math.floor(i/3) - Math.floor(this.state.chosenPiece/3) == 0) && 
          (i%3 - this.state.chosenPiece%3 == 1 ||
           this.state.chosenPiece%3 - i%3 == 1 ||
           i%3 - this.state.chosenPiece%3 == 0)) {
          if ((this.state.xIsNext && squares[4] == "O") || (!this.state.xIsNext && squares[4] == "X")) {
            if (this.state.chosenPiece != 4) {
              squares[i] = this.state.xIsNext ? "O" : "X";
              squares[this.state.chosenPiece] = null;
              if (!calculateWinner(squares)) {
                return;
              }
            }
          }
          else {
            squares[i] = this.state.xIsNext ? "O" : "X";
            squares[this.state.chosenPiece] = null;
          }
          
          this.setState({
            history: history.concat([
              {
                squares: squares
              }
            ]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
            choosePiece: !this.state.choosePiece,
            chosenPiece: -1
          });
        }
      }
    }
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
