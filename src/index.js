import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

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
        key={i}
        onClick={() => this.props.onClick(i)}
      />
    );
  }
  render() {
    const board = [];
    let totalCells = 0;
    for (let i = 0; i < 3; i++) {
      const columns = [];
      for (let j = 0; j < 3; j++) {
        columns.push(this.renderSquare(totalCells++));
      }
      board.push(
        <div key={i} className="board-row">
          {columns}
        </div>
      );
    }
    return board;
  }
}

// board w/ placeholder values
class Game extends React.Component {
  state = {
    history: [
      {
        squares: Array(9).fill(null)
      }
    ],
    stepNumber: 0,
    xIsNext: true
  };

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      // put new history entires on history; doesnt mutate original array, unliek push
      history: history.concat([
        {
          squares: squares
        }
      ]),
      // dont get stuck showing same move after new one has been made
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0
    });
  }

  render() {
    const history = this.state.history;
    // // awlways render last move
    // const current = history[history.length - 1];
    // rendres the currently selected move
    const current = history[this.state.stepNumber];
    const moves = history.map((step, move) => {
      const description = move ? `Go to Move # ${move}` : "Go to Start";
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{description}</button>
        </li>
      );
    });
    const winner = calculateWinner(current.squares);
    let status;
    if (winner) {
      status = `The winner is ${winner}`;
    } else if (history.length === 10) {
      status = `Lame game. It's a draw.`;
    } else {
      status = `Next Player: ${this.state.xIsNext ? "X" : "O"}`;
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            key={current.squares.id}
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

ReactDOM.render(<Game />, document.getElementById("root"));
