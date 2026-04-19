import { Injectable } from "@nestjs/common";
import { OpenFeature } from "@openfeature/server-sdk";
import { UserSegment } from "../shared/types/domain.types";

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

    async canAutoPromoteFromWaitlist(userId: number, segment: UserSegment): Promise<boolean> {
        return this.client.getBooleanValue(
            "advanced-waitlist-auto-promote",
            false,
            {
                targetingKey: String(userId),
                segment,
            },
        );
    }
}