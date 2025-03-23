import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
   async onModuleInit() {
        await this.$connect()
        this.$use(async (params, next) => {
            if (params.model === 'Bin' && params.action === 'update') {
              const updatedData = params.args.data;
      
              // Check if currentFillLevel is being updated
              if (updatedData.currentFillLevel !== undefined) {
                const binId = params.args.where.id;
      
                // Fetch the current state of the bin
                const bin = await this.bin.findUnique({
                  where: { id: binId },
                });
      
                // If currentFillLevel reaches 100, set status to "full"
                if (updatedData.currentFillLevel === 100) {
                  params.args.data.status = 'FULL';
                }
                if (updatedData.currentFillLevel === 0) {
                    params.args.data.status = 'EMPTY';
                  }
              }
            }
      
            // Proceed with the original operation
            return next(params);
          });
    }
}
