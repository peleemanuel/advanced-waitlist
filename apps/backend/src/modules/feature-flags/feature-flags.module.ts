import { Module } from "@nestjs/common";
import { FeatureFlagsController } from "./feature-flags.controller";
import { FeatureFlagsService } from "./feature-flags.service";
import { UsersModule } from "../users/users.module";

@Module({
    imports: [UsersModule],
    controllers: [FeatureFlagsController],
    providers: [FeatureFlagsService],
    exports: [FeatureFlagsService],
})
export class FeatureFlagsModule { }