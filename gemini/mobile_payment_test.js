gemini.suite('mobile-payment-form-test', (suite) => {
	suite.setUrl('/workspace')
		.setCaptureElements('[data-test-id="mobile-payment-contract-form"]')
		.capture('plain')
		.capture('with_sum', (actions, find) => {
			actions.sendKeys(
				find('[data-test-id="mobile-payment-contract-input"]'),
				[gemini.BACK_SPACE, gemini.NUMPAD1, gemini.NUMPAD0, gemini.NUMPAD0]);
		});
});

gemini.suite('mabile-payment-transaction-test', (suite) => {
	suite.setUrl('/workspace')
		.setCaptureElements('[data-test-id="history-content"]')
		.ignoreElements({every: '[data-test-id="history-item-time"]'})
		.capture('plain')
		.capture('operation_done', (actions, find) => {
			actions.sendKeys(
				find('[data-test-id="mobile-payment-contract-input"]'),
				[gemini.BACK_SPACE, gemini.NUMPAD1, gemini.NUMPAD0, gemini.NUMPAD0]);
			actions.click('[data-test-id="mobile-payment-contract-form"] button').wait(500);
		});
});
