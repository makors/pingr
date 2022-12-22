// import libraries
const express = require('express');
const localtunnel = require('localtunnel');
var qrcode = require('qrcode-terminal');
const { keyboard, Key } = require("@nut-tree/nut-js");
var ffi = require('ffi-napi')
const { Window } = require('win-control')
var monitor = require('active-window');
const chalk = require('chalk');
var { platform, exit } = require('process');
const { exec } = require('child_process');
const bodyParser = require('body-parser');

// continue if platform is windows
if (platform == "win32") {
    console.log(chalk.green(`Platform: ${platform} ✅`));
} else {
    // print platform then exit code
    console.log(chalk.red(`Platform: ${platform} ❌`));
    exit(1);
}

// port
const port = 3000;

// print ascii art
console.log(chalk.cyan(`
██████╗ ██╗███╗   ██╗ ██████╗ ██████╗ 
██╔══██╗██║████╗  ██║██╔════╝ ██╔══██╗
██████╔╝██║██╔██╗ ██║██║  ███╗██████╔╝
██╔═══╝ ██║██║╚██╗██║██║   ██║██╔══██╗
██║     ██║██║ ╚████║╚██████╔╝██║  ██║
╚═╝     ╚═╝╚═╝  ╚═══╝ ╚═════╝ ╚═╝  ╚═╝
`))

// express server
const app = express();

// form
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');

async function sleep(duration) {
    return new Promise(resolve => setTimeout(resolve, duration));
}

var user32 = new ffi.Library('user32', {
    'GetTopWindow': ['long', ['long']],
    'FindWindowA': ['long', ['string', 'string']],
    'SetActiveWindow': ['long', ['long']],
    'SetForegroundWindow': ['bool', ['long']],
    'BringWindowToTop': ['bool', ['long']],
    'ShowWindow': ['bool', ['long', 'int']],
    'SwitchToThisWindow': ['void', ['long', 'bool']],
    'GetForegroundWindow': ['long', []],
    'AttachThreadInput': ['bool', ['int', 'long', 'bool']],
    'GetWindowThreadProcessId': ['int', ['long', 'int']],
    'SetWindowPos': ['bool', ['long', 'long', 'int', 'int', 'int', 'int', 'uint']],
    'SetFocus': ['long', ['long']]
});

// everything that works
callback = async function(window) {
    exec('taskkill /f /im "Frozen Freebies.exe" && cd %appdata% && cd .. && cd Local && cd FrozenFreebies && "Frozen Freebies.exe"', (error, stdout, stderr) => {
        if (error) {
            console.log(chalk.red("Frozen Freebies is NOT running! ⛔\nHalting PINGR..."))
            exit(1)
        }
    });
    await sleep(4000)
    // restart frozen
    if (window.title == "Frozen Freebies") {
        return
    } else {
        winToSetOnTop = user32.FindWindowA(null, "Frozen Freebies");
        var setForegroundWindow = user32.SetForegroundWindow(winToSetOnTop)
        var setFocus = user32.SetFocus(winToSetOnTop)
        // other thing
        keyboard.type(Key.LeftSuper, Key.Up);
        await sleep(10000)
    }
    
}

monitor.getActiveWindow(callback);

// ping function
async function ping(asin, promo) {
    await sleep(8000)
    const notepad = Window.getByTitle("Frozen Freebies")
    // attempt to open window and close
    winToSetOnTop = user32.FindWindowA(null, "Frozen Freebies");
    var setForegroundWindow = user32.SetForegroundWindow(winToSetOnTop)
    var setFocus = user32.SetFocus(winToSetOnTop)
    // other thing
    keyboard.type(Key.LeftSuper, Key.Up);
    
    await sleep(2000)

    // print asin and promo
    var asin = arguments['0']
    var promo = arguments['1']
    // AFTER MONITOR
    
    console.log(chalk.blue("Starting Frozen Custom Ping Task..."))
    // do the thing
    keyboard.config.autoDelayMs = 1
    

    for (var i = 0; i < 6; i++) {
        keyboard.type(Key.Tab)
        await sleep(50)
    }

    // else
    // get to custom ping menu
    keyboard.type(Key.Enter)
    // get to
    // type asin
    for (var i = 0; i < asin.length; i++) {
        var asin_l = asin.charAt(i).toUpperCase();
        keyboard.type(Key[asin_l])
        await sleep(50)
    }
    // get to promo and type it
    keyboard.type(Key.Tab);
    keyboard.type(Key.Tab);
    for (var i = 0; i < promo.length; i++) {
        var asin_l = promo.charAt(i).toUpperCase();
        keyboard.type(Key[asin_l])
        await sleep(50)
    }
    // finish ping
    keyboard.type(Key.Tab);
    keyboard.type(Key.Enter);
    keyboard.type(Key.Escape);
    for (var i = 0; i < 8; i++) {
        keyboard.type(Key.Tab)
        await sleep(50)
    }
    console.log(chalk.bgGreen("Task Completed!"))
    return
}

// server
app.get('/', (req, res) => {
    res.render('form');
  });
  
  // Set up the form submission route
app.post('/', (req, res) => {
    const sku = req.body.sku;
    const promo = req.body.promo;
    console.log(chalk.yellow(`ASIN: ${sku} -- Promo: ${promo}`))
    ping(sku, promo)
    res.render('form');
});

const server = app.listen(port, () => {
  console.log(chalk.greenBright(`PINGR listening on port ${port} - Access your PINGR site:`));
});


// generatore localtunnel and qr code
(async () => {
    const tunnel = await localtunnel({ port: 3000 });
    console.log(chalk.green(`Link: ${tunnel.url} or the QR Code below:`))
    qrcode.generate(tunnel.url, {small: true}, function (qrcode) {
        console.log(qrcode)
    });
})();