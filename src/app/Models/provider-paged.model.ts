import { PaginationModel } from './pagination.model';
import { ProviderModel} from './provider.model';

export class ProviderPagedModel {
    providers: ProviderModel[];
    pagination: PaginationModel;
    page_datail: any;
}