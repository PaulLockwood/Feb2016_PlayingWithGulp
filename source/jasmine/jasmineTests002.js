//Jasmine.onTest(function() {
//  "use strict";

describe('TicTacToe Module', function() {
  var $scope = null;
  var ctrl = null;

  //you need to indicate your module in a test
  beforeEach(module('ticTacToe'));

  beforeEach(inject(function($rootScope, $controller) {
    $scope = $rootScope.$new();

    ctrl = $controller('gridController', {
      $scope: $scope
    });
  }));

  it('Canary Test', function() {
    expect(ctrl.canaryTest()).toEqual('alive');
  });

  it('Verify computerIsPlaying fn', function() {

    ctrl.humanIsPlaying = 'X';
    var result = ctrl.computerIsPlaying();
    expect('O').toEqual(result);

    ctrl.humanIsPlaying = 'O';
    result = ctrl.computerIsPlaying();
    expect('X').toEqual(result);
  });


  it('Verify all winning board positions (fn lookForWinner)', function() {
    // Verify all winning board positions are detected
    expect(ctrl.lookForWinner('000XXX000')).toEqual(3);
    expect(ctrl.lookForWinner('000000XXX')).toEqual(3);
    expect(ctrl.lookForWinner('XXX000000')).toEqual(3);
    expect(ctrl.lookForWinner('X000X000X')).toEqual(3); //diag
    expect(ctrl.lookForWinner('00X0X0X00')).toEqual(3); //diag
    expect(ctrl.lookForWinner('X00X00X00')).toEqual(3);
    expect(ctrl.lookForWinner('0X00X00X0')).toEqual(3);
    expect(ctrl.lookForWinner('00X00X00X')).toEqual(3);

    // Verify a real board with both letters
    expect(ctrl.lookForWinner('XXX O O O')).toEqual(3);
    expect(ctrl.lookForWinner('0OOXXXO00')).toEqual(3);

    // Verify a real board with both letters + O wins
    expect(ctrl.lookForWinner('OOO X X X')).toEqual(4);
    expect(ctrl.lookForWinner('OXO0XOX0O')).toEqual(4);

    // Verify a real board with no winner
    expect(ctrl.lookForWinner('O O X X X')).toEqual(1);

  });


  it('Verify Min-Max logic 2', function() {
    var board = 'OXO' +
      '000' +
      'OXO';
    var expectedResult = {
      utility: 1,
      options: [3, 4, 5]
    };

    var result = ctrl.determineBestPossibleMoves(board);

    expect(expectedResult).toEqual(result);
  });


  it('Test lodash without array function', function() {
    var options = [1, 2, 3];
    var result = _.without(options, 1, 2);
    expect(result).toEqual([3]);
  });


});
//});
