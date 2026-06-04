export interface SampleJD {
  title: string
  company: string
  text: string
}

export const sampleJDs: SampleJD[] = [
  {
    title: 'Senior Financial Advisor',
    company: 'Sample Corp',
    text: `We are looking for a Senior Financial Advisor with 5+ years of experience managing investment portfolios for high-value clients. 

Requirements:
- 5+ years of financial advisory experience
- Proven track record managing multi-million dollar portfolios
- Strong client relationship management skills
- Experience with Salesforce CRM
- CFA certification preferred
- Excellent communication and presentation skills
- Knowledge of investment strategies, estate planning, and risk management`,
  },
  {
    title: 'Backend Software Engineer',
    company: 'Tech Startup',
    text: `We are hiring a Backend Software Engineer to build scalable APIs and services.

Requirements:
- 3+ years of backend development experience
- Strong proficiency in Python and FastAPI or Django
- Experience with REST API design and microservices
- PostgreSQL and Redis experience
- Docker and Kubernetes knowledge
- AWS or GCP cloud experience
- Familiarity with CI/CD pipelines
- Experience with async programming`,
  },
  {
    title: 'Data Analyst',
    company: 'Analytics Co',
    text: `We are seeking a Data Analyst to turn complex data into actionable business insights.

Requirements:
- 2+ years of data analysis experience
- Strong SQL skills (PostgreSQL, MySQL)
- Python for data analysis (pandas, numpy)
- Tableau or Power BI for visualization
- Experience with data pipelines and ETL processes
- Statistical analysis and A/B testing knowledge
- Excellent communication skills to present findings to stakeholders
- Business intelligence reporting experience`,
  },
]
