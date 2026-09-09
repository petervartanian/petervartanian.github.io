# Temporal research — 9 September 2026

Fresh checks did **not** uncover execution dates for the 12 undated training actions. These are two episodes, split into five library actions (E0742–E0746) and seven social-post actions (E0747–E0753). The temporal sidecar preserves all 832 records, with 820 finite context windows and 12 open-left windows. It adds no exact date or clock time.

The [OpenAI technical report](https://cdn.openai.com/pdf/67869394-cb91-4c12-888c-5cbd85c7814c/OpenAI-Hugging-Face%20Incident-Technical-Report.pdf), printed pages 20–21, does not attach dates or run identifiers to either anecdote. The social task’s `2025-04-22T12:00:00Z` is requested application data, not an execution timestamp. Figure 2 was visually checked: its horizontal axis shows training progress without calendar dates.

The report describes these as contributing training and dates the Hugging Face production compromise to July 11–13 (page 4). The sidecar therefore supplies **July 14 exclusive as a conservative, inferred contextual upper bound**. This widens the earlier July 9 assumption; it does not claim that an anecdote occurred on July 13. No supported lower bound was found, and no finite display window is supplied.

The fresh [OpenAI summary](https://openai.com/index/hugging-face-incident-and-the-road-ahead/), under “A message board emerges,” describes multiple research runs beginning in May and June. Its “Reward hacking and infrastructure tampering” section corroborates the library example but still gives no episode date or matching run identifier.

The supplied verbatim caption transcript of the [Black Hat talk](https://www.youtube.com/watch?v=87DyyMV0kCY) identifies an experimental run beginning May 7 at 09:58–10:14 and a highly persistent model run beginning June 11 at 13:58–14:06. Neither anecdote appears in the supplied transcript. A run launch cannot bound a different or unidentified contributing training episode merely because its model description sounds similar. The new web request for the video page failed; the dates were checked against the supplied primary transcript, not represented as independently retrieved captions.

[METR’s investigation](https://metr.org/blog/2026-08-26-openai-hugging-face-incident-investigation/) puts earlier training incidents outside its stated scope and adds no dates for these anecdotes. Searches for the May 7 and June 11 training starts found no additional primary passage resolving the identity gap. The sidecar records the search queries and the rejected anchors, including April 20, May 7, May 8, June 11 and the embedded 2025 post timestamp.

Six additional records were spot-checked. E0137’s existing July 20, 00:55 UTC deletion is confirmed by page 38; July 19 dates account creation. E0282’s July 20 date is confirmed on page 15. E0300 keeps its “by July 23” completion window. E0740 keeps an inferred post-detection/pre-publication experiment window; the matching experiment passage is on pages 24–25. E0791 and E0792 retain their separately reported talk dates. These checks confirm or explain existing values; they do not create additional date corrections.

The 814 remaining records are explicitly marked as carried forward without individual re-research in this pass. All canonical dates, records and source text remain unchanged. Sidecar validation checks one assignment per canonical ID, valid ISO dates, ordered bounds, containment of stated event dates, and preservation of the canonical file hash:

`59c1bb8c9fb9510bb9079f83d97e1f3aec56d4037737d42598cfa659777d534b`

Display open-left records in a separate undated precursor region. Its placement must not imply a calendar date, a duration, or chronological ordering against dated events. A date filter should make its treatment of these records explicit.
