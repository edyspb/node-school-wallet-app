gemini.suite('sberbank-card', (suite) => {
	suite.setUrl('/workspace')
		.setCaptureElements('[data-test-id="card-1"]')
		.capture('inactive', (actions, find) => {
			actions.click(find('[data-test-id="card-2"]'));
		})
		.capture('slected', (actions, find) => {
			actions.click(find('[data-test-id="card-1"]'));
		});
});

gemini.suite('alfabank-card', (suite) => {
	suite.setUrl('/workspace')
		.setCaptureElements('[data-test-id="card-2"]')
		.capture('inactive')
		.capture('slected', (actions, find) => {
			actions.click(find('[data-test-id="card-2"]'));
		});
});

gemini.suite('otkritie-card', (suite) => {
	suite.setUrl('/workspace')
		.setCaptureElements('[data-test-id="card-3"]')
		.capture('inactive')
		.capture('slected', (actions, find) => {
			actions.click(find('[data-test-id="card-3"]'));
		});
});

gemini.suite('rosbank-card', (suite) => {
	suite.setUrl('/workspace')
		.setCaptureElements('[data-test-id="card-4"]')
		.capture('inactive')
		.capture('slected', (actions, find) => {
			actions.click(find('[data-test-id="card-4"]'));
		});
});

gemini.suite('tinkoff-card', (suite) => {
	suite.setUrl('/workspace')
		.setCaptureElements('[data-test-id="card-5"]')
		.capture('inactive')
		.capture('slected', (actions, find) => {
			actions.click(find('[data-test-id="card-5"]'));
		});
});

gemini.suite('vtb-card', (suite) => {
	suite.setUrl('/workspace')
		.setCaptureElements('[data-test-id="card-6"]')
		.capture('inactive')
		.capture('slected', (actions, find) => {
			actions.click(find('[data-test-id="card-6"]'));
		});
});

gemini.suite('new-card-field', (suite) => {
	suite.setUrl('/workspace')
		.setCaptureElements('[data-test-id="card-0"]')
		.capture('inactive')
		.capture('slected', (actions, find) => {
			actions.click(find('[data-test-id="card-0"]'));
		})
		.capture('wrong_data', (actions, find) => {
			actions.click(find('[data-test-id="card-0"] form button'));
		});
});
