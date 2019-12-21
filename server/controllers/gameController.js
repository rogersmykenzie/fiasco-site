async function createNewGame(req, res) {
  const db = req.app.get("db");
  let urls = await db.getExistingGameUrls();
  urls = urls.map(val => val.game_url);
  let currUrl = getRandomUrl();
  while (urls.includes(currUrl)) {
    currUrl = getRandomUrl();
  }
  try {
    await db.createNewGame(currUrl, req.body.numPlayers);
    res.status(200).json({
      url: currUrl,
      numPlayers: req.body.numPlayers
    });
  } catch (e) {
    res.status(500).json({
      error: "ERROR: " + e.message
    });
  }
}

function getRandomUrl() {
  let url = "/";
  for (let i = 0; i < 10; i++) {
    let char1 = String.fromCharCode(Math.floor(Math.random() * 26) + 97);
    let char2 = String.fromCharCode(Math.floor(Math.random() * 26) + 65);
    if (Math.random() < 0.5) {
      url += char1;
    } else {
      url += char2;
    }
  }
  return url;
}

async function getGame(req, res) {
  const { room } = req.params;
  const db = req.app.get("db");
  try {
    const game = await db.getGame(`/game/${room}`);
    res.status(200).json(game);
  } catch (e) {
    res.status(500).json({
      error: "ERROR: " + e.message
    });
  }
}

function setName(req, res) {
  try {
    const { name } = req.body;
    if (req.session.user === undefined) {
      req.session.user = {};
    }
    req.session.user.name = name;
    res.sendStatus(200);
  } catch (err) {
    res.status(200).json({
      error: "ERROR: " + err.message
    });
  }
}

module.exports = {
  createNewGame,
  getGame,
  setName,
  getRandomUrl
};
