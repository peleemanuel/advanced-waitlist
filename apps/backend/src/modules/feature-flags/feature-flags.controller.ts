import { Controller, Get, ParseIntPipe, Query } from "@nestjs/common";
import { FeatureFlagsService } from "./feature-flags.service";
import { UsersService } from "../users/users.service";

@Controller("feature-flags")
export class FeatureFlagsController {
    constructor(
        private readonly featureFlagsService: FeatureFlagsService,
        private readonly usersService: UsersService,
    ) { }

    @Get("advanced-waitlist-ui")
    async getAdvancedWaitlistUiFlag(
        @Query("userId", ParseIntPipe) userId: number,
    ) {
        const user = this.usersService.findCertainUser(userId);

        const enabled = await this.featureFlagsService.canSeeAdvancedWaitlist(user);

        return {
            flag: "advanced-waitlist-ui",
            enabled,
        };
    }
}