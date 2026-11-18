import axios from "axios";

import { loggerInfo } from "@/lib/logger";

/**
 * Open Badge 検証サービス（openbadges-validator-core）での検証結果。
 * - valid: 検証に成功した
 * - invalid: バッジ自体が不正（検証NG、許可されていない取得先、検証サービスの 4xx など）。再試行しても結果は変わらない
 * - unavailable: 検証サービスや発行元に接続できないなど、一時的な理由で検証できなかった
 */
export type OpenBadgeVerifyResult =
  | { status: "valid" }
  | { status: "invalid"; reason: string }
  | { status: "unavailable"; reason: string };

type VerifierMessage = { name?: string; messageLevel?: string; result?: unknown };
type VerifierReport = { valid?: unknown; messages?: VerifierMessage[] };

// 検証サービスが発行元（Moodle 等）からの取得に一時的に失敗したことを示す文字列。
// TemporaryFetchError は fork 版の検証サービスが、接続エラー・タイムアウト・HTTP 408/429/5xx に付ける印。
// FetchNotAllowedError（取得先の許可リストに無い）は一時的な障害ではないため含めない。
const NETWORK_ERROR_PATTERN = /TemporaryFetchError|ConnectionError|Timeout|SSLError|ProxyError/;
const FETCH_NOT_ALLOWED_ERROR = "FetchNotAllowedError";
// 先行タスクの失敗に連鎖して出るメッセージ。単独ではバッジ不正の根拠にしない。
const PREREQUISITE_ERROR = "Task could not run due to unmet prerequisites.";

const isNetworkError = (m: VerifierMessage) => {
  const result = String(m.result ?? "");
  return !result.includes(FETCH_NOT_ALLOWED_ERROR) && NETWORK_ERROR_PATTERN.test(result);
};

/**
 * 検証サービスのレポートを、有効／無効／一時的に検証できない、に分類する。
 */
export const classifyVerifierReport = (report: VerifierReport | undefined): OpenBadgeVerifyResult => {
  if (!report || typeof report.valid !== "boolean") {
    return { status: "unavailable", reason: "verifier returned an unexpected response" };
  }
  if (report.valid) {
    return { status: "valid" };
  }

  const errorMessages = (report.messages ?? []).filter((m) => m.messageLevel === "ERROR");
  const networkError = errorMessages.find(isNetworkError);
  // 取得の一時的な失敗以外に、バッジ自体の検証エラーがあれば invalid とする（再試行しても通らないため）。
  const hasBadgeError = errorMessages.some((m) => !isNetworkError(m) && m.result !== PREREQUISITE_ERROR);
  if (networkError && !hasBadgeError) {
    return {
      status: "unavailable",
      reason: `verifier could not fetch a badge resource: ${String(networkError.result).slice(0, 300)}`,
    };
  }

  return {
    status: "invalid",
    reason: `verifier reported ${errorMessages.length} error(s): ${errorMessages.map((m) => m.name).join(", ")}`,
  };
};

// 検証サービスへの 1 回の問い合わせを打ち切るまでの時間（ms）。
// 検証サービス側は発行元への取得ごとに FETCH_TIMEOUT（既定 10 秒）で打ち切るため、通常はこれより十分短く終わる。
const VERIFIER_TIMEOUT_MS = 60_000;

/**
 * 検証サービスに 1 回問い合わせ、結果を分類して返す（例外は投げない）。
 */
export const requestVerifier = async (verifierUrl: string, openBadgeMetadata: any): Promise<OpenBadgeVerifyResult> => {
  try {
    const { data } = await axios.post(
      verifierUrl,
      {
        data: JSON.stringify(openBadgeMetadata),
      },
      {
        headers: {
          Accept: "application/json",
        },
        timeout: VERIFIER_TIMEOUT_MS,
      },
    );
    loggerInfo(`API submission_badge: OpenBadge verification report: ${JSON.stringify(data?.report)}`);

    return classifyVerifierReport(data?.report);
  } catch (err) {
    const status = err?.response?.status;
    // 408（タイムアウト）と 429（リクエスト過多）は一時的な状態なので、リトライ対象（unavailable）にする。
    if (status >= 400 && status <= 499 && status !== 408 && status !== 429) {
      // 検証サービスがリクエスト自体を受け付けなかった（不正な入力など）。再試行しても変わらない。
      return { status: "invalid", reason: `verifier rejected the request: HTTP ${status}` };
    }
    return { status: "unavailable", reason: `verifier request failed: ${status ? `HTTP ${status}` : err?.message}` };
  }
};
