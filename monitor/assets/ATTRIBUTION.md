# AI Control Monitor attribution

## Data

Incident metadata comes from the [AI Incident Database](https://incidentdatabase.ai/), maintained by Responsible AI Collaborative, through the [MIT AI Incident Tracker](https://airisk.mit.edu/ai-incident-tracker). Machine classifications use the MIT risk taxonomy through Arcola AI’s pipeline. Harm ratings reproduce the public highest-severity field across 13 categories, including direct, indirect and inferred harms. The [MIT harm framework](https://airisk.mit.edu/ai-incident-tracker/harm-taxonomy) adapts CSET’s harm taxonomy. These ratings remain separate from IST’s loss-of-control warning levels.

AIID’s incident metadata is [CC BY-SA 4.0](https://incidentdatabase.ai/terms-of-use/); MIT’s classifications are [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). The adapted Monitor catalogue is CC BY-SA 4.0. Fields have been selected and descriptions shortened. Source article bodies and images are excluded.

The seven indicators and warning criteria are concise paraphrases of *AI Loss of Control Risk: Indications & Warning*, Mariami Tkeshelashvili, Ritika Verma and Steven M. Kelly, Institute for Security and Technology, February 2026. [Full report](https://securityandtechnology.org/wp-content/uploads/2026/02/AI-Loss-of-Control-Risk-1.pdf).

Dated Level 2 assessments cite *What We Knew Would Happen Is Happening*, Mariami Tkeshelashvili and Ritika Verma, IST, 6 August 2026. [Article](https://securityandtechnology.org/blog/what-we-knew-would-happen-is-happening/). The interface distinguishes these published judgments from editorial mapping proposals.

The standalone studies with published IST mappings cite [Apollo’s in-context scheming research](https://arxiv.org/abs/2412.04984v2), [Chen, Zaharia and Zou’s model-version comparison](https://arxiv.org/abs/2307.09009v3), [Anthropic/Redwood’s alignment-faking research](https://www.anthropic.com/research/alignment-faking), [DeepMind’s goal-misgeneralization research](https://arxiv.org/abs/2210.01790), [Palisade’s shutdown-resistance research](https://arxiv.org/abs/2509.14260v2), and [OpenAI/Apollo’s evaluation-awareness research](https://arxiv.org/abs/2509.15541).

Editorial study mappings cite [Anthropic’s agentic-misalignment experiments](https://www.anthropic.com/research/agentic-misalignment) and [Betley et al.’s emergent-misalignment study](https://arxiv.org/abs/2502.17424v7). Additional incident records cite [OpenAI](https://openai.com/index/how-we-monitor-internal-coding-agents-misalignment/) and [METR](https://metr.org/agent-incidents/), Anthropic’s [Opus 4.7](https://cdn.sanity.io/files/4zrzovbb/website/037f06850df7fbe871e206dad004c3db5fd50340.pdf) and [Mythos Preview](https://cdn.sanity.io/files/4zrzovbb/website/8b8380204f74670be75e81c820ca8dda846ab289.pdf) system cards, and [Transluce](https://transluce.org/us-canada-gov). AIID 477’s proposed mapping cites [Kevin Roose’s first-person account](https://www.longview.report/thelastinvention/contact/transcript). Source-specific limitations and attribution remain attached to each evidence item.

The collection contains 61 LOC rows and 1,710 full-collection rows, with 27 mapped cases. The 1,698-record source snapshot is unchanged; grouping and 14 standalone records explain the display counts. Standalone records carry no imported harm rating or IST warning level. Source papers and articles retain their own rights; the catalogue’s Creative Commons licenses are not automatically applied to them.

## Visual assets

The MIT wordmark and Figtree font were supplied in Peter’s MIT frontend reference. The wordmark’s viewBox is cropped to its artwork so its visible height matches the IST logo; vector paths are unchanged.

Peter supplied the white [Institute for Security and Technology](https://securityandtechnology.org/) wordmark on 1 October 2026 as a 3000 × 1688 PNG. It is cropped to its artwork with its black background made transparent, preserving antialiased white lettering.

The header follows Peter’s requested [PANTONE 17-1230 Mocha Mousse](https://connect.pantone.com/color-insider/the-story-of-color-of-the-year-2025), using the screen approximation `#A47864`. The page background is white; text, links, controls and context icons use neutral grays. Context icons are 14 px with accompanying labels. The interface builds on Peter’s AI Risk Correlator.

Harm colors follow the official MIT/Arcola palette in its [dashboard embed script](https://airi-echarts-visualizations.vercel.app/embed.js). IST warning colors follow Figure 1 of the February report. These scales remain distinct from each other and from the neutral context icons.
