module.exports = {
    rootUrl: 'http://127.0.0.1:3000',
    gridUrl: 'http://127.0.0.1:4444/wd/hub',
    calibrate: false,
 
    browsers: {
        chrome: {
            desiredCapabilities: {
                browserName: 'chrome'
            }
        }
    },

    system: {
        plugins: {
            'html-reporter': {
                enabled: true,
                path: 'gemini_reports',
                defaultView: 'all',
            }
        }
    },
};