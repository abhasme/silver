import { Injectable } from '@nestjs/common';
// import * as heapdump from 'heapdump';
import { join } from 'path';

@Injectable()
export class HeapdumpService {
  generateHeapdump() {
    // const filename = join(__dirname, '..', 'heapdump_' + Date.now() + '.heapsnapshot');
    // heapdump.writeSnapshot(filename, (err) => {
    //   if (err) {
    //     console.error('Heapdump failed:', err);
    //   } else {
    //     console.log('Heapdump written to ' + filename);
    //   }
    // });
  }
}
    