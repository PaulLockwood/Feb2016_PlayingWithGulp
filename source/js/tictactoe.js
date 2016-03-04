// TicTacToe - main logic

(function() {
  "use strict";

  var app = angular.module('ticTacToe', []);

  app.controller('gridController', function() {
    this.lastGameStateEnum = GameStateEnum.ONGOING;

    // Not working:
    //this.gridDataStartingPosition = '0000XO000';
    this.gridDataStartingPosition = 'O000XO000';
    //this.gridDataStartingPosition = '0000O0000';
    //this.gridDataStartingPosition = '0XO0000XO';
    //this.gridDataStartingPosition = '0XO000OXO';
    this.gridData = this.gridDataStartingPosition;

    this.canaryTest = function() {
      return "alive";
    };

    this.buttonPress = function(position) {

      // Has the game ended?
      if (this.lastGameStateEnum != GameStateEnum.ONGOING || this.gridData.charAt(position) !== '0') {
        return;
      }

      this.gridData = setCharAt(this.gridData, position, 'X');

      //console.log(">>>>>" + this.gridData);
      var gameStateEnum = this.getHeuristicValueBoard(this.gridData);

      if (gameStateEnum === GameStateEnum.ONGOING) {
        // Now make the computer's move
        var result = this.determineBestPossibleMoves(this.gridData);
        console.log('Best Options: ' + result.options);

        var option = getRandomIntInclusive(0, result.options.length - 1);
        var computerMove = result.options[option];
        this.gridData = setCharAt(this.gridData, computerMove, 'O');
        gameStateEnum = this.getHeuristicValueBoard(this.gridData);
      }

      this.lastGameStateEnum = gameStateEnum;

      return;
    };

    this.lookForWinner = function(board) {
      var gameStateEnum = GameStateEnum.ONGOING;
      var convertedBoard;
      board = board.replace(/ /g, "0");

      // Has X won?
      {
        convertedBoard = board.replace(/O/g, "0");
        convertedBoard = convertedBoard.replace(/X/g, "1");

        if (this.lookForWinningState(convertedBoard))
          gameStateEnum = GameStateEnum.X_WON;
      }

      // Has O Won?
      if (gameStateEnum === GameStateEnum.ONGOING) {
        convertedBoard = board.replace(/X/g, "0");
        convertedBoard = convertedBoard.replace(/O/g, "1");

        if (this.lookForWinningState(convertedBoard))
          gameStateEnum = GameStateEnum.O_WON;
      }

      return gameStateEnum;
    };

    this.getHeuristicValueBoard = function(board) {
      var gameStateEnum = this.lookForWinner(board);

      // Is the board full
      if (gameStateEnum === GameStateEnum.ONGOING && board.indexOf('0') === -1)
        gameStateEnum = GameStateEnum.DRAW;

      return gameStateEnum;
    };

    this.lookForWinningState = function(board) {
      var winningState = false;
      var boardBase2 = parseInt(board, 2);

      var winningPositions = [
        '000000111',
        '000111000',
        '111000000',
        '100010001', //diag
        '001010100', //diag
        '100100100',
        '010010010',
        '001001001',
      ];

      winningPositions.forEach(function(winningPosition) {
        // If a winning position has not been found yet
        if (!winningState) {
          /// Compare using base2
          var winningPositionBase2 = parseInt(winningPosition, 2);
          var bitwiseAnd = boardBase2 & winningPositionBase2;

          if (bitwiseAnd === winningPositionBase2) {
            winningState = true;
          }
        }

      });

      return winningState;
    };

    this.gameStatus = function() {
      var result = "";

      switch (this.lastGameStateEnum) {
        case GameStateEnum.ONGOING:
          result = "Game is ongoing";
          break;
        case GameStateEnum.DRAW:
          result = "It is a draw";
          break;
        case GameStateEnum.X_WON:
          result = "X has won";
          break;
        case GameStateEnum.O_WON:
          result = "O has won";
          break;
      }

      return result;
    };

    this.freeSpacesOnBoard = function(board) {
      var availableOptions = [];
      for (var i = 0; i < 9; i++) {
        if (board.charAt(i) === "0") {
          availableOptions.push(i);
        }
      }

      return availableOptions;
    };

    this.formattedBoard = function(board) {
      board = board.replace(/0/g, " ");

      board = insert(board, 6, "|\n|");
      board = insert(board, 3, "|\n|");

      board = "\n|" + board + "|\n";

      return board;
    };

    this.humanIsPlaying = 'X';

    this.computerIsPlaying = function() {
      // Computer is play the oppsite of the human
      return this.togglePlayer(this.humanIsPlaying);
    };

    this.togglePlayer = function(player) {
      return player == 'X' ? 'O' : 'X';
    };

    this.determineBestPossibleMoves = function(board) {
      // Obatin the positions left on the board to play
      var availableOptions = this.freeSpacesOnBoard(board);

      this.recursionDepth = -1;
      //xyzzy
      console.log('Available Options: ' + availableOptions);
      //availableOptions = [0,1,2,7,8];
      //availableOptions = [0,1,2,3,7,8];
      var result = this.minMaxValueSuccesors(board, availableOptions, this.computerIsPlaying(), true);
      //var depth = availableOptions.length;
      //var result = this.minMaxValueSuccesors(board, depth, true);

      return result;
    };

    this.getUtilityOfGameState = function(gameStateEnum, maximizingPlayer) {
      // xyzzy Hardcoded for player 'O'
      var utility;
      switch (gameStateEnum) {
        case GameStateEnum.X_WON:
          utility = maximizingPlayer ? -2 : 2;
          break;
        case GameStateEnum.O_WON:
          utility = maximizingPlayer ? 2 : -2;
          break;
        case GameStateEnum.ONGOING:
          utility = 1;
          break;
        default:
          utility = 0;
      }
      return utility;
    };

    /*
    function minimax(node, depth, maximizingPlayer)
        if depth = 0 or node is a terminal node
            return the heuristic value of node
        if maximizingPlayer
            bestValue := -∞
            for each child of node
                val := minimax(child, depth - 1, FALSE)
                bestValue := max(bestValue, val)
            return bestValue
        else
            bestValue := +∞
            for each child of node
                val := minimax(child, depth - 1, TRUE)
                bestValue := min(bestValue, val)
            return bestValue

    (* Initial call for maximizing player *)
    minimax(origin, depth, TRUE)
    */


    /*
        this.minMaxValueSuccesors = function(board, depth, maximizingPlayer) {
          var gameStateEnum = this.getHeuristicValueBoard(board);

          if (depth === 0 || gameStateEnum != GameStateEnum.ONGOING) {
            result = {
              utility: this.getUtilityOfGameState(gameStateEnum, maximizingPlayer),
              bestOptions: [2]
            };


          }

          result = {
            utility: 1,
            bestOptions: [2]
          };

          return result;
        };
    */

    this.recursionDepth = -1;
    // Note we have two output parameters: utility (highest utility of move) and options (array)
    this.minMaxValueSuccesors = function(board, operators, orgPlayer, maxTurn) {
      this.recursionDepth = this.recursionDepth + 1;
      var indent = new Array(this.recursionDepth * 2 + 1).join('-');
      //debugger;
      console.log(indent + 'recursionDepth = ' + this.recursionDepth);
      console.log(indent + 'Start of minMaxValueSuccesors for board = ' + this.formattedBoard(board) +
        ' available ops =  ' + operators +
        ' orgPlayer = ' + orgPlayer);

      var maxUtility = -1; //-1 loss, 0 Draw, 1 win
      var maxOptions = [];
      var minUtility = 1; //-1 loss, 0 Draw, 1 win
      var minOptions = [];

      // Loop through all remaining operators
      //operators.forEach(function(curOperator) {
      _.forEach(operators, function(curOperator) {

        // Determine current player
        var curPlayer = maxTurn ? orgPlayer : this.togglePlayer(orgPlayer);
        console.log(indent + 'Current player is ' + curPlayer +
          ', maxTurn is ' + maxTurn +
          ', orgPlayer is ' + orgPlayer);

        // Enter the move onto the board
        var boardWithCurMove = setCharAt(board, curOperator, curPlayer);

        // Score the board
        var gameStateEnum = this.getHeuristicValueBoard(boardWithCurMove);
        console.log(indent + 'played operator ' + curOperator +
          ' for player ' + curPlayer +
          ' making the board be ' +
          this.formattedBoard(boardWithCurMove) + ' with GameState is ' + gameStateEnum);

        var overallUtiltyAfterRecursion;
        var outcomeOfThisMove;

        // If not a Terminal State make recursive call
        if (gameStateEnum == GameStateEnum.ONGOING) {
          // Remove operator from working list
          var operatorsRemaining = _.without(operators, curOperator);
          // Resursive call
          if (operatorsRemaining.length === 0) {
            console.log(indent + 'No operators left, board is ' + boardWithCurMove);
            outcomeOfThisMove = GameStateEnum.DRAW;
          } else {
            var tempResults;
            //if (this.recursionDepth < 4) {
            tempResults = this.minMaxValueSuccesors(boardWithCurMove, operatorsRemaining, orgPlayer, !maxTurn);
            //} else {
            //            tempResults = {
            //utility: 0
            //};
            //}
            outcomeOfThisMove = tempResults.utility;
          }
        }

        // If terminal state then evaulate utility
        if (gameStateEnum !== GameStateEnum.ONGOING) {
          // We hit an endcase of the game

          // xyzzy Hardcoded for a win by O xyzzy
          // Get the utility value of this move
          switch (gameStateEnum) {
            case GameStateEnum.X_WON:
              console.log('X won');
              outcomeOfThisMove = (orgPlayer === 'O' ? -1 : 1);
              break;
            case GameStateEnum.O_WON:
              console.log('O won');
              outcomeOfThisMove = (orgPlayer === 'O' ? 1 : -1);
              break;
            default:
              console.log('Draw');
              outcomeOfThisMove = 0;
          }
        }

        if (maxTurn) {
          // We are concerned with the higest Utilty (i.e. org player trying to win)
          if (outcomeOfThisMove === maxUtility) {
            // We have an equally good option
            if (maxOptions.indexOf(curOperator) === -1)
              maxOptions.push(curOperator);
          }

          // Process the results for the last move (or final result of recursive moves)
          if (!maxUtility || outcomeOfThisMove > maxUtility) {
            // we have a new best case scenario. Remove any previous best options
            maxUtility = outcomeOfThisMove;
            maxOptions = [curOperator];
          }
        }

        if (!maxTurn) {
          // We are concerned with the lowest Utilty (i.e. other player trying to win)
          if (outcomeOfThisMove === minUtility) {
            // We have an equally bad option
            if (minOptions.indexOf(curOperator) === -1)
              minOptions.push(curOperator);
          }

          // Process the results for the last move (or final result of recursive moves)
          if (!minUtility || outcomeOfThisMove < minUtility) {
            // we have a new best case scenario. Remove any previous best options
            minUtility = outcomeOfThisMove;
            minOptions = [curOperator];
          }
        }

      }, this); /* end of forEach */

      var result;
      if (maxTurn) {
        result = {
          utility: maxUtility,
          options: maxOptions
            //,maxTurn: maxTurn
        };
      } else {
        result = {
          utility: minUtility,
          options: minOptions
            //,maxTurn: maxTurn
        };
      }

      console.log(indent + 'recursionDepth = ' + this.recursionDepth);
      console.log(indent + 'result is ' + JSON.stringify(result));
      console.log(indent + 'End of minMaxValueSuccesors for board = ' + board);
      console.log('');
      this.recursionDepth = this.recursionDepth - 1;

      return result;
    };

  });

  // Returns a random integer between min (included) and max (included)
  // Using Math.round() will give you a non-uniform distribution!
  function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function setCharAt(str, index, chr) {
    if (index > str.length - 1) return str;
    return str.substr(0, index) + chr + str.substr(index + 1);
  }

  function insert(str, index, value) {
    return str.substr(0, index) + value + str.substr(index);
  }

  var GameStateEnum = {
    ONGOING: 1,
    DRAW: 2,
    X_WON: 3,
    O_WON: 4
  };

  var UtiltyEnum = {
    MAXWIN: 1,
    DRAW: 0,
    MINWIN: -1
  };

})();
