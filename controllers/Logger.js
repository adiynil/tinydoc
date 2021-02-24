const Log = require("../models/Log");

const Logger = function (...args) {
  let Category, IpAddress, UserAgent, OriginData, TargetData, GenerateBy;

  operate: () => {
    Category = "operate";
  };
  system: () => {
    Category = "system";
  };
  error: () => {
    Category = "exception";
  };
  document: () => {
    Category = "document";
  };
};

module.exports = Logger;
