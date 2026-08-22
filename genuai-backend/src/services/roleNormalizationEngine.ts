import pool from '../db';

export interface CompanyRoleSelection {
  companyId: number;
  companyName: string;
  companyRoleId?: number;
  roleTitle: string;
}

export interface CanonicalRoleGroup {
  canonicalRoleId: number;
  canonicalRoleName: string;
  selections: CompanyRoleSelection[];
}

// Default fallback mappings when DB is not populated or offline
const FALLBACK_EQUIVALENCY_MAP: Record<string, { id: number; canonicalName: string }> = {
  'software developer': { id: 1, canonicalName: 'SOFTWARE_ENGINEER' },
  'software engineer': { id: 1, canonicalName: 'SOFTWARE_ENGINEER' },
  'sales executive': { id: 2, canonicalName: 'SALES_EXECUTIVE' },
  'data analyst': { id: 3, canonicalName: 'DATA_ANALYST' },
  'hr executive': { id: 4, canonicalName: 'HR_EXECUTIVE' },
  'ui/ux designer': { id: 5, canonicalName: 'UI_UX_DESIGNER' },
};

export class RoleNormalizationEngine {
  /**
   * Resolves company-role selections into canonical role groups (Fix 1).
   * Selections sharing the same canonical_role_id are grouped together.
   * Selections with different canonical_role_ids are kept in separate contexts.
   */
  static async resolveCanonicalRoleGroups(
    selections: CompanyRoleSelection[]
  ): Promise<CanonicalRoleGroup[]> {
    const groupsMap = new Map<number, CanonicalRoleGroup>();

    for (const sel of selections) {
      let canonicalId: number | null = null;
      let canonicalName = 'GENERAL_ROLE';

      try {
        // 1. Try DB lookup via role_equivalency_mapping or company_roles -> role_taxonomy
        const res = await pool.query(
          `SELECT r.canonical_role_id, t.canonical_name 
           FROM role_equivalency_mapping r
           JOIN role_taxonomy t ON r.canonical_role_id = t.id
           WHERE LOWER(r.company_role_title) = LOWER($1)
             AND (r.company_id = $2 OR r.company_id IS NULL)
             AND (r.mapped_by = 'admin_confirmed' OR r.reviewed_by_admin IS NOT NULL)
           ORDER BY r.company_id DESC NULLS LAST
           LIMIT 1`,
          [sel.roleTitle, sel.companyId]
        );

        if (res.rows.length > 0) {
          canonicalId = res.rows[0].canonical_role_id;
          canonicalName = res.rows[0].canonical_name;
        } else {
          // Fallback DB check on company_roles table
          const crRes = await pool.query(
            `SELECT cr.canonical_role_id, rt.canonical_name
             FROM company_roles cr
             JOIN role_taxonomy rt ON cr.canonical_role_id = rt.id
             WHERE LOWER(cr.title) = LOWER($1) AND cr.company_id = $2
             LIMIT 1`,
            [sel.roleTitle, sel.companyId]
          );

          if (crRes.rows.length > 0) {
            canonicalId = crRes.rows[0].canonical_role_id;
            canonicalName = crRes.rows[0].canonical_name;
          }
        }
      } catch (err: any) {
        console.warn('[RoleNormalizationEngine] DB lookup notice:', err.message);
      }

      // 2. Fallback to deterministic static map if DB lookup gave nothing
      if (!canonicalId) {
        const normalizedTitle = (sel.roleTitle || '').trim().toLowerCase();
        const fallback = FALLBACK_EQUIVALENCY_MAP[normalizedTitle];
        if (fallback) {
          canonicalId = fallback.id;
          canonicalName = fallback.canonicalName;
        } else {
          // Generate a synthetic deterministic id for distinct unmapped roles
          canonicalId = Math.abs(this.hashCode(normalizedTitle)) + 1000;
          canonicalName = (sel.roleTitle || 'CUSTOM_ROLE').toUpperCase().replace(/[^A-Z0-9]/g, '_');
        }
      }

      // 3. Group by canonicalId
      if (!groupsMap.has(canonicalId)) {
        groupsMap.set(canonicalId, {
          canonicalRoleId: canonicalId,
          canonicalRoleName: canonicalName,
          selections: [],
        });
      }
      groupsMap.get(canonicalId)!.selections.push(sel);
    }

    return Array.from(groupsMap.values());
  }

  private static hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return hash;
  }
}
