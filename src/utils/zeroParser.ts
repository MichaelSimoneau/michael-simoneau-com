export interface Principle {
  id: string;
  number: number;
  title: string;
  content: string;
}

export interface Chapter {
  id: string;
  number: number;
  title: string;
  principles: Principle[];
}

export interface ZeroContent {
  preface: string;
  chapters: Chapter[];
  conclusion: string;
}

export const parseZeroContent = (text: string): ZeroContent => {
  const lines = text.split('\n');
  const chapters: Chapter[] = [];
  let preface = '';
  let conclusion = '';
  
  // State tracking
  let currentChapter: Chapter | null = null;
  let currentPrinciple: Principle | null = null;
  let section: 'preface' | 'toc' | 'content' | 'conclusion' = 'preface';
  let buffer: string[] = [];

  // Helper to flush buffer to current principle or preface
  const flushBuffer = () => {
    const content = buffer.join('\n').trim();
    if (!content) return;

    if (section === 'preface') {
      preface = content;
    } else if (section === 'content' && currentPrinciple) {
      currentPrinciple.content = content;
    } else if (section === 'conclusion') {
      conclusion = content;
    }
    buffer = [];
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip empty lines at start of sections, but keep them in content
    if (!line && buffer.length === 0) continue;

    // Detect section transitions
    if (line.startsWith('Preface')) {
      section = 'preface';
      continue;
    }

    // Skip the summary TOC section (starts with Chapter 1 and has bullet points)
    if (section === 'preface' && line.startsWith('Chapter 1: Zero')) {
      flushBuffer(); // Save preface
      section = 'toc'; // We'll ignore the TOC part and jump to detailed content
      continue;
    }

    // Detect start of detailed content (Chapter N: ...)
    if (line.startsWith('Chapter') && !line.includes('•')) {
      // If we are in preface and see a Chapter line, transition to content (no TOC)
      if (section === 'preface') {
        flushBuffer(); // Save preface
        section = 'content';
      }
      // If we are in TOC, we only switch to content if we see Chapter 1 again.
      if (section === 'toc') {
        if (line.startsWith('Chapter 1:')) {
          section = 'content';
        } else {
          continue; // Ignore TOC chapters
        }
      }

      // If we are already in content (or just switched), it's a new chapter.
      if (section === 'content') {
        flushBuffer();
        
        // Parse chapter title
        const match = line.match(/Chapter (\d+): (.+)/);
        if (match) {
          currentChapter = {
            id: `chapter-${match[1]}`,
            number: parseInt(match[1]),
            title: match[2],
            principles: []
          };
          chapters.push(currentChapter);
          currentPrinciple = null;
        }
        continue;
      }
    }

    // Detect Principles
    if (section === 'content' && line.startsWith('Principle')) {
      flushBuffer();
      
      // Extract principle number and title from the same line: "Principle X: Title here"
      const match = line.match(/Principle (\d+): (.+)/);
      if (match && currentChapter) {
        const title = match[2].trim();
        
        currentPrinciple = {
          id: `chap-${currentChapter.number}-principle-${match[1]}`,
          number: parseInt(match[1]),
          title: title,
          content: ''
        };
        currentChapter.principles.push(currentPrinciple);
      }
      continue;
    }

    // Detect Conclusion
    if (line.startsWith('Conclusion:')) {
      flushBuffer();
      section = 'conclusion';
      // Add the title to the buffer so it's part of conclusion or separate?
      // Let's make the conclusion title part of the conclusion text for now
      buffer.push(line); 
      continue;
    }

    // If we're in conclusion but encounter a new chapter, switch back to content mode
    // This handles cases like Chapter 6 appearing after the conclusion
    if (section === 'conclusion' && line.startsWith('Chapter') && !line.includes('•')) {
      flushBuffer(); // Save conclusion content
      section = 'content'; // Switch back to content mode
      // Parse the chapter
      const match = line.match(/Chapter (\d+): (.+)/);
      if (match) {
        currentChapter = {
          id: `chapter-${match[1]}`,
          number: parseInt(match[1]),
          title: match[2],
          principles: []
        };
        chapters.push(currentChapter);
        currentPrinciple = null;
      }
      continue;
    }

    // Accumulate content
    if (section !== 'toc') {
      buffer.push(line);
    }
  }

  flushBuffer(); // Flush remaining content (conclusion)

  return {
    preface,
    chapters,
    conclusion
  };
};

