'use strict';

module.exports = {
    db: 'mongodb://localhost/prezy-prod',
    app: {
        name: 'Prezy - Slidedeck - Production'
    },
    facebook: {
        clientID: 'APP_ID',
        clientSecret: 'APP_SECRET',
        callbackURL: 'http://localhost:3000/auth/facebook/callback'
    },
    twitter: {
        clientID: 'CONSUMER_KEY',
        clientSecret: 'CONSUMER_SECRET',
        callbackURL: 'http://localhost:3000/auth/twitter/callback'
    },
    github: {
        clientID: 'APP_ID',
        clientSecret: 'APP_SECRET',
        callbackURL: 'http://localhost:3000/auth/github/callback'
    },
    google: {
        clientID: 'APP_ID',
        clientSecret: 'APP_SECRET',
        callbackURL: 'http://localhost:3000/auth/google/callback'
    },
    linkedin: {
        clientID: 'API_KEY',
        clientSecret: 'SECRET_KEY',
        callbackURL: 'http://localhost:3000/auth/linkedin/callback'
    },
    bitly: {
        clientID: '619c97ab4631086c4536cb59312aea3b90510e83',
        clientSecret: 'fa5b5e98d8420c0dd9cfa38a74f17da3877a7ed3',
        accessToken: '8e1cfa5f6292850d472a4e6c0c4793681efaf08d',
        username: 'tom.gabrysiak@yorkandchapel.com',
        password: 'viper111',
        callbackURL: 'http://prezy.ycproduction1.com:3000/bitly/callback'
    }
};
