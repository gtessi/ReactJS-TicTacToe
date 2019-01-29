import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Square extends React.Component {
  render() {
    let color = this.props.isWinner ? ' blue' : '';
    return (
      <button className={'square' + color} onClick={this.props.onClick}>
        {this.props.value}
      </button>
    );
  }
}

class Board extends React.Component {
  renderSquare(i) {
    const winnerLine = this.props.winnerLine;
    return(
      <Square key={i} value={this.props.squares[i]} isWinner={winnerLine && winnerLine.includes(i)} onClick={() => this.props.onClick(i)}/>
    );
  }

  render() {
    let board = [];

    let row;
    for (let i = 0; i < 3; i++) {
      row = [];
      for (let j = 0; j < 3; j++) {
        row.push(this.renderSquare((i * 3) + j));
      }

      board.push(<div key={'row_' + i} className="board-row">{row}</div>);
    }

    return (
      <div>{board}</div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        pos: null
      }],
      stepNumber: 0,
      xIsNext: true,
      ascOrder: true
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares).winner || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';
    const pos = [(i % 3) + 1, Math.floor(i / 3) + 1];
    this.setState({
      history: history.concat([{
        squares: squares,
        pos: pos
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  toggleOrder() {
    this.setState({
      ascOrder: !this.state.ascOrder
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winnerInfo = calculateWinner(current.squares);
    const winner = winnerInfo.winner;
    const ascOrder = this.state.ascOrder;

    let moves = history.map((step, move) => {
      const desc = move ? 'Go to move #' + move : 'Go to game start';
      return (
        <li key={move} style={this.state.stepNumber === move ? {fontWeight: 'bold'} : {}}>
          ({move ? (step.pos[0] + ', ' + step.pos[1]) : ' , '}) - <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else if (winnerInfo.draw) {
      status = 'Draw';
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    if (!ascOrder) {
      moves.reverse();
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current.squares} winnerLine={winnerInfo.line} onClick={(i) => this.handleClick(i)} />
        </div>
        <div className="game-info">
          <button onClick={() => this.toggleOrder()}>Toggle order {!ascOrder ? 'asc' : 'desc'}</button>
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

  for(let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];

    if (squares[a] && squares[a] === squares[b] && squares[b] === squares[c]) {
      return {
        winner: squares[a],
        line: lines[i],
        draw: false
      };
    }
  }
  
  let isDraw = squares.every(x => x);

  return {
    winner: null,
    line: null,
    draw: isDraw
  };
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
