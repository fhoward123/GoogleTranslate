'use strict';

const chalk = require('chalk');

/* Option flags */
const debug = 0;
const defaultBrowser = 1;
const headless = 1;
const makeCaptures = 1;
const diffTheCaptures = 1;
const devtools = 0;

/* defaults */
const baseUrl = 'https://translate.google.com/';
const windowWidth = 1600;
const windowHeight = 940;
const parentDir = defaultBrowser ? 'chromium' : 'chrome';
const childDir = headless ? 'headless' : 'nonHeadless';

const launchOptions = {
    headless,
    timeout: debug ? 7000 : 5000,
    args: [
        '--no-sandbox', // Required for GitBash
        `--window-size=${windowWidth},${windowHeight}`,
    ],
    slowMo: debug ? 100 : 30,
    devtools,
};

if (!defaultBrowser) {
    launchOptions.executablePath = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';
    launchOptions.product = 'chrome';
}

module.exports = {
    debug,
    headless,
    takeScreenshots: makeCaptures && defaultBrowser && !devtools,
    diffScreenshots: diffTheCaptures && makeCaptures && defaultBrowser && !devtools,
    pageTitle: 'Google Translate',
    baseUrl,
    screenshotGoldenDir: `./test/integration/screenshots/${parentDir}/baseline/${childDir}`,
    screenshotCurrentDir: `./test/integration/screenshots/${parentDir}/current/${childDir}`,
    screenshotExtension: 'png',
    windowWidth,
    windowHeight,
    viewPortWidth: 1017,
    viewPortHeight: 900,
    launchOptions,
    errorStyle: chalk.bold.red,
    successStyle: chalk.bold.green,
    debugStyle: chalk.bold.yellow,
    alertStyle: chalk.black.bgYellowBright,
    contextStyle: chalk.hex('#59C1A5'),
    describeItStyle: chalk.hex('#59ABC1'),
    clickStyle: chalk.hex('#C19259'),
    beforeAfterStyle: chalk.bgGray,
    takePicStyle: chalk.hex('#E4591D'),
    funcStyle: chalk.white.bgBlue,
    timeStyle: chalk.hex('#E41DA5'),
    log: console.info,
    logGroup: console.group,
    logGroupEnd: console.groupEnd,
    timeStart: console.time,
    timeEnd: console.timeEnd,
    timeLog: console.timeLog,
};
