import { isCountableFinishedQuizGame } from './quizHelpers';

export const computeLeaderboard = (games) => {
  const stats = {};

  games.filter(isCountableFinishedQuizGame).forEach((game) => {
    [game.player1, game.player2].forEach((player) => {
      if (!stats[player]) {
        stats[player] = { name: player, wins: 0, losses: 0, draws: 0, points: 0 };
      }
    });

    if (game.winner === game.player1) {
      stats[game.player1].wins++;
      stats[game.player2].losses++;
      stats[game.player1].points += 3;
    } else if (game.winner === game.player2) {
      stats[game.player2].wins++;
      stats[game.player1].losses++;
      stats[game.player2].points += 3;
    } else {
      stats[game.player1].draws++;
      stats[game.player2].draws++;
      stats[game.player1].points += 1;
      stats[game.player2].points += 1;
    }
  });

  return Object.values(stats).sort((a, b) => b.points - a.points);
};
