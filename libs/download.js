// require modules
const fs = require("fs");
const path = require("path");
const archiver = require("archiver");

module.exports = (req, res, next) => {
    const output = fs.createWriteStream(path.join(__dirname, "example.zip"));
    const archive = archiver("zip", {
        zlib: { level: 9 },
    });

    output.on("close", function() {
        console.log(archive.pointer() + " total bytes");
        console.log(
            "archiver has been finalized and the output file descriptor has closed."
        );
        res.download(path.join(__dirname, "example.zip"));
    });
    output.on("end", function() {
        console.log("end");
    });

    archive.on("warning", function(err) {
        if (err.code === "ENOENT") {
            console.log("warning");
        } else {
            console.log("warning error");
            throw err;
        }
    });

    archive.on("error", function(err) {
        console.log("on error");
        throw err;
    });

    archive.pipe(output);

    const file1 = __dirname + "/crypto.js";
    archive.append(fs.createReadStream(file1), { name: "file1.js" });

    archive.append("string cheese!", { name: "file2.txt" });

    if (req.query.id) archive.append(req.query.id, { name: "req.query.md" });

    const buffer3 = Buffer.from("buff it!");
    archive.append(buffer3, { name: "file3.txt" });

    archive.finalize();
};