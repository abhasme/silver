
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { CronHelper } from 'src/common/utils/helper.service';

@Injectable()
export class CronService {
  constructor(private readonly cronHelper: CronHelper) {}

  // @Cron("*/2 * 2 * *") 
  // // @Cron("* * 2 * *") 
  // async cronJobbefore() {
  //   try {


  //   } catch (error) {
  //     console.error('Error in the cron job:', error);
  //   }
  // };

  @Cron("* * 1 * *") 
  async cronJobafter(){
    try {
      console.log('Cron job executed cronJobAfter ! ');
      await this.cronHelper.updateGrowthFactor(); 
      await this.cronHelper.updateValueInRoInventory();
    

      
    } catch (error) {
      console.error('Error in the cron job:', error);
    }
  };

@Cron("* * * * *")   
// @Cron('0 0 */3 * * *')

  async cronJob2() {
    try {
     

      // await this.cronHelper.updateGrowthFactor();
      // await this.cronHelper.updateROInventoryFix();
      
      // await this.cronHelper.updateROInventoryFix();
      
    } catch (error) {
      // console.error('Error in the cron job:', error);
    }
  };



};

