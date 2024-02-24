#include <iostream>

struct Score {
  unsigned int player_1;
  unsigned int player_2;

  Score() : player_1(0), player_2(0) {}

  void increment_score(unsigned int player) {
    if (player == 1) {
      player_1++;
    } else {
      player_2++;
    }
  }

  void draw() {
    std::cout << "Score: " << player_1 << std::endl;
    std::cout << "Score: " << player_2 << std::endl;
  }
};
