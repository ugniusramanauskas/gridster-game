import React, { useEffect, useState } from "react";
import Square from "./elements/Square";
import * as PF from "pathfinding";

function Board({ numberOfRows = 9, numberOfCols = 5 }) {
  const [renderCount, setRenderCount] = useState(0);
  const [matrix, setMatrix] = useState([[]]);
  const [startPoint, setStartPoint] = useState(null);
  const [endPoint, setEndPoint] = useState(null);
  const [path, setPath] = useState([]);
  const [renderArray, setRenderArray] = useState();

  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  const findPath = (matrix, startPoint, endPoint) => {
    let grid = new PF.Grid(matrix);
    let finder = new PF.AStarFinder();
    let path = finder.findPath(
      startPoint.col,
      startPoint.row,
      endPoint.col,
      endPoint.row,
      grid
    );
    console.log({ startPoint, endPoint });
    console.log("Path: ", path);
    setPath(path);
  };

  const updateMatrix = (rowNumber, colNumber, newState) => {
    // Modify the matrix to match the changes in the grid
    setMatrix((prevMatrix) => {
      let matrixCopy = prevMatrix.map((rowArray) => [...rowArray]);
      matrixCopy[rowNumber][colNumber] = newState;
      return matrixCopy;
    });
  };

  const handleSquareClick = (rowNumber, colNumber, newSquareState) => {
    console.log("rowNumber");
    console.log(rowNumber);
    console.log("colNumber");
    console.log(colNumber);
    console.log("newSquareState");
    console.log(newSquareState);
    updateMatrix(rowNumber, colNumber, newSquareState);
    /**
     * Check if a CLEAR path exists:
     * 1. update the Matrix
     * 2. run a finder algorithm
     */

    // setActivePath(checkPath(start, end, {rowNumber, colNumber}));
  };

  const renderSquare = (
    rowNumber,
    colNumber,
    isStartPoint,
    isEndPoint,
    isPathPoint
  ) => (
    <Square
      key={`${rowNumber}${colNumber}`}
      rowNumber={rowNumber}
      colNumber={colNumber}
      onChange={(rowNumber, colNumber, newSquareState) =>
        handleSquareClick(rowNumber, colNumber, newSquareState)
      }
      isStartPoint={isStartPoint}
      isEndPoint={isEndPoint}
      isPathPoint={isPathPoint}
      renderCount={renderCount}
    />
  );

  const renderSingleRow = (rowNumber, startPoint, endPoint, path) => {
    let squares = [];
    for (let colNumber = 0; colNumber < numberOfCols; colNumber++) {
      let isStartPoint =
        rowNumber === startPoint.row && colNumber === startPoint.col
          ? true
          : false;
      let isEndPoint =
        rowNumber === endPoint.row && colNumber === endPoint.col ? true : false;
      let isPathPoint = false;
      for (let pathItem = 0; pathItem < path.length; pathItem++) {
        if (
          colNumber === path[pathItem][0] &&
          rowNumber === path[pathItem][1]
        ) {
          isPathPoint = true;
          break;
        }
      }
      squares.push(
        renderSquare(
          rowNumber,
          colNumber,
          isStartPoint,
          isEndPoint,
          isPathPoint
        )
      );
    }
    return squares;
  };

  const renderRows = (startPoint, endPoint, path) => {
    let rows = [];
    for (let i = 0; i < numberOfRows; i++) {
      rows.push(
        <div key={i} className="board-row">
          {renderSingleRow(i, startPoint, endPoint, path)}
        </div>
      );
    }
    setRenderArray(rows);
  };

  const generateMatrix = (numberOfRows, numberOfCols) => {
    return Array(numberOfRows)
      .fill(1)
      .map(() => Array(numberOfCols).fill(1));
  };

  useEffect(() => {
    if (!startPoint || !endPoint) return;
    console.log("Rerendering the entire board...");
    renderRows(startPoint, endPoint, path);
  }, [matrix, path, startPoint, endPoint]);

  useEffect(() => {
    if (!startPoint || !endPoint || !matrix) return;
    console.log("NEW matrix", matrix);
    findPath(matrix, startPoint, endPoint);
  }, [matrix, startPoint, endPoint]);

  useEffect(() => {
    if (!startPoint || !endPoint) return;
    console.log("startPoint", startPoint);
    console.log("endPoint", endPoint);
    updateMatrix(startPoint.row, startPoint.col, 0);
    updateMatrix(endPoint.row, endPoint.col, 0);
  }, [startPoint, endPoint]);

  useEffect(() => {
    // Generate the board (setMatrix)
    setMatrix(generateMatrix(numberOfRows, numberOfCols));
    // Repaint the Board
    setRenderCount((renderCount) => renderCount + 1);
    // Choose start and end points, save them to State
    setStartPoint({
      row: getRandomInt(numberOfRows),
      col: 0,
    });
    setEndPoint({
      row: getRandomInt(numberOfRows),
      col: numberOfCols - 1,
    });
  }, [numberOfRows, numberOfCols]);

  return (
    <div className="game">
      <div className="game-board">{renderArray}</div>
    </div>
  );
}

export default Board;
