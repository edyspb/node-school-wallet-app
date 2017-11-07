gemini.suite('withdraw-test', (suite) => {
	suite.setUrl('/workspace')
		.setCaptureElements('[data-test-id="withdraw-form"]')
		.capture('plain')
		.capture('with_sum', (actions, find) => {
			actions.sendKeys(
				find('[data-test-id="withdraw-input"]'),
				[gemini.BACK_SPACE, gemini.NUMPAD1, gemini.NUMPAD0, gemini.NUMPAD0]);
		});
});

gemini.suite('withdraw-transaction-test', (suite) => {
	suite.setUrl('/workspace')
		.setCaptureElements('[data-test-id="history-content"]')
		.ignoreElements({every: '[data-test-id="history-item-time"]'})
		.capture('plain')
		.capture('operation_done', (actions, find) => {
			actions.sendKeys(
				find('[data-test-id="withdraw-input"]'),
				[gemini.BACK_SPACE, gemini.NUMPAD1, gemini.NUMPAD0, gemini.NUMPAD0]);
			actions.click('[data-test-id="withdraw-form"] button').wait(500);
		});
});
