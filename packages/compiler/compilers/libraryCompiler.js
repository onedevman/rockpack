const deepExtend = require('deep-extend');
const { isString, isObject, isArray } = require('valid-types');
const frontendCompiler = require('./frontendCompiler');
const backendCompiler = require('./backendCompiler');
const getMode = require('../utils/getMode');
const errors = require('../errors/libraryCompiler');
const errorHandler = require('../errorHandler');

async function libraryCompiler(libraryOpts, conf, cb, configOnly = false) {
  if (!conf) {
    conf = {};
  }

  conf.__library = true;

  conf.write = true;

  errorHandler();
  let libraryName = false;

  if (isString(libraryOpts)) {
    libraryName = libraryOpts;
  } else if (isObject(libraryOpts) && isString(libraryOpts.name)) {
    if (isArray(libraryOpts.externals) && libraryOpts.externals.length > 0) {
      conf.externals = libraryOpts.externals;
    }

    libraryName = libraryOpts.name;
    if (isObject(libraryOpts.esm)) {
      deepExtend(conf, {
        esm: libraryOpts.esm
      });
    }
    if (isObject(libraryOpts.cjs)) {
      deepExtend(conf, {
        cjs: libraryOpts.cjs
      });
    }
  } else {
    console.error(errors.LIBRARY_OPTS_ERROR);
    console.error(errors.MUST_BE_STRING);
    return process.exit(1);
  }

  if (!isString(libraryName)) {
    console.error(errors.MUST_BE_STRING);
    return process.exit(1);
  }

  const mode = getMode();

  conf = deepExtend({}, conf, {
    library: libraryName
  }, {
    html: !conf.html ? false : conf.html
  });

  if (!conf.html) {
    if (mode === 'development') {
      conf.onlyWatch = true;
    }
  } else if (mode === 'development') {
    conf._liveReload = true;
  }

  conf.compilerName = libraryCompiler.name;

  if (conf.nodejs) {
    return await backendCompiler(conf, cb, configOnly);
  }
  return await frontendCompiler(conf, cb, configOnly);
}

module.exports = libraryCompiler;
