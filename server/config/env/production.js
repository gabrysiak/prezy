'use strict';

module.exports = {
    db: 'mongodb://localhost/prezy-prod',
    app: {
        name: 'Prezy - Slidedeck - Production'
    },
    facebook: {
        clientID: '278162479023481',
        clientSecret: '3026f0bdd0087c0155c272d2265feffb',
        callbackURL: 'http://prezy.ycproduction1.com:3000/auth/facebook/callback'
    },
    twitter: {
        clientID: '3b3I3N9OMrDIkyRCKRmB2d7KZ',
        clientSecret: 'qKBB8ixliU5yvojuHJWL8fGvb8swsrIBnz0eMEiowzM1Lfnwxc',
        callbackURL: 'http://prezy.ycproduction1.com:3000/auth/twitter/callback'
    },
    github: {
        clientID: '95504c14c0262391c8be',
        clientSecret: 'fc94a83443097df6bb39da7d21333bd8acfbebbb',
        callbackURL: 'http://prezy.ycproduction1.com:3000/auth/github/callback'
    },
    google: {
        clientID: '608878902672-qhad8ehi6bop3o90ej4k1eb1i84qdd6h.apps.googleusercontent.com',
        clientSecret: 'WviP0bvzy-tRB4waFHrqNXKt',
        callbackURL: 'http://prezy.ycproduction1.com:3000/auth/google/callback'
    },
    linkedin: {
        clientID: '77y8prz18flzno',
        clientSecret: 'bdAyB3Mx7wyU3zOz',
        callbackURL: 'http://prezy.ycproduction1.com:3000/auth/linkedin/callback'
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