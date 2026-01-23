



// Piece-Square Tables
// These tables provide positional values for each piece type on the board for white. For black, the tables should be mirrored vertically.
const pawnTable = [
    [0,  0,  0,  0,  0,  0,  0,  0],
    [50, 50, 50, 50, 50, 50, 50, 50],
    [10, 10, 20, 30, 30, 20, 10, 10],
    [5,  5, 10, 25, 25, 10,  5,  5],
    [0,  0,  0, 20, 20,  0,  0,  0],
    [5, -5,-10,  0,  0,-10, -5,  5],
    [5, 10, 10,-20,-20, 10, 10,  5],
    [0,  0,  0,  0,  0,  0,  0,  0]
];

const knightTable = [
    [-50,-40,-30,-30,-30,-30,-40,-50],
    [-40,-20,  0,  0,  0,  0,-20,-40],
    [-30,  0, 10, 15, 15, 10,  0,-30],
    [-30,  5, 15, 20, 20, 15,  5,-30],
    [-30,  0, 15, 20, 20, 15,  0,-30],
    [-30,  5, 10, 15, 15, 10,  5,-30],
    [-40,-20,  0,  5,  5,  0,-20,-40],
    [-50,-40,-30,-30,-30,-30,-40,-50]
];

const bishopTable = [
    [-20,-10,-10,-10,-10,-10,-10,-20],
    [-10,  0,  0,  0,  0,  0,  0,-10],
    [-10,  0,  5, 10, 10,  5,  0,-10],
    [-10,  5,  5, 10, 10,  5,  5,-10],
    [-10,  0, 10, 10, 10, 10,  0,-10],
    [-10, 10, 10, 10, 10, 10, 10,-10],
    [-10,  5,  0,  0,  0,  0,  5,-10],
    [-20,-10,-10,-10,-10,-10,-10,-20]
];

const rookTable = [
    [0,  0,  0,  0,  0,  0,  0,  0],
    [5, 10, 10, 10, 10, 10, 10,  5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [0,  0,  0,  5,  5,  0,  0,  0]
];

const queenTable = [
    [-20,-10,-10, -5, -5,-10,-10,-20],
    [-10,  0,  0,  0,  0,  0,  0,-10],
    [-10,  0,  5,  5,  5,  5,  0,-10],
    [-5,  0,  5,  5,  5,  5,  0, -5],
    [0,  0,  5,  5,  5,  5,  0, -5],
    [-10,  5,  5,  5,  5,  5,  0,-10],
    [-10,  0,  5,  0,  0,  0,  0,-10],
    [-20,-10,-10, -5, -5,-10,-10,-20]
];

const kingTableMidGame = [
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-20,-30,-30,-40,-40,-30,-30,-20],
    [-10,-20,-20,-20,-20,-20,-20,-10],
    [20, 20,  0,  0,  0,  0, 20, 20],
    [20, 30, 10,  0,  0, 10, 30, 20]
];


export function initializeBoard() {
    const initialBoard = [
        ["rook-black", "knight-black", "bishop-black", "queen-black", "king-black", "bishop-black", "knight-black", "rook-black"],
        ["pawn-black", "pawn-black", "pawn-black", "pawn-black", "pawn-black", "pawn-black", "pawn-black", "pawn-black"],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        ["pawn-white", "pawn-white", "pawn-white", "pawn-white", "pawn-white", "pawn-white", "pawn-white", "pawn-white"],
        ["rook-white", "knight-white", "bishop-white", "queen-white", "king-white", "bishop-white", "knight-white", "rook-white"]
    ];

    return initialBoard;
}

export function isValidMove(board: (string | null)[][], pieceType: string, fromRow: number, fromCol: number, toRow: number, toCol: number, toSquare: string | null) {
    const rowDiff = Math.abs(toRow - fromRow);
    const colDiff = Math.abs(toCol - fromCol);

    // Prevent capturing own pieces
    if (toSquare && toSquare.includes(pieceType.split('-')[1])) {
        return false;
    }

    let isValid = false;
    switch (pieceType.split('-')[0]) {
        case 'pawn':
            isValid = isValidPawnMove(pieceType, fromRow, fromCol, toRow, toCol, toSquare);
            break;
        case 'rook':
            isValid = isValidRookMove(fromRow, fromCol, toRow, toCol) && isPathClear(board, fromRow, fromCol, toRow, toCol);
            break;
        case 'knight':
            isValid = isValidKnightMove(rowDiff, colDiff);
            break;
        case 'bishop':
            isValid = isValidBishopMove(rowDiff, colDiff) && isPathClear(board, fromRow, fromCol, toRow, toCol);
            break;
        case 'queen':
            isValid = isValidQueenMove(fromRow, fromCol, toRow, toCol) && isPathClear(board, fromRow, fromCol, toRow, toCol);
            break;
        case 'king':
            isValid = isValidKingMove(rowDiff, colDiff) || isValidCastling(board, pieceType, fromRow, fromCol, toRow, toCol);
            break;
        default:
            isValid = false;
    }

    if (!isValid) {
        return false;
    }

    // Check if the move would put the player's own king in check
    const newBoard = board.map(row => row.slice());
    newBoard[toRow][toCol] = pieceType;
    newBoard[fromRow][fromCol] = null;
    const playerColor = pieceType.split('-')[1] as 'white' | 'black';
    if (isKingInCheck(newBoard, playerColor)) {
        return false;
    }

    return true;

}

function isValidPawnMove(pieceType: string, fromRow: number, fromCol: number, toRow: number, toCol: number, toSquare: string | null) {
    const direction = pieceType.includes('white') ? -1 : 1;
    const startRow = pieceType.includes('white') ? 6 : 1;

    // One square forward
    if (fromCol === toCol && toRow === fromRow + direction && !toSquare) {
        return true;
    }

    // Two squares forward from starting position
    if (fromCol === toCol && fromRow === startRow && toRow === fromRow + 2 * direction && !toSquare) {
        return true;
    }

    // Diagonal capture
    if (Math.abs(fromCol - toCol) === 1 && toRow === fromRow + direction && toSquare) {
        return true;
    }

    // En passant capture
    if (Math.abs(fromCol - toCol) === 1 && toRow === fromRow + direction && !toSquare) {
        const lastMove = getLastMove();
        if (lastMove && lastMove.piece.includes('pawn') && Math.abs(lastMove.fromRow - lastMove.toRow) === 2) {
            if (lastMove.toRow === fromRow && Math.abs(lastMove.toCol - fromCol) === 1) {
                return true;
            }
        }
    }

    return false;
}

let lastMove: { piece: string, fromRow: number, fromCol: number, toRow: number, toCol: number } | null = null;

export function getLastMove() {
    return lastMove;
}

export function setLastMove(move: { piece: string, fromRow: number, fromCol: number, toRow: number, toCol: number }) {
    lastMove = move;
}

function isValidRookMove(fromRow: number, fromCol: number, toRow: number, toCol: number) {
    return fromRow === toRow || fromCol === toCol;
}

function isValidKnightMove(rowDiff: number, colDiff: number) {
    return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
}

function isValidBishopMove(rowDiff: number, colDiff: number) {
    return rowDiff === colDiff;
}

function isValidQueenMove(fromRow: number, fromCol: number, toRow: number, toCol: number) {
    const rowDiff = Math.abs(toRow - fromRow);
    const colDiff = Math.abs(toCol - fromCol);
    return isValidRookMove(fromRow, fromCol, toRow, toCol) || isValidBishopMove(rowDiff, colDiff);
}

function isValidKingMove(rowDiff: number, colDiff: number) {
    return rowDiff <= 1 && colDiff <= 1;
}

// Rule of 50 moves
const positionHistory: string[] = [];
let halfMoveClock: number = 0;

export function isThreefoldRepetition(board: (string | null)[][]): boolean {
    const boardString = board.map(row => row.join(',')).join(';');
    positionHistory.push(boardString);

    const occurrences = positionHistory.filter(position => position === boardString).length;
    return occurrences >= 3;
}

export function isFiftyMoveRule(): boolean {
    return halfMoveClock >= 50;
}

export function resetHalfMoveClock() {
    halfMoveClock = 0;
}

export function incrementHalfMoveClock() {
    halfMoveClock++;
}

// Rule of castling

const kingMoved = { white: false, black: false };
const rookMoved = { 'white-0': false, 'white-7': false, 'black-0': false, 'black-7': false };

export function setKingMoved(color: 'white' | 'black') {
    kingMoved[color] = true;
}

export function setRookMoved(color: 'white' | 'black', col: 0 | 7) {
    rookMoved[`${color}-${col}`] = true;
}

function isValidCastling(board: (string | null)[][], pieceType: string, fromRow: number, fromCol: number, toRow: number, toCol: number): boolean {
    const color = pieceType.split('-')[1];
    if (kingMoved[color as 'white' | 'black']) {
        return false;
    }

    // Short castling
    if (toCol === fromCol + 2) {
        if (rookMoved[`${color}-7` as 'white-7' | 'black-7'] || board[fromRow][7] !== `rook-${color}`) {
            return false;
        }
        if (board[fromRow][fromCol + 1] !== null || board[fromRow][fromCol + 2] !== null) return false;
        if (isKingInCheck(board, color as 'white' | 'black') || 
            isSquareAttacked(board, fromRow, fromCol + 1, color as 'white' | 'black') || 
            isSquareAttacked(board, fromRow, fromCol + 2, color as 'white' | 'black')) {
            return false;
        }
        return true;
    }

    // Long castling
    if (toCol === fromCol - 2) {
        if (rookMoved[`${color}-0` as 'white-0' | 'black-0'] || board[fromRow][0] !== `rook-${color}`) {
            return false;
        }
        if (board[fromRow][fromCol - 1] !== null || board[fromRow][fromCol - 2] !== null || board[fromRow][fromCol - 3] !== null) return false;
        if (isKingInCheck(board, color as 'white' | 'black') || 
            isSquareAttacked(board, fromRow, fromCol - 1, color as 'white' | 'black') || 
            isSquareAttacked(board, fromRow, fromCol - 2, color as 'white' | 'black')) {
            return false;
        }
        return true;
    }

    return false;
}

function isSquareAttacked(board: (string | null)[][], row: number, col: number, color: 'white' | 'black'): boolean {
    const opponentColor = color === 'white' ? 'black' : 'white';
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const piece = board[r][c];
            if (piece && piece.includes(opponentColor)) {
                if (isValidMove(board, piece, r, c, row, col, board[row][col])) {
                    return true;
                }
            }
        }
    }
    return false;
}

// Check for checkmate and stalemate

export function isKingInCheck(board: (string | null)[][], kingColor: 'white' | 'black'): boolean {
    const kingPosition = findKing(board, kingColor);
    if (!kingPosition) {
        return false;
    }

    const [kingRow, kingCol] = kingPosition;
    const opponentColor = kingColor === 'white' ? 'black' : 'white';

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const piece = board[row][col];
            if (piece && piece.includes(opponentColor)) {
                if (isValidMove(board, piece, row, col, kingRow, kingCol, board[kingRow][kingCol])) {
                    return true;
                }
            }
        }
    }

    return false;
}

export function isCheckmate(board: (string | null)[][], kingColor: 'white' | 'black'): boolean {
    if (!isKingInCheck(board, kingColor)) {
        return false;
    }

    const kingPosition = findKing(board, kingColor);
    if (!kingPosition) {
        return false;
    }

    const [kingRow, kingCol] = kingPosition;

    // Check if the king can move to a safe position
    for (let rowDiff = -1; rowDiff <= 1; rowDiff++) {
        for (let colDiff = -1; colDiff <= 1; colDiff++) {
            const newRow = kingRow + rowDiff;
            const newCol = kingCol + colDiff;
            if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
                const newSquare = board[newRow][newCol];
                if (isValidMove(board, `king-${kingColor}`, kingRow, kingCol, newRow, newCol, newSquare)) {
                    const newBoard = board.map(row => row.slice());
                    newBoard[newRow][newCol] = `king-${kingColor}`;
                    newBoard[kingRow][kingCol] = null;
                    if (!isKingInCheck(newBoard, kingColor)) {
                        return false;
                    }
                }
            }
        }
    }

    // Check if any piece can block the check or capture the attacking piece
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const piece = board[row][col];
            if (piece && piece.includes(kingColor)) {
                for (let newRow = 0; newRow < 8; newRow++) {
                    for (let newCol = 0; newCol < 8; newCol++) {
                        const newSquare = board[newRow][newCol];
                        if (isValidMove(board, piece, row, col, newRow, newCol, newSquare)) {
                            const newBoard = board.map(row => row.slice());
                            newBoard[newRow][newCol] = piece;
                            newBoard[row][col] = null;
                            if (!isKingInCheck(newBoard, kingColor)) {
                                return false;
                            }
                        }
                    }
                }
            }
        }
    }

    return true;
}

export function isStalemate(board: (string | null)[][], kingColor: 'white' | 'black'): boolean {
    if (isKingInCheck(board, kingColor)) return false;

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const piece = board[row][col];
            if (piece && piece.includes(kingColor)) {
                for (let newRow = 0; newRow < 8; newRow++) {
                    for (let newCol = 0; newCol < 8; newCol++) {
                        const newSquare = board[newRow][newCol];
                        if (isValidMove(board, piece, row, col, newRow, newCol, newSquare)) {
                            return false;
                        }
                    }
                }
            }
        }
    }

    return true;
}

function findKing(board: (string | null)[][], kingColor: 'white' | 'black'): [number, number] | null {
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            if (board[row][col] === `king-${kingColor}`) {
                return [row, col];
            }
        }
    }
    return null;
}

// AI move

function evaluateBoard(board: (string | null)[][], aiColor: 'white' | 'black'): number {
    let score = 0;
    const isEndGame = false; // Placeholder for endgame detection
    // Implement a simple evaluation function based on material count
    const pieceValues: { [key: string]: number } = {
        'pawn': 1,
        'knight': 3,
        'bishop': 3,
        'rook': 5,
        'queen': 9,
        'king': 0
    };

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const piece = board[row][col];
            if (piece) {
                const [type, color] = piece.split('-');
                const isWhite = color === 'white';

                let pieceValue = 0;
                let positionValue = 0;

                const tableRow = isWhite ? row : 7 - row;
                const tableCol = col;

                switch (type) {
                    case 'pawn': 
                        pieceValue = 100; 
                        positionValue = pawnTable[tableRow][tableCol];
                        break;
                    case 'knight': 
                        pieceValue = 320; 
                        positionValue = knightTable[tableRow][tableCol];
                        break;
                    case 'bishop': 
                        pieceValue = 330; 
                        positionValue = bishopTable[tableRow][tableCol];
                        break;
                    case 'rook': 
                        pieceValue = 500; 
                        positionValue = rookTable[tableRow][tableCol];
                        break;
                    case 'queen': 
                        pieceValue = 900; 
                        positionValue = queenTable[tableRow][tableCol];
                        break;
                    case 'king': 
                        pieceValue = 20000; 
                        positionValue = kingTableMidGame[tableRow][tableCol];
                        break;
                }

                const totalValue = pieceValue + positionValue;

                score += (color === aiColor ? totalValue : -totalValue);
            }
        }
    }
    return score;
}

function minimax(
    board: (string | null)[][], 
    depth: number, 
    alpha: number, 
    beta: number, 
    isMaximizing: boolean, 
    aiColor: 'white' | 'black'
): number {
    if (depth === 0) {
        return evaluateBoard(board, aiColor);
    }

    const opponentColor = aiColor === 'white' ? 'black' : 'white';
    
    // Generate all possible moves for the current player
    const possibleMoves = getAllPossibleMoves(board, isMaximizing ? aiColor : opponentColor);

    // If there are no moves, it's checkmate or stalemate
    if (possibleMoves.length === 0) {
        if (isKingInCheck(board, isMaximizing ? aiColor : opponentColor)) {
            return isMaximizing ? -99999 : 99999; // Checkmate is the worst/best possible
        }
        return 0; // Stalemate
    }

    // Move ordering (optional but recommended):
    // Trying to analyze captures first helps alpha-beta pruning be faster.
    // For simplicity, here we shuffle them to add variety if scores are equal.
    possibleMoves.sort(() => Math.random() - 0.5);

    if (isMaximizing) {
        let maxEval = -Infinity;
        for (const move of possibleMoves) {
            const newBoard = simulateMove(board, move);
            const evalScore = minimax(newBoard, depth - 1, alpha, beta, false, aiColor);
            maxEval = Math.max(maxEval, evalScore);
            alpha = Math.max(alpha, evalScore);
            if (beta <= alpha) break; // Beta pruning
        }
        return maxEval;
    } else {
        let minEval = Infinity;
        for (const move of possibleMoves) {
            const newBoard = simulateMove(board, move);
            const evalScore = minimax(newBoard, depth - 1, alpha, beta, true, aiColor);
            minEval = Math.min(minEval, evalScore);
            beta = Math.min(beta, evalScore);
            if (beta <= alpha) break; // Alpha pruning
        }
        return minEval;
    }
}

// Helper function to get all possible moves (to keep main code clean)
function getAllPossibleMoves(board: (string | null)[][], color: 'white' | 'black') {
    const moves = [];
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const piece = board[r][c];
            if (piece && piece.includes(color)) {
                for (let toR = 0; toR < 8; toR++) {
                    for (let toC = 0; toC < 8; toC++) {
                        if (isValidMove(board, piece, r, c, toR, toC, board[toR][toC])) {
                            // Extra check to ensure we don't leave the king in check
                            const tempBoard = simulateMove(board, {fromRow: r, fromCol: c, toRow: toR, toCol: toC, piece});
                            if (!isKingInCheck(tempBoard, color)) {
                                moves.push({ fromRow: r, fromCol: c, toRow: toR, toCol: toC, piece });
                            }
                        }
                    }
                }
            }
        }
    }
    return moves;
}

// Helper function to simulate a move without modifying the original board
function simulateMove(board: (string | null)[][], move: {fromRow: number, fromCol: number, toRow: number, toCol: number, piece: string}) {
    const newBoard = board.map(row => row.slice());
    newBoard[move.toRow][move.toCol] = move.piece;
    newBoard[move.fromRow][move.fromCol] = null;
    return newBoard;
}

export function makeAIMove(board: (string | null)[][], aiColor: 'white' | 'black'): (string | null)[][] {
    const depth = 3; // Adjust depth for difficulty/performance trade-off
    const possibleMoves = getAllPossibleMoves(board, aiColor);
    
    let bestMove: { fromRow: number, fromCol: number, toRow: number, toCol: number, piece: string } | null = null;
    let bestValue = -Infinity;
    let alpha = -Infinity;
    let beta = Infinity;

    possibleMoves.sort(() => Math.random() - 0.5);

    for (const move of possibleMoves) {
        const newBoard = simulateMove(board, move);
        // Call minimax for the opponent's turn
        const boardValue = minimax(newBoard, depth - 1, alpha, beta, false, aiColor);

        if (boardValue > bestValue) {
            bestValue = boardValue;
            bestMove = move;
        }
        // Update alpha for the root level
        alpha = Math.max(alpha, bestValue);
    }

    if (bestMove) {
        const newBoard = simulateMove(board, bestMove);
        setLastMove({ 
            piece: bestMove.piece, 
            fromRow: bestMove.fromRow, 
            fromCol: bestMove.fromCol, 
            toRow: bestMove.toRow, 
            toCol: bestMove.toCol 
        });
        return newBoard;
    }

    return board;
}

function isPathClear(board: (string | null)[][], fromRow: number, fromCol: number, toRow: number, toCol: number): boolean {
    const rowStep = toRow > fromRow ? 1 : toRow < fromRow ? -1 : 0;
    const colStep = toCol > fromCol ? 1 : toCol < fromCol ? -1 : 0;

    let currentRow = fromRow + rowStep;
    let currentCol = fromCol + colStep;

    while (currentRow !== toRow || currentCol !== toCol) {
        if (board[currentRow][currentCol] !== null) {
            return false; // Obstacle found
        }
        currentRow += rowStep;
        currentCol += colStep;
    }
    return true;
}