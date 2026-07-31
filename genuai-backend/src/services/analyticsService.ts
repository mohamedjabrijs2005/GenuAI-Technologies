export class AnalyticsService {
  static async getCompanyDashboardAnalytics(_companyId: number) {
    return {
      assessmentsToday: 14,
      interviewsToday: 6,
      lowRiskCandidates: 12,
      mediumRiskCandidates: 3,
      highRiskCandidates: 1,
      aiAssistanceTrend: 'LOW',
      plagiarismTrend: 'STABLE',
      averageInterviewScore: 84,
      averageTechnicalScore: 82,
      averageCommunicationScore: 87,
      activityByDay: [
        { day: 'Mon', count: 12 },
        { day: 'Tue', count: 18 },
        { day: 'Wed', count: 15 },
        { day: 'Thu', count: 22 },
        { day: 'Fri', count: 14 },
      ],
    };
  }

  static async getAdminGlobalAnalytics() {
    return {
      activeCompanies: 8,
      totalAssessments: 240,
      totalInterviews: 110,
      averageIntegrityScore: 88,
      riskDistribution: { low: 75, medium: 20, high: 5 }, // Percentages
      aiAssistanceDistribution: { low: 80, medium: 15, high: 5 },
      plagiarismDistribution: { low: 90, medium: 8, high: 2 },
      hiringFunnel: {
        applied: 300,
        identityVerified: 280,
        assessmentCompleted: 240,
        interviewPassed: 95,
        hiredByRecruiter: 42,
      },
    };
  }
}
