function getRandomBoxIndex() {
  return Math.floor(Math.random() * 3);
}

class Game {
  constructor() {
    const prizeBoxIndex = getRandomBoxIndex();
    this.boxes = [
      new Box(prizeBoxIndex === 0),
      new Box(prizeBoxIndex === 1),
      new Box(prizeBoxIndex === 2),
    ];
  }
  choose(boxIndex) {
    const box = this.boxes.find((_, i) => i === boxIndex);
    box.choose();
  }
  revealNonChosenBox() {
    const box = this.boxes.find((box) => !box.isPrize && !box.isChosen);
    box.open();
  }
  switch() {
    const previousBox = this.boxes.find((box) => box.isChosen);
    const newBox = this.boxes.find((box) => !box.isChosen && !box.isOpened);

    previousBox.unchoose();
    newBox.choose();
  }
  isWin() {
    const chosenBox = this.boxes.find((box) => box.isChosen);
    return chosenBox.isPrize;
  }
}

class Box {
  constructor(isPrize) {
    this.isPrize = isPrize;
    this.isOpened = false;
    this.isChosen = false;
  }
  unchoose() {
    this.isChosen = false;
  }
  choose() {
    this.isChosen = true;
  }
  open() {
    this.isOpened = true;
  }
}

function handleResults(roundResults, numOfRounds) {
  const results = roundResults.reduce(
    (acc, result) => {
      if (result.isWin) {
        result.toSwitch ? acc.switchWins++ : acc.stayWins++;
      } else {
        result.toSwitch ? acc.switchLosses++ : acc.stayLosses++;
      }
      return acc;
    },
    {
      switchWins: 0,
      switchLosses: 0,
      stayWins: 0,
      stayLosses: 0,
    }
  );

  const switchProbability = (results.switchWins / numOfRounds) * 100;
  const stayProbability = (results.stayWins / numOfRounds) * 100;

  console.log(`Switch wins: ${results.switchWins}`);
  console.log(`Switch losses: ${results.switchLosses}`);
  console.log(`Switch probability: ${switchProbability.toFixed(2)}%`);

  console.log(`Stay wins: ${results.stayWins}`);
  console.log(`Stay losses: ${results.stayLosses}`);
  console.log(`Stay probability: ${stayProbability.toFixed(2)}%`);
}

function startGameRound() {
  const game = new Game();

  game.choose(getRandomBoxIndex());

  game.revealNonChosenBox();

  const toSwitch = Math.random() > 0.5;
  if (toSwitch) {
    game.switch();
  }

  const isWin = game.isWin();

  return { isWin, toSwitch };
}

function startGameLoop() {
  const numberOfRounds = 100000;

  let roundResults = [];

  for (let i = 0; i < numberOfRounds; i++) {
    const { isWin, toSwitch } = startGameRound();
    roundResults.push({ isWin, toSwitch });
  }

  handleResults(roundResults, numberOfRounds);
}

startGameLoop();
