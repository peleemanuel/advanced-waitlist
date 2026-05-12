import { Injectable } from "@nestjs/common";
import { OpenFeature } from "@openfeature/server-sdk";
import { User } from "../shared/types/domain.types";

@Injectable()
export class FeatureFlagsService {
    private client = OpenFeature.getClient();

    private buildUserFlagContext(user: User) {
        const emailDomain = user.email.split("@")[1]?.toLowerCase() ?? "";

        return {
            targetingKey: String(user.id),
            segment: user.segment,
            emailDomain,
        };
    }

    async canSeeAdvancedWaitlist(user: User): Promise<boolean> {
        return this.client.getBooleanValue(
            "advanced-waitlist-ui",
            false,
            this.buildUserFlagContext(user),
        );
    }

    async canAutoPromoteFromWaitlist(user: User): Promise<boolean> {
        return this.client.getBooleanValue(
            "advanced-waitlist-auto-promote",
            false,
            this.buildUserFlagContext(user),
        );
    }
}