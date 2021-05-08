import { Injectable } from "@nestjs/common";
import {snedIsonToQueue , recieveTitle} from '../../queue/titleQueue'


@Injectable()
export class TitleService {

    getTitleFromQueue(ison){
        snedIsonToQueue(ison);
        let title = recieveTitle();
        return title;
    }
}