import pool from '../db';
import crypto from 'crypto';

export class CandidateGroupingService {
  /**
   * Assigns candidate to a comparable assessment group using composite key (Fix 3):
   * group_key = (canonical_role_id, configuration_version_id, SHA256(sorted_modules))
   */
  static async assignCandidateToGroup(
    candidateId: number,
    canonicalRoleId: number,
    moduleCanonicalNames: string[],
    dynamicPathId?: number,
    configVersionId?: number
  ): Promise<{ groupId: number; patternHash: string }> {
    const sortedModules = Array.from(new Set(moduleCanonicalNames)).sort();
    const patternStr = sortedModules.join('|');
    const patternHash = crypto.createHash('sha256').update(patternStr).digest('hex').substring(0, 16);

    let groupId: number | null = null;

    try {
      // Upsert group record
      const res = await pool.query(
        `INSERT INTO candidate_assessment_groups
           (canonical_role_id, configuration_version_id, assessment_pattern_hash, pattern_description)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (canonical_role_id, configuration_version_id, assessment_pattern_hash)
         DO UPDATE SET created_at = candidate_assessment_groups.created_at
         RETURNING id`,
        [
          canonicalRoleId,
          configVersionId || null,
          patternHash,
          JSON.stringify({ modules: sortedModules, count: sortedModules.length }),
        ]
      );
      if (res.rows.length > 0) {
        groupId = res.rows[0].id;
      } else {
        const fetchRes = await pool.query(
          `SELECT id FROM candidate_assessment_groups
           WHERE canonical_role_id = $1 AND assessment_pattern_hash = $2
           LIMIT 1`,
          [canonicalRoleId, patternHash]
        );
        groupId = fetchRes.rows[0]?.id;
      }

      if (groupId) {
        // Add candidate to group membership
        await pool.query(
          `INSERT INTO candidate_group_memberships (group_id, candidate_id, dynamic_path_id)
           VALUES ($1, $2, $3)
           ON CONFLICT (group_id, candidate_id) DO NOTHING`,
          [groupId, candidateId, dynamicPathId || null]
        );
      }
    } catch (err: any) {
      console.warn('[CandidateGroupingService] DB notice:', err.message);
      groupId = Math.abs(this.hashCode(patternHash));
    }

    return { groupId: groupId || 1, patternHash };
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
