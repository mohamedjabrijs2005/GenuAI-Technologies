import pool from '../db';

export interface SubscriptionPlanItem {
  id: number;
  name: string;
  description: string;
  price: number;
  currency: string;
  durationDays: number;
  configChangesAllowed: number;
  rolesAllowed: number;
  advancedAnalytics: boolean;
  features: string[];
}

export class SubscriptionService {
  /**
   * Returns all active subscription plans for company configuration changes.
   */
  static async getActivePlans(): Promise<SubscriptionPlanItem[]> {
    try {
      const res = await pool.query(
        `SELECT id, name, description, price, currency, duration_days,
                config_changes_allowed, roles_allowed, advanced_analytics, features
         FROM subscription_plans
         WHERE is_active = true
         ORDER BY price ASC`
      );

      if (res.rows.length > 0) {
        return res.rows.map((r) => ({
          id: r.id,
          name: r.name,
          description: r.description,
          price: parseFloat(r.price),
          currency: r.currency || 'INR',
          durationDays: r.duration_days,
          configChangesAllowed: r.config_changes_allowed,
          rolesAllowed: r.roles_allowed,
          advancedAnalytics: r.advanced_analytics,
          features: typeof r.features === 'string' ? JSON.parse(r.features) : r.features || [],
        }));
      }
    } catch (err: any) {
      console.warn('[SubscriptionService] DB plans fetch notice:', err.message);
    }

    // Fallback static plans
    return [
      {
        id: 1,
        name: 'Starter Config Pack',
        description: 'Allows 1 assessment configuration change per active role.',
        price: 2999,
        currency: 'INR',
        durationDays: 30,
        configChangesAllowed: 1,
        rolesAllowed: 3,
        advancedAnalytics: false,
        features: ['config_change_x1', 'email_support'],
      },
      {
        id: 2,
        name: 'Growth Config Pack',
        description: 'Allows 3 configuration changes with advanced analytics.',
        price: 7999,
        currency: 'INR',
        durationDays: 60,
        configChangesAllowed: 3,
        rolesAllowed: 10,
        advancedAnalytics: true,
        features: ['config_change_x3', 'analytics_export', 'priority_support'],
      },
      {
        id: 3,
        name: 'Enterprise Config Pack',
        description: 'Unlimited configuration changes with dedicated support.',
        price: 19999,
        currency: 'INR',
        durationDays: 365,
        configChangesAllowed: 999,
        rolesAllowed: 999,
        advancedAnalytics: true,
        features: ['config_change_unlimited', 'analytics_export', 'dedicated_support'],
      },
    ];
  }

  /**
   * Approves a configuration change request and creates a new configuration version (V2, V3...) (Rules §13, §15, Fix 2).
   */
  static async approveConfigurationChange(
    companyId: number,
    configurationId: number,
    selectedModuleIds: number[],
    approvedByAdminId: number
  ): Promise<{ newVersionId: number; versionNumber: number }> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // 1. Get current active version number
      const vRes = await client.query(
        `SELECT id, version_number, company_role_id, canonical_role_id
         FROM company_configuration_versions
         WHERE configuration_id = $1 AND status = 'active'
         LIMIT 1`,
        [configurationId]
      );

      if (vRes.rows.length === 0) {
        throw new Error('Current active configuration version not found.');
      }

      const currentVersion = vRes.rows[0];
      const newVersionNumber = currentVersion.version_number + 1;

      // 2. Create new active version (V2, V3...)
      const newVRes = await client.query(
        `INSERT INTO company_configuration_versions
           (configuration_id, version_number, company_id, company_role_id, canonical_role_id,
            selected_module_ids, status, created_by)
         VALUES ($1, $2, $3, $4, $5, $6, 'active', $7)
         RETURNING id`,
        [
          configurationId,
          newVersionNumber,
          companyId,
          currentVersion.company_role_id,
          currentVersion.canonical_role_id,
          selectedModuleIds,
          approvedByAdminId,
        ]
      );
      const newVersionId = newVRes.rows[0].id;

      // 3. Mark old version as superseded (NEVER DELETE V1, preserve historical binding)
      await client.query(
        `UPDATE company_configuration_versions
         SET status = 'superseded', superseded_at = NOW(), superseded_by_version_id = $1
         WHERE id = $2`,
        [newVersionId, currentVersion.id]
      );

      // 4. Insert requirements for new version
      for (const modId of selectedModuleIds) {
        await client.query(
          `INSERT INTO company_configuration_requirements
             (configuration_version_id, assessment_module_id, weight, is_required)
           VALUES ($1, $2, 1.0, true)`,
          [newVersionId, modId]
        );
      }

      await client.query('COMMIT');
      return { newVersionId, versionNumber: newVersionNumber };
    } catch (err: any) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }
}
