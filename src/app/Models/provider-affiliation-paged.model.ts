import { PaginationModel } from './pagination.model';
import { ProviderAffiliationModel} from './provider-affiliation.model';

export class ProviderAffiliationPagedModel {
    provider_affiliations: ProviderAffiliationModel[];
    pagination: PaginationModel;
    page_datail: any;
}