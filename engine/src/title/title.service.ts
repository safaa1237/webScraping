import { Injectable } from "@nestjs/common";
import {sendAsinToQueue , recieveTitle} from '../../queue/titleQueue'


@Injectable()
export class TitleService {

    getTitleFromQueue(asin){
        sendAsinToQueue(asin);
        let title = recieveTitle();
        return title;
    }
}