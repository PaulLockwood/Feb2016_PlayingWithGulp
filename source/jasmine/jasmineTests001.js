//Jasmine.onTest(function() {
//  "use strict";

describe('TicTacToe Module', function() {
  var $scope = null;
  var ctrl = null;

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

  xit('Verify Min-Max logic 1', function() {
    var board =
      '000' +
      '0XO' +
      'X00';

    var expectedResult = {
      utility: 1,
      options: [2]
    };

    var result = ctrl.determineBestPossibleMoves(board);

    expect(expectedResult).toEqual(result);
  });


  it('Verify Min-Max logic 2', function() {
    var board = 'XXO' +
      'O00' +
      '0XO';

    var expectedResult = {
      utility: 1,
      options: [4, 5]
    };

    var result = ctrl.determineBestPossibleMoves(board);

    expect(expectedResult).toEqual(result);
  });

  it('Verify Min-Max logic 5', function() {
    var board = 'O00' +
      'OX0' +
      'XOX';

    var expectedResult = {
      utility: 1,
      options: [2]
    };

    var result = ctrl.determineBestPossibleMoves(board);

    expect(expectedResult).toEqual(result);
  });


  it('Verify Min-Max logic 3', function() {
    var board = '0XO' +
      '000' +
      'OXO';
    var expectedResult = {
      utility: 1,
      options: [4, 5]
    };

    ctrl.humanIsPlaying = 'X';
    var result = ctrl.determineBestPossibleMoves(board);

    expect(expectedResult).toEqual(result);
  });


});
