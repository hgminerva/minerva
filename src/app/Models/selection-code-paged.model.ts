import { PaginationModel } from './pagination.model';
import { SelectionCodeModel} from './selection-code.model';

export class SelectionCodePagedModel {
    selection_codes: SelectionCodeModel[];
    pagination: PaginationModel;
    page_datail: any;
}