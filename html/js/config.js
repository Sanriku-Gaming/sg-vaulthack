let debug = false; /* used for testing and console logs, updated via config.lua */

const config = {
    easy: {
        targets: 2,
        speed: 1,
        minSize: 26,
        maxSize: 34,
        totalTime: 30,
        lossTime: 1
    },
    medium: {
        targets: 3,
        speed: 2,
        minSize: 22,
        maxSize: 30,
        totalTime: 28,
        lossTime: 1.5
    },
    hard: {
        targets: 4,
        speed: 3,
        minSize: 18,
        maxSize: 26,
        totalTime: 25,
        lossTime: 2
    },
    ultra: {
        targets: 5,
        speed: 4,
        minSize: 14,
        maxSize: 22,
        totalTime: 22,
        lossTime: 2.5
    },
    testing: {
        targets: 10,
        speed: 1,
        minSize: 15,
        maxSize: 55,
        totalTime: 45,
        lossTime: 1
    },
    locale: {
        analyzingEncryption: "Analyzing Encryption...",
        loadingHack: "Loading Hack...",
        timeRemaining: "Time Remaining: ",
        seconds: "seconds",
        successfullyDecrypted: "Successfully Decrypted!",
        decryptionFailed: "Decryption Failed!"
    }
};