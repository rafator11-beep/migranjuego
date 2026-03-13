export type PlayerColor = 'red' | 'blue' | 'yellow' | 'green';
export type PieceState = 'home' | 'board' | 'goal_path' | 'goal';

export interface ParchisPiece {
    id: string; // e.g., 'red-0'
    color: PlayerColor;
    state: PieceState;
    position: number;
}

export const SAFE_SQUARES = [4, 7, 11, 21, 24, 28, 38, 41, 45, 55, 58, 62];

export const COLOR_ORDER: PlayerColor[] = ['red', 'blue', 'yellow', 'green'];

export const BOARD_CONFIG = {
    yellow: { start: 4, enterGoalAfter: 67 },
    blue: { start: 21, enterGoalAfter: 16 },
    red: { start: 38, enterGoalAfter: 33 },
    green: { start: 55, enterGoalAfter: 50 },
};

export function createInitialPieces(): ParchisPiece[] {
    const pieces: ParchisPiece[] = [];
    COLOR_ORDER.forEach(color => {
        for (let i = 0; i < 4; i++) {
            pieces.push({
                id: `${color}-${i}`,
                color: color as PlayerColor,
                state: 'home',
                position: 0,
            });
        }
    });
    return pieces;
}

export function isSafe(pos: number): boolean {
    return SAFE_SQUARES.includes(pos);
}

// Logic for calculating the next position
// Returns the new state and position
export function calculateNextPosition(piece: ParchisPiece, steps: number): { state: PieceState; position: number } | null {
    if (piece.state === 'goal') return null;

    if (piece.state === 'home') {
        if (steps === 5) { // Needs a 5 to exit home
            return { state: 'board', position: BOARD_CONFIG[piece.color].start };
        }
        return null; // Cannot move
    }

    if (piece.state === 'goal_path') {
        const newPos = piece.position + steps;
        if (newPos === 7) {
            return { state: 'goal', position: 7 };
        } else if (newPos < 7) {
            return { state: 'goal_path', position: newPos };
        } else {
            // Rebounds (rebote en pasillo)
            const rebound = newPos - 7;
            return { state: 'goal_path', position: 7 - rebound };
        }
    }

    if (piece.state === 'board') {
        let currentPos = piece.position;
        const enterGoalLimit = BOARD_CONFIG[piece.color].enterGoalAfter;

        // Check if it crosses the goal entry
        let distanceToGoalEntry = 0;
        if (currentPos <= enterGoalLimit) {
            distanceToGoalEntry = enterGoalLimit - currentPos;
        } else {
            distanceToGoalEntry = (67 - currentPos + 1) + enterGoalLimit;
        }

        if (steps > distanceToGoalEntry) {
            // Enters goal path
            const stepsInPath = steps - distanceToGoalEntry;
            if (stepsInPath === 8) { // 8 steps exact to reach the goal (position 7 index)
                return { state: 'goal', position: 7 };
            } else if (stepsInPath < 8) {
                return { state: 'goal_path', position: stepsInPath - 1 };
            } else {
                const rebound = stepsInPath - 8;
                return { state: 'goal_path', position: 6 - rebound };
            }
        } else {
            // Stays on board
            let newPos = currentPos + steps;
            if (newPos > 67) newPos -= 68;
            return { state: 'board', position: newPos };
        }
    }

    return null;
}
