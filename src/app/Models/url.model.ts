import { UrlQueryModel} from './url-query.model';
import { UrlHeaderModel} from './url-header.model';

export class UrlModel {
    type: string;
    url: string;
    queries: UrlQueryModel[];
    headers: UrlHeaderModel[];
    auth_type: string;
    auth_value: string;
    body: string;
}