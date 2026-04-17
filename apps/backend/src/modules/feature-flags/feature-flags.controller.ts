import { Controller, Get, ParseIntPipe, Query } from "@nestjs/common";
import { FeatureFlagsService } from "./feature-flags.service";

@Controller("feature-flags")
export class FeatureFlagsController {
    constructor(
        private readonly featureFlagsService: FeatureFlagsService,
    ) { }

    @Get("advanced-waitlist-ui")
    async getAdvancedWaitlistUiFlag(
        @Query("userId", ParseIntPipe) userId: number,
        @Query("segment") segment: string,
    ) {
        const enabled = await this.featureFlagsService.canSeeAdvancedWaitlist(
            userId,
            segment,
        );

        return {
            flag: "advanced-waitlist-ui",
            enabled,
        };
    }
}