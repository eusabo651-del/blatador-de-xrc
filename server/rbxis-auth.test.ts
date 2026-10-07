import { afterEach, describe, expect, it, vi } from "vitest";
import { createSessionToken, getAdminAccessKey, readSessionFromRequest, readSessionToken } from "./rbxis-auth";

afterEach(() => vi.unstubAllEnvs());

describe("RBXIS session auth", () => {
  it("round-trips a user session with its claims", () => {
    const token = createSessionToken({ role: "user", userId: 42, licenseId: 7, username: "player_pro" });
    const session = readSessionToken(token);

    expect(session?.role).toBe("user");
    expect(session?.userId).toBe(42);
    expect(session?.licenseId).toBe(7);
    expect(session?.username).toBe("player_pro");
    expect(session?.expiresAt).toBeGreaterThan(Date.now());
  });

  it("rejects tampered and malformed tokens", () => {
    const token = createSessionToken({ role: "admin", username: "admin-test" });
    const [payload] = token.split(".");

    expect(readSessionToken(`${payload}.tampered`)).toBeNull();
    expect(readSessionToken("not-a-session")).toBeNull();
    expect(readSessionToken(undefined)).toBeNull();
  });

  it("does not use a public default admin key", () => {
    vi.stubEnv("RBXIS_ADMIN_KEY", "");
    expect(getAdminAccessKey()).toBe("");
  });

  it("reads the configured admin key from the server environment", () => {
    vi.stubEnv("RBXIS_ADMIN_KEY", "test-admin-key-only");
    expect(getAdminAccessKey()).toBe("test-admin-key-only");
  });

  it("accepts the signed session through an Authorization bearer header", () => {
    const token = createSessionToken({ role: "admin", username: "admin-test" });
    const session = readSessionFromRequest({ headers: { authorization: `Bearer ${token}` } } as never);
    expect(session?.role).toBe("admin");
  });
});
