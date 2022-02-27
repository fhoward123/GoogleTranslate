'use strict';

const { expect } = require('chai');
const data = require('../integration/data/translateData.json');

const {
    captureScreenshot,
    checkForErrors,
    clickButton,
    closePage,
    closeBrowser,
    compareScreenshots,
    elementFound,
    enterInputText,
    getElementText,
    launchBrowser,
    setupEventHandlers,
    openPage,
    verifyPageTitle,
    verifyPageUrl,
    testTranslation,
    typeOnKeyboard,
} = require('../integration/helpers/translateHelpers');

const {
    clearInputTextBtn,
    closeKeyboardBtn,
    emptyInputTextField,
    inputText,
    inputToolBtn,
    keyboardClosed,
    keyboardInUse,
    outputText,
    screenKeyboard,
    selectSourceLangBtn,
    selectTargetLangBtn,
    sourceLangInput,
    sourceLangText,
    sourceTextInput,
    sourceTextSwapped,
    swapLangBtn,
    targetLangInput,
    targetLangText,
    targetTextSwapped,
    translatedText,
    translateTextBtn,
} = require('../integration/selectors/translateSelectors');

const {
    debug,
    contextStyle,
    describeItStyle,
    beforeAfterStyle,
    debugStyle,
    timeStyle,
    baseUrl,
    pageTitle,
    timeStart,
    timeEnd,
    log,
    logGroup,
    logGroupEnd,
} = require('../integration/config/puppeteerConfig');

context(contextStyle('***** Test Suite for "Google Translate web page" *****\n'), async function() {
    let browser = '';
    let page = '';

    before(async function() {
        if (debug) {
            timeStart(timeStyle('translate.google'));
            log(debugStyle('\n            ***** Running in DEBUG mode *****'));
            logGroup(beforeAfterStyle('\n⚡before():'));
        }
        browser = await launchBrowser();
        page = await openPage(browser);
        await setupEventHandlers(page);
        await page.setCacheEnabled(false);
        await page.goto(baseUrl);
        await verifyPageUrl(page, baseUrl);
        await verifyPageTitle(page, pageTitle);

        if (await elementFound(page, clearInputTextBtn)) {
            await clickButton(page, clearInputTextBtn, 'Clear source text');
            await page.reload({waitUntil: 'networkidle2'});
            text = await getElementText(page, emptyInputTextField);
            expect(text).to.be.equal('');
        }

        if (debug) {
            log(beforeAfterStyle('before() completed'));
            logGroupEnd(beforeAfterStyle('\n⚡before():'));
        }
    });

    after(async function () {
        if (debug) logGroup(beforeAfterStyle('\n⚡after():'));
        await closePage(page);
        await closeBrowser(browser);
        checkForErrors();
        if (debug) {
            log(beforeAfterStyle('after() completed\n'));
            logGroupEnd(beforeAfterStyle('\n⚡after():'));
            timeEnd(timeStyle('translate.google'));
        }
    });

    describe(describeItStyle('\n▶ Using Google Translate application'), async function() {
        let text = '';

        it(describeItStyle('should select correct source language'), async function() {
            await clickButton(page, translateTextBtn, 'Text');
            await clickButton(page, selectSourceLangBtn, 'Source Language Dropdown');
            await enterInputText(page, sourceLangInput, data.languages.source.lang);
            text = await getElementText(page, sourceLangText);
            expect(text).to.equal(data.languages.source.lang);
        });

        it(describeItStyle('should select correct target language'), async function() {
            await clickButton(page, selectTargetLangBtn, 'Target Language Dropdown');
            await enterInputText(page, targetLangInput, data.languages.target.lang);
            text = await getElementText(page, targetLangText);
            expect(text).to.equal(data.languages.target.lang);
        });

        it(describeItStyle('should correctly translate word list before/after swap'), async function() {
            // Loop through word list checking for correct or known incorrect translation
            let moreTestWords = data.text.length;
            for (const element of data.text) {
                moreTestWords -= 1;
                await enterInputText(page, sourceTextInput, element.initial);
                text = await getElementText(page, translatedText);
                testTranslation(element.expectTranslationToPass, element.expected, text);

                await clickButton(page, swapLangBtn, 'Swap Languages');
                await page.waitForXPath(targetTextSwapped);

                // Verify previous target translation is now in Source text location
                text = await getElementText(page, sourceTextSwapped);
                testTranslation(element.expectTranslationToPass, element.expected, text);

                // Verify new source word (old target) translates to original source word
                text = await getElementText(page, targetTextSwapped);
                testTranslation(element.expectSwapTranslationToPass, element.initial, text);

                // Set languages back to original selection to test more words
                if (moreTestWords) await clickButton(page, swapLangBtn, 'Swap Languages');
                // Clear source input text field
                await clickButton(page, clearInputTextBtn, 'Clear source text');
                await page.reload({ waitUntil: 'networkidle2' });

                // Verify translation input was cleared using image comparison
                if (moreTestWords) {
                    const filename = await captureScreenshot(page, 'default');
                    await compareScreenshots(filename, 2, 40);
                }
            } // for
        });

        it(describeItStyle('should open virtual keyboard'), async function() {
            await clickButton(page, inputToolBtn, 'Select Input Tool');
            await clickButton(page, screenKeyboard, data.keyboard.type);
            await page.waitForXPath(keyboardInUse);
        });

        it(describeItStyle('should correctly translate text typed on virtual keyboard'), async function() {
            const inputTextData = data.keyboard.input.split('');
            await typeOnKeyboard(page, inputTextData);
            text = await getElementText(page, inputText);
            expect(text).to.equal(data.keyboard.input);
            // Verify target text has correct translation
            await page.waitForXPath(outputText);
        });

        it(describeItStyle('should close virtual keyboard'), async function() {
            // Close virtual keyboard and verify it is gone
            await clickButton(page, closeKeyboardBtn, 'Close keyboard');
            await page.waitForXPath(keyboardClosed);
        }); // it
    }); // describe
}); // context
