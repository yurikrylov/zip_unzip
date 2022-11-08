const appRoot =  require("app-root-path").path;
const path = require('path');
const ensureDir = require("fs-extra").ensureDir;
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const fs = require('fs');


function getArgs(defaultValues) {
    const args = defaultValues;
    process.argv
        .slice(2, process.argv.length)
        .forEach(arg => {
            // long arg
            if (arg.slice(0, 2) === '--') {
                const longArg = arg.split('=');
                const longArgFlag = longArg[0].slice(2, longArg[0].length);
                const longArgValue = longArg.length > 1 ? longArg[1] : true;
                args[longArgFlag] = longArgValue;
            }
            // flags
            else if (arg[0] === '-') {
                const flags = arg.slice(1, arg.length).split('');
                flags.forEach(flag => {
                    args[flag] = true;
                });
            }
        });
    return args;
}

const args = getArgs({f: path.join(appRoot, 'upload'), db: 'db.json', d: '1440'});
const folder = args.f;
const dbFilename = args.db;
const diffTime = Number(args.d) * 1000 * 60; // мин разница между временем создания файла
// и текущем временем для удаления в мс
if (!fs.existsSync(folder)) throw 'Папка не найдена';
ensureDir(folder);
const file = path.join(folder, 'db.json');
const adapter = new FileSync(file);
const db = low(adapter);
fs.readdirSync(folder).forEach(filename => {
    if (filename === dbFilename) return;
    let fullPath = path.join(folder, filename);
    fs.stat(fullPath, (err, stats) => {
        if (stats.birthtime < (new Date().getTime() - diffTime)) {
            db.get('files').remove({ Id: filename }).write();
            fs.rm(fullPath, {recursive: true, force: true}, (error) => {
            });
        }
    })
});
