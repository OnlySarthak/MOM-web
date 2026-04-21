import Handlebars from 'handlebars';

const latexTemplate = `\\documentclass[11pt,a4paper]{article}

\\usepackage[margin=1in]{geometry}
\\usepackage{titlesec}
\\usepackage{longtable}
\\usepackage{array}
\\usepackage{xcolor}
\\usepackage{hyperref}
\\usepackage{fancyhdr}

\\titleformat{\\section}{\\large\\bfseries}{}{0em}{}
\\titleformat{\\subsection}{\\normalsize\\bfseries}{}{0em}{}

\\setlength{\\parskip}{6pt}
\\setlength{\\parindent}{0pt}

\\pagestyle{fancy}
\\fancyhf{}
\\rhead{Minutes of Meeting}
\\lhead{ {{workspaceName}} }
\\rfoot{\\thepage}

\\begin{document}

% ---------------- HEADER ----------------
\\begin{center}
{\\LARGE \\textbf{Minutes of Meeting}}\\\\[8pt]

{\\large \\textbf{\`\`\` {{meetingTitle}} \`\`\`}}\\\\[6pt]
\\vspace{4pt}
\\begin{tabular}{rl}
    \\textbf{Project:} & {{projectName}} \\\\
    \\textbf{Date:} & {{meetingDate}} \\\\
    \\textbf{Duration:} & {{meetingDuration}} \\\\
    \\textbf{Leader:} & {{leaderName}} \\\\
\\end{tabular}

\\end{center}

\\vspace{10pt}
\\hrule
\\vspace{12pt}

% ---------------- MEETING INFO ----------------
\\section*{Meeting Information}

\\textbf{Workspace:} {{workspaceName}} \\\\
\\textbf{Team:} {{teamName}} \\\\
\\textbf{Project:} {{projectName}} \\\\
\\textbf{Meeting ID:} {{meetingId}} \\\\
\\textbf{Processing Status:} {{processingStage}}

% ---------------- CONTEXT ----------------
\\section*{Context}
\\textbf{Type:} {{contextLabel}}

% ---------------- SUMMARY ----------------
\\section*{Summary}
{{summary}}

% ---------------- ATTENDANCE ----------------
\\section*{Attendance}

\\textbf{Present:}
{{#if attendees.present}}
\\begin{itemize}
{{#each attendees.present}}
\\item {{name}} — {{role}}
{{/each}}
\\end{itemize}
{{else}}
None \\\\
{{/if}}

\\textbf{Absent:}
{{#if attendees.absent}}
\\begin{itemize}
{{#each attendees.absent}}
\\item {{name}} — {{role}}
{{/each}}
\\end{itemize}
{{else}}
None \\\\
{{/if}}

% ---------------- DECISIONS ----------------
\\section*{Key Decisions}
{{#if decisions}}
\\begin{itemize}
{{#each decisions}}
\\item {{this}}
{{/each}}
\\end{itemize}
{{else}}
No key decisions recorded.
{{/if}}

% ---------------- INSIGHTS ----------------
\\section*{Insights}
{{insights}}

% ---------------- TASK SUMMARY ----------------
\\section*{Task Summary}

\\textbf{Total Tasks:} {{taskSummary.total}} \\\\

\\textbf{Completed:} {{taskSummary.completed}} \\\\

\\textbf{In Progress:} {{taskSummary.inProgress}} \\\\

\\textbf{Pending:} {{taskSummary.pending}}

% ---------------- TASK DETAILS ----------------
\\section*{Tasks by Member}

{{#each tasksByMember}}
\\textbf{ {{name}} } ({{role}})

\\textit{Completed:}
{{#if completed}}
\\begin{itemize}
{{#each completed}}
\\item {{this}}
{{/each}}
\\end{itemize}
{{else}}
None \\\\
{{/if}}

\\textit{In Progress:}
{{#if inProgress}}
\\begin{itemize}
{{#each inProgress}}
\\item {{this}}
{{/each}}
\\end{itemize}
{{else}}
None \\\\
{{/if}}

\\textit{Pending:}
{{#if pending}}
\\begin{itemize}
{{#each pending}}
\\item {{this}}
{{/each}}
\\end{itemize}
{{else}}
None \\\\
{{/if}}

\\vspace{8pt}

{{/each}}

% ---------------- FOOTER ----------------
\\vspace{12pt}
\\hrule
\\vspace{4pt}
\\small Generated automatically by Meeting Intelligence System

\\end{document}
`;

function escapeLatex(str) {
  if (!str) return '';
  return String(str).replace(/[&%$\#\_\{\}\~^\\]/g, (match) => {
    switch (match) {
      case '&': return '\\&';
      case '%': return '\\%';
      case '$': return '\\$';
      case '#': return '\\#';
      case '_': return '\\_';
      case '{': return '\\{';
      case '}': return '\\}';
      case '~': return '\\textasciitilde{}';
      case '^': return '\\textasciicircum{}';
      case '\\': return '\\textbackslash{}';
      default: return match;
    }
  });
}

function processDataForLatex(sourceData) {
  const meeting = sourceData.meetingId || {};
  const allTasks = sourceData.allTasks || [];
  const attendeesList = sourceData.presentAttendees || [];

  const taskSummary = {
    total: allTasks.length,
    completed: allTasks.filter(t => t.state === 'completed').length,
    inProgress: allTasks.filter(t => t.state === 'in_progress').length,
    pending: allTasks.filter(t => t.state === 'pending').length
  };

  const tasksByMemberMap = {};
  allTasks.forEach(task => {
    const memberName = task.resposibleName || 'Unassigned';
    const role = task.responsibleFunctionalRole || 'Unknown';
    if (!tasksByMemberMap[memberName]) {
      tasksByMemberMap[memberName] = { name: memberName, role, completed: [], inProgress: [], pending: [] };
    }
    if (task.state === 'completed') tasksByMemberMap[memberName].completed.push(task.title);
    else if (task.state === 'in_progress') tasksByMemberMap[memberName].inProgress.push(task.title);
    else tasksByMemberMap[memberName].pending.push(task.title);
  });

  const durationStr = meeting.meetingDuration 
    ? `${Math.floor(meeting.meetingDuration / 60)}m ${meeting.meetingDuration % 60}s` 
    : 'Unknown Duration';

  const dateStr = meeting.meetingDate 
    ? new Date(meeting.meetingDate).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
    : 'Unknown Date';

  return {
    workspaceName: escapeLatex(sourceData.workspaceId?.name || 'Unknown Workspace'),
    teamName: escapeLatex(sourceData.teamId?.teamName || 'Unknown Team'),
    projectName: escapeLatex(meeting.projectName || 'Unknown Project'),
    meetingTitle: escapeLatex(meeting.title || sourceData.MeetingTitle || 'MOM'),
    meetingDate: escapeLatex(dateStr),
    meetingDuration: escapeLatex(durationStr),
    leaderName: escapeLatex(meeting.leaderName || 'Unknown'),
    meetingId: escapeLatex(sourceData._id || ''),
    processingStage: escapeLatex('Summarized'),
    contextLabel: escapeLatex(sourceData.contextLable || 'General'),
    summary: escapeLatex(sourceData.summary || 'No summary available.'),
    decisions: (sourceData.decisions || []).map(escapeLatex),
    insights: escapeLatex(sourceData.insights || ''),
    attendees: {
      present: attendeesList.map(a => ({ name: escapeLatex(a.name), role: escapeLatex(a.functionalRole || '') })),
      absent: []
    },
    taskSummary,
    tasksByMember: Object.values(tasksByMemberMap).map(tm => ({
      name: escapeLatex(tm.name),
      role: escapeLatex(tm.role),
      completed: tm.completed.map(escapeLatex),
      inProgress: tm.inProgress.map(escapeLatex),
      pending: tm.pending.map(escapeLatex)
    }))
  };
}

export function generateMomLatex(momData) {
  const compiler = Handlebars.compile(latexTemplate, { noEscape: true });
  const data = processDataForLatex(momData);
  return compiler(data);
}

export function downloadLatexString(latexStr, filename) {
  try {
    const form = document.createElement('form');
    form.method = 'GET';
    form.action = 'https://latexonline.cc/compile';
    form.target = '_blank'; // Opens in new tab so it doesn't break React app on error
    
    const textInput = document.createElement('textarea');
    textInput.name = 'text';
    textInput.value = latexStr;
    
    const commandInput = document.createElement('input');
    commandInput.type = 'hidden';
    commandInput.name = 'command';
    commandInput.value = 'pdflatex';

    form.appendChild(textInput);
    form.appendChild(commandInput);
    
    document.body.appendChild(form);
    form.submit();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(form);
    }, 100);
  } catch (error) {
    console.error('Export Error:', error);
    alert('Failed to trigger PDF generation: ' + error.message);
  }
}
