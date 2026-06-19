// ─── Update PocketBase Collection API Rules ───
// Mitti Art — Run separately to fix API rules on all collections
//
// Usage:
//   npx tsx scripts/update-api-rules.mts

import PocketBase from "pocketbase";

const PB_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL || "http://127.0.0.1:8090";
const ADMIN_EMAIL = process.env.PB_ADMIN_EMAIL || "admin@mittiart.com";
const ADMIN_PASSWORD =
  process.env.PB_ADMIN_PASSWORD || "mitti@2024!ChangeMeSecure";

// ─── Desired API rules ─────────────────────────────────────────

interface CollectionRules {
  listRule?: string | null;
  viewRule?: string | null;
  createRule?: string | null;
  updateRule?: string | null;
  deleteRule?: string | null;
}

const RULES: Record<string, CollectionRules> = {
  products: {
    listRule: "",
    viewRule: "",
  },
  testimonials: {
    listRule: "",
    viewRule: "",
  },
  commissions: {
    listRule:
      "@request.auth.id = user.id || @request.auth.collectionName = '_superusers'",
    viewRule:
      "@request.auth.id = user.id || @request.auth.collectionName = '_superusers'",
    createRule: "@request.auth.id != ''",
    updateRule: "@request.auth.collectionName = '_superusers'",
  },
  orders: {
    listRule:
      "@request.auth.id = user.id || @request.auth.collectionName = '_superusers'",
    viewRule:
      "@request.auth.id = user.id || @request.auth.collectionName = '_superusers'",
    createRule: "@request.auth.id != ''",
    updateRule: "@request.auth.collectionName = '_superusers'",
  },
  users: {
    updateRule:
      "id = @request.auth.id || @request.auth.collectionName = '_superusers'",
  },
};

// ─── Helpers ───────────────────────────────────────────────────

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function updateCollectionRules(
  pb: PocketBase,
  name: string,
  rules: CollectionRules
): Promise<boolean> {
  try {
    // Fetch collection by name (PocketBase resolves collection name to ID)
    const col = await pb.collections.getOne(name);

    let changed = false;
    for (const [field, value] of Object.entries(rules)) {
      const key = field as keyof typeof rules;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((col as any)[key] !== value) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (col as any)[key] = value;
        changed = true;
      }
    }

    if (changed) {
      await pb.collections.update(col.id, col);
      return true;
    }
    return false;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`   ✗ Failed to update "${name}": ${msg}`);
    return false;
  }
}

// ─── Main ──────────────────────────────────────────────────────

async function main() {
  const pb = new PocketBase(PB_URL);

  console.log("⏳ Connecting to PocketBase...");

  for (let i = 0; i < 30; i++) {
    try {
      await pb.health.check();
      break;
    } catch {
      console.log(`   Waiting for server (${i + 1}/30)...`);
      await sleep(1000);
    }
  }

  console.log("✅ Connected");

  // Authenticate as superuser
  await pb.collection("_superusers").authWithPassword(
    ADMIN_EMAIL,
    ADMIN_PASSWORD
  );
  console.log("✅ Authenticated as superuser\n");

  let updatedCount = 0;
  let unchangedCount = 0;
  let errorCount = 0;

  for (const [name, rules] of Object.entries(RULES)) {
    console.log(`   Processing "${name}"...`);
    try {
      const changed = await updateCollectionRules(pb, name, rules);
      if (changed) {
        console.log(`   ✅ Rules updated for "${name}"`);
        updatedCount++;
      } else {
        console.log(`   ✓ Rules already correct for "${name}"`);
        unchangedCount++;
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`   ✗ Error updating "${name}": ${msg}`);
      errorCount++;
    }
  }

  console.log("\n── Summary ──");
  console.log(`   Updated:  ${updatedCount}`);
  console.log(`   Unchanged: ${unchangedCount}`);
  console.log(`   Errors:    ${errorCount}`);
  console.log("\n✅ API rules update complete!");
}

main().catch((e: unknown) => {
  const msg = e instanceof Error ? e.message : String(e);
  console.error("❌ Update failed:", msg);
  process.exit(1);
});
