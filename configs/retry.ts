import { RetryConfig } from "@/types/config";

export const badgeDataRetryConfig: RetryConfig = {
  count: Number(process.env.badge_data_request_retry_count),
  time: Number(process.env.badge_data_request_retry_time),
};

export const openbadgeVerifyRetryConfig: RetryConfig = {
  count: Number(process.env.oepnbadge_verify_api_request_retry_count),
  time: Number(process.env.oepnbadge_verify_api_request_retry_time),
};

export const resolveDIDRetryConfig: RetryConfig = {
  count: Number(process.env.resolve_did_request_retry_count),
  time: Number(process.env.resolve_did_request_retry_time),
};
