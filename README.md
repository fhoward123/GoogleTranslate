# GoogleTranslate
## Test Automation take-home challenge for *Nuna Inc.*

1. Based on Page Object Model, create automated test for the scenario: Using [Google Translate application](https://translate.google.com/)
   - select source language from the drop-down menu on the left
   - select translation language from the drop-down menu on the right
   - enter the initial text in the input field on the left
   - make sure that the actual translation result in the right field is correct

   > Source, Translation languages, initial text and expected result should be taken from a separate data file (.json, .yaml, or .xlsx), for example (but not necessarily the exact word!):
   - source language: German
   - translation language: Spanish
   - initial text: "Demokratien"
   - expected result: "Democracias"

2. Add scenario: click swap languages button and verify the result.
3. Add scenario: clear the input field, click "select input tool" button, select "screen keyboard" and enter "Hi!"
4. Share the link of your framework repository on GitHub with us. It should be public.
5. Make sure you follow each step precisely. Works in which at least one step is omitted are not subject to consideration.

## Issues
   - Only one word set was given to test with.  That's not much of a test.  I received clarification that it was not mandatory to use the words included in the instructions.  I inquired further what I was to use for the source of truth for the correct translations of other words.  I was then instructed to use the words in the instructions!  I went ahead and added some additional words and scenarios to better exercise the web application.
   - Item #3 states "screen keyboard" should be selected.  However, there is not option that states that so I initially used "US International" from the drop-down list.  Then I received clarification that "Spanish" should be used.
   - Going back-and-forth getting clarification on issues delayed coding.
   - The website was clearly not designed for testing since most "classes" and other attributes were dynamically assigned non-sensical names, and there was very little use of "id" attributes, some of which were dynamically assigned as well.

## Test Framework
   - NodeJS
   - JavaScript
   - Puppeteer
   - Mocha
   - Chai
   - mochawesome
   - pixelmatch
   - pngjs
   - chalk

## Features
*Styled color console output for debugging*
- Used the "chalk" npm package to provide color to console output used for debugging and to uniquely color "context", "describe", and "it" output.

*Image capture and comparison*
- Used the "pixelmatch" and "pngjs" npm packages to capture and compare screenshots.

*Config file containing flags to control test execution features*
- *puppeteerConfig.js*
   ```
    const  debug = 0;           // Run with verbose output to console (not default)
    const  defaultBrowser = 1;  // Run with Puppeteer's built-in Chromium browser (default)
    const  headless = 1;        // Run headless browser (default)
    const  makeCaptures = 1;    // Enable screen captures (default)
    const  diffTheCaptures = 1; // Enable comparison of screen captures and baseline image (default)
    const  devtools = 0;        // Launch browser with "DevTools" enabled (not default)
   ```

*Dynamically assigned selectors and configurable expected results*
- *translateData.json*
    - Used data from this test data file to dynamically assign selectors based on languages defined in it.
    - Because there was no ***source of truth*** for additional test words and expected translation results, especially for translation results after swapped languages, I added attributes to the config file to indicate the expected results.  That is, the application cannot be relied upon to translate the same in both directions, so to allow for full testing when a translation is known to not be consistent when swapped, the source of truth can be defined in the data file.

*Capture and display page errors not affecting test*
- Setup event handlers and capture page errors for output at end of test run.

## Execution
- From a "Git Bash" terminal
--     ```FORCE_COLOR=YES npm run translate```
- From a "Visual Studio Code" terminal
--     ```npm run translate```

## Output
```
	  ***** Test Suite for "Google Translate web page" *****

▶ Using Google Translate application
      √ should select correct source language (1628ms)
      √ should select correct target language (1568ms)
      √ should correctly translate word list before/after swap (20522ms)
      √ should open virtual keyboard (641ms)
      √ should correctly translate text typed on virtual keyboard (1718ms)
      √ should close virtual keyboard (359ms)

  6 passing (33s)
```
