import './index.css';

function loadScript(src: string) {
  return new Promise<any>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onabort = reject;
    script.onerror = reject;
    document.body.append(script);
  });
}

async function startGame() {
        const params: {[key:string]: string} = {};

        window.location.search.replace("?", "").split("&").forEach(param => {
            const paramData = param.split("=");
            params[paramData[0]] = paramData[1];
        });

        let games: {[key:string]: string} = {};

        await fetch('/games.json')
            .then(response => response.json())
            .then(data => {
                games = data;
                console.log("data:", data);
            })

        const gameName = games[params['game']];
        console.log(gameName);

        if (!gameName) alert('FUCK THAT SHIT')

        const script = `./${gameName}/game.js`

        await loadScript(script);
    }

startGame();