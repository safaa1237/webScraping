import { Injectable } from "@nestjs/common";
import {sendAsinToQueue , recieveTitle} from '../../queue/titleQueue'


@Injectable()
export class TitleService {

    getTitleFromQueue(ison){
        sendAsinToQueue(ison);
        let title = recieveTitle();
        return title;
    }
}