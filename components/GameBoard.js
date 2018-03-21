/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react'
import {
  TouchableWithoutFeedback,
  View
} from 'react-native'

import Circle from './Circle'
import Cross from './Cross'
import {
  CENTER_POINTS,
  AREAS,
  CONDITIONS,
  GAME_RESULT_NO,
  GAME_RESULT_USER,
  GAME_RESULT_AI,
  GAME_RESULT_TIE
} from '../constants/game'
import styles from './styles/gameBoard'
import PromptArea from './PromptArea'

export default class GameBoard extends Component {
  state: {
    AIInputs: number[],
    userInputs: number[],
    result: number,
    round: number,
    board: [],
    huPlayer: string,
    aiPlayer: string,
    iter: number,
    roundAI: number
  };

  constructor() {
    super()
    this.minimax = this.minimax.bind(this);
    this.state = {
      AIInputs: [],
      userInputs: [],
      result: GAME_RESULT_NO,
      round: 0,
      board: [0, 1, 2, 3, 4, 5, 6, 7, 8],
      huPlayer: "P",
      aiPlayer: "C",
      iter: 0,
      roundAI: 0
    }

  }

  restart() {
    const { round } = this.state
    this.setState({
      userInputs: [],
      AIInputs: [],
      result: GAME_RESULT_NO,
      round: round + 1,
      board: [0, 1, 2, 3, 4, 5, 6, 7, 8],
      huPlayer: "P",
      aiPlayer: "C",
      iter: 0,
      roundAI: 0
    })
    setTimeout(() => {
      if (round % 2 === 0) {
        this.AIAction('first')
      }
    }, 5)
  }

  boardClickHandler(e: Object) {
    const { locationX, locationY } = e.nativeEvent
    const { userInputs, AIInputs, result } = this.state
    if (result !== -1) {
      return
    }
    const inputs = userInputs.concat(AIInputs)

    const area = AREAS.find(d =>
      (locationX >= d.startX && locationX <= d.endX) &&
      (locationY >= d.startY && locationY <= d.endY))

    if (area && inputs.every(d => d !== area.id)) {
      this.state.board[area.id] = "P";
      this.setState({ userInputs: userInputs.concat(area.id) })
      setTimeout(() => {
        this.judgeWinner()
        this.AIAction()
      }, 5)
    }
  }

  AIAction(isFirst) {
    this.state.roundAI++;
    const { userInputs, AIInputs, result } = this.state
    if (result !== -1) {
      return
    }
    this.state.roundAI++;
    while (true) {
      const inputs = userInputs.concat(AIInputs)
      var indexValue = isFirst? Math.round(Math.random() * 8.3): this.minimax(this.state.board, this.state.aiPlayer).index;
      this.state.board[indexValue] = "C";
      if (inputs.every(d => d !== indexValue)) {
        this.setState({ AIInputs: AIInputs.concat(indexValue) })
        this.judgeWinner()
        break
      }
    }
  }

  componentDidMount() {
    this.restart()
  }

  isWinner(inputs: number[]) {
    return CONDITIONS.some(d => d.every(item => inputs.indexOf(item) !== -1))
  }

  judgeWinner() {
    const { userInputs, AIInputs, result } = this.state
    const inputs = userInputs.concat(AIInputs)

    if (inputs.length >= 5) {
      let res = this.isWinner(userInputs)
      if (res && result !== GAME_RESULT_USER) {
        return this.setState({ result: GAME_RESULT_USER })
      }
      res = this.isWinner(AIInputs)
      if (res && result !== GAME_RESULT_AI) {
        return this.setState({ result: GAME_RESULT_AI })
      }
    }

    if (inputs.length === 9 &&
      result === GAME_RESULT_NO && result !== GAME_RESULT_TIE) {
      this.setState({ result: GAME_RESULT_TIE })
    }
  }

  reset() {
    this.state.roundAI = 0;
    this.state.board = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    this.restart();
  }

  minimax(reboard, player) {
    this.state.iter++;
    let array = this.avail(reboard);
    if (this.winning(reboard, this.state.huPlayer)) {
      return {
        score: -10
      };
    } else if (this.winning(reboard, this.state.aiPlayer)) {
      return {
        score: 10
      };
    } else if (array.length === 0) {
      return {
        score: 0
      };
    }

    var moves = [];
    for (var i = 0; i < array.length; i++) {
      var move = {};
      move.index = reboard[array[i]];
      reboard[array[i]] = player;
      if (player == this.state.aiPlayer) {
        var g = this.minimax(reboard, this.state.huPlayer);
        move.score = g.score;
      } else {
        var g = this.minimax(reboard, this.state.aiPlayer);
        move.score = g.score;
      }
      reboard[array[i]] = move.index;
      moves.push(move);
    }

    var bestMove;
    if (player === this.state.aiPlayer) {
      var bestScore = -10000;
      for (var i = 0; i < moves.length; i++) {
        if (moves[i].score > bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    } else {
      var bestScore = 10000;
      for (var i = 0; i < moves.length; i++) {
        if (moves[i].score < bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    }
    return moves[bestMove];
  }

  //available spots
  avail(reboard) {
    return reboard.filter(s => s != "P" && s != "C");
  }

  // winning combinations
  winning(board, player) {
    if (
      (board[0] == player && board[1] == player && board[2] == player) ||
      (board[3] == player && board[4] == player && board[5] == player) ||
      (board[6] == player && board[7] == player && board[8] == player) ||
      (board[0] == player && board[3] == player && board[6] == player) ||
      (board[1] == player && board[4] == player && board[7] == player) ||
      (board[2] == player && board[5] == player && board[8] == player) ||
      (board[0] == player && board[4] == player && board[8] == player) ||
      (board[2] == player && board[4] == player && board[6] == player)
    ) {
      return true;
    } else {
      return false;
    }
  }

  render() {
    const { userInputs, AIInputs, result } = this.state
    return (
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={e => this.boardClickHandler(e)}>
          <View style={styles.board}>
            <View
              style={styles.line}
            />
            <View
              style={[styles.line, {
                width: 3,
                height: 306,
                transform: [
                  { translateX: 200 }
                ]
              }]}
            />
            <View
              style={[styles.line, {
                width: 306,
                height: 3,
                transform: [
                  { translateY: 100 }
                ]
              }]}
            />
            <View
              style={[styles.line, {
                width: 306,
                height: 3,
                transform: [
                  { translateY: 200 }
                ]
              }]}
            />
            {
              userInputs.map((d, i) => (
                <Circle
                  key={i}
                  xTranslate={CENTER_POINTS[d].x}
                  yTranslate={CENTER_POINTS[d].y}
                  color='deepskyblue'
                />
              ))
            }
            {
              AIInputs.map((d, i) => (
                <Cross
                  key={i}
                  xTranslate={CENTER_POINTS[d].x}
                  yTranslate={CENTER_POINTS[d].y}
                />
              ))
            }
          </View>
        </TouchableWithoutFeedback>
        <PromptArea result={result} onRestart={() => this.restart()} />
      </View>
    )
  }
}
