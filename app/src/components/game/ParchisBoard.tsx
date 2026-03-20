import React from 'react';
import { ParchisPiece, PlayerColor, SAFE_SQUARES } from '@/lib/parchisLogic';
import { TRACK_POSITIONS, SAFE_SQUARES_UI, COLOR_CONFIG, getGoalPath, getPieceVisualPosition } from '@/lib/parchisBoardData';
import tapete from '@/assets/tapete.jpg';

interface ParchisBoardProps {
    pieces: ParchisPiece[];
    currentTurn: PlayerColor;
    myColor: PlayerColor | null;
    onPieceClick?: (piece: ParchisPiece) => void;
    teamLogos?: Record<PlayerColor, string>;
    equippedTokens?: Record<PlayerColor, string>;
}

const COLORS = {
    red: '#EF4444',
    blue: '#3B82F6',
    yellow: '#EAB308',
    green: '#10B981',
    safe: '#94A3B8',
    track: '#FFFFFF',
    border: '#334155'
};

const S = 40; // Size of a square
import { SHOP_ITEMS } from '@/lib/playerEconomy';

export function ParchisBoard({ pieces, currentTurn, myColor, onPieceClick, teamLogos, equippedTokens }: ParchisBoardProps) {
    const [imageErrors, setImageErrors] = React.useState<Record<string, boolean>>({});

    const handleImageError = (color: string) => {
        setImageErrors(prev => ({ ...prev, [color]: true }));
    };

    // Renders a single track square
    const renderSquare = (x: number, y: number, isSafe: boolean, colorTint?: string, index?: number) => (
        <g key={`sq-${x}-${y}`} transform={`translate(${x}, ${y})`}>
            <rect
                width={S} height={S}
                fill={colorTint || (isSafe ? COLORS.safe : COLORS.track)}
                stroke={COLORS.border} strokeWidth="1"
            />
            {isSafe && !colorTint && (
                <circle cx={S / 2} cy={S / 2} r={S / 3} fill="none" stroke={COLORS.border} strokeWidth="2" opacity="0.5" />
            )}
        </g>
    );

    const renderHomeLogo = (color: PlayerColor) => {
        const logo = teamLogos?.[color];
        if (!logo || imageErrors[color]) return null;

        return (
            <image
                href={logo}
                x={4 * S - 30} y={4 * S - 30}
                width={60} height={60}
                className="pointer-events-none drop-shadow-xl"
                onError={() => handleImageError(color)}
                preserveAspectRatio="xMidYMid meet"
            />
        );
    };

    return (
        <div className="w-full max-w-2xl aspect-square relative select-none touch-none drop-shadow-2xl">
            <svg
                viewBox="0 0 760 760"
                className="w-full h-full bg-[#E2E8F0] rounded-xl overflow-hidden"
                style={{ filter: 'drop-shadow(0px 20px 30px rgba(0,0,0,0.5))' }}
            >
                <defs>
                    <radialGradient id="pieceGrad" cx="30%" cy="30%" r="70%">
                        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="#000000" stopOpacity="0.4" />
                    </radialGradient>
                    <filter id="shadow">
                        <feDropShadow dx="2" dy="2" stdDeviation="2" floodOpacity="0.5" />
                    </filter>
                </defs>

                {/* --- 4 HOME BASES --- */}
                {/* TOP LEFT (Red) */}
                <g transform={`translate(0, 0)`}>
                    <rect width={8 * S} height={8 * S} fill={COLORS.red} stroke={COLORS.border} strokeWidth="4" />
                    <circle cx={4 * S} cy={4 * S} r={2.5 * S} fill="#ffffff" stroke={COLORS.border} strokeWidth="2" />
                    {renderHomeLogo('red')}
                </g>
                {/* TOP RIGHT (Blue) */}
                <g transform={`translate(${11 * S}, 0)`}>
                    <rect width={8 * S} height={8 * S} fill={COLORS.blue} stroke={COLORS.border} strokeWidth="4" />
                    <circle cx={4 * S} cy={4 * S} r={2.5 * S} fill="#ffffff" stroke={COLORS.border} strokeWidth="2" />
                    {renderHomeLogo('blue')}
                </g>
                {/* BOTTOM RIGHT (Yellow) */}
                <g transform={`translate(${11 * S}, ${11 * S})`}>
                    <rect width={8 * S} height={8 * S} fill={COLORS.yellow} stroke={COLORS.border} strokeWidth="4" />
                    <circle cx={4 * S} cy={4 * S} r={2.5 * S} fill="#ffffff" stroke={COLORS.border} strokeWidth="2" />
                    {renderHomeLogo('yellow')}
                </g>
                {/* BOTTOM LEFT (Green) */}
                <g transform={`translate(0, ${11 * S})`}>
                    <rect width={8 * S} height={8 * S} fill={COLORS.green} stroke={COLORS.border} strokeWidth="4" />
                    <circle cx={4 * S} cy={4 * S} r={2.5 * S} fill="#ffffff" stroke={COLORS.border} strokeWidth="2" />
                    {renderHomeLogo('green')}
                </g>

                {/* --- CENTRAL GOAL --- */}
                <g transform={`translate(${8 * S}, ${8 * S})`}>
                    {/* Triangular cuts for the goal Center */}
                    <polygon points={`0,0 ${1.5 * S},${1.5 * S} 0,${3 * S}`} fill={COLORS.green} stroke={COLORS.border} strokeWidth="1" />
                    <polygon points={`0,0 ${3 * S},0 ${1.5 * S},${1.5 * S}`} fill={COLORS.red} stroke={COLORS.border} strokeWidth="1" />
                    <polygon points={`${3 * S},0 ${3 * S},${3 * S} ${1.5 * S},${1.5 * S}`} fill={COLORS.blue} stroke={COLORS.border} strokeWidth="1" />
                    <polygon points={`0,${3 * S} ${3 * S},${3 * S} ${1.5 * S},${1.5 * S}`} fill={COLORS.yellow} stroke={COLORS.border} strokeWidth="1" />
                    <rect width={3 * S} height={3 * S} fill="none" stroke={COLORS.border} strokeWidth="4" />

                    {/* Main Goal image (Huesca Shield) in the absolute center */}
                    <circle cx={1.5 * S} cy={1.5 * S} r={1.2 * S} fill="#fff" stroke={COLORS.border} strokeWidth="2" />
                    <image
                        href={tapete}
                        x={1.5 * S - 35} y={1.5 * S - 35} width="70" height="70"
                        preserveAspectRatio="xMidYMid slice"
                    />
                </g>

                {/* --- MAIN TRACK (68 squares) --- */}
                {TRACK_POSITIONS.map((pos, i) => {
                    const isSafe = SAFE_SQUARES_UI.includes(i);
                    let colorTint;
                    if (i === COLOR_CONFIG.yellow.start) colorTint = COLORS.yellow;
                    if (i === COLOR_CONFIG.blue.start) colorTint = COLORS.blue;
                    if (i === COLOR_CONFIG.red.start) colorTint = COLORS.red;
                    if (i === COLOR_CONFIG.green.start) colorTint = COLORS.green;

                    return renderSquare(pos.x, pos.y, isSafe, colorTint, i);
                })}

                {/* --- GOAL PATHS (4x7 squares) --- */}
                {['red', 'blue', 'yellow', 'green'].map(c => {
                    const color = c as PlayerColor;
                    const path = getGoalPath(color);
                    return path.map((pos, i) => (
                        <g key={`path-${color}-${i}`} transform={`translate(${pos.x}, ${pos.y})`}>
                            <rect
                                width={S} height={S}
                                fill={COLORS[color]}
                                stroke={COLORS.border} strokeWidth="1"
                                opacity={0.8 - (i * 0.05)}
                            />
                            <text x={S / 2} y={S / 2 + 5} fontSize="14" fontWeight="bold" fill="#fff" textAnchor="middle" opacity="0.5">{i + 1}</text>
                        </g>
                    ));
                })}

                {/* --- PIECES --- */}
                {pieces.map(piece => {
                    const { x, y } = getPieceVisualPosition(piece, pieces);
                    const isMyPiece = piece.color === myColor;
                    const isTurn = piece.color === currentTurn;

                    // Slight animation offset for active player piece hovering
                    const activeClass = isMyPiece && isTurn ? "animate-pulse cursor-pointer" : "";

                    return (
                        <g
                            key={piece.id}
                            transform={`translate(${x}, ${y})`}
                            className={`transition-all duration-500 ease-out ${activeClass}`}
                            onClick={() => {
                                if (isMyPiece && isTurn && onPieceClick) {
                                    onPieceClick(piece);
                                }
                            }}
                            filter="url(#shadow)"
                        >
                            <circle cx={S / 2} cy={S / 2} r={14} fill={COLORS[piece.color]} stroke="#ffffff" strokeWidth="2" />
                            {/* Inner 3D spherical gradient highlight */}
                            <circle cx={S / 2} cy={S / 2} r={14} fill="url(#pieceGrad)" />

                            {/* Equipped Token Emoji or Team Logo Overlay */}
                            {(() => {
                                const equippedItem = equippedTokens && equippedTokens[piece.color]
                                    ? SHOP_ITEMS.find(it => it.id === equippedTokens[piece.color])
                                    : null;

                                if (equippedItem) {
                                    return (
                                        <text x={S / 2} y={S / 2 + 5} fontSize="18" textAnchor="middle" className="pointer-events-none drop-shadow-md">
                                            {equippedItem.emoji}
                                        </text>
                                    );
                                }

                                if (teamLogos && teamLogos[piece.color] && !imageErrors[piece.color]) {
                                    return (
                                        <image
                                            href={teamLogos[piece.color]}
                                            x={S / 2 - 10} y={S / 2 - 10}
                                            width={20} height={20}
                                            className="pointer-events-none drop-shadow-md"
                                            onError={() => handleImageError(piece.color)}
                                            preserveAspectRatio="xMidYMid meet"
                                        />
                                    );
                                }
                                return null;
                            })()}

                            {/* Highlight ring for current player's piece */}
                            {isMyPiece && isTurn && (
                                <circle cx={S / 2} cy={S / 2} r={18} fill="none" stroke="#fff" strokeWidth="2" strokeDasharray="4 4" className="animate-[spin_4s_linear_infinite]" />
                            )}
                        </g>
                    );
                })}
            </svg>
        </div>
    );
}
