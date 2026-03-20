
export function checkAchievements(stats: any) {
  const achievements = [];
  if (stats.drinks >= 10) achievements.push("🍻 Bebedor social");
  if (stats.gamesWon >= 3) achievements.push("🏆 Racha ganadora");
  return achievements;
}
