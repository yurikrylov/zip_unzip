import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {AuthDto} from "./dto/auth.dto";
import {path as appRoot} from "app-root-path";
import {ensureDir} from "fs-extra";
import path = require('path');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const folder = path.join(appRoot, 'upload');
ensureDir(folder);
const file = path.join(folder, 'db.json');
const adapter = new FileSync(file);
const db = low(adapter);
db.defaults({ users: [{username: 'username', password: 'password'}] }).write();

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async login(authBody: AuthDto) {
    const user = db.get('users').find({username: authBody.username}).value();
    if (user && user.password === authBody.password) {
      return this.generateToken(authBody.username, authBody.password)
    }
    return new UnauthorizedException({message: 'Неверные данные для входа'});
  }

  async generateToken(username: string, password: string) {
    const payload = {username: username, password: password};
    return {
      token: this.jwtService.sign(payload)
    }
  }
}
