import {BadRequestException, Injectable, StreamableFile} from '@nestjs/common';
import { path as appRoot } from 'app-root-path';
import path = require('path');
import { ensureDir, writeFile } from 'fs-extra';
import { FileResponse } from './dto/file-response';
import { createReadStream, existsSync} from 'fs';
import { v4 } from 'uuid';

const Iconv = require('iconv').Iconv;
const AdmZip = require('adm-zip');
const autoenc = require('node-autodetect-utf8-cp1251-cp866');
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
// структура мапа файлов
type FileMap = {
    Id: string,
    FileName: string
}
// Структура "базы данных"
type Data = {
    files: FileMap[]
}

const folder = path.join(appRoot, 'upload');
ensureDir(folder); // TODO: настроить ts чтобы можно было использовать await в корне
const file = path.join(folder, 'db.json');
const adapter = new FileSync(file);
const db = low(adapter);
db.defaults({ files: [] }).write()
@Injectable()
export class FileService {
    async uploadZipFile(file: Express.Multer.File) {
        await db.read();
        db.data ||= { files: [] };
        const res: FileResponse[] = [];
        let filenc: string = autoenc.detectEncoding(file.originalname).encoding.toUpperCase()
        filenc = filenc= "CP1251" ? "windows-1251": filenc
        let iconv = new Iconv(filenc, 'UTF-8');

        let zipId = v4();
        let zipName = iconv.convert( file.originalname).toString();
        // db.data.files.push({Id: zipId, FileName: zipName});
        db.get('files').push({Id: zipId, FileName: zipName}).write();

        const fullName = path.join(folder, zipId);
        await writeFile(fullName, file.buffer);
        let zip = new AdmZip(fullName);
        let zipEntries = zip.getEntries();
        zipEntries.forEach(zipEntry => {
            if (zipEntry.isDirectory) return;
            let enc: String = autoenc.detectEncoding(zipEntry.rawEntryName).encoding.toUpperCase()
            let iconv = new Iconv(enc, 'UTF-8');
            zipEntry.entryName = iconv.convert(zipEntry.rawEntryName).toString();
            let entryId = v4();
            res.push({ url: encodeURI(
                    (process.env.EXTERNAL_IP ? process.env.EXTERNAL_IP + '/api/download/' :
                        'https://webtools.case.one/api/download/')
                        .concat("?fileId=", entryId)), name: zipEntry.name });
            // db.data.files.push({Id: entryId, FileName: zipEntry.name});
            db.get('files').push({Id: entryId, FileName: zipEntry.name}).write();
            zipEntry.entryName = entryId;
            // zip.extractEntryTo(zipEntry.entryName, folder, false, true); // Entry doesn't exist
        })
        await zip.extractAllTo(folder); // TODO: папки тоже распаковываются, нужно распаковывать только файлы
        return res;
    }

    async downloadUnzipedFiles(fileId) {
        let normilizedFileName = fileId.split("/");
        normilizedFileName = path.join(...normilizedFileName);
        const filepath = decodeURI(path.join(appRoot, 'upload', normilizedFileName));
        if (!existsSync(filepath)) {
            throw new BadRequestException('Файл не найден')
        }
        const file = createReadStream(filepath);
        // const fileName = db.data.files.find(file => file.Id == fileId).FileName;
        const fileName = db.get('files').find({Id: fileId}).value().FileName;
        return {file: new StreamableFile(file), fileName: fileName};
    }
}
