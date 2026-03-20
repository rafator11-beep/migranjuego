import { PlayerColor, PieceState, ParchisPiece } from './parchisLogic';

const S = 40; // Square size
export const CENTER_OFFSET = 0; // if we need to shift the board

// Generate the 68 squares of the main track
export function generateTrack(): { x: number, y: number }[] {
    const track: { x: number, y: number }[] = [];

    // Quadrant 1: Yellow (BOT) to Blue (RIGHT)
    track.push({ x: 10 * S, y: 18 * S }); // 0: Corner BR
    for (let y = 17; y >= 11; y--) track.push({ x: 10 * S, y: y * S }); // 1..7: Right Col UP
    for (let x = 11; x <= 17; x++) track.push({ x: x * S, y: 10 * S }); // 8..14: Right Arm Bot LEFT->RIGHT
    track.push({ x: 18 * S, y: 10 * S }); // 15: Corner RB
    track.push({ x: 18 * S, y: 9 * S });  // 16: Mid R (Goal Entry Blue)

    // Quadrant 2: Blue (RIGHT) to Red (TOP)
    track.push({ x: 18 * S, y: 8 * S });  // 17: Corner RT
    for (let x = 17; x >= 11; x--) track.push({ x: x * S, y: 8 * S }); // 18..24: Right Arm Top RIGHT->LEFT
    for (let y = 7; y >= 1; y--) track.push({ x: 10 * S, y: y * S });   // 25..31: Top Arm Right UP
    track.push({ x: 10 * S, y: 0 });    // 32: Corner TR
    track.push({ x: 9 * S, y: 0 });     // 33: Mid T (Goal Entry Red)

    // Quadrant 3: Red (TOP) to Green (LEFT)
    track.push({ x: 8 * S, y: 0 });     // 34: Corner TL
    for (let y = 1; y <= 7; y++) track.push({ x: 8 * S, y: y * S });    // 35..41: Top Arm Left DOWN
    for (let x = 7; x >= 1; x--) track.push({ x: x * S, y: 8 * S });    // 42..48: Left Arm Top RIGHT->LEFT
    track.push({ x: 0, y: 8 * S });     // 49: Corner LT
    track.push({ x: 0, y: 9 * S });     // 50: Mid L (Goal Entry Green)

    // Quadrant 4: Green (LEFT) to Yellow (BOT)
    track.push({ x: 0, y: 10 * S });    // 51: Corner LB
    for (let x = 1; x <= 7; x++) track.push({ x: x * S, y: 10 * S });   // 52..58: Left Arm Bot LEFT->RIGHT
    for (let y = 11; y <= 17; y++) track.push({ x: 8 * S, y: y * S });  // 59..65: Bot Arm Left DOWN
    track.push({ x: 8 * S, y: 18 * S });  // 66: Corner BL
    track.push({ x: 9 * S, y: 18 * S });  // 67: Mid B (Goal Entry Yellow)

    return track;
}

// Fixed Constants for UI and safe zones based on the generated track
export const TRACK_POSITIONS = generateTrack();
export const SAFE_SQUARES_UI = [4, 7, 11, 21, 24, 28, 38, 41, 45, 55, 58, 62];

export const COLOR_CONFIG = {
    yellow: { start: 4, goalEntry: 67, home: { x: 15 * S, y: 15 * S } }, // Bottom Right area conceptually
    blue: { start: 21, goalEntry: 16, home: { x: 15 * S, y: 4 * S } },  // Top Right area
    red: { start: 38, goalEntry: 33, home: { x: 4 * S, y: 4 * S } },   // Top Left area
    green: { start: 55, goalEntry: 50, home: { x: 4 * S, y: 15 * S } },  // Bottom Left area
};

// Generate Goal Paths (7 squares for each color leading to center)
export function getGoalPath(color: PlayerColor): { x: number, y: number }[] {
    const path: { x: number, y: number }[] = [];
    if (color === 'yellow') {
        for (let y = 17; y >= 11; y--) path.push({ x: 9 * S, y: y * S });
    } else if (color === 'blue') {
        for (let x = 17; x >= 11; x--) path.push({ x: x * S, y: 9 * S });
    } else if (color === 'red') {
        for (let y = 1; y <= 7; y++) path.push({ x: 9 * S, y: y * S });
    } else if (color === 'green') {
        for (let x = 1; x <= 7; x++) path.push({ x: x * S, y: 9 * S });
    }
    return path;
}

export function getPieceVisualPosition(piece: ParchisPiece, allPieces: ParchisPiece[]): { x: number, y: number } {
    let basePos = { x: 0, y: 0 };

    if (piece.state === 'home') {
        const homeCenter = COLOR_CONFIG[piece.color].home;
        // Offset standard 4 pieces in a 2x2 grid inside the home
        const { id } = piece;
        const idx = parseInt(id.split('-')[1]);
        const d = S * 0.8;
        const offX = idx % 2 === 0 ? -d : d;
        const offY = Math.floor(idx / 2) === 0 ? -d : d;
        basePos = { x: homeCenter.x + offX - S / 2, y: homeCenter.y + offY - S / 2 };
    } else if (piece.state === 'board') {
        basePos = { ...TRACK_POSITIONS[piece.position] };
    } else if (piece.state === 'goal_path') {
        const path = getGoalPath(piece.color);
        basePos = { ...path[piece.position] };
    } else if (piece.state === 'goal') {
        // Center triangle area for the goal
        // To simplify, put them staggered in the center 3x3
        basePos = { x: 9 * S, y: 9 * S };
        const { id } = piece;
        const idx = parseInt(id.split('-')[1]);
        const offsets = [
            { x: -15, y: -15 }, { x: 15, y: -15 },
            { x: -15, y: 15 }, { x: 15, y: 15 }
        ];
        basePos.x += offsets[idx].x;
        basePos.y += offsets[idx].y;
    }

    // Handle stacking on the board
    if (piece.state === 'board' || piece.state === 'goal_path') {
        const overlapping = allPieces.filter(p => p.state === piece.state && p.position === piece.position && p.id !== piece.id);
        if (overlapping.length > 0) {
            // Just a slight visual offset
            const myOverLapIndex = [piece, ...overlapping].sort((a, b) => a.id.localeCompare(b.id)).findIndex(p => p.id === piece.id);
            if (myOverLapIndex === 1) {
                basePos.x += 10;
                basePos.y += 10;
            } else if (myOverLapIndex === 2) {
                basePos.x -= 10;
                basePos.y += 10;
            } else if (myOverLapIndex === 3) {
                basePos.x += 10;
                basePos.y -= 10;
            }
        }
    }

    return basePos;
}
