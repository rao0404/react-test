const path = require("path");

const getProjectRootPath = () => {
    return path.resolve(__dirname, '../')
}

module.exports.COMMON_DIR_PATH = '/common'

module.exports.PROJECT_ROOT = getProjectRootPath()

module.exports.ENV_MODE = {
    DEVELOPMENT: 'development',
    PRODUCTION: 'production'
}

module.exports.CONTENT_ID = {
    'sample1': [
        'child1'
    ],
    'sample2': [
        'child1/child1_1'
    ]
}
