'use strict'

var chai = require('chai');
const bn = web3.utils.BN;
const chaiBn = require('chai-bn')(bn);
chai.use(chaiBn);

const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

module.exports = chai;