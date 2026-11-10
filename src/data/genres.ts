export type Mode = "Written" | "Visual" | "Audio";

export interface Genre {
  name: string;
  cat: string;
  modes: Mode[];
  audience: string;
  purpose: string;
  ex: string;
}

export const genres: Genre[] = [
  {name:"Journal entries",cat:"Personal & Narrative",modes:["Written"],audience:"Self / intimate reader",purpose:"Process, reflect, witness",ex:"Daily entries documenting a social issue you care about"},
  {name:"Personal letter",cat:"Personal & Narrative",modes:["Written"],audience:"Specific individual",purpose:"Connect, persuade, inform one person",ex:"Letter to a senator, a parent, a future self"},
  {name:"Inner monologue",cat:"Personal & Narrative",modes:["Written"],audience:"General / literary",purpose:"Humanize a perspective",ex:"Voice of someone living the issue you researched"},
  {name:"Short story",cat:"Personal & Narrative",modes:["Written","Visual"],audience:"General readers",purpose:"Narrative persuasion, empathy",ex:"Fiction that dramatizes your research topic"},
  {name:"Myth, tall tale, or fairy tale",cat:"Personal & Narrative",modes:["Written"],audience:"Broad / family",purpose:"Encode cultural arguments",ex:"Rewritten fable arguing your position"},
  {name:"Obituary, eulogy, or tribute",cat:"Personal & Narrative",modes:["Written"],audience:"Community",purpose:"Honor, mourn, advocate",ex:"Tribute to something lost — a neighborhood, a species"},
  {name:"Ghost story",cat:"Personal & Narrative",modes:["Written"],audience:"General readers",purpose:"Unsettle, haunt, linger",ex:"Story that literalizes a social harm"},
  {name:"Poetry",cat:"Personal & Narrative",modes:["Written","Audio"],audience:"Broad",purpose:"Emotional resonance, compression",ex:"Poem sequence about your research topic"},
  {name:"Op-ed",cat:"Journalism & News",modes:["Written"],audience:"Newspaper readers / public",purpose:"Argue a position publicly",ex:"Opinion piece in a campus or city paper"},
  {name:"Letter to the editor",cat:"Journalism & News",modes:["Written"],audience:"Newspaper readership",purpose:"Respond, push back, advocate",ex:"Reply to recent coverage of your issue"},
  {name:"Local news report",cat:"Journalism & News",modes:["Written"],audience:"Local community",purpose:"Inform, document",ex:"News story on a community-level version of your issue"},
  {name:"Feature / human interest story",cat:"Journalism & News",modes:["Written"],audience:"Magazine or newspaper readers",purpose:"Humanize a data point",ex:"Profile of someone affected by your topic"},
  {name:"Tabloid article",cat:"Journalism & News",modes:["Written","Visual"],audience:"Mass audience",purpose:"Amplify, sensationalize (strategically)",ex:"Tabloid framing of a data finding for rhetorical effect"},
  {name:"Future news story",cat:"Journalism & News",modes:["Written"],audience:"General public",purpose:"Project consequences forward",ex:"News article from 2040 about your issue"},
  {name:"Listicle",cat:"Journalism & News",modes:["Written","Visual"],audience:"Online readers",purpose:"Accessible, shareable persuasion",ex:"'7 things you didn't know about [your topic]'"},
  {name:"Open letter",cat:"Journalism & News",modes:["Written"],audience:"Public + named recipient",purpose:"Public accountability, advocacy",ex:"Open letter to a university, company, or policymaker"},
  {name:"Persuasive / advocacy letter",cat:"Civic & Advocacy",modes:["Written"],audience:"Decision-maker",purpose:"Demand change, present evidence",ex:"Letter to a city council member or school board"},
  {name:"Business letter",cat:"Civic & Advocacy",modes:["Written"],audience:"Professional / institutional",purpose:"Formal professional communication",ex:"Proposal letter to an organization"},
  {name:"Lesson plan",cat:"Civic & Advocacy",modes:["Written"],audience:"Educators",purpose:"Change what is taught",ex:"Lesson on your topic for a K–12 classroom"},
  {name:"Petition / contest entry",cat:"Civic & Advocacy",modes:["Written"],audience:"Organization or panel",purpose:"Request action or recognition",ex:"Grant application for a program addressing your issue"},
  {name:"Case study",cat:"Academic & Analytical",modes:["Written","Visual"],audience:"Academic / professional",purpose:"Analyze a specific instance deeply",ex:"Case study of one community affected by your topic"},
  {name:"Textbook article",cat:"Academic & Analytical",modes:["Written"],audience:"Students",purpose:"Teach a concept authoritatively",ex:"Textbook entry defining a term central to your topic"},
  {name:"Encyclopedia article",cat:"Academic & Analytical",modes:["Written"],audience:"General educated reader",purpose:"Inform, define, contextualize",ex:"Wikipedia-style entry on your research question"},
  {name:"Science / research report",cat:"Academic & Analytical",modes:["Written","Visual"],audience:"Academic readers",purpose:"Report findings, build field",ex:"Research report on your topic in APA format"},
  {name:"Critique of a published source",cat:"Academic & Analytical",modes:["Written"],audience:"Academic community",purpose:"Evaluate, challenge, extend scholarship",ex:"Critical review of a key source from your annotated bibliography"},
  {name:"Character analysis",cat:"Academic & Analytical",modes:["Written"],audience:"Literary / academic",purpose:"Close reading through a social lens",ex:"Analysis of a figure shaped by your issue"},
  {name:"Dialogue of a conversation",cat:"Academic & Analytical",modes:["Written"],audience:"General / educational",purpose:"Show multiple perspectives in tension",ex:"Dialogue between two people with opposing views on your topic"},
  {name:"Infographic",cat:"Visual & Design",modes:["Visual","Written"],audience:"Broad / social media",purpose:"Make data accessible and shareable",ex:"Visual breakdown of statistics from your research"},
  {name:"Brochure or newsletter",cat:"Visual & Design",modes:["Visual","Written"],audience:"Community members",purpose:"Inform, distribute, mobilize",ex:"Community brochure on your topic"},
  {name:"Magazine advertisement",cat:"Visual & Design",modes:["Visual","Written"],audience:"Magazine readers",purpose:"Persuade through image and copy",ex:"Ad advocating for a cause or product change"},
  {name:"Poster or 3D artwork",cat:"Visual & Design",modes:["Visual"],audience:"Public",purpose:"Grab attention, spark emotion",ex:"Advocacy poster for display in a public space"},
  {name:"Comic strip or graphic novel",cat:"Visual & Design",modes:["Visual","Written"],audience:"Broad",purpose:"Narrative + visual argument",ex:"Sequential art depicting your issue"},
  {name:"Picture book",cat:"Visual & Design",modes:["Visual","Written"],audience:"Children / families",purpose:"Introduce complex issues accessibly",ex:"Children's book about a social concept"},
  {name:"Chart or diagram with analysis",cat:"Visual & Design",modes:["Visual","Written"],audience:"General",purpose:"Visualize data with argument",ex:"Annotated chart showing trends in your topic"},
  {name:"Map with explanation",cat:"Visual & Design",modes:["Visual","Written"],audience:"Community / public",purpose:"Show geographic pattern or disparity",ex:"Map of where your issue is concentrated and why"},
  {name:"Timeline or chain of events",cat:"Visual & Design",modes:["Visual","Written"],audience:"General / educational",purpose:"Show causation, history",ex:"Timeline of how your issue developed over time"},
  {name:"Slideshow presentation",cat:"Visual & Design",modes:["Visual","Written","Audio"],audience:"Classroom / professional",purpose:"Inform and persuade a live audience",ex:"Slide deck presenting your research to a panel"},
  {name:"Mock Instagram page",cat:"Social & Digital",modes:["Visual","Written"],audience:"Instagram users",purpose:"Influence through platform conventions",ex:"Curated account advocating for your position"},
  {name:"Social media post series",cat:"Social & Digital",modes:["Visual","Written"],audience:"Social platform users",purpose:"Serial persuasion, community building",ex:"Twitter/X thread or TikTok series on your topic"},
  {name:"Blog",cat:"Social & Digital",modes:["Written"],audience:"Online readers / community",purpose:"Opinion + information over time",ex:"Multi-post blog about your topic and findings"},
  {name:"SMS conversation",cat:"Social & Digital",modes:["Written"],audience:"Intimate / peer",purpose:"Naturalistic dialogue, irony",ex:"Text thread that reveals a social problem"},
  {name:"Podcast episode",cat:"Audio & Video",modes:["Audio"],audience:"Podcast listeners",purpose:"Inform and persuade through voice and conversation",ex:"Interview-style episode on your research question"},
  {name:"Recorded speech / TED Talk",cat:"Audio & Video",modes:["Audio","Visual"],audience:"Live or online audience",purpose:"Inspire, challenge, move to action",ex:"5–7 min recorded talk presenting your argument"},
  {name:"TV advertisement",cat:"Audio & Video",modes:["Audio","Visual"],audience:"TV viewers",purpose:"Persuade through emotion and spectacle",ex:"30-second spot advocating for your cause"},
  {name:"Informational video",cat:"Audio & Video",modes:["Audio","Visual"],audience:"Online viewers",purpose:"Explain, demonstrate, educate",ex:"YouTube-style explainer on your research topic"},
  {name:"Talk show / panel",cat:"Audio & Video",modes:["Audio","Visual"],audience:"Broadcast audience",purpose:"Debate, expose, entertain through dialogue",ex:"Scripted panel with multiple perspectives on your topic"},
  {name:"Board game with rules",cat:"Creative & Interactive",modes:["Visual","Written"],audience:"Players / students",purpose:"Simulate systems, teach through play",ex:"Game simulating the dynamics of your social issue"},
  {name:"Comedy routine or parody",cat:"Creative & Interactive",modes:["Audio","Written"],audience:"General",purpose:"Satirize, expose through humor",ex:"Satirical sketch about your topic"},
  {name:"Pop-up book",cat:"Creative & Interactive",modes:["Visual","Written"],audience:"Children / all ages",purpose:"Delight and teach through interactive design",ex:"Pop-up that explains your topic concept visually"},
  {name:"Song lyrics",cat:"Creative & Interactive",modes:["Audio","Written"],audience:"Listeners",purpose:"Emotional resonance, cultural reach",ex:"Lyrics exploring themes from your research"},
  {name:"Short scene from a play",cat:"Creative & Interactive",modes:["Written","Audio"],audience:"Theater audience",purpose:"Drama to reveal tension and stakes",ex:"Scene depicting conflict around your issue"},
  {name:"Short film scene",cat:"Creative & Interactive",modes:["Written","Visual","Audio"],audience:"Film audience",purpose:"Cinematic argument through action and image",ex:"Screenplay scene with camera directions"},
  {name:"Travel brochure",cat:"Practical & Reference",modes:["Visual","Written"],audience:"Travelers / general",purpose:"Describe, entice, represent a place",ex:"Brochure using 'travel' framing for a social space"},
  {name:"How-to booklet",cat:"Practical & Reference",modes:["Written"],audience:"General",purpose:"Empower, instruct, democratize knowledge",ex:"Zine-style guide on navigating a system"},
  {name:"Menu or restaurant description",cat:"Practical & Reference",modes:["Visual","Written"],audience:"Consumers",purpose:"Reframe consumption rhetorically",ex:"Menu that makes an argument about food systems"},
  {name:"Glossary or dictionary entries",cat:"Practical & Reference",modes:["Written"],audience:"Students / general",purpose:"Define, reclaim, challenge language",ex:"Glossary of key terms in your issue, with argument"},
  {name:"Mock legal / official document",cat:"Practical & Reference",modes:["Written"],audience:"Bureaucratic / public",purpose:"Expose systems, satirize forms",ex:"Mock application that reveals a systemic problem"},
  {name:"Greeting card",cat:"Practical & Reference",modes:["Visual","Written"],audience:"Individual recipient",purpose:"Intimate persuasion, emotional appeal",ex:"Card that advocates for something personal"},
  {name:"Event invitation",cat:"Practical & Reference",modes:["Visual","Written"],audience:"Guests / community",purpose:"Celebrate, mark, announce",ex:"Invitation framing a community event around your issue"},
  {name:"Review and poster",cat:"Practical & Reference",modes:["Visual","Written"],audience:"Consumers",purpose:"Evaluate, recommend, critique",ex:"Review of a film, book, or show related to your topic"},
];

export const categories = ["All", ...new Set(genres.map((g) => g.cat))];
