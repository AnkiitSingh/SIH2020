var mongoose = require("mongoose");

const DepartmentSchema = new mongoose.Schema(
    {
        deptId: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: Number,
            default: 3
        }
    }
);

module.exports = mongoose.model("Department", DepartmentSchema);
