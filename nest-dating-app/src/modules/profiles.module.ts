import { Module } from '@nestjs/common';
import { ProfilesController } from '../controllers/profiles.controller';
import { ProfilesService } from '../services/profiles.service';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  imports: [SupabaseModule],
  controllers: [ProfilesController],
  providers: [ProfilesService],
})
export class ProfilesModule {}

