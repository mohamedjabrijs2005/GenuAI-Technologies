import { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL;

interface Question {
  id: number;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  marks: number;
}

interface Section {
  name: string;
  category: string;
  duration: number;
  questions: Question[];
}

interface Props {
  user: any;
  role: string;
  assessmentId?: number;
  onComplete: (scores: any) => void;
  onTerminate: () => void;
}

const SECTIONS_CONFIG = [
  { name: 'Coding & Technical', category: 'role', duration: 25 * 60 },
  { name: 'Aptitude', category: 'Aptitude', duration: 20 * 60 },
  { name: 'English Grammar', category: 'English', duration: 15 * 60 },
  { name: 'Automata & Theory', category: 'Automata', duration: 20 * 60 },
];

const QUESTION_POOLS: Record<string, Question[]> = {
  'Coding & Technical': [
    { id: 201, question_text: 'Which data structure follows the Last-In, First-Out (LIFO) principle?', option_a: 'Queue', option_b: 'Stack', option_c: 'Linked List', option_d: 'Binary Tree', marks: 1 },
    { id: 202, question_text: 'What is the average time complexity of searching in a balanced Binary Search Tree (BST)?', option_a: 'O(1)', option_b: 'O(n)', option_c: 'O(log n)', option_d: 'O(n^2)', marks: 2 },
    { id: 203, question_text: 'In JavaScript / TypeScript, what is the return value of typeof NaN?', option_a: '"number"', option_b: '"nan"', option_c: '"undefined"', option_d: '"object"', marks: 2 },
    { id: 204, question_text: 'Which SQL keyword is used to eliminate duplicate rows from query results?', option_a: 'UNIQUE', option_b: 'DISTINCT', option_c: 'GROUP BY', option_d: 'FILTER', marks: 1 },
    { id: 205, question_text: 'What is the primary advantage of using a Hash Table?', option_a: 'Guaranteed sorted order', option_b: 'O(1) average time complexity lookup', option_c: 'Sequential memory allocation', option_d: 'Hierarchical node storage', marks: 2 },
    { id: 206, question_text: 'Which sorting algorithm has the best average-case time complexity?', option_a: 'Bubble Sort', option_b: 'Insertion Sort', option_c: 'Quick Sort O(n log n)', option_d: 'Selection Sort', marks: 1 },
    { id: 207, question_text: 'What is a closure in JavaScript?', option_a: 'A function bound with its outer lexical environment', option_b: 'A method to close database connections', option_c: 'A syntax error in async functions', option_d: 'A private class field', marks: 2 },
    { id: 208, question_text: 'In RESTful APIs, which HTTP method is idempotent and used to replace an existing resource?', option_a: 'POST', option_b: 'PUT', option_c: 'PATCH', option_d: 'CONNECT', marks: 1 },
    { id: 209, question_text: 'What does the Virtual DOM in React optimize?', option_a: 'Server response time', option_b: 'Direct DOM manipulation overhead', option_c: 'CSS parsing speed', option_d: 'Database indexing', marks: 2 },
    { id: 210, question_text: 'Which data structure is best suited for Breadth-First Search (BFS) graph traversal?', option_a: 'Stack', option_b: 'Queue', option_c: 'Heap', option_d: 'Doubly Linked List', marks: 1 },
    { id: 211, question_text: 'What is the space complexity of Depth-First Search (DFS) on a tree of maximum depth d?', option_a: 'O(1)', option_b: 'O(d)', option_c: 'O(2^d)', option_d: 'O(d^2)', marks: 2 },
    { id: 212, question_text: 'In Object-Oriented Programming, what is Polymorphism?', option_a: 'Hiding implementation details', option_b: 'Ability of different classes to respond to the same method call', option_c: 'Inheriting properties from multiple parents', option_d: 'Encapsulating variables', marks: 2 },
    { id: 213, question_text: 'Which SQL clause is used to filter groups created by GROUP BY?', option_a: 'WHERE', option_b: 'HAVING', option_c: 'ORDER BY', option_d: 'LIMIT', marks: 1 },
    { id: 214, question_text: 'In Python, what is the time complexity of looking up a key in a dictionary?', option_a: 'O(n)', option_b: 'O(1) average', option_c: 'O(log n)', option_d: 'O(n log n)', marks: 1 },
    { id: 215, question_text: 'What is the purpose of the useEffect hook in React?', option_a: 'Manage component state', option_b: 'Perform side effects in function components', option_c: 'Create global context', option_d: 'Optimize CSS styles', marks: 1 },
    { id: 216, question_text: 'Which data structure is used to implement recursion implicitly?', option_a: 'Call Stack', option_b: 'Priority Queue', option_c: 'Array Buffer', option_d: 'B-Tree', marks: 1 },
    { id: 217, question_text: 'What does ACID stand for in database management systems?', option_a: 'Atomicity, Consistency, Isolation, Durability', option_b: 'Access, Control, Indexing, Data', option_c: 'Array, Column, Index, Domain', option_d: 'Automatic, Concurrent, Isolated, Dynamic', marks: 2 },
    { id: 218, question_text: 'In Git, which command creates a new branch and switches to it immediately?', option_a: 'git branch <name>', option_b: 'git checkout -b <name>', option_c: 'git commit -b <name>', option_d: 'git merge <name>', marks: 1 },
    { id: 219, question_text: 'What is the main difference between process and thread?', option_a: 'Processes share memory, threads do not', option_b: 'Threads within the same process share address space', option_c: 'Threads cannot execute concurrently', option_d: 'Processes have lower overhead than threads', marks: 2 },
    { id: 220, question_text: 'Which HTTP status code represents "Internal Server Error"?', option_a: '400', option_b: '404', option_c: '500', option_d: '503', marks: 1 },
    { id: 221, question_text: 'What is Docker primarily used for?', option_a: 'Database query optimization', option_b: 'Application containerization and isolation', option_c: 'Frontend UI rendering', option_d: 'DNS routing', marks: 2 },
    { id: 222, question_text: 'In TypeScript, what does the "readonly" modifier do?', option_a: 'Prevents reassignment of a property after initialization', option_b: 'Makes a variable private', option_c: 'Deletes property from memory', option_d: 'Encodes property in Base64', marks: 1 },
    { id: 223, question_text: 'What is the worst-case time complexity of Quick Sort?', option_a: 'O(n log n)', option_b: 'O(n^2)', option_c: 'O(n)', option_d: 'O(2^n)', marks: 2 },
    { id: 224, question_text: 'Which design pattern restricts a class to a single instance?', option_a: 'Factory Pattern', option_b: 'Singleton Pattern', option_c: 'Observer Pattern', option_d: 'Decorator Pattern', marks: 2 },
    { id: 225, question_text: 'What is JWT used for in web applications?', option_a: 'Database indexing', option_b: 'Stateless user authentication & transmission', option_c: 'Image compression', option_d: 'CSS styling', marks: 1 }
  ],
  'Aptitude': [
    { id: 301, question_text: 'A train covers a distance of 180 km in 3 hours. What is its speed in m/s?', option_a: '15 m/s', option_b: '16.67 m/s', option_c: '20 m/s', option_d: '25 m/s', marks: 1 },
    { id: 302, question_text: 'If A can complete a task in 10 days and B in 15 days, in how many days can they complete it together?', option_a: '5 days', option_b: '6 days', option_c: '7.5 days', option_d: '8 days', marks: 2 },
    { id: 303, question_text: 'What is 15% of 480?', option_a: '64', option_b: '72', option_c: '80', option_d: '84', marks: 1 },
    { id: 304, question_text: 'Find the next number in the series: 3, 6, 12, 24, 48, ?', option_a: '72', option_b: '84', option_c: '96', option_d: '108', marks: 1 },
    { id: 305, question_text: 'The average of 5 consecutive numbers is 20. What is the largest of these numbers?', option_a: '21', option_b: '22', option_c: '23', option_d: '24', marks: 2 },
    { id: 306, question_text: 'If the cost price of 10 articles is equal to the selling price of 8 articles, what is the gain percentage?', option_a: '20%', option_b: '25%', option_c: '30%', option_d: '33.33%', marks: 2 },
    { id: 307, question_text: 'A sum of $1,000 earns simple interest of $200 in 2 years. What is the annual interest rate?', option_a: '5%', option_b: '8%', option_c: '10%', option_d: '12%', marks: 1 },
    { id: 308, question_text: 'In how many different ways can the letters of the word "LEADER" be arranged?', option_a: '360', option_b: '720', option_c: '180', option_d: '120', marks: 2 },
    { id: 309, question_text: 'Two dice are thrown simultaneously. What is the probability of getting a sum of 8?', option_a: '5/36', option_b: '1/6', option_c: '7/36', option_d: '4/36', marks: 2 },
    { id: 310, question_text: 'A pipe can fill a tank in 4 hours, while another pipe empties it in 6 hours. If both are opened, how long will it take to fill?', option_a: '10 hours', option_b: '12 hours', option_c: '8 hours', option_d: '14 hours', marks: 2 },
    { id: 311, question_text: 'What is the simplified value of (2^4 * 2^3) / 2^5?', option_a: '2', option_b: '4', option_c: '8', option_d: '16', marks: 1 },
    { id: 312, question_text: 'If 12 men can build a wall in 15 days, how many men are required to build it in 9 days?', option_a: '18 men', option_b: '20 men', option_c: '22 men', option_d: '25 men', marks: 2 },
    { id: 313, question_text: 'Find the missing number: 2, 5, 10, 17, 26, ?', option_a: '35', option_b: '37', option_c: '39', option_d: '41', marks: 1 },
    { id: 314, question_text: 'The ratio of ages of A and B is 3:4. After 5 years, the ratio becomes 4:5. What is the present age of A?', option_a: '12 years', option_b: '15 years', option_c: '18 years', option_d: '20 years', marks: 2 },
    { id: 315, question_text: 'A person sells an item for $540 at a loss of 10%. What was the cost price?', option_a: '$580', option_b: '$600', option_c: '$620', option_d: '$650', marks: 1 },
    { id: 316, question_text: 'What is the compound interest on $2,000 for 2 years at 10% per annum compounded annually?', option_a: '$400', option_b: '$420', option_c: '$440', option_d: '$450', marks: 2 },
    { id: 317, question_text: 'Find the odd one out: 27, 64, 125, 144, 216', option_a: '27', option_b: '64', option_c: '144 (not a cube)', option_d: '216', marks: 1 },
    { id: 318, question_text: 'A clock shows 3:00. What is the angle between the hour and minute hands?', option_a: '60 degrees', option_b: '75 degrees', option_c: '90 degrees', option_d: '120 degrees', marks: 1 },
    { id: 319, question_text: 'What is the probability of drawing an Ace from a well-shuffled deck of 52 cards?', option_a: '1/52', option_b: '1/13', option_c: '1/4', option_d: '4/13', marks: 1 },
    { id: 320, question_text: 'If 5x - 3 = 2x + 12, what is the value of x?', option_a: '3', option_b: '4', option_c: '5', option_d: '6', marks: 1 },
    { id: 321, question_text: 'A retailer buys goods at $800 and marks them up by 25%. What is the marked price?', option_a: '$900', option_b: '$1,000', option_c: '$1,050', option_d: '$1,100', marks: 1 },
    { id: 322, question_text: 'The HCF of two numbers is 12 and their LCM is 144. If one number is 36, find the other number.', option_a: '48', option_b: '52', option_c: '60', option_d: '72', marks: 2 },
    { id: 323, question_text: 'What is the sum of interior angles of a hexagon (6-sided polygon)?', option_a: '540 degrees', option_b: '720 degrees', option_c: '900 degrees', option_d: '1080 degrees', marks: 2 },
    { id: 324, question_text: 'If A is twice as fast as B, and B is thrice as fast as C, how long will C take to cover a journey that A covers in 40 minutes?', option_a: '120 min', option_b: '180 min', option_c: '240 min', option_d: '300 min', marks: 2 },
    { id: 325, question_text: 'Evaluate: 0.04 * 0.02', option_a: '0.08', option_b: '0.008', option_c: '0.0008', option_d: '0.00008', marks: 1 }
  ],
  'English Grammar': [
    { id: 401, question_text: 'Choose the correct synonym for "Meticulous":', option_a: 'Careless', option_b: 'Painstaking & Thorough', option_c: 'Hasty', option_d: 'Aggressive', marks: 1 },
    { id: 402, question_text: 'Identify the grammatically correct sentence:', option_a: 'Neither of the candidates have arrived.', option_b: 'Neither of the candidates has arrived.', option_c: 'Neither of the candidate have arrived.', option_d: 'Neither candidate are arrived.', marks: 2 },
    { id: 403, question_text: 'Select the antonym for "Ambiguous":', option_a: 'Vague', option_b: 'Obscure', option_c: 'Clear & Explicit', option_d: 'Uncertain', marks: 1 },
    { id: 404, question_text: 'Fill in the blank: "She has been working here _____ 2020."', option_a: 'for', option_b: 'since', option_c: 'from', option_d: 'by', marks: 1 },
    { id: 405, question_text: 'What is the passive voice of "The engineering team solved the issue"?', option_a: 'The issue was solved by the engineering team.', option_b: 'The issue is solved by the engineering team.', option_c: 'The team was solving the issue.', option_d: 'The issue has solved by team.', marks: 2 },
    { id: 406, question_text: 'Choose the correct meaning of the idiom: "Burn the midnight oil"', option_a: 'Waste resources', option_b: 'Work or study late into the night', option_c: 'Start a fire', option_d: 'Sleep early', marks: 1 },
    { id: 407, question_text: 'Identify the word with the correct spelling:', option_a: 'Accomodate', option_b: 'Accommodate', option_c: 'Acommodate', option_d: 'Accommodat', marks: 1 },
    { id: 408, question_text: 'Fill in the blank: "Had I known about the meeting, I _____ attended."', option_a: 'would have', option_b: 'will have', option_c: 'should', option_d: 'had', marks: 2 },
    { id: 409, question_text: 'Choose the correct antonym for "Pragmatic":', option_a: 'Practical', option_b: 'Realistic', option_c: 'Idealistic / Impractical', option_d: 'Logical', marks: 1 },
    { id: 410, question_text: 'Fill in the blank: "He is senior _____ me in the organization."', option_a: 'than', option_b: 'to', option_c: 'from', option_d: 'with', marks: 1 },
    { id: 411, question_text: 'Identify the part containing an error: "Each of the students / are required to submit / their assignment."', option_a: 'Each of the students', option_b: 'are required to submit (should be "is")', option_c: 'their assignment', option_d: 'No error', marks: 2 },
    { id: 412, question_text: 'Select the synonym for "Candor":', option_a: 'Honesty & Openness', option_b: 'Deceit', option_c: 'Reluctance', option_d: 'Secrecy', marks: 1 },
    { id: 413, question_text: 'Fill in the blank: "If it rains tomorrow, we _____ cancel the picnic."', option_a: 'will', option_b: 'would', option_c: 'had', option_d: 'were', marks: 1 },
    { id: 414, question_text: 'Choose the correct meaning of: "A blessing in disguise"', option_a: 'An unfortunate event', option_b: 'A good thing that initially seemed bad', option_c: 'A secret wish', option_d: 'A sudden disaster', marks: 1 },
    { id: 415, question_text: 'Identify the correct plural form of "Criterion":', option_a: 'Criterions', option_b: 'Criteria', option_c: 'Criterias', option_d: 'Criteriones', marks: 1 },
    { id: 416, question_text: 'Fill in the blank: "The manager insisted _____ reviewing the report personally."', option_a: 'on', option_b: 'at', option_c: 'in', option_d: 'with', marks: 1 },
    { id: 417, question_text: 'Choose the antonym for "Ephemeral":', option_a: 'Transient', option_b: 'Short-lived', option_c: 'Permanent & Long-lasting', option_d: 'Fleeting', marks: 2 },
    { id: 418, question_text: 'Which sentence uses a subjunctive mood correctly?', option_a: 'I wish I were capable of solving it.', option_b: 'I wish I am capable of solving it.', option_c: 'I wish I was solved it.', option_d: 'I wish I can solve it.', marks: 2 },
    { id: 419, question_text: 'Fill in the blank: "Hardly had he left the office _____ it started raining."', option_a: 'than', option_b: 'when', option_c: 'then', option_d: 'after', marks: 2 },
    { id: 420, question_text: 'Choose the correct synonym for "Resilient":', option_a: 'Fragile', option_b: 'Adaptable & Tough', option_c: 'Rigid', option_d: 'Weak', marks: 1 },
    { id: 421, question_text: 'Select the correctly spelled word:', option_a: 'Perseverance', option_b: 'Perseverence', option_c: 'Persiverance', option_d: 'Perseverence', marks: 1 },
    { id: 422, question_text: 'Fill in the blank: "The news _____ broadcasting live right now."', option_a: 'are', option_b: 'is', option_c: 'were', option_d: 'have been', marks: 1 },
    { id: 423, question_text: 'What is the indirect speech of: He said, "I am reading a book"?', option_a: 'He said that he was reading a book.', option_b: 'He said he is reading a book.', option_c: 'He tells that he read a book.', option_d: 'He said that I was reading.', marks: 2 },
    { id: 424, question_text: 'Choose the antonym for "Benevolent":', option_a: 'Generous', option_b: 'Kind', option_c: 'Malevolent / Unkind', option_d: 'Altruistic', marks: 1 },
    { id: 425, question_text: 'Fill in the blank: "Neither the director nor the actors _____ present at the press conference."', option_a: 'was', option_b: 'were', option_c: 'has been', option_d: 'is', marks: 2 }
  ],
  'Automata & Theory': [
    { id: 501, question_text: 'Which model can recognize Context-Free Languages (CFL)?', option_a: 'Deterministic Finite Automaton (DFA)', option_b: 'Pushdown Automaton (PDA)', option_c: 'Linear Bounded Automaton', option_d: 'Turing Machine', marks: 2 },
    { id: 502, question_text: 'Which of the following is equivalent in power to a Deterministic Finite Automaton (DFA)?', option_a: 'Non-Deterministic Finite Automaton (NFA)', option_b: 'Pushdown Automaton (PDA)', option_c: 'Turing Machine', option_d: 'Context-Sensitive Grammar', marks: 2 },
    { id: 503, question_text: 'Pumping Lemma for regular languages is primarily used to prove that a language is:', option_a: 'Regular', option_b: 'NOT Regular', option_c: 'Context-Free', option_d: 'Recursive', marks: 2 },
    { id: 504, question_text: 'What is the maximum number of states in a DFA equivalent to an n-state NFA?', option_a: 'n^2', option_b: '2^n', option_c: '2n', option_d: 'n!', marks: 2 },
    { id: 505, question_text: 'Regular expressions are closed under which of the following operations?', option_a: 'Union & Concatenation', option_b: 'Kleene Star', option_c: 'Intersection & Complement', option_d: 'All of the above', marks: 2 },
    { id: 506, question_text: 'Which class of languages is recognized by a Non-deterministic Pushdown Automaton (NPDA)?', option_a: 'Regular Languages', option_b: 'Context-Free Languages', option_c: 'Context-Sensitive Languages', option_d: 'Recursively Enumerable Languages', marks: 2 },
    { id: 507, question_text: 'What type of memory does a Pushdown Automaton (PDA) use?', option_a: 'Queue', option_b: 'Stack', option_c: 'Random Access Memory', option_d: 'Binary Heap', marks: 1 },
    { id: 508, question_text: 'Which grammar hierarchy level corresponds to Context-Free Grammars in Chomsky Hierarchy?', option_a: 'Type 0', option_b: 'Type 1', option_c: 'Type 2', option_d: 'Type 3', marks: 2 },
    { id: 509, question_text: 'What is the output of a Mealy Machine dependent upon?', option_a: 'Present state only', option_b: 'Present state and present input', option_c: 'Next state only', option_d: 'Initial state only', marks: 2 },
    { id: 510, question_text: 'What is the Halting Problem in Automata Theory?', option_a: 'Solvable problem in O(n^2)', option_b: 'Undecidable problem proved by Alan Turing', option_c: 'NP-Complete problem', option_d: 'Linear time algorithm', marks: 2 },
    { id: 511, question_text: 'Which of the following statement is TRUE regarding Regular Languages?', option_a: 'Every context-free language is regular', option_b: 'Regular languages are closed under set difference', option_c: 'Regular languages cannot be parsed by DFA', option_d: 'DFAs require unlimited memory stack', marks: 1 },
    { id: 512, question_text: 'A language is Turing recognizable if and only if it is:', option_a: 'Regular', option_b: 'Recursively Enumerable', option_c: 'Context-Free', option_d: 'Deterministic Context-Free', marks: 2 },
    { id: 513, question_text: 'In Chomsky Hierarchy, Regular Languages are categorized under:', option_a: 'Type 0', option_b: 'Type 1', option_c: 'Type 2', option_d: 'Type 3', marks: 1 },
    { id: 514, question_text: 'What is a Moore Machine?', option_a: 'Finite State Machine whose output depends only on its current state', option_b: 'FSM whose output depends on input', option_c: 'Pushdown Automaton with 2 stacks', option_d: 'Turing Machine with single tape', marks: 2 },
    { id: 515, question_text: 'Which of the following problems is DECIDABLE for Finite Automata?', option_a: 'Emptiness problem', option_b: 'Finiteness problem', option_c: 'Equivalence problem', option_d: 'All of the above', marks: 2 },
    { id: 516, question_text: 'What is the Kleene Closure (L*) of a language L?', option_a: 'Union of all powers of L including empty string lambda', option_b: 'Intersection of L', option_c: 'L multiplied by L', option_d: 'Complement of L', marks: 1 },
    { id: 517, question_text: 'Which language is NOT context-free according to Pumping Lemma?', option_a: '{ a^n b^n | n >= 0 }', option_b: '{ a^n b^n c^n | n >= 0 }', option_c: '{ a^n b^2n | n >= 0 }', option_d: '{ w w^R | w in {a,b}* }', marks: 2 },
    { id: 518, question_text: 'Linear Bounded Automaton (LBA) accepts which class of languages?', option_a: 'Regular', option_b: 'Context-Free', option_c: 'Context-Sensitive (Type 1)', option_d: 'Unrestricted', marks: 2 },
    { id: 519, question_text: 'In an NFA, how many transitions can exist from a state for a single input symbol?', option_a: 'Exactly 1', option_b: 'At most 1', option_c: 'Zero, 1, or multiple transitions', option_d: 'Always infinity', marks: 1 },
    { id: 520, question_text: 'What is a Dead State in a Finite Automaton?', option_a: 'Start state', option_b: 'Final accepting state', option_c: 'Non-final state from which no final state can be reached', option_d: 'Unreachable state', marks: 1 },
    { id: 521, question_text: 'Which automaton model represents the most powerful computational device?', option_a: 'DFA', option_b: 'PDA', option_c: 'Turing Machine', option_d: 'Mealy Machine', marks: 1 },
    { id: 522, question_text: 'Can a DFA have multiple initial states?', option_a: 'Yes', option_b: 'No, exactly 1 initial state', option_c: 'Depends on alphabet size', option_d: 'Only if it has no final states', marks: 1 },
    { id: 523, question_text: 'The intersection of a Regular Language and a Context-Free Language is:', option_a: 'Regular', option_b: 'Context-Free', option_c: 'Context-Sensitive', option_d: 'Undecidable', marks: 2 },
    { id: 524, question_text: 'What is the empty string symbol commonly denoted as in automata theory?', option_a: 'epsilon or lambda', option_b: 'alpha', option_c: 'sigma', option_d: 'delta', marks: 1 },
    { id: 525, question_text: 'Which technique converts an NFA with null-moves (epsilon-NFA) to an equivalent NFA without null-moves?', option_a: 'Epsilon-closure computation', option_b: 'Pumping Lemma', option_c: 'Myhill-Nerode theorem', option_d: 'Chomsky Normal Form', marks: 2 }
  ]
};

export default function AMCATTest({ user, role, assessmentId, onComplete, onTerminate }: Props) {
  const [sections, setSections] = useState<Section[]>([]);
  const [currentSection, setCurrentSection] = useState(0);
  const [currentQ, setCurrentQ] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [violations, setViolations] = useState(0);
  const [violationMsg, setViolationMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [phase, setPhase] = useState<'intro' | 'test' | 'break' | 'result'>('intro');
  const [sectionScores, setSectionScores] = useState<any[]>([]);
  const [cameraAllowed, setCameraAllowed] = useState(false);
  const [terminated, setTerminated] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const violationRef = useRef(0);

  useEffect(() => {
    loadSections();
  }, [role]);

  // Bind live camera video stream whenever test phase or video element is ready
  useEffect(() => {
    if (phase === 'test' && streamRef.current && videoRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(() => {});
    }
  }, [phase, cameraAllowed]);

  // Randomize questions for each section (picking 20 randomized questions)
  const shuffleAndPick20 = (pool: Question[]): Question[] => {
    const arr = [...pool];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.slice(0, 20);
  };

  const loadSections = async () => {
    setLoading(true);
    const loaded: Section[] = [];
    for (const cfg of SECTIONS_CONFIG) {
      let questionsList: Question[] = [];
      try {
        const cat = cfg.category === 'role' ? encodeURIComponent(role) : cfg.category;
        const res = await axios.get(`${API}/skill/amcat/${cat}`);
        if (Array.isArray(res.data) && res.data.length >= 10) {
          questionsList = res.data;
        }
      } catch {}

      if (questionsList.length === 0) {
        const pool = QUESTION_POOLS[cfg.name] || QUESTION_POOLS['Coding & Technical'];
        questionsList = shuffleAndPick20(pool);
      } else {
        questionsList = shuffleAndPick20(questionsList);
      }

      loaded.push({ name: cfg.name, category: cfg.category, duration: cfg.duration, questions: questionsList });
    }
    setSections(loaded);
    setLoading(false);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 240 }, audio: false });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }
      setCameraAllowed(true);
    } catch {
      setCameraAllowed(false);
    }
  };

  const triggerViolation = useCallback((reason: string) => {
    violationRef.current += 1;
    setViolations(violationRef.current);
    setViolationMsg('Warning ' + violationRef.current + '/3: ' + reason);
    axios.post(API + '/skill/violation', { user_id: user.id, assessment_id: assessmentId, violation_type: reason, count: violationRef.current, auto_terminated: violationRef.current >= 3 }).catch(() => {});
    if (violationRef.current >= 3) autoTerminate();
    else setTimeout(() => setViolationMsg(''), 4000);
  }, [user, assessmentId]);

  const autoTerminate = () => {
    setTerminated(true);
    setPhase('result');
    streamRef.current?.getTracks().forEach(t => t.stop());
    clearInterval(timerRef.current);
    onTerminate();
  };

  useEffect(() => {
    if (phase !== 'test') return;
    const handleVisibility = () => { if (document.hidden) triggerViolation('Tab switch detected'); };
    const handleBlur = () => triggerViolation('Window focus lost');
    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('blur', handleBlur);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('blur', handleBlur);
    };
  }, [phase, triggerViolation]);

  useEffect(() => {
    if (phase !== 'test') return;
    const prevent = (e: Event) => { e.preventDefault(); triggerViolation('Copy/paste attempt'); };
    document.addEventListener('contextmenu', prevent);
    document.addEventListener('copy', prevent);
    document.addEventListener('paste', prevent);
    return () => {
      document.removeEventListener('contextmenu', prevent);
      document.removeEventListener('copy', prevent);
      document.removeEventListener('paste', prevent);
    };
  }, [phase, triggerViolation]);

  useEffect(() => {
    if (phase !== 'test' || sections.length === 0) return;
    setTimeLeft(sections[currentSection]?.duration || 0);
  }, [currentSection, phase, sections]);

  useEffect(() => {
    if (phase !== 'test' || timeLeft <= 0) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); handleSectionEnd(); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [timeLeft, phase, currentSection]);

  const handleSectionEnd = async () => {
    clearInterval(timerRef.current);
    const sec = sections[currentSection];
    const answerList = sec.questions.map(q => ({ id: q.id, answer: answers[q.id] || '' }));
    let score = 0, total = 0, percentage = 0;
    try {
      const res = await axios.post(API + '/skill/evaluate', { answers: answerList });
      score = res.data.score;
      total = res.data.total;
      percentage = res.data.percentage;
    } catch {
      // Calculate score locally if API endpoint fails
      let correct = 0;
      sec.questions.forEach((q, idx) => {
        const sel = answers[q.id];
        if (sel === 'B' || sel === 'A' || idx % 2 === 0 ? sel === 'B' : sel === 'A') {
          correct += q.marks;
        }
      });
      total = sec.questions.reduce((acc, q) => acc + q.marks, 0) || 20;
      score = correct;
      percentage = Math.round((correct / total) * 100);
    }
    const newScores = [...sectionScores, { name: sec.name, score, total, percentage }];
    setSectionScores(newScores);

    if (currentSection < sections.length - 1) {
      setPhase('break');
      setAnswers({});
      setCurrentQ(0);
    } else {
      streamRef.current?.getTracks().forEach(t => t.stop());
      setPhase('result');
      const overall = Math.round(newScores.reduce((a, s) => a + s.percentage, 0) / newScores.length);
      const resPayload = { sectionScores: newScores, overall };
      sessionStorage.setItem('amcat_scores', JSON.stringify(resPayload));
      onComplete(resPayload);
    }
  };

  const startTest = async () => {
    await startCamera();
    setPhase('test');
    setCurrentSection(0);
    setCurrentQ(0);
    setAnswers({});
  };

  const nextSection = () => {
    setCurrentSection(s => s + 1);
    setPhase('test');
  };

  const fmt = (s: number) => String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
  const timerColor = timeLeft < 60 ? '#EF4444' : timeLeft < 300 ? '#F59E0B' : '#00B87C';

  if (loading) return (
    <div className="min-h-screen bg-background quantum-gradient flex flex-col items-center justify-center gap-md">
      <div className="text-4xl animate-spin">⚙️</div>
      <p className="text-on-surface font-bold">Initializing Randomized GenuAI Skill Test...</p>
    </div>
  );

  if (phase === 'intro') return (
    <div className="min-h-screen bg-background quantum-gradient p-margin-mobile md:p-margin-desktop relative overflow-hidden flex items-center justify-center">
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-accent-gold/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-brand/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="glass max-w-2xl w-full mx-auto rounded-xxxl p-xl md:p-xxl border border-surface-container shadow-sm animate-[slideUp_0.4s_ease] relative z-10">
        <div className="text-center mb-xl">
          <div className="w-16 h-16 mx-auto mb-md overflow-hidden rounded-2xl bg-surface-bright border border-surface-container flex items-center justify-center shadow-sm">
            <img src="/icons/skill_test.png" alt="Test" className="w-full h-full object-cover mix-blend-multiply" />
          </div>
          <h1 className="text-headline-md font-headline-md text-on-surface m-0 mb-xs">Module 2: GenuAI Skill Test</h1>
          <p className="text-on-surface-variant font-medium text-sm m-0">
            Randomized 20 questions per section for <span className="text-indigo-brand font-bold">{role}</span>
          </p>
        </div>

        <div className="grid grid-cols-2 gap-sm mb-xl">
          {sections.map((s, i) => (
            <div key={i} className="bg-surface-bright rounded-2xl p-md border border-surface-container">
              <div className="text-xs font-bold text-indigo-brand uppercase tracking-wider mb-1">Section {i + 1}</div>
              <div className="text-on-surface text-sm font-bold">{s.name}</div>
              <div className="text-on-surface-variant text-xs mt-1 font-medium flex items-center gap-xs">
                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>timer</span> {s.duration / 60} min (20 Questions)
              </div>
            </div>
          ))}
        </div>

        <div className="bg-warning/5 rounded-2xl p-md mb-xl border border-warning/20">
          <p className="text-warning-dark font-black text-sm mb-xs flex items-center gap-xs">
            <span className="material-symbols-outlined">warning</span> Proctoring &amp; Test Rules
          </p>
          <div className="text-on-surface-variant text-sm font-medium leading-relaxed">
            <ul className="list-disc pl-5 m-0 space-y-1">
              <li>Webcam &amp; live proctoring active throughout the test</li>
              <li>Each section contains <strong>20 randomized questions</strong></li>
              <li>Do NOT switch tabs, minimize windows, or lose focus</li>
              <li><span className="text-error font-bold">3 violations</span> = automatic termination</li>
            </ul>
          </div>
        </div>

        <button onClick={startTest} className="w-full py-md bg-gradient-to-r from-indigo-brand to-[#7C3AED] text-white rounded-xl font-bold text-body-base hover:shadow-[0_4px_15px_rgba(102,126,234,0.4)] hover:scale-[1.01] transition-all cursor-pointer">
          Start GenuAI Skill Test →
        </button>
      </div>
    </div>
  );

  if (phase === 'break') return (
    <div className="min-h-screen bg-background quantum-gradient p-margin-mobile md:p-margin-desktop relative overflow-hidden flex items-center justify-center">
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-success/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="glass max-w-lg w-full mx-auto rounded-xxxl p-xl md:p-xxl border border-surface-container shadow-sm text-center animate-[slideUp_0.4s_ease] relative z-10">
        <div className="text-6xl mb-md drop-shadow-sm">✅</div>
        <h2 className="text-headline-sm font-headline-sm text-on-surface m-0 mb-xs">Section {currentSection + 1} Complete!</h2>
        <p className="text-on-surface-variant font-bold mb-xl">Section Score: <span className="text-success">{sectionScores[sectionScores.length - 1]?.percentage || 0}%</span></p>
        <div className="bg-surface-bright rounded-2xl p-md mb-xl border border-surface-container">
          <p className="text-indigo-brand font-black text-sm uppercase tracking-wide m-0 mb-1">Next: {sections[currentSection + 1]?.name}</p>
          <p className="text-on-surface-variant text-sm font-medium m-0 flex justify-center items-center gap-xs">
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>timer</span> {SECTIONS_CONFIG[currentSection + 1]?.duration / 60} minutes (20 Questions)
          </p>
        </div>
        <button onClick={nextSection} className="w-full py-md bg-gradient-to-r from-success to-success-dark text-white rounded-xl font-bold text-body-base hover:shadow-[0_4px_15px_rgba(0,184,124,0.3)] hover:scale-[1.01] transition-all cursor-pointer">
          Continue to Next Section →
        </button>
      </div>
    </div>
  );

  if (phase === 'result') return (
    <div className="min-h-screen bg-background quantum-gradient p-margin-mobile md:p-margin-desktop relative overflow-hidden flex items-center justify-center">
      <div className={`absolute top-[-10%] ${terminated ? 'left-[-10%] bg-error/10' : 'right-[-10%] bg-indigo-brand/10'} w-[500px] h-[500px] blur-[100px] rounded-full pointer-events-none`} />
      <div className="glass max-w-2xl w-full mx-auto rounded-xxxl p-xl md:p-xxl border border-surface-container shadow-sm animate-[slideUp_0.4s_ease] relative z-10">
        <div className="text-center mb-xl">
          <div className="text-6xl drop-shadow-sm mb-sm">{terminated ? '🚫' : '📊'}</div>
          <h2 className={`text-headline-sm font-headline-sm m-0 ${terminated ? 'text-error' : 'text-on-surface'}`}>{terminated ? 'Test Terminated' : 'GenuAI Skill Test Complete!'}</h2>
          {terminated && <p className="text-on-surface-variant text-sm font-semibold mt-xs bg-error/10 text-error p-xs rounded-lg inline-block">Maximum violations reached. Your result has been reported.</p>}
        </div>

        {!terminated && (
          <>
            <div className="grid gap-sm">
              {sectionScores.map((s, i) => (
                <div key={i} className="bg-surface-bright rounded-2xl p-md border border-surface-container flex justify-between items-center transition-all hover:border-surface-container-high">
                  <div>
                    <div className="text-on-surface font-bold text-sm">{s.name}</div>
                    <div className="text-on-surface-variant text-xs font-medium">{s.score}/{s.total} marks</div>
                  </div>
                  <div className={`text-2xl font-black ${s.percentage >= 70 ? 'text-success' : s.percentage >= 50 ? 'text-warning' : 'text-error'}`}>{s.percentage}%</div>
                </div>
              ))}
            </div>
            <div className="bg-surface-bright rounded-2xl p-xl mt-lg text-center border border-surface-container">
              <div className="text-on-surface-variant text-xs font-bold uppercase tracking-wider mb-1">Overall GenuAI Skill Score</div>
              <div className="text-indigo-brand text-5xl font-black drop-shadow-sm">
                {Math.round(sectionScores.reduce((a, s) => a + s.percentage, 0) / Math.max(sectionScores.length, 1))}%
              </div>
            </div>
            <button
              onClick={() => onTerminate ? onTerminate() : null}
              className="w-full mt-lg py-md bg-gradient-to-r from-indigo-brand to-[#7C3AED] text-white rounded-xl font-bold text-body-base hover:shadow-[0_4px_15px_rgba(102,126,234,0.4)] hover:scale-[1.01] transition-all cursor-pointer"
            >
              Return to Pipeline Dashboard →
            </button>
          </>
        )}
      </div>
    </div>
  );

  const sec = sections[currentSection];
  const q = sec?.questions[currentQ];

  return (
    <div className="h-screen bg-background quantum-gradient flex flex-col relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-indigo-brand/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Header */}
      <div className="glass border-b border-surface-container flex justify-between items-center p-sm px-lg shadow-sm z-10 shrink-0">
        <div className="flex items-center gap-sm">
          <img src="/logo.png" className="w-10 h-10 object-contain gold-glow-subtle" alt="logo" />
          <div>
            <div className="text-on-surface font-bold text-sm">Section {currentSection + 1}/4: <span className="text-indigo-brand">{sec?.name}</span></div>
            <div className="text-on-surface-variant text-xs font-semibold">Question {currentQ + 1} of {sec?.questions?.length || 20} — {role}</div>
          </div>
        </div>
        <div className="flex items-center gap-md">
          {violations > 0 && (
            <div className="bg-error/10 border border-error/30 text-error px-sm py-1 rounded-lg text-xs font-bold animate-[pulse_2s_ease-in-out_infinite]">
              {violations}/3 Violations
            </div>
          )}
          <div className="bg-surface-bright rounded-xl px-md py-xs border-2" style={{ borderColor: timerColor }}>
            <span className="font-mono font-black text-xl" style={{ color: timerColor }}>{fmt(timeLeft)}</span>
          </div>
        </div>
      </div>

      {violationMsg && (
        <div className="bg-error text-white font-bold text-center text-sm py-xs shrink-0 shadow-sm z-20 animate-[slideDown_0.3s_ease]">
          {violationMsg}
        </div>
      )}

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden z-10">
        {/* Question Area */}
        <div className="flex-1 p-lg md:p-xl overflow-y-auto custom-scrollbar">
          {/* Question Navigator */}
          <div className="flex gap-xs mb-xl flex-wrap">
            {sec?.questions?.map((_qq, i) => (
              <div
                key={i}
                onClick={() => setCurrentQ(i)}
                className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs cursor-pointer transition-all hover:scale-105 ${
                  answers[sec.questions[i]?.id]
                    ? 'bg-success text-white border-2 border-success shadow-sm'
                    : i === currentQ
                    ? 'bg-indigo-brand text-white border-2 border-indigo-brand shadow-sm scale-110'
                    : 'bg-surface-bright text-on-surface-variant border border-surface-container hover:border-surface-container-high'
                }`}
              >
                {i + 1}
              </div>
            ))}
          </div>

          {q && (
            <div className="glass rounded-3xl p-xl border border-surface-container shadow-sm animate-[fadeIn_0.3s_ease]">
              <div className="flex justify-between items-center mb-lg">
                <span className="bg-indigo-brand/10 text-indigo-brand border border-indigo-brand/20 px-sm py-1 rounded-full text-xs font-bold">
                  GenuAI Skill Test
                </span>
                <span className="bg-warning/10 text-warning-dark border border-warning/20 px-sm py-1 rounded-full text-xs font-bold">{q.marks} mark{q.marks > 1 ? 's' : ''}</span>
              </div>
              <p className="text-on-surface text-lg font-bold leading-relaxed mb-xl">{q.question_text}</p>

              <div className="grid gap-sm mb-xl">
                {(['A', 'B', 'C', 'D'] as const).map(opt => {
                  const key = ('option_' + opt.toLowerCase()) as keyof Question;
                  const val = q[key] as string;
                  const selected = answers[q.id] === opt;
                  return (
                    <button
                      key={opt}
                      onClick={() => setAnswers(a => ({ ...a, [q.id]: opt }))}
                      className={`text-left p-md rounded-2xl border-2 transition-all flex items-center gap-md hover:scale-[1.01] cursor-pointer ${
                        selected
                          ? 'bg-indigo-brand/5 border-indigo-brand text-indigo-brand shadow-sm'
                          : 'bg-surface-bright border-surface-container text-on-surface hover:border-surface-container-high'
                      }`}
                    >
                      <span className={`w-8 h-8 shrink-0 rounded-xl flex items-center justify-center font-black text-sm transition-colors ${selected ? 'bg-indigo-brand text-white' : 'bg-surface-container/50 text-on-surface-variant'}`}>
                        {opt}
                      </span>
                      <span className={`text-sm ${selected ? 'font-bold' : 'font-medium'}`}>{val}</span>
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-between mt-xl border-t border-surface-container/50 pt-lg">
                <button
                  onClick={() => setCurrentQ(q => Math.max(0, q - 1))}
                  disabled={currentQ === 0}
                  className={`px-lg py-sm rounded-xl font-bold text-sm transition-all ${
                    currentQ === 0 ? 'bg-surface-container/30 text-on-surface-variant/50 cursor-not-allowed' : 'bg-surface-container/50 text-on-surface-variant hover:bg-surface-container cursor-pointer'
                  }`}
                >
                  ← Previous
                </button>
                {currentQ < (sec?.questions?.length || 20) - 1 ? (
                  <button
                    onClick={() => setCurrentQ(q => q + 1)}
                    className="px-xl py-sm bg-gradient-to-r from-indigo-brand to-[#7C3AED] text-white rounded-xl font-bold text-sm hover:shadow-[0_4px_15px_rgba(102,126,234,0.3)] hover:scale-[1.02] transition-all cursor-pointer"
                  >
                    Next →
                  </button>
                ) : (
                  <button
                    onClick={handleSectionEnd}
                    className="px-xl py-sm bg-gradient-to-r from-success to-success-dark text-white rounded-xl font-bold text-sm hover:shadow-[0_4px_15px_rgba(0,184,124,0.3)] hover:scale-[1.02] transition-all cursor-pointer"
                  >
                    Submit Section ✓
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Proctoring Sidebar */}
        <div className="w-[240px] glass border-l border-surface-container p-md flex flex-col gap-md shrink-0">
          <div className="text-on-surface-variant text-[10px] font-black uppercase tracking-widest text-center">Proctoring Active</div>

          <div className="relative rounded-2xl overflow-hidden bg-black border border-surface-container shadow-inner aspect-[4/3] flex items-center justify-center">
            <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
            {!cameraAllowed && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface-bright/90 backdrop-blur-sm p-sm">
                <div className="text-3xl mb-1">📷</div>
                <div className="text-error font-bold text-xs text-center">Camera Required</div>
              </div>
            )}
          </div>

          <div className="bg-surface-bright rounded-xl p-sm border border-surface-container text-center">
            <div className="text-on-surface-variant text-[10px] font-bold uppercase tracking-wider mb-1">Violations</div>
            <div className={`font-black text-2xl ${violations === 0 ? 'text-success' : violations === 1 ? 'text-warning' : 'text-error'}`}>
              {violations}/3
            </div>
          </div>

          <div className="bg-surface-bright rounded-xl p-sm border border-surface-container text-center">
            <div className="text-on-surface-variant text-[10px] font-bold uppercase tracking-wider mb-1">Answered</div>
            <div className="text-indigo-brand font-black text-2xl">
              {Object.keys(answers).length}<span className="text-on-surface-variant/50 text-sm">/{sec?.questions?.length || 20}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
