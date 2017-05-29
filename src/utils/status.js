const status = {
  error: 0,
  queued: 1,
  success: 2
};

module.exports = {
  kv: status,
};

module.exports.vk = Object
  .keys(status)
  .reduce((out, label) => {
    out[status[label]] = label;
    return out;
  }, {})
;