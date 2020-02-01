module.exports = {
    getDotEnvFilePath() {
        switch (process.env.NODE_ENV) {
            case "dev": {
                return ".env.dev";
            }
            case "prod":
            default: {
                return ".env.prod";
            }
        }
    }
}