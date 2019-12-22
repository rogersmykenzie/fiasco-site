class Game {
  constructor(url, numPlayers) {
    this.url = url;
    this.numPlayers = numPlayers;
    this.players = [];
    this.whiteDice = [];
    this.blackDice = [];
    for (let i = 1; i <= 6; i++) {
      this.whiteDice.push({
        id: i,
        x: 50,
        y: 50 + 104 * (i + 5),
        z: 0,
        value: Math.ceil(Math.random() * 6)
      });
      this.blackDice.push({
        id: i + 6,
        x: 50,
        y: 50 + 104 * (i - 1),
        z: 0,
        value: Math.ceil(Math.random() * 6)
      });
      this.text = "";
    }
  }

  addPlayer(id, name) {
    this.players.push({
      id,
      name
    });
  }

  removePlayer(id) {
    const index = this.players.findIndex(val => val.id === id);
    this.players.splice(index, 1);
  }

  findPlayerById(id) {
    return this.players.findIndex(val => val.id === id);
  }

  updateDieValue(id, newValue) {
    function updateElement(val, i, arr) {
      if (val.id === id) {
        arr[i].value = newValue;
      }
    }
    this.whiteDice.forEach(updateElement);
    this.blackDice.forEach(updateElement);
  }

  updateDiePosition(id, x, y) {
    function updateElement(val, i, arr) {
      if (val.id === id) {
        arr[i].x = x < 50 ? 50 : x;
        arr[i].y = y < 50 ? 50 : y - 50;
      }
    }

    this.whiteDice.forEach(updateElement);
    this.blackDice.forEach(updateElement);
  }

  bringDieToFront(id) {
    const highest = this.getHighestZIndex();
    function updateElement(val, i, arr) {
      if (val.id === id) {
        arr[i].z = highest + 1;
      }
    }

    this.whiteDice.forEach(updateElement);
    this.blackDice.forEach(updateElement);
  }

  getHighestZIndex() {
    return Math.max(...this.whiteDice.concat(this.blackDice).map(val => val.z));
  }

  setText(text) {
    this.text = text;
  }
}

module.exports = {
  Game
};
