import { CronHelper } from 'src/common/utils/helper.service';
export declare class CronService {
    private readonly cronHelper;
    constructor(cronHelper: CronHelper);
    cronJobafter(): Promise<void>;
    cronJob2(): Promise<void>;
}
