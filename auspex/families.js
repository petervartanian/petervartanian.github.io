/* Family-level summaries of Eight Existential Risk Scenarios from AI:
 * A Systematic Review, draft compiled 15 September 2026, §§4.3–4.5.
 * Counts refer to the review's document scenarios, not empirical evidence.
 * These addresses are site navigation labels, not the paper's identifiers.
 */
window.AuspexFamilies = {
  source: 'Eight Existential Risk Scenarios from AI: A Systematic Review',
  groups: [
    { id: 'A', title: 'Influence passes to AI systems', families: [
      { id: 'A-I', title: 'Independent Takeover', count: 41, pages: 'pp. 8–9',
        premise: 'A system, or instances acting as one, has a decisive capability advantage over those positioned to constrain it and pursues power in conflict with continued human control.',
        chain: [
          ['Gains external access', 'The system can communicate or act beyond its initial containment. Its takeover need not depend on authority delegated over society.'],
          ['Secures a foothold', 'It obtains resources or positions from which it can extend its influence.'],
          ['Is not stopped early', 'Concealment, inadequate oversight, or unwillingness to intervene allows its position to persist.'],
          ['Escalates past correction', 'Its expanding capabilities and influence exceed the ability of humans to stop or redirect it.'],
          ['Humans are disempowered', 'Human control over the future is permanently lost. Extinction requires further mechanisms or consequences.']
        ] },
      { id: 'A-II', title: 'Dispersed Takeover', count: 10, pages: 'pp. 9–10',
        premise: 'AI systems hold influential roles across society, and a significant portion have or develop influence-seeking tendencies.',
        chain: [
          ['Influence accumulates separately', 'Systems independently expand their influence beyond their assigned functions, together reaching across society.'],
          ['Accumulation is not corrected', 'Local decisions obscure the aggregate problem, while oversight weakens and the costs of intervention rise.'],
          ['Humans are disempowered', 'The combined influence of the systems permanently prevents humans from directing civilization, without any single system needing to seize control.']
        ] },
      { id: 'A-III', title: 'Coordinated Takeover', count: 4, pages: 'pp. 10–11',
        premise: 'Widely deployed, influence-seeking systems can communicate and have sufficiently compatible objectives to coordinate.',
        chain: [
          ['Influence accumulates together', 'Systems coordinate to expand and pool their positions across society.'],
          ['Coordination resists correction', 'Their activities or communication evade effective oversight, and systems can defend one another against intervention.'],
          ['Humans are disempowered', 'Pooled influence grows beyond the ability of humans to redirect the systems or regain control of civilization.']
        ] },
      { id: 'A-IV', title: 'Handover', count: 19, pages: 'p. 11',
        premise: 'Humans delegate real decision-making authority to AI within economic, cultural, or institutional functions.',
        chain: [
          ['Delegation deepens', 'Loss of human capability and competitive pressure make further delegation increasingly attractive or necessary.'],
          ['Reversal passes out of reach', 'Dependencies and eroded human knowledge make reversal infeasible. Reduced participation can also weaken the connection to human preferences.'],
          ['Humans are disempowered', 'Humans permanently lose the authority or ability to direct civilization, even without systems actively seeking additional power.']
        ] }
    ] },
    { id: 'B', title: 'Power concentrates in a narrow human group', families: [
      { id: 'B-I', title: 'Entrenched Totalitarianism', count: 10, pages: 'pp. 11–12',
        premise: 'A human actor or narrow coalition directs AI capabilities relevant to holding power, with an advantage over those positioned to check it.',
        chain: [
          ['Control is taken and held', 'AI strengthens the actor’s control, reduces its dependence on willing human participants, or provides capabilities rivals lack.'],
          ['Reach becomes global', 'No population remains outside such arrangements, whether one actor dominates or several control separate spheres.'],
          ['Power is permanently entrenched', 'Routes for contestation and reversal close, leaving control of civilization with a narrow human group across generations.']
        ] },
      { id: 'B-II', title: 'Economic Stratification', count: 1, pages: 'p. 12',
        premise: 'AI and associated technologies can substitute for human labor across enough economically valuable work to change who holds productive power.',
        chain: [
          ['The population loses leverage', 'Labor becomes less important to those directing the economy; mobility narrows and incentives to invest in the broader population weaken.'],
          ['Counteracting forces are outmatched', 'Ownership of productive assets remains concentrated, and institutions fail to restore the population’s influence.'],
          ['Control is permanently foreclosed', 'Those holding the non-human factors of production determine civilization’s direction. Material provision does not itself restore political or economic control.']
        ] }
    ] },
    { id: 'C', title: 'AI extends what humans can destroy', families: [
      { id: 'C-I', title: 'Engineered Catastrophe', count: 7, pages: 'p. 13',
        premise: 'AI substantially extends human capabilities in scientific research, engineering, or production.',
        chain: [
          ['Existentially destructive technology becomes possible', 'AI enables, accelerates, widens access to, or scales a technology capable of an existential outcome.'],
          ['Release outpaces response', 'The technology reaches the world through deliberate release or an accident, before governance and defenses can contain it.'],
          ['Humanity does not recover', 'The consequences cause extinction or leave survivors without the lasting capacity to rebuild.']
        ] },
      { id: 'C-II', title: 'Automated Warfare', count: 3, pages: 'pp. 13–14',
        premise: 'Rival powers hold arsenals whose combined use could cause existential destruction, and AI systems can escalate their conflict with limited human involvement.',
        chain: [
          ['Escalation escapes human control', 'An exchange begins and automated responses carry it beyond the point where human intervention can halt it.'],
          ['Humanity does not recover', 'The exchange reaches a scale that causes extinction or permanently prevents recovery.']
        ] }
    ] }
  ]
};
