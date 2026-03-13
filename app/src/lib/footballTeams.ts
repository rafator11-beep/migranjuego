// Curated list of top worldwide football clubs (ESPN IDs) to ensure 100% reliable, high-quality PNG logos
export const FOOTBALL_TEAM_IDS = [
    // La Liga
    86, 83, 1068, 153, 243, 142, 175, 89,
    // Premier League
    359, 363, 364, 382, 360, 367, 361, 371, 379,
    // Serie A
    111, 103, 110, 114, 104, 112, 120,
    // Bundesliga
    132, 124, 131, 134, 138,
    // Ligue 1
    160, 176, 167, 164, 175,
    // Rest of Europe
    139, 148, 87, 1048, 228, 432, 436, 130, 135,
    // Americas
    5, 16, 819, 2024, 874, 344, 10, 12, 15, 3
];

export function getRandomTeamId(): number {
    const idx = Math.floor(Math.random() * FOOTBALL_TEAM_IDS.length);
    return FOOTBALL_TEAM_IDS[idx];
}

export function getTeamLogoUrl(teamId: number): string {
    // Highly reliable ESPN CDN for 500x500 transparent PNG logos without CORS/hotlinking errors
    return `https://a.espncdn.com/i/teamlogos/soccer/500/${teamId}.png`;
}
