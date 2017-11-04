gemini.suite('simple-test', (suite) => {
    suite.setUrl('/')
        .setCaptureElements('#root')
        .capture('plain');
});