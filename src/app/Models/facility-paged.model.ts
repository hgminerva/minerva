import { PaginationModel } from './pagination.model';
import { FacilityModel} from './facility.model';

export class FacilityPagedModel {
    facilities: FacilityModel[];
    pagination: PaginationModel;
    page_datail: any;
}