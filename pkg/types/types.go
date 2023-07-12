package types

type LandscapeList struct {
	Landscape []struct {
		Name          string `yaml:"name"`
		Subcategories []struct {
			Name  string `yaml:"name"`
			Items []struct {
				Name        string `yaml:"name"`
				HomepageURL string `yaml:"homepage_url"`
				RepoURL     string `yaml:"repo_url,omitempty"`
				Logo        string `yaml:"logo"`
				Twitter     string `yaml:"twitter,omitempty"`
				Crunchbase  string `yaml:"crunchbase"`
				Project     string `yaml:"project,omitempty"`
				Description string `yaml:"description,omitempty"`
				Extra       struct {
					Accepted               string `yaml:"accepted"`
					Incubating             string `yaml:"incubating"`
					Graduated              string `yaml:"graduated"`
					DevStatsURL            string `yaml:"dev_stats_url"`
					ArtworkURL             string `yaml:"artwork_url"`
					MailingListURL         string `yaml:"mailing_list_url"`
					SlackURL               string `yaml:"slack_url"`
					SummaryPersonas        string `yaml:"summary_personas"`
					SummaryTags            string `yaml:"summary_tags"`
					SummaryUseCase         string `yaml:"summary_use_case"`
					SummaryBusinessUseCase string `yaml:"summary_business_use_case"`
					SummaryReleaseRate     string `yaml:"summary_release_rate"`
					SummaryIntegrations    string `yaml:"summary_integrations"`
					SummaryIntroURL        string `yaml:"summary_intro_url"`
					BlogURL                string `yaml:"blog_url"`
					YoutubeURL             string `yaml:"youtube_url"`
					ChatChannel            string `yaml:"chat_channel"`
				} `yaml:"extra,omitempty"`
				Joined              string `yaml:"joined,omitempty"`
				URLForBestpractices string `yaml:"url_for_bestpractices,omitempty"`
			} `yaml:"items"`
		} `yaml:"subcategories"`
	} `yaml:"landscape"`
}
