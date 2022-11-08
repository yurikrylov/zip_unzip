import {BadRequestException, Injectable} from '@nestjs/common';
import axios, {Method} from 'axios';
import {AuthBody} from "./dto/dto";


@Injectable()
export class AppService {

    async fetchApi(c1URL, method: Method, url: string, body: object | null = null, options: { headers?: object, paged?: boolean } = {}) {
        async function run(u: string) {
            let res;
            let rBody;
            try {
                res = await axios.request({
                    url: c1URL + u,
                    method: method,
                    headers: Object.assign({"Content-Type": "application/json"}, options.headers || {}),
                    data: body && JSON.stringify(body)
                });
            } catch (e) {
                res = {...e};
            }
            rBody = res.data
            if (res.status >= 200 && res.status < 300) {
                return rBody;
            }
            // throw res.response.status + ' - ' + (res.response.statusText || rBody);
            throw rBody;
        }

        if (options.paged) {
            let Page = 1, res = [];
            do {
                let data = await run(url + '?Page=' + (Page++) + '&PageSize=100');
                if (!data || !data.Items || !data.Items.length) break;
                res = [...res, ...data.Items];
            } while (1);
            return res;
        }
        return await run(url);
    }

    async c1Auth(body: AuthBody) {
        let res;
        try {
            res = await this.fetchApi(body.c1URL, 'POST', '/api/v2/auth/token', {
                grant_type: "password",
                username: body.username,
                password: body.password
            });
        } catch (e) {
            throw new BadRequestException('Неверные данные для авторизации');
        }
        return {token: res.access_token};
    }

}
