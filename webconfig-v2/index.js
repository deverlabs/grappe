/* @flow */

global.__CLIENT__ = false;
global.__SERVER__ = true;
global.__DEV__ = process.env.NODE_ENV === 'development';

if (__DEV__){
  require('@babel/register');
  require('./tools/webpack/hooks')();
  require('./src/server');
}
else {
  require('./dist/server');
}

