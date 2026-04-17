import { Injectable } from "@nestjs/common";
import { OpenFeature } from "@openfeature/server-sdk";

@Injectable()
export class FeatureFlagsService {
    private client = OpenFeature.getClient();

    async canSeeAdvancedWaitlist(userId: number, segment: string): Promise<boolean> {
        return this.client.getBooleanValue(
            "advanced-waitlist-ui",
            false,
            {
                targetingKey: String(userId),
                segment,
            },
        );
    }
}