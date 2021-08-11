import { PaginationModel } from './pagination.model';
import { ProviderOfficeModel} from './provider-office.model';

export class ProviderOfficePagedModel {
    provider_offices: ProviderOfficeModel[];
    pagination: PaginationModel;
    page_datail: any;
}