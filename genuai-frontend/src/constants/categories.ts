// Skill test categories used in SkillTestPractice and AMCATTest
export const SKILL_CATEGORIES = [
  { id: 'logical',      name: 'Logical Reasoning',        imgSrc: '/icons/cat_logical.png',   desc: 'Syllogisms, blood relations, patterns' },
  { id: 'quantitative', name: 'Quantitative Aptitude',    imgSrc: '/icons/cat_quant.png',     desc: 'Permutations, probability, algebra' },
  { id: 'english',      name: 'English Comprehension',    imgSrc: '/icons/cat_english.png',   desc: 'Grammar, vocabulary, reading comp' },
  { id: 'automata_fix', name: 'GenuAI Automata Fix',      imgSrc: '/icons/cat_autofix.png',   desc: 'Debug logical and syntax errors in C/C++/Java' },
  { id: 'automata',     name: 'GenuAI Automata',          imgSrc: '/icons/cat_automata.png',  desc: 'Live competitive programming assessment' },
  { id: 'core',         name: 'Core Computer Science',    imgSrc: '/icons/learning_brain.png',desc: 'OS, DBMS, Computer Networks, OOPS' },
] as const;

export const SKILL_SUB_TOPICS: Record<string, string[]> = {
  logical:      ['Coding-Decoding', 'Blood Relations', 'Directional Sense', 'Data Sufficiency', 'Logical Sequences', 'Syllogism', 'Seating Arrangement', 'Clocks & Calendars'],
  quantitative: ['Number System', 'HCF & LCM', 'Divisibility', 'Percentages', 'Profit & Loss', 'Time-Speed-Distance', 'Probability', 'Permutations & Combinations', 'Simple & Compound Interest'],
  english:      ['Vocabulary Synonyms', 'Vocabulary Antonyms', 'Error Identification', 'Sentence Correction', 'Sentence Improvement', 'Prepositions & Articles', 'Active/Passive Voice'],
  automata_fix: ['Array Manipulation', 'String Parsing', 'Loop Logic', 'Conditional Logic', 'Recursion Base Case', 'Basic Math Logic', 'Off-by-one errors'],
  automata:     ['Arrays', 'Strings', 'Linked Lists', 'Recursion', 'Sorting', 'Searching', 'Matrix Manipulation', 'Basic Hash Maps'],
  core:         ['Operating Systems', 'DBMS & SQL', 'Computer Networks', 'Computer Architecture', 'Software Engineering', 'Deadlocks & Concurrency', 'OSI Model'],
};
