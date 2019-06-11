const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PrivilegeSchema = new Schema({
  code: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true
  },
  subordinate: {
    type: String,
    default: 'all'
  },
  parent: {
    type: String
  }
})

module.exports = Privilege = mongoose.model("privilege", PrivilegeSchema)